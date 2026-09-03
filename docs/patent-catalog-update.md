# 特許カタログの新着検知と更新手順

このドキュメントは、`client/src/data/patents.ts` に載っている特許カタログを、
新しく公開された公報で更新するための仕組みと手順をまとめたものです。

## 1. 自動検知の仕組み

- ワークフロー: `.github/workflows/check-new-patents.yml`
- 実行タイミング:
  - **2か月に1回**（奇数月＝1月・3月・5月・7月・9月・11月の1日、UTC 00:00 = 日本時間 09:00）
  - いつでも手動実行可能（`workflow_dispatch`）
- 監視している検索式:
  `https://patents.google.com/?inventor=Matsuura+Toru&assignee=shimadzu,Materials+Science`
  （発明者 Toru Matsuura、出願人が Shimadzu または Materials Science のいずれか）
- スクリプト本体: `scripts/check_new_patents.py`（共通処理は `scripts/gpatents.py`）

### やっていること・やっていないこと

このワークフローが自動で行うのは**検知だけ**です。

1. Google Patentsの検索XHRエンドポイントに問い合わせ、検索条件に一致する公開番号の一覧を取得する
2. `client/src/data/patents.ts` に載っている公開番号（正規表現 `id: "JP..."` で抽出）と突き合わせる
3. 新規の公開番号があれば `research/pending_new_patents.json` を更新し、`chore/patent-catalog-update` ブランチへコミット、既存のPRがあれば更新・なければ新規作成する
4. 新規が無ければ何もしない（PRもIssueも作らない）
5. 検索そのものが失敗した場合（0件ヒット、既知件数から大きく減少、レイアウト変更などでJSONの構造が想定と違う場合）は、**ワークフローを失敗として終了**し、PRは作らない

`client/src/data/patents.ts` の**書き換えは一切行いません**。表示題名・原題・4項目要約
（技術課題・従来技術・解決手段・請求項要旨）・keywordsの作成は、既存レコードと同じ文体・
粒度になるよう、人（または人の確認を経たAI）が行う前提です。

### 重要: 実際のGoogle Patents応答に対して未検証です

`scripts/check_new_patents.py` は、このリポジトリの開発環境（サンドボックス）から
`patents.google.com` への通信が組織のプロキシポリシーでブロックされていたため、
**実際のGoogle Patents応答に対して一度も実行できていません**。応答のJSON構造
（`results.cluster[].result[].patent.publication_number` など）は公開情報をもとに
推測して実装し、`scripts/tests/fixtures/gpatents_search_response.sample.json` という
**自作の模擬データ**でのみ単体テスト（`scripts/tests/test_check_new_patents.py`）を
通しています。実物の構造とズレている可能性があります。

そのため:

- **初回は必ず `workflow_dispatch` で手動実行し、Actionsのログで「取得件数」
  （`Search reported total_num_results=...`）が現在のカタログ件数（`client/src/data/patents.ts`
  のレコード数）と近い妥当な値になっているかを目視確認してから、定期実行に任せてください。**
- もし応答形式が変わって（あるいは最初から想定と違って）壊れた場合、直す場所は決まっています。
  `scripts/gpatents.py` の `parse_search_payload()` / `_iter_patent_entries()` に、
  「ここを直せばよい」というコメントを書いてあります。ログに出るエラーメッセージ
  （`Unexpected response shape: ...`）を手がかりに、実際のJSONをブラウザの開発者ツールの
  Networkタブで確認しながら該当関数を直してください。
- GitHub Actionsのランナーは通常のインターネット接続を持つため、本番では動作するはずですが、
  Google Patents側のレート制限や一時的なブロックにより失敗することもあり得ます。その場合は
  ワークフローが失敗するだけで、カタログやPRには影響しません。再実行するか、
  時間を置いて `workflow_dispatch` で試してください。

## 2. PRが来たときに人が行う作業

`chore/patent-catalog-update` ブランチへのPRが来たら、次の手順で `patents.ts` に追記します。

1. PR本文の表に載っている公開番号ごとに、`https://patents.google.com/patent/{公開番号}/ja`
   （リンクはPR本文に記載）を開き、原文（要約・明細書・請求項1）を確認する
2. 松浦融氏・島津製作所（またはMaterials Science関連会社）が発明者・出願人として
   記載されていることを確認する（同姓同名の除外は `research/01_google_patents_initial.md`
   の注意事項を参照）
