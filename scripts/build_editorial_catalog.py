"""Build the TypeScript catalog from source-grounded editorial summaries.

This was the one-time script used to construct client/src/data/patents.ts
from research/patent_editorial_summaries.json plus a set of hand-picked
CATEGORY_OVERRIDES / TITLE_OVERRIDES / TEXT_OVERRIDES for the original 53
publication numbers (the assignee=Shimadzu search). It writes to
client/src/data/patents.next.ts, never to patents.ts itself, so it is safe to
re-run without clobbering hand-edited catalog entries; a human must still
diff and merge patents.next.ts by hand.

2026-09 review note: two things were fixed so this keeps working as the
catalog grows past the original 53 records (e.g. the assignee=Materials
Science additions, and anything check_new_patents.py finds later):
  - parse_original_records() used a regex anchored on a single-line
    `{ id: "...", title: "...", priority: "...", published: "...",
    regions: [...] }` object-literal format. The catalog is formatted one
    field per line, so that regex matched zero records; it now matches each
    field independently of whitespace/newlines.
  - the "exactly 53 records" check is gone. Instead, main() now requires
    every parsed catalog ID to have an entry in CATEGORY_OVERRIDES (the one
    dict every record must have, since PatentRecord.category is required) and
    fails with a clear, actionable list of which IDs are missing overrides,
    rather than a bare KeyError. TITLE_OVERRIDES/TEXT_OVERRIDES remain
    optional per-ID overrides layered on top of the LLM draft in
    patent_editorial_summaries.json, same as before.

This script does NOT decide which publication numbers are new - that is
check_new_patents.py's job - and it still requires a human to add
CATEGORY_OVERRIDES (and usually TITLE_OVERRIDES/TEXT_OVERRIDES) entries for
any newly added ID before running it again.
"""

from __future__ import annotations

import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE_CATALOG = ROOT / "client/src/data/patents.ts"
SUMMARIES = ROOT / "research/patent_editorial_summaries.json"
OUTPUT = ROOT / "client/src/data/patents.next.ts"

CATEGORY_ORDER = [
    ("監視・管理システム", "複数の試験・分析機器の状態確認、遠隔監視、進捗管理、予防保全に関わる技術。"),
    ("制御技術", "試験機の動作を制御し、荷重・変位・速度などを条件に合わせて調整する技術。"),
    ("信号処理・ノイズ除去", "試験信号の検出、補正、フィルタリング、ノイズ除去に関する技術。"),
    ("システム同定・最適化", "試験機の特性を把握し、設定値やパラメータの調整を支援する技術。"),
    ("試験結果の評価・判定", "試験結果の信頼性、妥当性、き裂進展などを評価・判定する技術。"),
    ("ハードウェア設計・機構", "試験機の構造、把持具、治具、撮影方法など機構面に関わる技術。"),
    ("超音波技術", "超音波を使った疲労試験、ホーン、試験片保持に関する技術。"),
    ("疲労試験技術", "繰返し荷重を与える疲労試験の方法、装置、試験の進め方に関する技術。"),
    ("振動制御・環境シミュレーション", "振動台や波形を用いて、実環境に近い振動・加速度を再現する技術。"),
    ("一般的な装置改良", "上記にまたがる、試験機の表示、油圧、結果確認などの改善に関する技術。"),
]

