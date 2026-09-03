# 追加調査メモ: assignee=Materials Science（松浦融氏本人申告分）

調査日: 2026-09-03

## 依頼内容

オーナー（松浦融氏本人）から、以下の検索式で表示される「Materials Science」系の出願人による公開特許（想定2件）も本人の発明であるとの申告があった。

- 追加分: `https://patents.google.com/?inventor=Matsuura+Toru&assignee=Materials+Science&num=100`
- 統合後の想定: `https://patents.google.com/?inventor=Matsuura+Toru&assignee=shimadzu,Materials+Science`

## 調査結果: 一次情報を確認できず（未追加）

**結論として、今回のセッションでは上記2件の特許を一次資料（Google Patents本体や他の特許データベース）から確認することができなかった。** そのため `client/src/data/patents.ts` への追加は行っていない（既存53件は無変更）。理由と試行過程を以下に記録する。

### 1. ネットワーク到達性の制約

本セッションの実行環境では、`scripts/fetch_patent_details.py` が想定する `patents.google.com` への直接アクセス（curl / WebFetch）が、環境のegressポリシーにより一律にブロックされていることを確認した。

```
$ curl -sS -A "Mozilla/5.0 ..." "https://patents.google.com/patent/JP2019132766A/ja"
curl: (56) CONNECT tunnel failed, response 403
```

`curl -sS "$HTTPS_PROXY/__agentproxy/status"` で確認したところ、`recentRelayFailures` に

```
{"kind": "connect_rejected", "detail": "gateway answered 403 to CONNECT (policy denial or upstream failure)", "host": "patents.google.com:443"}
```

が記録されており、`/root/.ccr/README.md` の分類に従えば「組織ポリシーによる拒否（403）」であり、再試行や回避（TLS検証の無効化、HTTPS_PROXYの解除）を行うべきものではない。

念のため、他の特許関連ドメイン（`patents.justia.com`、`www.patentguru.com`、`j-platpat.inpit.go.jp`、`worldwide.espacenet.com`、`www.freepatentsonline.com`、`image-ppubs.uspto.gov`、`www.lens.org`、`samurai.nims.go.jp`、`jglobal.jst.go.jp`）についても同様に`curl`で疎通確認したが、すべて同じ `connect_rejected` (403) で拒否された。また `WebFetch` ツールでも `patents.google.com`、`en.wikipedia.org`、`example.com` 等が `EGRESS_BLOCKED` として拒否されることを確認した（`example.com` すら拒否されたことから、これは特定サイトの個別ブロックではなく、本セッションの一般的なWebブラウジングに対するポリシー制限と判断した）。一方で `raw.githubusercontent.com`、`api.github.com`、`pypi.org` 等の開発ツール系ドメインへの疎通は正常であり、egress許可リストが開発系サービスに限定されていることを確認した。

この制約下では、既存の `scripts/fetch_patent_details.py` のような個別公報ページの直接取得も、Google PatentsのXHRエンドポイントの直接取得も実行できない。

### 2. WebSearchツールによる代替調査

直接フェッチができないため、`WebSearch` ツール（検索エンジンのスニペットに基づく間接的な調査）で代替調査を試みた。試行したクエリと結果の要旨は以下の通り。

| 試行内容 | クエリ例 | 結果 |
| --- | --- | --- |
| 英字名 + Materials Science の直接組み合わせ | `"Matsuura Toru" "Materials Science" patent inventor` | 該当なし。無関係な同姓同名（Masashi Matsuura、Makoto Matsuura等）のみ |
| 別表記 "Tohru Matsuura" | `"Tohru Matsuura" "Materials Science" patent` | 該当なし |
| site:patents.google.com での絞り込み | `site:patents.google.com "Matsuura" "Materials Science"` 等 | Google Patentsの検索結果ページ・個別公報ページとも索引されず、無関係なサイトのみ返る |
| 出願人候補: 物質・材料研究機構（NIMS, 英名 National Institute for Materials Science） | `"物質・材料研究機構" "島津製作所" 発明者 松浦 融 特許 公開` 等、複数バリエーション | NIMSと島津製作所それぞれの一般情報は見つかったが、両者と松浦融氏を結びつける一次情報は見つからず |
| 出願人候補: 北陸/奈良先端科学技術大学院大学（JAIST/NAIST、学域に"Materials Science"を含む） | `松浦融 島津製作所 奈良先端科学技術大学院大学 特許` | 該当なし |
| 出願人候補: 国内の「マテリアルサイエンス株式会社」 | `"マテリアルサイエンス株式会社" 松浦 特許` | 実在の企業（東京都新宿区、UV関連製品・塗装・フラーレン等を扱う商社）がヒットしたが、材料試験・計測・制御という松浦融氏の技術領域と整合せず、除外 |
| Justia / uspto.report 等のミラー | `"patents.justia.com/inventor/toru-matsuura"`、`uspto.report "Matsuura" inventor "Materials Science"` 等 | 該当ページ自体が検索結果に現れず、確認不能 |
| J-GLOBAL経由 | `jglobal.jst.go.jp 松浦融 特許` | 松浦融氏に関する該当情報なし |

上記に加え、`ipforce.jp`（島津製作所の公開特許一覧を掲載する民間IP情報サイト）についても `site:ipforce.jp 松浦融` で検索したが、無関係な特許・企業（株式会社松浦機械製作所、株式会社松浦紙器製作所等）がノイズとしてヒットするのみで、松浦融氏本人および「Materials Science」系出願人との関連は確認できなかった。

### 3. 到達した判断

- 出願人名の正式名称（日本語・英語）は特定できなかった。「National Institute for Materials Science（国立研究開発法人物質・材料研究機構）」を含む複数の候補を検討したが、いずれも松浦融氏・島津製作所との関連を裏付ける一次情報には到達できなかった。
- 該当2件の公開番号、題名、優先日、請求項等の内容も一切確認できていない。
- したがって、**推測に基づく創作を避けるため、`client/src/data/patents.ts` への追加は行っていない。**

### 4. 今後の確認方法（提案）

本セッションの環境制約が解消され次第、以下のいずれかで再調査可能:

1. `https://patents.google.com/?inventor=Matsuura+Toru&assignee=Materials+Science&num=100` にGoogle Patentsへの疎通があるセッションから直接アクセスし、表示される公開番号を確認する。
2. オーナー（松浦融氏）に該当2件の公開番号（JP特許番号等）を直接確認いただき、`https://patents.google.com/patent/<公開番号>/ja` から本文・請求項を取得する（このページ形式は `scripts/fetch_patent_details.py` の既存ロジックでそのまま取得可能）。
3. J-PlatPat（特許情報プラットフォーム）で発明者名「松浦融」または「松浦　融」で検索し、出願人が島津製作所以外のものを確認する。

## 参照（アクセス不能を確認した一次情報源候補）

- [Google Patents: inventor:Matsuura Toru, assignee:Materials Science](https://patents.google.com/?inventor=Matsuura+Toru&assignee=Materials+Science&num=100) — 本セッションからは接続不可（403 policy denial）
- [Google Patents: inventor:Matsuura Toru, assignee:shimadzu,Materials Science](https://patents.google.com/?inventor=Matsuura+Toru&assignee=shimadzu,Materials+Science) — 同上
