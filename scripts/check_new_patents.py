"""Detect newly published patents matching the tracked Google Patents search.

This script performs deterministic detection only. It does not write any
Japanese summaries, does not touch client/src/data/patents.ts, and does not
create a pull request itself - that is the job of the
.github/workflows/check-new-patents.yml workflow, which runs this script and
branches on its exit code.

What it does:
  1. Extract the publication numbers already present in
     client/src/data/patents.ts (regex-based, see gpatents.extract_known_ids).
  2. Query the Google Patents XHR search endpoint for the tracked search
     (SEARCH_QUERY below) via gpatents.search_patents().
  3. Diff the two id sets with diff_new_ids() (a pure function, unit-tested
     in scripts/tests/test_check_new_patents.py against a synthetic fixture).
  4. If there are new ids, write research/pending_new_patents.json describing
     them; otherwise remove any stale copy of that file.

Exit codes (read by the GitHub Actions workflow):
  0 -> no new patents found; nothing to commit.
  1 -> new patents found; research/pending_new_patents.json was written.
  2 -> the search or the catalog parsing failed, or the result looked
       abnormal (e.g. zero hits, or far fewer than the known catalog size).
       The workflow must fail the run and must NOT open or update a PR.

KNOWN LIMITATION (2026-09): this script has not been run against a live
Google Patents response. The sandbox it was authored in has no network route
to patents.google.com (its egress proxy returns 403 on CONNECT - an
organizational policy, not a bug to route around). Its request/response
handling has only been exercised in scripts/tests/ against a synthetic JSON
fixture that mimics the documented /xhr/query response shape. Before relying
on the scheduled run, trigger the workflow once by hand
(workflow_dispatch) and read the Actions log to confirm the fetched count is
sane - see docs/patent-catalog-update.md.
"""

from __future__ import annotations

import json
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from gpatents import GooglePatentsError, extract_known_ids, search_patents  # noqa: E402

ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "client/src/data/patents.ts"
OUTPUT = ROOT / "research/pending_new_patents.json"

# Edit this to change the tracked search. It is the query-string portion of
# https://patents.google.com/?... , copy-pasted as-is from the browser
# address bar (do not URL-decode it further; gpatents.build_xhr_search_url
# takes care of the encoding needed for the XHR endpoint).
SEARCH_QUERY = "inventor=Matsuura+Toru&assignee=shimadzu,Materials+Science"

# If the live search returns fewer publication numbers than this fraction of
# the currently known catalog size, treat the fetch as broken (rate limiting,
# a layout change, a network hiccup) rather than as "no new patents".
MIN_EXPECTED_RATIO = 0.9

EXIT_NO_NEW = 0
EXIT_NEW_FOUND = 1
EXIT_ERROR = 2


def diff_new_ids(known_ids: set[str], fetched_ids: set[str]) -> list[str]:
    """Pure function: publication numbers present in the search but not the catalog.

    Kept separate from all I/O so it can be unit-tested directly.
    """
    return sorted(fetched_ids - known_ids)


def build_pending_payload(
    *,
    new_ids: list[str],
    hits_by_id: dict[str, dict[str, str]],
    known_count: int,
    fetched_total: int,
    query_url: str | None,
) -> dict:
    return {
        "checked_at_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "search_query_url": f"https://patents.google.com/?{SEARCH_QUERY}",
        "xhr_url": query_url,
        "known_catalog_count": known_count,
        "fetched_total_num_results": fetched_total,
        "new_patents": [
            {
                "id": pid,
                "title": hits_by_id[pid].get("title", ""),
                "priority_date": hits_by_id[pid].get("priority_date", ""),
                "publication_date": hits_by_id[pid].get("publication_date", ""),
                "country_code": hits_by_id[pid].get("country_code", ""),
                "google_patents_url": f"https://patents.google.com/patent/{pid}/ja",
            }
            for pid in new_ids
        ],
    }


def main() -> int:
    try:
        known_ids = set(extract_known_ids(CATALOG.read_text(encoding="utf-8")))
    except (GooglePatentsError, OSError) as exc:
        print(f"ERROR: failed to read known patent ids from {CATALOG}: {exc}", file=sys.stderr)
        return EXIT_ERROR

    print(f"Known catalog ids: {len(known_ids)}")

    try:
        result = search_patents(SEARCH_QUERY)
    except GooglePatentsError as exc:
        print(f"ERROR: Google Patents search failed: {exc}", file=sys.stderr)
        return EXIT_ERROR

    hits_by_id = {hit["id"]: hit for hit in result["hits"]}
    fetched_ids = set(hits_by_id)
    total = result["total_num_results"]
    print(
        f"Search reported total_num_results={total}, parsed {len(fetched_ids)} "
        f"unique publication numbers from {SEARCH_QUERY!r}"
    )

    if total == 0 or not fetched_ids:
        print(
            "ERROR: the search returned zero results. Treating this as a failed "
            "fetch (rate limit, layout change, or blocked request), not as "
            "'no new patents'.",
            file=sys.stderr,
        )
        return EXIT_ERROR

    if known_ids:
        min_expected = len(known_ids) * MIN_EXPECTED_RATIO
        if len(fetched_ids) < min_expected:
            print(
                f"ERROR: fetched {len(fetched_ids)} ids, well below the known "
                f"catalog size of {len(known_ids)} (threshold {min_expected:.1f}). "
                "Treating this as a broken fetch rather than a real drop in results.",
                file=sys.stderr,
            )
            return EXIT_ERROR

    new_ids = diff_new_ids(known_ids, fetched_ids)

    if not new_ids:
        print("No new patents found.")
        if OUTPUT.exists():
            OUTPUT.unlink()
            print(f"Removed stale {OUTPUT}")
        return EXIT_NO_NEW

    payload = build_pending_payload(
        new_ids=new_ids,
        hits_by_id=hits_by_id,
        known_count=len(known_ids),
        fetched_total=total,
        query_url=result.get("query_url"),
    )
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Found {len(new_ids)} new patent id(s): {', '.join(new_ids)}")
    print(f"Wrote {OUTPUT}")
    return EXIT_NEW_FOUND


if __name__ == "__main__":
    sys.exit(main())