# The classification is an editorial choice based on each publication's principal purpose.
CATEGORY_OVERRIDES = {
    "JP2014025702A": "振動制御・環境シミュレーション",
    "JP2019132766A": "試験結果の評価・判定",
    "JP2019053009A": "超音波技術",
    "JP2016080631A": "試験結果の評価・判定",
    "JP2019132768A": "信号処理・ノイズ除去",
    "JP2023043191A": "監視・管理システム",
    "JP2019056614A": "信号処理・ノイズ除去",
    "JP2019052997A": "一般的な装置改良",
    "JP2020134472A": "試験結果の評価・判定",
    "JP2013068492A": "一般的な装置改良",
    "JP2013221872A": "ハードウェア設計・機構",
    "JP2011169866A": "振動制御・環境シミュレーション",
    "JP2010266398A": "振動制御・環境シミュレーション",
    "JP2013002824A": "一般的な装置改良",
    "JP2009058522A": "振動制御・環境シミュレーション",
    "JP2014032113A": "振動制御・環境シミュレーション",
    "JP2011017729A": "信号処理・ノイズ除去",
    "JP2014013176A": "振動制御・環境シミュレーション",
    "JP2025023349A": "制御技術",
    "JP2019132767A": "信号処理・ノイズ除去",
    "JP2020165702A": "制御技術",
    "JP2020169836A": "制御技術",
    "JP2020169838A": "信号処理・ノイズ除去",
    "JP2019109189A": "信号処理・ノイズ除去",
    "JP2020165787A": "制御技術",
    "JP2017058273A": "振動制御・環境シミュレーション",
    "JP2020169842A": "制御技術",
    "JP2015132569A": "超音波技術",
    "JP2015210094A": "超音波技術",
    "JP2023013482A": "監視・管理システム",
    "JP2014142196A": "ハードウェア設計・機構",
    "JP2011227025A": "疲労試験技術",
    "JP2005017054A": "試験結果の評価・判定",
    "JP2009222655A": "疲労試験技術",
    "JP2007303893A": "疲労試験技術",
    "JP2004361317A": "疲労試験技術",
    "JP2023037157A": "システム同定・最適化",
    "JP2024138552A": "監視・管理システム",
    "JP2024016434A": "監視・管理システム",
    "JP2023043144A": "監視・管理システム",
    "JP2023044390A": "システム同定・最適化",
    "JP2025179728A": "一般的な装置改良",
    "JP2022134709A": "システム同定・最適化",
    "JP2022184622A": "監視・管理システム",
    "JP2020165701A": "制御技術",
    "JP2020159893A": "制御技術",
    "JP2020165706A": "制御技術",
    "JP2020159897A": "制御技術",
    "JP2020165699A": "制御技術",
    "JP2020159963A": "システム同定・最適化",
    "JP2020169837A": "制御技術",
    "JP2016038227A": "試験結果の評価・判定",
    "JP2025179729A": "ハードウェア設計・機構",
}

# Rewritten display titles avoid generic labels while staying inside the scope of each publication.
TITLE_OVERRIDES = {
    "JP2014025702A": "広い加速度域に対応する疲労試験",
    "JP2019132766A": "固有振動を考慮した試験結果評価",
    "JP2019053009A": "端部質量を調整する超音波治具",
    "JP2016080631A": "位相差を使うき裂長測定",
    "JP2019132768A": "固有振動を抽出する方法",
    "JP2023043191A": "画像で管理する分析機器",
    "JP2019056614A": "変化点を保つノイズ除去",
    "JP2019052997A": "目標速度との差を示す材料試験",
    "JP2020134472A": "高速引張試験の有効性判定",
    "JP2013068492A": "油圧供給を調整する疲労試験",
    "JP2013221872A": "薄板を固定する試験片把持具",
    "JP2011169866A": "伝達関数で補正する振動試験",
    "JP2010266398A": "目標波形を再現する試験制御",
    "JP2013002824A": "油圧源を効率運転する疲労試験",
    "JP2009058522A": "分割・結合でつくる駆動信号",
    "JP2014032113A": "速度制限を考慮した波形生成",
    "JP2011017729A": "重畳波で行う共振周波数検出",
    "JP2014013176A": "駆動波形を補正する疲労試験",
    "JP2025023349A": "誤操作を抑える試験機制御",
    "JP2019132767A": "フィルタの影響を見せる材料試験",
    "JP2020165702A": "短時間データで行う荷重制御",
    "JP2020169836A": "速度と位置を切り替える試験制御",
    "JP2020169838A": "ノイズ量に合わせるフィルタ制御",
    "JP2019109189A": "有限区間の信号を整える方法",
    "JP2020165787A": "過大信号を抑える試験機制御",
    "JP2017058273A": "ウェーブレットで補正する疲労試験",
    "JP2020169842A": "目標値超過を抑える試験機制御",
    "JP2015132569A": "薄板を扱う超音波疲労試験",
    "JP2015210094A": "温度に合わせた超音波加振制御",
    "JP2023013482A": "状態遷移で見る試験機管理",
    "JP2014142196A": "小径試験片に対応する超音波ホーン",
    "JP2011227025A": "反復補正による疲労試験",
    "JP2005017054A": "三点曲げで破壊靱性を測る装置",
    "JP2009222655A": "周波数に追従する材料疲労試験",
    "JP2007303893A": "開始時の衝撃を抑える疲労試験",
    "JP2004361317A": "内圧変動を抑える疲労試験",
    "JP2023037157A": "非線形応答に合わせた試験機設定",
    "JP2024138552A": "複数疲労試験機の進捗管理",
    "JP2024016434A": "非凸マーカーを検出する監視装置",
    "JP2023043144A": "表示画像で見る分析機器の状態",
    "JP2023044390A": "既存データを使う試験機設定支援",
    "JP2025179728A": "疲労試験結果を一覧表示する方法",
    "JP2022134709A": "最大速度・加速度を見積もる試験機評価",
    "JP2022184622A": "画像による安全停止支援",
    "JP2020165701A": "補償量を調整する試験機制御",
    "JP2020159893A": "同定モデルを使う試験機制御",
    "JP2020165706A": "移動方向の切替に対応する荷重制御",
    "JP2020159897A": "変化量比を使う試験機制御",
    "JP2020165699A": "伸び計の変化を用いる荷重制御",
    "JP2020159963A": "一次遅れ系で行う試験機同定",
    "JP2020169837A": "応答速度に合わせる試験機制御",
    "JP2016038227A": "き裂進展を測る材料試験",
    "JP2025179729A": "把持具の撮影を支援する材料試験",
}

