"""Shared Google Patents access helpers used by the scripts in this directory.

This module centralizes:
  - the HTTP headers / retry policy used when talking to Google Patents, and
  - small, dependency-free parsing helpers (pure functions, no network I/O)
    for the search XHR response and for the `client/src/data/patents.ts`
    catalog file.

Keeping the parsing functions free of any `requests` call means they can be
unit-tested against saved/synthetic JSON fixtures without touching the
network (see scripts/tests/). Deterministic retrieval only: nothing here
summarizes, judges, or rewrites patent text.

IMPORTANT / known limitation (2026-09): the JSON shape assumed below for the
`/xhr/query` endpoint (`results.cluster[].result[].patent.publication_number`
etc.) is based on publicly documented behaviour of Google Patents, not on a
response captured from this environment - the sandbox this module was
authored in has no network access to patents.google.com (its egress proxy
returns 403 on CONNECT). It has only been exercised against the synthetic
fixture in scripts/tests/fixtures/. If Google changes the response shape,
`parse_search_payload()` below is the one place to fix.
"""

from __future__ import annotations

import re
import time
import urllib.parse
from typing import Any, Iterable

import requests

USER_AGENT = (
    "Mozilla/5.0 (compatible; PatentArchiveResearch/1.0; "
    "+https://github.com/ohru131/matsuura-patent-portal)"
)

# Headers for fetching a normal, human-facing patent detail page (used by
# fetch_patent_details.py).
BROWSE_HEADERS = {"User-Agent": USER_AGENT}

# Headers for the JSON search endpoint. Google Patents' own front-end sends an
# X-Requested-With header on this call; without it some edge/CDN layers have
# been reported to reject the request as not coming from the app.
XHR_HEADERS = {
    "User-Agent": USER_AGENT,
    "X-Requested-With": "XMLHttpRequest",
    "Referer": "https://patents.google.com/",
    "Accept": "application/json, text/plain, */*",
}

DEFAULT_TIMEOUT = 30
DEFAULT_MAX_RETRIES = 4
DEFAULT_BACKOFF_SECONDS = 3.0

# Naive, deliberately non-TypeScript-aware extraction of publication numbers
# from client/src/data/patents.ts. Matches `id: "JP..."` regardless of
# surrounding whitespace/newlines so it survives re-formatting (e.g. prettier)
# of the object literals.
ID_PATTERN = re.compile(r'id:\s*"(JP[0-9A-Z]+)"')


class GooglePatentsError(RuntimeError):
    """Raised when Google Patents cannot be reached or returns an unexpected shape.

    Callers must treat this as a hard failure, never as "zero results".
    """


def extract_known_ids(catalog_text: str) -> list[str]:
    """Pull publication numbers out of client/src/data/patents.ts source text.

    Raises GooglePatentsError if nothing is found, so a catalog formatting
    change does not silently look like "there are zero known patents".
    """
    ids = ID_PATTERN.findall(catalog_text)
    if not ids:
        raise GooglePatentsError(
            "Could not find any `id: \"JP...\"` entries in the catalog text; "
            "the file format may have changed and ID_PATTERN needs updating."
        )
    return ids


def request_with_retry(
    method: str,
    url: str,
    *,
    headers: dict[str, str] | None = None,
    timeout: int = DEFAULT_TIMEOUT,
    max_retries: int = DEFAULT_MAX_RETRIES,
    backoff_seconds: float = DEFAULT_BACKOFF_SECONDS,
) -> requests.Response:
    """GET/POST with simple exponential backoff for transient failures / 429s."""
    last_exc: Exception | None = None
    for attempt in range(1, max_retries + 1):
        try:
            response = requests.request(method, url, headers=headers, timeout=timeout)
            if response.status_code == 429 or response.status_code >= 500:
                raise GooglePatentsError(
                    f"HTTP {response.status_code} from {url}: {response.text[:300]!r}"
                )
            response.raise_for_status()
            return response
        except (requests.RequestException, GooglePatentsError) as exc:
            last_exc = exc
            if attempt == max_retries:
                break
            time.sleep(backoff_seconds * (2 ** (attempt - 1)))
    raise GooglePatentsError(
        f"Request to {url} failed after {max_retries} attempts: {last_exc}"
    ) from last_exc


def build_xhr_search_url(query: str) -> str:
    """Build the JSON search endpoint URL for a Google Patents search query string.

    `query` is the query-string portion of a normal
    https://patents.google.com/?... search URL, copy-pasted as-is from the
    browser address bar, e.g.:

        inventor=Matsuura+Toru&assignee=shimadzu,Materials+Science

    Google Patents' own UI issues an XHR to /xhr/query with that same string
    percent-encoded as the single `url` query parameter (this is a documented
    pattern used by third-party Google Patents scraping tools; it has not been
    re-verified against a live response from this environment - see the
    module docstring).
    """
    encoded = urllib.parse.quote(query, safe="")
    return f"https://patents.google.com/xhr/query?url={encoded}&exp="


