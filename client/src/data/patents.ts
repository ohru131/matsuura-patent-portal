export type PatentCategory =
  | "振動・疲労試験"
  | "計測・データ信頼性"
  | "制御・最適化"
  | "接続・運用・安全";

export type PatentRecord = {
  id: string;
  title: string;
  priority: string;
  published: string;
  regions: string[];
  category: PatentCategory;
  overview: string;
  featured?: boolean;
};

const gp = (id: string) => `https://patents.google.com/patent/${id}/ja`;

export const patents: PatentRecord[] = [
  { id: "JP2014025702A", title: "疲労試験機", priority: "2012-07-24", published: "2014", regions: ["JP"], category: "振動・疲労試験", overview: "加速度範囲の広い疲労・耐久試験に対応する試験機。" },
  { id: "JP2019132766A", title: "試験結果評価方法および材料試験機", priority: "2018-02-01", published: "2019", regions: ["JP", "US", "EP", "CN"], category: "計測・データ信頼性", overview: "固有振動が測定結果に与える影響を定量的に評価する。", featured: true },
  { id: "JP2019053009A", title: "超音波疲労試験機用治具", priority: "2017-09-19", published: "2019", regions: ["JP", "US", "EP", "CN"], category: "振動・疲労試験", overview: "高応力を繰り返し与える超音波疲労試験のための治具。", featured: true },
  { id: "JP2016080631A", title: "材料試験機", priority: "2014-10-21", published: "2016", regions: ["JP"], category: "計測・データ信頼性", overview: "CT試験片を用いるき裂進展試験で、き裂長を安定して測定する。" },
  { id: "JP2019132768A", title: "振幅検出方法および材料試験機", priority: "2018-02-01", published: "2019", regions: ["JP", "US", "EP", "CN"], category: "計測・データ信頼性", overview: "試験データに重なる固有振動の振幅を求める。", featured: true },
  { id: "JP2023043191A", title: "分析機器の管理装置、分析機器の管理システム、及び、分析機器の管理方法", priority: "2021-09-15", published: "2023", regions: ["JP", "US", "CN"], category: "接続・運用・安全", overview: "機器と操作装置の画像を対応付けて記録・管理する。", featured: true },
  { id: "JP2019056614A", title: "材料試験におけるノイズ除去方法および材料試験機", priority: "2017-09-21", published: "2019", regions: ["JP", "US", "EP", "CN"], category: "計測・データ信頼性", overview: "破断点などの変化を保ちながら、高周波ノイズを除去する。" },
  { id: "JP2019052997A", title: "材料試験機", priority: "2017-09-19", published: "2019", regions: ["JP"], category: "計測・データ信頼性", overview: "実際の試験速度と目標値の差を結果とともに示す。" },
  { id: "JP2020134472A", title: "引張試験機および引張試験機の制御方法", priority: "2019-02-26", published: "2020", regions: ["JP", "US"], category: "計測・データ信頼性", overview: "高速引張試験の結果が妥当かを確認するための技術。" },
  { id: "JP2013068492A", title: "材料試験機および材料試験機の油圧調整方法", priority: "2011-09-22", published: "2013", regions: ["JP"], category: "制御・最適化", overview: "試験前に得たデータを用い、油圧機構の消費電力を抑える。" },
  { id: "JP2013221872A", title: "試験片把持具", priority: "2012-04-17", published: "2013", regions: ["JP"], category: "振動・疲労試験", overview: "ねじ止めが難しい薄板などを超音波疲労試験で固定する。" },
  { id: "JP2011169866A", title: "振動試験装置", priority: "2010-02-22", published: "2011", regions: ["JP"], category: "振動・疲労試験", overview: "広い周波数域で加速度応答を取得し、振動制御に用いる。" },
  { id: "JP2010266398A", title: "材料試験機", priority: "2009-05-18", published: "2010", regions: ["JP"], category: "振動・疲労試験", overview: "目標波形に近い振動を試験片へ与えるため、駆動信号を補正する。" },
  { id: "JP2013002824A", title: "材料試験機", priority: "2011-06-13", published: "2013", regions: ["JP"], category: "制御・最適化", overview: "油圧シリンダーの動きに応じて、消費電力と油の劣化を抑える。" },
  { id: "JP2009058522A", title: "疲労試験機および駆動信号生成装置", priority: "2008-11-06", published: "2009", regions: ["JP"], category: "振動・疲労試験", overview: "試験片への衝撃を抑えた駆動信号を生成する。" },
  { id: "JP2014032113A", title: "材料試験機", priority: "2012-08-03", published: "2014", regions: ["JP"], category: "振動・疲労試験", overview: "目標振幅に応答波形を近づけるための制御技術。" },
  { id: "JP2011017729A", title: "共振周波数検出器", priority: "2010-10-21", published: "2011", regions: ["JP"], category: "振動・疲労試験", overview: "複数の周波数を重ねた波形で、試験片の共振周波数を短時間に検出する。" },
  { id: "JP2014013176A", title: "疲労試験機および駆動波形補正方法", priority: "2012-07-04", published: "2014", regions: ["JP"], category: "振動・疲労試験", overview: "実際の応答をもとに、駆動波形を目標値へ補正する。" },
  { id: "JP2025023349A", title: "材料試験機および材料試験機用制御装置", priority: "2020-11-09", published: "2025", regions: ["JP", "US", "CN"], category: "制御・最適化", overview: "引張試験における操作ミスを抑えるための制御技術。" },
  { id: "JP2019132767A", title: "材料試験機", priority: "2018-02-01", published: "2019", regions: ["JP", "US", "EP", "CN"], category: "計測・データ信頼性", overview: "データ処理で用いるフィルター条件の妥当性を示す。" },
  { id: "JP2020165702A", title: "材料試験機および材料試験機の制御方法", priority: "2019-03-28", published: "2020", regions: ["JP"], category: "制御・最適化", overview: "短時間の測定から制御コンプライアンスを算出し、フィードバック制御に用いる。" },
  { id: "JP2020169836A", title: "制御装置、材料試験機、制御方法およびプログラム", priority: "2019-04-01", published: "2020", regions: ["JP"], category: "制御・最適化", overview: "複数の試験条件を組み合わせた材料試験を制御する。" },
  { id: "JP2020169838A", title: "材料試験機および材料試験機の制御方法", priority: "2019-04-01", published: "2020", regions: ["JP"], category: "計測・データ信頼性", overview: "制御対象の測定値に応じて、ノイズ除去の処理条件を定める。" },
  { id: "JP2019109189A", title: "信号処理方法および材料試験機", priority: "2017-12-20", published: "2019", regions: ["JP", "US", "EP", "CN"], category: "計測・データ信頼性", overview: "時間区間ごとの信号処理で、必要なデータの欠落を抑える。" },
  { id: "JP2020165787A", title: "制御装置、材料試験機、制御装置の制御方法および制御プログラム", priority: "2019-03-29", published: "2020", regions: ["JP"], category: "制御・最適化", overview: "材料試験機の制御精度を高めるための制御装置。" },
  { id: "JP2017058273A", title: "疲労試験機", priority: "2015-09-17", published: "2017", regions: ["JP"], category: "振動・疲労試験", overview: "非線形な応答に対して、駆動波形を補正する。" },
  { id: "JP2020169842A", title: "材料試験機およびその制御方法", priority: "2019-04-01", published: "2020", regions: ["JP"], category: "制御・最適化", overview: "荷重の測定値を用いて、試験力をフィードバック制御する。" },
  { id: "JP2015132569A", title: "超音波疲労試験機", priority: "2014-01-15", published: "2015", regions: ["JP"], category: "振動・疲労試験", overview: "薄い試験片にも大きな励振振幅を与えるための構成。" },
  { id: "JP2015210094A", title: "超音波疲労試験機および超音波疲労試験方法", priority: "2014-04-24", published: "2015", regions: ["JP"], category: "振動・疲労試験", overview: "試験片の温度を見積もり、励振と休止の時間を設定する。" },
  { id: "JP2023013482A", title: "材料試験機の管理装置および管理システム", priority: "2021-07-16", published: "2023", regions: ["JP"], category: "接続・運用・安全", overview: "試験機のパラメーターから状態を判定し、管理に用いる。" },
  { id: "JP2014142196A", title: "超音波疲労試験機および超音波疲労試験機用ホーン", priority: "2013-01-22", published: "2014", regions: ["JP"], category: "振動・疲労試験", overview: "小径の試験片をホーンへ固定するための構成。" },
  { id: "JP2011227025A", title: "疲労試験機", priority: "2010-04-23", published: "2011", regions: ["JP"], category: "振動・疲労試験", overview: "非線形な応答でも、反復計算によって目標波形へ近づける。" },
  { id: "JP2005017054A", title: "三点曲げ試験による破壊靱性値測定装置", priority: "2003-06-25", published: "2005", regions: ["JP"], category: "計測・データ信頼性", overview: "三点曲げ試験で破壊靱性値を測定する装置。" },
  { id: "JP2009222655A", title: "材料試験機および材料試験方法", priority: "2008-03-18", published: "2009", regions: ["JP"], category: "振動・疲労試験", overview: "試験片の共振周波数の変化に試験周波数を追従させる。" },
  { id: "JP2007303893A", title: "疲労試験機", priority: "2006-05-10", published: "2007", regions: ["JP"], category: "振動・疲労試験", overview: "本試験の前に準備用の駆動を行い、試験片への衝撃を抑える。" },
  { id: "JP2004361317A", title: "内圧疲労試験機", priority: "2003-06-06", published: "2004", regions: ["JP"], category: "振動・疲労試験", overview: "補助油圧源の動作に伴う圧力変動を抑える。" },
  { id: "JP2023037157A", title: "材料試験機", priority: "2021-09-03", published: "2023", regions: ["JP"], category: "制御・最適化", overview: "非線形な試験片に対する制御パラメーターを求める。" },
  { id: "JP2024138552A", title: "疲労試験機の管理装置および疲労試験機", priority: "2021-01-08", published: "2024", regions: ["JP"], category: "接続・運用・安全", overview: "複数の疲労試験機の試験進行をまとめて管理する。" },
  { id: "JP2024016434A", title: "監視装置および監視システム", priority: "2022-07-26", published: "2024", regions: ["JP", "US", "CN"], category: "接続・運用・安全", overview: "表示パネルの非発光マーカーをカメラ画像から検出する。" },
  { id: "JP2023043144A", title: "分析機器のモニタ", priority: "2021-09-15", published: "2023", regions: ["JP"], category: "接続・運用・安全", overview: "分析機器の表示画像を保存し、状態確認に用いる。" },
  { id: "JP2023044390A", title: "材料試験機", priority: "2021-09-17", published: "2023", regions: ["JP", "US", "CN"], category: "制御・最適化", overview: "油圧アクチュエーターの応答を推定し、制御条件の調整に用いる。" },
  { id: "JP2025179728A", title: "疲労試験機および疲労試験機の表示制御方法", priority: "2024-05-28", published: "2025", regions: ["JP"], category: "接続・運用・安全", overview: "疲労試験の結果一覧を表示・確認するための制御方法。" },
  { id: "JP2022134709A", title: "試験機特性評価方法、試験機およびプログラム", priority: "2021-03-04", published: "2022", regions: ["JP"], category: "制御・最適化", overview: "最大速度曲線と最大加速度曲線を求め、試験機の特性を評価する。" },
  { id: "JP2022184622A", title: "材料試験装置および材料試験システム", priority: "2021-06-01", published: "2022", regions: ["JP"], category: "接続・運用・安全", overview: "人体の検知結果に応じて、引張試験機の動作を制限する。" },
  { id: "JP2020165701A", title: "材料試験機および材料試験機の制御方法", priority: "2019-03-28", published: "2020", regions: ["JP"], category: "制御・最適化", overview: "試験内容に応じた制御コンプライアンスを算出し、サーボ制御に用いる。" },
  { id: "JP2020159893A", title: "制御装置、材料試験機、制御装置の制御方法および制御プログラム", priority: "2019-03-27", published: "2020", regions: ["JP"], category: "制御・最適化", overview: "材料試験機の制御精度を高めるための制御装置。" },
  { id: "JP2020165706A", title: "材料試験機および材料試験機の制御方法", priority: "2019-03-28", published: "2020", regions: ["JP"], category: "制御・最適化", overview: "クロスヘッドの移動方向が変わる試験に対応する制御方法。" },
  { id: "JP2020159897A", title: "材料試験機および材料試験機の制御方法", priority: "2019-03-27", published: "2020", regions: ["JP"], category: "制御・最適化", overview: "試験片の違いに左右されにくいフィードバック制御を行う。" },
  { id: "JP2020165699A", title: "材料試験機および材料試験機の制御方法", priority: "2019-03-28", published: "2020", regions: ["JP"], category: "制御・最適化", overview: "伸び計の分解能に依存しない材料試験を行うための制御方法。" },
  { id: "JP2020159963A", title: "同定装置、材料試験機、同定装置の制御方法およびプログラム", priority: "2019-03-27", published: "2020", regions: ["JP"], category: "制御・最適化", overview: "材料試験機の特性を同定するための装置と制御方法。" },
  { id: "JP2020169837A", title: "材料試験機および材料試験機の制御方法", priority: "2019-04-01", published: "2020", regions: ["JP"], category: "制御・最適化", overview: "圧縮試験における制御偏差を扱い、制御精度を改善する。" },
  { id: "JP2016038227A", title: "材料試験機", priority: "2014-08-06", published: "2016", regions: ["JP"], category: "計測・データ信頼性", overview: "CT試験片によるき裂進展試験の所要時間を短縮する。" },
  { id: "JP2025179729A", title: "材料試験機および把持具の撮影方法", priority: "2024-05-28", published: "2025", regions: ["JP"], category: "接続・運用・安全", overview: "引張試験の準備中に把持具を撮影し、確認用の画像を得る。" },
];

export const patentCategories: { id: PatentCategory; label: string; description: string }[] = [
  { id: "振動・疲労試験", label: "振動・疲労試験", description: "繰り返し荷重、共振、超音波を用いる材料試験。" },
  { id: "計測・データ信頼性", label: "計測・データ信頼性", description: "ノイズや振動の影響を扱い、測定値を評価する技術。" },
  { id: "制御・最適化", label: "制御・最適化", description: "試験条件に応じて、荷重や変位の制御を行う技術。" },
  { id: "接続・運用・安全", label: "接続・運用・安全", description: "機器の管理、状態確認、安全に関する技術。" },
];

export const patentLink = (id: string) => gp(id);