# Repairs for terms that required a closer edit than the batch draft.
TEXT_OVERRIDES = {
    "JP2019132766A": {
        "technical_challenge": "高速引張などの試験で荷重データに固有振動が重なったとき、試験信号の信頼性をどう評価するかが課題です。",
        "prior_art": "公報では、固有振動が重なった荷重データから試験結果を判断する際、影響を数値で扱いにくい点が示されています。",
        "solution": "固有振動の1周期を基準に区間データの代表値と振幅比を求め、試験信号の信頼性を定量化します。",
        "claim_summary": "荷重試験の時間領域データを区間に分け、各区間の代表値と固有振動に基づく振幅比を算出して評価する方法です。",
    },
    "JP2020159893A": {
        "technical_challenge": "試験片の変形などで試験機の特性が変化する場合でも、制御に使うモデルを安定して更新することが課題です。",
        "prior_art": "公報では、試験中の条件変化によって設定時のモデルと実際の応答に差が生じ得る点が示されています。",
        "solution": "装置特性と設定値から同定モデルを生成・更新し、その想定出力を用いて試験機の出力を調整します。",
        "claim_summary": "装置特性と設定値を使って同定モデルを生成・更新し、想定出力に基づいて出力を調整する制御装置です。",
    },
    "JP2020159897A": {
        "technical_challenge": "試験片や装置の応答変化があると、フィードバック制御に使う補償値が適切でなくなることが課題です。",
        "prior_art": "公報では、物理量の変化比を一定に扱うと、条件変化時に制御が不安定になる場合が示されています。",
        "solution": "初期と応答時の変化量を比較し、その比に上限や補正を加えた値をフィードバック制御に用います。",
        "claim_summary": "二つの変化量を検出して比を求め、上限または補正を加えた値をフィードバック制御に使う構成です。",
    },
    "JP2020169842A": {
        "technical_challenge": "荷重制御の切替時に目標値を超える応答が生じないよう、遅れを見込んで制御することが課題です。",
        "prior_art": "公報では、制御遅れを十分に見込まずに設定を切り替えると、目標値を超える場合があると示されています。",
        "solution": "制御遅れを加味した増加分が閾値を超えたとき、目標値を設定値に固定して過大な応答を抑えます。",
        "claim_summary": "算出した増加分が閾値を超えたとき、目標値を所定の設定値に固定するフィードバック制御の構成です。",
    },
    "JP2022184622A": {
        "technical_challenge": "可動部を持つ試験装置の周囲に人がいるかを画像から把握し、動作を適切に抑制することが課題です。",
        "prior_art": "公報では、撮影画像で人を検出して装置の動作を制限する技術と、誤判定を抑える必要性が示されています。",
        "solution": "可動部を含む画像から人体の一部と装置の状態を抽出し、その結果に応じて装置の動作を抑制します。",
        "claim_summary": "可動部の画像から人体と装置状態を抽出し、抽出結果に応じて装置の動作を抑制する試験装置です。",
    },
}


