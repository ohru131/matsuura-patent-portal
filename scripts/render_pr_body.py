"""Render the pull request body for a pending-new-patents update.

Pure/offline: reads research/pending_new_patents.json (the file
check_new_patents.py writes) and prints a Japanese Markdown description to
stdout. Used by .github/workflows/check-new-patents.yml when creating or
refreshing the chore/patent-catalog-update pull request, so the same text is
produced whether the PR is being created for the first time or updated on a
later run.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_INPUT = ROOT / "research/pending_new_patents.json"


def render(payload: dict) -> str:
    rows = payload.get("new_patents", [])
    lines = [
        "## 新着の可能性がある公開特許",
        "",
        "検索式 `" + payload.get("search_query_url", "") + "` を GitHub Actions が定期実行し、",
        "`client/src/data/patents.ts` に未収録の公開番号を検知しました。",
        "",
        f"- 検知日時 (UTC): {payload.get('checked_at_utc', '')}",
        f"- 検知時点の既知カタログ件数: {payload.get('known_catalog_count', '')}",
        f"- 検索がヒットした総数: {payload.get('fetched_total_num_results', '')}",
        "",
        "| 公開番号 | 原題（Google Patents表示） | 公開日 | 国 | リンク |",
        "| --- | --- | --- | --- | --- |",
    ]
    for row in rows:
        lines.append(
            "| {id} | {title} | {pub} | {country} | [Google Patents]({url}) |".format(
                id=row.get("id", ""),
                title=(row.get("title", "") or "(取得できず)").replace("|", "\\|"),
                pub=row.get("publication_date", "") or "-",
                country=row.get("country_code", "") or "-",
                url=row.get("google_patents_url", ""),
            )
        )
    lines += [
        "",
        "### このPRについて",
        "",
        "- **このPRは新着の検知のみを行います。**",
        "  `client/src/data/patents.ts` への追記（表示題名・4項目要約〈技術課題・従来技術・"
        f"解決手段・請求項要旨〉・keywordsの作成）は、既存{payload.get('known_catalog_count', '')}件と同じ文体・粒度になるよう、"
        "人（または人の確認を経たAI）が行ってください。自動でカタログ本体を書き換えることはしません。",
        "- 追記の手順は `docs/patent-catalog-update.md` を参照してください。",
        "- 追記が完了したら、このブランチ（`chore/patent-catalog-update`）または本PRをクローズ/マージし、"
        "`research/pending_new_patents.json` を削除してください（次回実行時に新着がなければ自動的に整理されます）。",
        "",
        "🤖 この本文は scripts/render_pr_body.py が自動生成しました。",
    ]
    return "\n".join(lines) + "\n"


def main() -> int:
    input_path = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_INPUT
    payload = json.loads(input_path.read_text(encoding="utf-8"))
    sys.stdout.write(render(payload))
    return 0


if __name__ == "__main__":
    sys.exit(main())