def _iter_patent_entries(payload: dict[str, Any]) -> Iterable[dict[str, Any]]:
    """Yield each `patent` dict inside a parsed /xhr/query JSON payload.

    *** If Google Patents changes its response shape, this is the function to
    fix. *** The expected shape is:

        {"results": {"cluster": [{"result": [{"patent": {...}}, ...]}],
                     "total_num_results": <int>}}

    Any deviation (missing "results", missing "cluster") raises rather than
    silently yielding nothing, because a silent empty iteration is exactly
    what would cause "new patents" detection to wrongly report zero.
    """
    results = payload.get("results")
    if not isinstance(results, dict):
        raise GooglePatentsError(
            "Unexpected response shape: top-level 'results' object is missing. "
            "Google Patents may have changed its /xhr/query response format."
        )
    clusters = results.get("cluster")
    if clusters is None:
        raise GooglePatentsError(
            "Unexpected response shape: 'results.cluster' is missing (a legitimate "
            "zero-hit response still includes an empty cluster list, so a missing "
            "key means the layout changed, not that there are no results)."
        )
    for cluster in clusters:
        for item in cluster.get("result", []):
            patent = item.get("patent")
            if patent:
                yield patent


def parse_search_payload(payload: dict[str, Any]) -> dict[str, Any]:
    """Pure function: turn one page of /xhr/query JSON into a normalized dict.

    Returns {"total_num_results": int, "hits": [{"id", "title",
    "priority_date", "publication_date", "country_code"}, ...]}.

    Raises GooglePatentsError if the payload carries an explicit error, or if
    the expected keys are missing outright (layout change). Does not raise
    just because a page happens to contain zero hits.
    """
    if payload.get("error"):
        raise GooglePatentsError(f"Google Patents returned an error payload: {payload['error']}")

    results = payload.get("results")
    if not isinstance(results, dict):
        raise GooglePatentsError("Unexpected response shape: missing 'results' object")

    raw_total = results.get("total_num_results")
    if raw_total is None:
        raise GooglePatentsError("Unexpected response shape: missing 'results.total_num_results'")

    hits: list[dict[str, Any]] = []
    for patent in _iter_patent_entries(payload):
        pub_number = patent.get("publication_number")
        if not pub_number:
            continue
        hits.append(
            {
                "id": pub_number,
                "title": patent.get("title", ""),
                "priority_date": patent.get("priority_date", ""),
                "publication_date": patent.get("publication_date", ""),
                "country_code": patent.get("country_code", ""),
            }
        )

    return {"total_num_results": int(raw_total), "hits": hits}


def search_patents(query: str, *, max_pages: int = 10, page_size: int = 100) -> dict[str, Any]:
    """Fetch every hit for a Google Patents search query via the XHR endpoint.

    Network I/O lives only in this function; the response-shape parsing is
    delegated to parse_search_payload() so that function can be unit-tested
    without a network call. Raises GooglePatentsError on anything that looks
    like a layout change, rate limiting, or a network failure - callers must
    not treat that as "no new patents".
    """
    hits_by_id: dict[str, dict[str, Any]] = {}
    total_num_results: int | None = None
    first_url: str | None = None

    for page in range(max_pages):
        paged_query = query if "num=" in query else f"{query}&num={page_size}"
        if page:
            paged_query = f"{paged_query}&page={page}"
        url = build_xhr_search_url(paged_query)
        if first_url is None:
            first_url = url

        response = request_with_retry("GET", url, headers=XHR_HEADERS)
        try:
            payload = response.json()
        except ValueError as exc:
            raise GooglePatentsError(f"Response was not valid JSON: {exc}") from exc

        page_result = parse_search_payload(payload)
        if total_num_results is None:
            total_num_results = page_result["total_num_results"]

        new_on_page = 0
        for hit in page_result["hits"]:
            if hit["id"] not in hits_by_id:
                hits_by_id[hit["id"]] = hit
                new_on_page += 1

        if new_on_page == 0 or len(hits_by_id) >= (total_num_results or 0):
            break
        time.sleep(1.0)  # be polite between pages

    if total_num_results is None:
        raise GooglePatentsError("Could not determine total_num_results from the search response")

    return {
        "total_num_results": total_num_results,
        "hits": list(hits_by_id.values()),
        "query_url": first_url,
    }