def parse_original_records(text: str) -> list[dict]:
    # One `{ ... }` record spans multiple lines with one field per line (see
    # the "id: ..." / "title: ..." example in the module docstring), so each
    # field is matched independently rather than assuming a single-line
    # object literal. re.DOTALL lets ".*?" cross newlines; the fields are
    # matched in the order they appear in PatentRecord (id, title, ...,
    # regions), so the non-greedy match stops at the correct occurrence.
    pattern = re.compile(
        r'id:\s*"(?P<id>JP[0-9A-Z]+)".*?'
        r'title:\s*"(?P<title>[^"]+)".*?'
        r'priority:\s*"(?P<priority>[^"]+)".*?'
        r'published:\s*"(?P<published>[^"]+)".*?'
        r'regions:\s*\[(?P<regions>[^\]]*)\]',
        re.DOTALL,
    )
    result = []
    for match in pattern.finditer(text):
        data = match.groupdict()
        data["regions"] = re.findall(r'"([A-Z]+)"', data["regions"])
        result.append(data)
    if not result:
        raise RuntimeError("Could not parse any catalog records; the catalog format may have changed")
    return result


def ts(value: object) -> str:
    return json.dumps(value, ensure_ascii=False)


def main() -> None:
    originals = parse_original_records(SOURCE_CATALOG.read_text(encoding="utf-8"))
    summaries = {item["id"]: item for item in json.loads(SUMMARIES.read_text(encoding="utf-8"))}
    original_ids = {record["id"] for record in originals}
    if set(summaries) != original_ids:
        raise RuntimeError(
            f"Original catalog ({len(original_ids)} ids) and editorial summary "
            f"({len(summaries)} ids) IDs do not match: "
            f"missing summaries={sorted(original_ids - set(summaries))}, "
            f"extra summaries={sorted(set(summaries) - original_ids)}"
        )
    missing_category_overrides = sorted(original_ids - set(CATEGORY_OVERRIDES))
    if missing_category_overrides:
        raise RuntimeError(
            "CATEGORY_OVERRIDES is missing an entry for the following catalog "
            f"IDs (every record needs a human-assigned category): {missing_category_overrides}"
        )

    lines = [
        "// 光学の航路: 特許の原題と一般向けの整理を並べ、原典への導線を保つ。",
        "export type PatentCategory =",
    ]
    lines.extend([f'  | {ts(name)}' for name, _ in CATEGORY_ORDER[:-1]])
    lines.append(f'  | {ts(CATEGORY_ORDER[-1][0])};\n')
    lines.extend([
        "export type PatentRecord = {",
        "  id: string;",
        "  title: string;",
        "  originalTitle: string;",
        "  priority: string;",
        "  published: string;",
        "  regions: string[];",
        "  category: PatentCategory;",
        "  overview: string;",
        "  technicalChallenge: string;",
        "  priorArt: string;",
        "  solution: string;",
        "  claimSummary: string;",
        "  keywords: string[];",
        "};\n",
        "const gp = (id: string) => `https://patents.google.com/patent/${id}/ja`;\n",
        "export const patents: PatentRecord[] = [",
    ])
    for record in originals:
        item = summaries[record["id"]]
        copy = {key: item[key] for key in ("technical_challenge", "prior_art", "solution", "claim_summary")}
        copy.update(TEXT_OVERRIDES.get(record["id"], {}))
        category = CATEGORY_OVERRIDES[record["id"]]
        title = TITLE_OVERRIDES.get(record["id"], item["plain_title"])
        lines.append("  {")
        lines.append(f"    id: {ts(record['id'])},")
        lines.append(f"    title: {ts(title)},")
        lines.append(f"    originalTitle: {ts(record['title'])},")
        lines.append(f"    priority: {ts(record['priority'])},")
        lines.append(f"    published: {ts(record['published'])},")
        lines.append(f"    regions: {ts(record['regions'])},")
        lines.append(f"    category: {ts(category)},")
        lines.append(f"    overview: {ts(copy['technical_challenge'])},")
        lines.append(f"    technicalChallenge: {ts(copy['technical_challenge'])},")
        lines.append(f"    priorArt: {ts(copy['prior_art'])},")
        lines.append(f"    solution: {ts(copy['solution'])},")
        lines.append(f"    claimSummary: {ts(copy['claim_summary'])},")
        lines.append(f"    keywords: {ts(item['keywords'])},")
        lines.append("  },")
    lines.append("];\n")
    lines.append("export const patentCategories: { id: PatentCategory; label: string; description: string }[] = [")
    for name, description in CATEGORY_ORDER:
        lines.append(f"  {{ id: {ts(name)}, label: {ts(name)}, description: {ts(description)} }},")
    lines.append("];\n")
    lines.append("export const patentLink = (id: string) => gp(id);\n")
    OUTPUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Generated {OUTPUT} with {len(originals)} records")


if __name__ == "__main__":
    main()
