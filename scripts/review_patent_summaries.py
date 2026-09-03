"""Re-edit patent summaries with an explicit source-grounding pass.

The catalog's Japanese title is used as the original title. The Google Patents
description and independent claim are the only sources for the editorial
fields. Requires OPENAI_API_KEY; this is an editorial-review aid for a human,
not something the automated new-patent-detection workflow runs.

2026-09 review note, two bugs fixed:
  - catalog_titles() used a regex anchored on a single-line
    `{ id: "...", title: "..." }` object-literal format. The catalog is now
    (and, per git history, was already) formatted as one field per line, so
    that regex matched zero records. It has been rewritten to match `id:` and
    `title:` independently of surrounding whitespace/newlines.
  - both count checks were hardcoded to "53", left over from when the catalog
    only covered the assignee=Shimadzu search. They now compare the two
    inputs to each other instead of to a fixed number, since the catalog size
    is expected to grow over time.
"""

from __future__ import annotations

import concurrent.futures as futures
import json
import re
import time
from pathlib import Path

from openai import OpenAI


ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "research/raw_google_patents.json"
CATALOG = ROOT / "client/src/data/patents.ts"
OUTPUT = ROOT / "research/patent_editorial_reviewed.json"
MODEL = "gpt-5-mini"
MAX_WORKERS = 5

CATEGORIES = [
    "監視・管理システム",
    "制御技術",
    "信号処理・ノイズ除去",
    "システム同定・最適化",
    "試験結果の評価・判定",
    "ハードウェア設計・機構",
    "超音波技術",
    "疲労試験技術",
    "振動制御・環境シミュレーション",
    "一般的な装置改良",
]

SCHEMA = {
    "type": "object",
    "properties": {
        "category": {"type": "string", "enum": CATEGORIES},
        "plain_title": {"type": "string"},
        "technical_challenge": {"type": "string"},
        "prior_art": {"type": "string"},
        "solution": {"type": "string"},
        "claim_summary": {"type": "string"},
        "keywords": {"type": "array", "items": {"type": "string"}},
        "source_terms": {"type": "array", "items": {"type": "string"}},
        "confidence": {"type": "string", "enum": ["high", "medium", "low"]},
    },
    "required": [
        "category",
        "plain_title",
        "technical_challenge",
        "prior_art",
        "solution",
        "claim_summary",
        "keywords",
        "source_terms",
        "confidence",
    ],
    "additionalProperties": False,
}

SYSTEM = """あなたは日本の特許公報を精査する、保守的な技術編集者です。
必ず提供された【要約】【説明】【請求項1】だけに基づき、一般向けの短い説明を作成してください。
題名の意味を推測して、資料にない対象・用途・性能・原因を追加してはいけません。特に「接合」「冷却」「警告」など、原文に明示されない言葉を使わないでください。
各本文は55〜105文字程度。請求項の説明は、請求項1の構成または工程を平易に言い換え、権利範囲や効果を断定しません。
従来技術欄は、原文に従来技術が明確にない場合「公報では、従来の構成では…が課題として示される。」と記し、具体的な先行技術を作らないでください。
plain_titleは、原題と区別して中核技術がわかる簡潔な表示題名（8〜24文字）にします。
source_termsには、出力の根拠として原文にそのまま含まれる技術語を3〜6語返します。
keywordsには検索用の具体語を4〜8語返します。指定の10分類から、最も中心的な分類を1つだけ選んでください。
分類の目安：監視・管理システム=複数機器の管理・遠隔監視・状態確認、制御技術=試験機の動作制御、信号処理・ノイズ除去=信号の検出/補正/ノイズ処理、システム同定・最適化=機械特性同定やパラメータ導出、試験結果の評価・判定=結果の信頼性や合否評価、ハードウェア設計・機構=治具/把持具/構造、超音波技術=超音波を用いる試験、疲労試験技術=疲労試験の方法・装置、振動制御・環境シミュレーション=振動環境や加速度制御、一般的な装置改良=上記以外の試験機の一般的な改善。"""


def catalog_titles() -> dict[str, str]:
    text = CATALOG.read_text(encoding="utf-8")
    # One `{ ... }` record spans multiple lines with one field per line, e.g.:
    #   {
    #     id: "JP2019132766A",
    #     title: "固有振動を考慮した試験結果評価",
    #     ...
    #   },
    # so id: and title: are matched independently (in DOTALL mode, non-greedily
    # up to the next record boundary) rather than assuming they sit on one line.
    pattern = re.compile(r'id:\s*"(JP[0-9A-Z]+)".*?title:\s*"([^"]+)"', re.DOTALL)
    pairs = pattern.findall(text)
    if not pairs:
        raise RuntimeError("Could not parse any catalog id/title pairs; the catalog format may have changed")
    return dict(pairs)


def prompt(record: dict, original_title: str) -> str:
    return f"""公開番号: {record['id']}
原題（カタログの正規表記）: {original_title}
原典URL: {record['url']}

【要約】
{record.get('abstract', '')}

【説明】
{record.get('description', '')[:9500]}

【請求項1】
{record.get('claim1', '')}
"""


def one(record: dict, titles: dict[str, str]) -> dict:
    client = OpenAI()
    for attempt in range(3):
        try:
            response = client.chat.completions.create(
                model=MODEL,
                messages=[
                    {"role": "system", "content": SYSTEM},
                    {"role": "user", "content": prompt(record, titles[record["id"]])},
                ],
                max_completion_tokens=1300,
                response_format={
                    "type": "json_schema",
                    "json_schema": {"name": "reviewed_patent_summary", "strict": True, "schema": SCHEMA},
                },
            )
            data = json.loads(response.choices[0].message.content)
            return {
                "id": record["id"],
                "url": record["url"],
                "original_title": titles[record["id"]],
                **data,
            }
        except Exception as exc:
            if attempt == 2:
                return {"id": record["id"], "url": record["url"], "error": str(exc)}
            time.sleep(2 ** attempt)
    raise RuntimeError("unreachable")


def main() -> None:
    records = json.loads(RAW.read_text(encoding="utf-8"))
    titles = catalog_titles()
    if not records or {item["id"] for item in records} != set(titles):
        raise RuntimeError(
            f"The source records ({len(records)} ids) and catalog ({len(titles)} ids) "
            "must be non-empty and contain exactly the same set of IDs"
        )

    results: list[dict] = []
    with futures.ThreadPoolExecutor(max_workers=MAX_WORKERS) as pool:
        jobs = {pool.submit(one, record, titles): record["id"] for record in records}
        for index, job in enumerate(futures.as_completed(jobs), start=1):
            result = job.result()
            results.append(result)
            status = result.get("category", "error")
            print(f"[{index}/{len(records)}] {result['id']} {status}")

    results.sort(key=lambda item: item["id"])
    OUTPUT.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
    errors = [item for item in results if "error" in item]
    print(f"Saved {len(results)} summaries to {OUTPUT}; errors={len(errors)}")


if __name__ == "__main__":
    main()