3. 既存レコードと同じ文体・粒度で、以下の項目を作成する
   - `title`: 一般向け表示題名（8〜24文字程度、専門用語をかみ砕く）
   - `originalTitle`: 公報の正式な題名
   - `priority` / `published`: 優先日・公開年
   - `regions`: 公開されている国・地域コードの配列
   - `category`: 既存の10分類（`PatentCategory`）から最も近いものを1つ選ぶ
   - `overview` / `technicalChallenge`: 課題を55〜115文字程度で要約（`overview`と
     `technicalChallenge`は現状同一文言で運用されている）
   - `priorArt`: 従来技術・従来構成を1文で要約。記載が薄い場合は
     「公報では、…が課題として示される。」のように断定を避ける
   - `solution`: 解決手段の構成を要約。権利の有効性や優位性は断定しない
   - `claimSummary`: 独立請求項（請求項1）の構成・工程を平易に言い換える。権利範囲は断定しない
   - `keywords`: 検索用の具体的な技術語を4〜8個

   参考例（`client/src/data/patents.ts` の実際のレコード、JP2019132766A）:

   ```ts
   {
     id: "JP2019132766A",
     title: "固有振動を考慮した試験結果評価",
     originalTitle: "試験結果評価方法および材料試験機",
     priority: "2018-02-01",
     published: "2019",
     regions: ["JP", "US", "EP", "CN"],
     category: "試験結果の評価・判定",
     overview: "高速引張などの試験で荷重データに固有振動が重なったとき、試験信号の信頼性をどう評価するかが課題です。",
     technicalChallenge: "高速引張などの試験で荷重データに固有振動が重なったとき、試験信号の信頼性をどう評価するかが課題です。",
     priorArt: "公報では、固有振動が重なった荷重データから試験結果を判断する際、影響を数値で扱いにくい点が示されています。",
     solution: "固有振動の1周期を基準に区間データの代表値と振幅比を求め、試験信号の信頼性を定量化します。",
     claimSummary: "荷重試験の時間領域データを区間に分け、各区間の代表値と固有振動に基づく振幅比を算出して評価する方法です。",
     keywords: ["接合", "荷重試験", "固有振動", "時間領域データ", "代表値算出", "振幅比算出", "信号信頼性"],
   },
   ```

   参考として `scripts/fetch_patent_details.py`（公報ページの取得）、
   `scripts/summarize_patent_details.py` / `scripts/review_patent_summaries.py`
   （LLMによる下書き作成、`OPENAI_API_KEY` が必要）、
   `scripts/build_editorial_catalog.py`（下書きから `patents.next.ts` を生成し、
   人が差分を見て `patents.ts` へ反映する）という編集パイプラインが `scripts/` にあります。
   ただしこれらは元々53件（assignee=Shimadzuのみ）を一括構築した際のスクリプトで、
   `CATEGORY_OVERRIDES` 等のIDごとの上書き辞書に新規IDのエントリを追加しないと
   `build_editorial_catalog.py` は明確なエラーで止まります（黙って壊れることはありません）。
   数件程度の追加であれば、これらのスクリプトを使わず本表を見ながら手作業で
   `patents.ts` に追記する方が簡単な場合もあります。
4. 追記が終わったら `pnpm check` を実行し、型エラーがないことを確認する
5. `research/pending_new_patents.json` を削除する（次回の自動検知が0件なら自動的に削除されますが、
   追記が先に終わった場合は手動で消しておくと状態が分かりやすくなります）
6. `chore/patent-catalog-update` ブランチのPRをクローズ（または、そのブランチに直接
   `patents.ts` の追記コミットを積んでマージ）する

## 3. 手動で検知を走らせる方法

### GitHub Actionsから

1. GitHubリポジトリの `Actions` タブ → `Check for new patents` ワークフローを開く
2. `Run workflow` から対象ブランチを選んで実行する
3. `Run new-patent detection` ステップのログで、取得件数とカタログ件数を確認する

### ローカルで実行する場合

```bash
cd matsuura-patent-portal
pip install -r scripts/requirements.txt   # requests / beautifulsoup4 / openai
python3 scripts/check_new_patents.py
echo "exit code: $?"
```

終了コードの意味:

| 終了コード | 意味 |
| --- | --- |
| `0` | 新着なし。何もしない |
| `1` | 新着あり。`research/pending_new_patents.json` を書き込み済み |
| `2` | 検索やカタログ解析に失敗した（異常）。ログの `ERROR:` 行を確認する |

単体テスト（ネットワーク不要、模擬データのみ）は次のコマンドで実行できます。

```bash
python3 -m unittest discover -s scripts/tests -v
```

## 4. 検索式を変更したいとき

`scripts/check_new_patents.py` の先頭付近にある `SEARCH_QUERY` 定数を書き換えてください。

```python
SEARCH_QUERY = "inventor=Matsuura+Toru&assignee=shimadzu,Materials+Science"
```

この文字列は、`https://patents.google.com/?...` の `?` 以降のクエリ文字列をそのまま
ブラウザのアドレスバーからコピーしたものです（URLデコードなどの追加加工は不要です）。
出願人を追加・変更したい場合は `assignee=` の値をカンマ区切りで増減させてください。

なお `MIN_EXPECTED_RATIO`（同ファイル内）は、「既知カタログ件数の何割を下回ったら
異常とみなすか」のしきい値です（デフォルト0.9）。検索式を大きく変えて件数が
大幅に変わることが分かっている場合は、この値も合わせて見直してください。
