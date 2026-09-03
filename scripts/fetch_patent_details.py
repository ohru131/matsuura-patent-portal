"""Fetch public Google Patents detail pages for IDs already in the catalog.

This is a per-ID detail-page fetch used to (re)build the editorial pipeline
(summarize_patent_details.py / review_patent_summaries.py /
build_editorial_catalog.py) for whichever publication numbers are currently
listed in client/src/data/patents.ts. It does not search Google Patents and
does not decide which IDs belong in the catalog - that is what
check_new_patents.py is for. This script performs deterministic retrieval
only: it does not summarize or alter patent text.

2026-09 review note: this previously hardcoded an "exactly 53 records"
assumption from when the catalog only covered the assignee=Shimadzu search.
The catalog now (or will soon) also cover assignee=Materials Science
patents, so the expected count is derived from the catalog itself instead of
being hardcoded. HTTP headers/retry now live in scripts/gpatents.py so this
script and check_new_patents.py do not each reimplement them.
"""

from __future__ import annotations

import json
import re
import time
from pathlib import Path

from bs4 import BeautifulSoup

from gpatents import BROWSE_HEADERS, extract_known_ids, request_with_retry


ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "client/src/data/patents.ts"
OUT = ROOT / "research/raw_google_patents.json"
HEADERS = BROWSE_HEADERS


def clean(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def text_of(node) -> str:
    return clean(node.get_text(" ", strip=True)) if node else ""


def extract_record(patent_id: str) -> dict:
    url = f"https://patents.google.com/patent/{patent_id}/ja"
    response = request_with_retry("GET", url, headers=HEADERS)
    soup = BeautifulSoup(response.text, "html.parser")

    title = ""
    title_node = soup.select_one('meta[name="DC.title"]') or soup.select_one('meta[name="DC.Title"]')
    if title_node:
        title = clean(title_node.get("content", ""))
    if not title:
        title = text_of(soup.select_one("h1"))

    abstract_node = soup.select_one('meta[name="DC.description"]') or soup.select_one('meta[name="description"]')
    abstract = clean(abstract_node.get("content", "")) if abstract_node else ""
    if not abstract:
        abstract = text_of(soup.select_one("section[itemprop='abstract']"))

    description = text_of(soup.select_one("section[itemprop='description']"))
    if not description:
        description = text_of(soup.select_one("div.description"))

    claim_nodes = soup.select("div.claim-text")
    if not claim_nodes:
        claim_nodes = soup.select("section[itemprop='claims'] .claim")
    claims = [text_of(node) for node in claim_nodes if text_of(node)]

    return {
        "id": patent_id,
        "url": url,
        "title": title,
        "abstract": abstract,
        "description": description,
        "claim1": claims[0] if claims else "",
        "claim_count_detected": len(claims),
        "fetched_at_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }


def main() -> None:
    ids = extract_known_ids(CATALOG.read_text(encoding="utf-8"))
    if len(set(ids)) != len(ids):
        raise RuntimeError(f"Duplicate JP publication IDs found in catalog: {len(ids)} entries, {len(set(ids))} unique")

    existing: dict[str, dict] = {}
    if OUT.exists():
        existing = {item["id"]: item for item in json.loads(OUT.read_text(encoding="utf-8"))}

    records: list[dict] = []
    for index, patent_id in enumerate(ids, start=1):
        prior = existing.get(patent_id)
        if prior and prior.get("abstract") and prior.get("claim1"):
            records.append(prior)
            print(f"[{index}/{len(ids)}] reused {patent_id}")
            continue
        try:
            record = extract_record(patent_id)
            records.append(record)
            print(f"[{index}/{len(ids)}] fetched {patent_id}: abstract={len(record['abstract'])}, claim1={len(record['claim1'])}")
        except Exception as exc:
            records.append({"id": patent_id, "url": f"https://patents.google.com/patent/{patent_id}/ja", "error": str(exc)})
            print(f"[{index}/{len(ids)}] failed {patent_id}: {exc}")
        time.sleep(0.65)

    OUT.write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding="utf-8")
    errors = [item for item in records if item.get("error")]
    print(f"Saved {len(records)} records to {OUT}; errors={len(errors)}")


if __name__ == "__main__":
    main()
