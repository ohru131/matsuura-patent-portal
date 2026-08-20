# Google Patents 初回照合メモ

調査日: 2026-08-20

## 名寄せ条件

- 日本語表記 `inventor:松浦融` と `assignee:株式会社島津製作所` の組み合わせは、Google Patents上で 0 件だった。
- 英字表記 `inventor:Matsuura Toru` と `assignee:Shimadzu` の組み合わせは、Google Patents上で **53 results** を表示した。
- このため、サイトの調査対象の主要な名寄せキーは **Toru Matsuura / 松浦融**、出願人キーは **Shimadzu / 株式会社島津製作所** とする。

## 初頁で確認した代表的な公開公報

| 公開番号 | Google Patents上の英題 | 表示された国・地域 |
| --- | --- | --- |
| JP2014025702A | Fatigue testing machine | JP |
| JP2019132766A | Test result evaluation method and material tester | EP / US / CN / JP |
| JP2019053009A | Jig for ultrasonic fatigue testing machine | EP / US / CN / JP |
| JP2016080631A | Material testing machine | JP |
| JP2019132768A | Amplitude detection method and material tester | EP / US / CN / JP |
| JP2019052997A | Material testing machine | JP |
| JP2020134472A | Tensile tester and control method of tensile tester | JP |
| JP2013068492A | Material testing machine and hydraulic adjustment method for material testing machine | JP |

## 注意事項

Google Patentsの「53 results」は同じ発明の各国公報を含む可能性がある。公開番号の単純な件数ではなく、**特許ファミリーと各国・地域の公開公報を区別**して整理する必要がある。

J-GLOBALで「材料試験システム、方法、およびプログラム」に対応する公開記録の照合も試みたが、2026-08-20時点で同サービスは `503 Service Unavailable` を返した。J-GLOBALの検索結果スニペットで松浦融氏と島津製作所の関連は確認できたものの、本調査ではGoogle Patentsの公開情報を主たる検証元として用いる。

Google Patentsの画面では検索結果のCSVダウンロードURLが提示されたが、取得時には `429 Too Many Requests` が返った。したがって、結果ページの閲覧、個別公報、および検索エンジンによる補助照合を組み合わせて一覧を構築する。

## 同姓同名の除外

Justiaの「Toru Matsuura」一覧には、MediaTek Inc.を出願人とする高周波回路・通信分野等の出願も含まれていた。これは島津製作所の材料試験関連の対象とは一致しないため、本ポータルからは**除外**する。氏名だけでなく、少なくとも出願人（Shimadzu Corp／株式会社島津製作所）と技術分野を併用する。

## 個別原典による確認: JP2019132766A

| 項目 | 確認内容 |
| --- | --- |
| 題名 | 試験結果評価方法および材料試験機 |
| 発明者 | 融 松浦 / Toru Matsuura |
| 出願人 | Shimadzu Corp |
| 優先日 | 2018-02-01 |
| 日本公開 | JP2019132766A（2019-08-08） |
| 日本登録 | JP6911783B2（2021-07-28） |
| 海外同族 | US、EP、CN の公開がGoogle Patents上に表示 |
| 一般向け要約 | 試験中の微細な揺れ（固有振動）が測定値にどの程度混ざったかを数値化し、結果の信頼性を判断しやすくする技術。 |

この個別公報では、英字と日本語の発明者名が同一原典上に併記されている。また、国・地域タブとして JP、US、EP、CN が示され、国際的な特許ファミリーとして扱う根拠を確認した。

## 網羅検索の確定範囲

Google Patentsの条件 `inventor:Matsuura Toru`、`assignee:Shimadzu`、`num=100` により、**53 results** を一画面で確認した。構造化データの登録件数も53件で一致した。最も古い優先日は2003-06-06、最も新しい優先日は2024-05-28である。

| 観点 | 確認結果 |
| --- | --- |
| 名寄せ | Toru Matsuura / 融 松浦、Shimadzu Corp / 株式会社島津製作所 |
| 表示件数 | 53件（Google Patents検索結果） |
| 対象時期 | 優先日 2003年〜2024年 |
| 主要技術 | 材料試験、疲労・振動、超音波疲労、信号処理、制御、機器管理・監視 |
| 海外展開の表示 | JPを軸に、US・EP・CNを含む同族公開が一部のファミリーに表示 |
| 個別原典リンク | すべてのカードから `https://patents.google.com/patent/{公開番号}/ja` へ遷移可能 |

## 第二の個別原典による検証: JP2023043191A

| 項目 | 確認内容 |
| --- | --- |
| 題名 | 分析機器の管理装置、分析機器の管理システム、及び、分析機器の管理方法 |
| 発明者 | 大輔 萩原、泰紀 西村、融 松浦、翔太 牧 |
| 出願人 | Shimadzu Corp |
| 優先日 | 2021-09-15 |
| 国・地域表示 | JP、US、CN |
| 一般向け要約 | 機器本体や操作装置の画像を機器に対応付けて保管・配信し、利用者が現場へ行かず状態を確認しやすくする。 |

分類は、一般の読者が発明の役割を理解しやすいように「振動・疲労試験」「計測・データ信頼性」「制御・最適化」「接続・運用・安全」の4領域とした。

## 参照先

1. [Google Patents: inventor:Matsuura Toru, assignee:Shimadzu](https://patents.google.com/?inventor=Matsuura+Toru&assignee=Shimadzu)
2. [Google Patents: inventor:松浦融, assignee:株式会社島津製作所](https://patents.google.com/?inventor=%E6%9D%BE%E6%B5%A6%E8%9E%8D&assignee=%E6%A0%AA%E5%BC%8F%E4%BC%9A%E7%A4%BE%E5%B3%B6%E6%B4%A5%E8%A3%BD%E4%BD%9C%E6%89%80)
