"""Create source-grounded Japanese summaries for the patent catalog.

Input is the deterministic retrieval JSON produced by fetch_patent_details.py.
All outputs are constrained by a JSON schema and preserve the source URL for review.
"""

from __future__ import annotations

import concurrent.futures as futures
import json
import time
from pathlib import Path

from openai import OpenAI


ROOT = Path(__file__).resolve().parents[1]
INPUT = ROOT / "research/raw_google_patents.json"
OUTPUT = ROOT / "research/patent_editorial_summaries.json"
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
        "confidence",
    ],
    "additionalProperties": False,
}

SYSTEM = """あなたは日本の特許公報を一般向けに編集する技術ライターです。
必ず提供された原典抜粋だけに基づいて、事実に忠実な日本語で要約してください。
権利の有効性、優位性、実用化、性能を断定してはいけません。
「請求項」は独立請求項（請求項1）の構成・方法の核を平易に言い換え、権利範囲を断定しません。
「従来技術」は明細書に書かれている従来の構成または限界を一文で要約します。記載が薄いときは「公報では、…が課題として示される。」のように慎重に書きます。
各説明は55〜115文字程度、plain_titleは8〜24文字程度とします。
指定された10分類のうち、発明の中核に最も近いものを1つだけ選びます。
分類の目安：監視・管理システム=複数機器の管理・遠隔監視・状態確認、制御技術=試験機の動作制御、信号処理・ノイズ除去=信号の検出/補正/ノイズ処理、システム同定・最適化=機械特性同定やパラメータ導出、試験結果の評価・判定=結果の信頼性や合否評価、ハードウェア設計・機構=治具/把持具/構造、超音波技術=超音波を用いる試験、疲労試験技術=疲労試験の方法・装置、振動制御・環境シミュレーション=振動環境や加速度制御、一般的な装置改良=上記以外の試験機の一般的な改善。
keywordsは本文検索用の具体的な技術語を4〜8個、重複なしで返してください。"""


def compact_description(value: str) -> str:
    # The opening typically contains background, problem, and the core solution.
    return value[:8500]


def make_prompt(record: dict) -> str:
    return f"""公開番号: {record['id']}
原題: {record.get('title', '')}
原典URL: {record['url']}

【要約】
{record.get('abstract', '')}

【説明冒頭】
{compact_description(record.get('description', ''))}

【独立請求項】
{record.get('claim1', '')}
"""


def summarize(record: dict) -> dict:
    client = OpenAI()
    for attempt in range(3):
        try:
            response = client.chat.completions.create(
                model=MODEL,
                messages=[
                    {"role": "system", "content": SYSTEM},
                    {"role": "user", "content": make_prompt(record)},
                ],
                max_completion_tokens=1300,
                response_format={
                    "type": "json_schema",
                    "json_schema": {"name": "patent_editorial_summary", "strict": True, "schema": SCHEMA},
                },
            )
            summary = json.loads(response.choices[0].message.content)
            return {
                "id": record["id"],
                "url": record["url"],
                "original_title": record.get("title", ""),
                **summary,
            }
        except Exception as exc:
            if attempt == 2:
                return {"id": record["id"], "url": record["url"], "error": str(exc)}
            time.sleep(2 ** attempt)
    raise RuntimeError("unreachable")


def main() -> None:
    raw = json.loads(INPUT.read_text(encoding="utf-8"))
    if len(raw) != 53 or any("error" in item for item in raw):
        raise RuntimeError("Input must contain 53 successful source records")

    results: list[dict] = []
    with futures.ThreadPoolExecutor(max_workers=MAX_WORKERS) as pool:
        jobs = {pool.submit(summarize, record): record["id"] for record in raw}
        for index, job in enumerate(futures.as_completed(jobs), start=1):
            result = job.result()
            results.append(result)
            state = "error" if "error" in result else result["category"]
            print(f"[{index}/{len(raw)}] {result['id']} {state}")

    results.sort(key=lambda item: item["id"])
    OUTPUT.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
    errors = [item for item in results if "error" in item]
    print(f"Saved {len(results)} summaries to {OUTPUT}; errors={len(errors)}")


if __name__ == "__main__":
    main()
