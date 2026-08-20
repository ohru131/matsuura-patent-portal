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
  { id: "JP2014025702A", title: "疲労試験機", priority: "2012-07-24", published: "2014", regions: ["JP"], category: "振動・疲労試験", overview: "幅広い加速度域で、耐久性を確かめる繰り返し試験を行いやすくする。" },
  { id: "JP2019132766A", title: "試験結果評価方法および材料試験機", priority: "2018-02-01", published: "2019", regions: ["JP", "US", "EP", "CN"], category: "計測・データ信頼性", overview: "測定値に混ざる揺れの影響を数値化し、結果をどこまで信頼できるか判断しやすくする。", featured: true },
  { id: "JP2019053009A", title: "超音波疲労試験機用治具", priority: "2017-09-19", published: "2019", regions: ["JP", "US", "EP", "CN"], category: "振動・疲労試験", overview: "さまざまな材料の試験片を扱いやすくし、高い応力を繰り返しかける試験を支える。", featured: true },
  { id: "JP2016080631A", title: "材料試験機", priority: "2014-10-21", published: "2016", regions: ["JP"], category: "計測・データ信頼性", overview: "き裂が伸びる試験で、ひずみ計の測定を使いながら安定して長さを求める。" },
  { id: "JP2019132768A", title: "振幅検出方法および材料試験機", priority: "2018-02-01", published: "2019", regions: ["JP", "US", "EP", "CN"], category: "計測・データ信頼性", overview: "試験データに重なる固有振動の大きさを、定量的につかめるようにする。", featured: true },
  { id: "JP2023043191A", title: "分析機器の管理装置、管理システム、管理方法", priority: "2021-09-15", published: "2023", regions: ["JP", "US", "CN"], category: "接続・運用・安全", overview: "機器と操作装置の画像をひも付け、現地に行かずに状態を確かめやすくする。", featured: true },
  { id: "JP2019056614A", title: "材料試験におけるノイズ除去方法および材料試験機", priority: "2017-09-21", published: "2019", regions: ["JP", "US", "EP", "CN"], category: "計測・データ信頼性", overview: "破断など大事な変化を残しながら、測定データの高周波ノイズを抑える。" },
  { id: "JP2019052997A", title: "材料試験機", priority: "2017-09-19", published: "2019", regions: ["JP"], category: "計測・データ信頼性", overview: "目標どおりの試験速度が得られたかを、結果と一緒に判断できるようにする。" },
  { id: "JP2020134472A", title: "引張試験機および引張試験機の制御方法", priority: "2019-02-26", published: "2020", regions: ["JP", "US"], category: "計測・データ信頼性", overview: "高速で引っ張る試験について、結果が妥当かどうかを確認しやすくする。" },
  { id: "JP2013068492A", title: "材料試験機および材料試験機の油圧調整方法", priority: "2011-09-22", published: "2013", regions: ["JP"], category: "制御・最適化", overview: "試験前のデータを活かし、油圧式の試験機で電力を効率良く使う。" },
  { id: "JP2013221872A", title: "試験片把持具", priority: "2012-04-17", published: "2013", regions: ["JP"], category: "振動・疲労試験", overview: "ねじ止めしにくい薄板なども、超音波疲労試験でしっかり固定する。" },
  { id: "JP2011169866A", title: "振動試験装置", priority: "2010-02-22", published: "2011", regions: ["JP"], category: "振動・疲労試験", overview: "幅広い周波数で信頼できる加速度応答を得て、振動の制御精度を高める。" },
  { id: "JP2010266398A", title: "材料試験機", priority: "2009-05-18", published: "2010", regions: ["JP"], category: "振動・疲労試験", overview: "目標に近い振動を試験片へ与えるため、駆動信号を繰り返し整える。" },
  { id: "JP2013002824A", title: "材料試験機", priority: "2011-06-13", published: "2013", regions: ["JP"], category: "制御・最適化", overview: "油圧シリンダーの動きに合わせて、消費電力と油の劣化を抑える。" },
  { id: "JP2009058522A", title: "疲労試験機および駆動信号生成装置", priority: "2008-11-06", published: "2009", regions: ["JP"], category: "振動・疲労試験", overview: "試験片へ衝撃を与えにくい、滑らかで正確な駆動信号を作る。" },
  { id: "JP2014032113A", title: "材料試験機", priority: "2012-08-03", published: "2014", regions: ["JP"], category: "振動・疲労試験", overview: "試験機の限界を越える目標振幅にも近づけるよう、応答波形を整える。" },
  { id: "JP2011017729A", title: "共振周波数検出器", priority: "2010-10-21", published: "2011", regions: ["JP"], category: "振動・疲労試験", overview: "異なる周波数を重ねた波を使い、試験片が最も振動しやすい周波数を短時間で探す。" },
  { id: "JP2014013176A", title: "疲労試験機および駆動波形補正方法", priority: "2012-07-04", published: "2014", regions: ["JP"], category: "振動・疲労試験", overview: "実際の応答を見ながら、目標に近い振動波形になるよう駆動を補正する。" },
  { id: "JP2025023349A", title: "材料試験機および材料試験機用制御装置", priority: "2020-11-09", published: "2025", regions: ["JP", "US", "CN"], category: "制御・最適化", overview: "操作者の誤操作を抑え、引張試験をより確実に進めやすくする。" },
  { id: "JP2019132767A", title: "材料試験機", priority: "2018-02-01", published: "2019", regions: ["JP", "US", "EP", "CN"], category: "計測・データ信頼性", overview: "データ処理のフィルター条件が適切か、利用者が判断しやすい情報を示す。" },
  { id: "JP2020165702A", title: "材料試験機および材料試験機の制御方法", priority: "2019-03-28", published: "2020", regions: ["JP"], category: "制御・最適化", overview: "短い測定時間でも試験機の動かしやすさを正確に計算し、制御に活かす。" },
  { id: "JP2020169836A", title: "制御装置、材料試験機、制御方法およびプログラム", priority: "2019-04-01", published: "2020", regions: ["JP"], category: "制御・最適化", overview: "複数の試験条件を組み合わせた材料試験を、無理なく実行できるようにする。" },
  { id: "JP2020169838A", title: "材料試験機および材料試験機の制御方法", priority: "2019-04-01", published: "2020", regions: ["JP"], category: "計測・データ信頼性", overview: "制御対象の測定値に合わせて、ノイズを適切に取り除くフィルター処理を行う。" },
  { id: "JP2019109189A", title: "信号処理方法および材料試験機", priority: "2017-12-20", published: "2019", regions: ["JP", "US", "EP", "CN"], category: "計測・データ信頼性", overview: "信号を区切って処理する際にも、必要なデータが抜けないようにする。" },
  { id: "JP2020165787A", title: "制御装置、材料試験機、制御装置の制御方法および制御プログラム", priority: "2019-03-29", published: "2020", regions: ["JP"], category: "制御・最適化", overview: "試験機の制御精度を高め、狙った条件で材料を確かめやすくする。" },
  { id: "JP2017058273A", title: "疲労試験機", priority: "2015-09-17", published: "2017", regions: ["JP"], category: "振動・疲労試験", overview: "複雑な応答でも、波レット変換を使って駆動波形を精密に補正する。" },
  { id: "JP2020169842A", title: "材料試験機およびその制御方法", priority: "2019-04-01", published: "2020", regions: ["JP"], category: "制御・最適化", overview: "荷重を測る値を使い、試験片に加える力を正確にフィードバック制御する。" },
  { id: "JP2015132569A", title: "超音波疲労試験機", priority: "2014-01-15", published: "2015", regions: ["JP"], category: "振動・疲労試験", overview: "装置を大きくせずに、薄い試験片にも大きな励振振幅を与えられるようにする。" },
  { id: "JP2015210094A", title: "超音波疲労試験機および超音波疲労試験方法", priority: "2014-04-24", published: "2015", regions: ["JP"], category: "振動・疲労試験", overview: "試験片の温度を見積もり、超音波試験の動作時間と休止時間を適切に決める。" },
  { id: "JP2023013482A", title: "材料試験機の管理装置および管理システム", priority: "2021-07-16", published: "2023", regions: ["JP"], category: "接続・運用・安全", overview: "試験機のパラメーターから状態を判定し、利用者が状況をつかみやすくする。" },
  { id: "JP2014142196A", title: "超音波疲労試験機および超音波疲労試験機用ホーン", priority: "2013-01-22", published: "2014", regions: ["JP"], category: "振動・疲労試験", overview: "細い試験片でも確実に固定し、精度の良い超音波疲労試験を行う。" },
  { id: "JP2011227025A", title: "疲労試験機", priority: "2010-04-23", published: "2011", regions: ["JP"], category: "振動・疲労試験", overview: "非線形な応答でも、繰り返し調整によって目標に近い振動を作る。" },
  { id: "JP2005017054A", title: "三点曲げ試験による破壊靱性値測定装置", priority: "2003-06-25", published: "2005", regions: ["JP"], category: "計測・データ信頼性", overview: "材料の割れにくさを表す値を、より正確に測定するための三点曲げ試験装置。" },
  { id: "JP2009222655A", title: "材料試験機および材料試験方法", priority: "2008-03-18", published: "2009", regions: ["JP"], category: "振動・疲労試験", overview: "試験片の共振周波数の変化に合わせて、試験の振動数を追従させる。" },
  { id: "JP2007303893A", title: "疲労試験機", priority: "2006-05-10", published: "2007", regions: ["JP"], category: "振動・疲労試験", overview: "本試験の前に準備用の駆動を行い、試験片に不要な衝撃を与えずに始める。" },
  { id: "JP2004361317A", title: "内圧疲労試験機", priority: "2003-06-06", published: "2004", regions: ["JP"], category: "振動・疲労試験", overview: "補助油圧源の動作時にも圧力変動を抑え、内圧を使う疲労試験の精度を高める。" },
  { id: "JP2023037157A", title: "材料試験機", priority: "2021-09-03", published: "2023", regions: ["JP"], category: "制御・最適化", overview: "試験片の性質が単純でない場合にも、適切な制御パラメーターを見つける。" },
  { id: "JP2024138552A", title: "疲労試験機の管理装置および疲労試験機", priority: "2021-01-08", published: "2024", regions: ["JP"], category: "接続・運用・安全", overview: "複数の疲労試験機について、試験の進み具合をまとめて確認しやすくする。" },
  { id: "JP2024016434A", title: "監視装置および監視システム", priority: "2022-07-26", published: "2024", regions: ["JP", "US", "CN"], category: "接続・運用・安全", overview: "表示パネルの光らない目印もカメラ画像から捉え、機器の状態監視に役立てる。" },
  { id: "JP2023043144A", title: "分析機器のモニタ", priority: "2021-09-15", published: "2023", regions: ["JP"], category: "接続・運用・安全", overview: "分析機器の表示を画像として保管し、利用者が状態を確認しやすくする。" },
  { id: "JP2023044390A", title: "材料試験機", priority: "2021-09-17", published: "2023", regions: ["JP", "US", "CN"], category: "制御・最適化", overview: "油圧アクチュエーターの応答を見積もり、調整作業の負担を減らす。" },
  { id: "JP2025179728A", title: "疲労試験機および疲労試験機の表示制御方法", priority: "2024-05-28", published: "2025", regions: ["JP"], category: "接続・運用・安全", overview: "試験結果の一覧を見やすくし、確認にかかる手間を抑える。" },
  { id: "JP2022134709A", title: "試験機特性評価方法、試験機およびプログラム", priority: "2021-03-04", published: "2022", regions: ["JP"], category: "制御・最適化", overview: "最大速度や最大加速度を適切に求め、試験機ができることを把握しやすくする。" },
  { id: "JP2022184622A", title: "材料試験装置および材料試験システム", priority: "2021-06-01", published: "2022", regions: ["JP"], category: "接続・運用・安全", overview: "人の身体を検知した状態に応じて、引張試験機の動作を制限する安全技術。" },
  { id: "JP2020165701A", title: "材料試験機および材料試験機の制御方法", priority: "2019-03-28", published: "2020", regions: ["JP"], category: "制御・最適化", overview: "試験内容に合った制御のしやすさを計算し、サーボモーターを精密に動かす。" },
  { id: "JP2020159893A", title: "制御装置、材料試験機、制御装置の制御方法および制御プログラム", priority: "2019-03-27", published: "2020", regions: ["JP"], category: "制御・最適化", overview: "材料試験機の制御精度を高めるための制御装置と、その動かし方。" },
  { id: "JP2020165706A", title: "材料試験機および材料試験機の制御方法", priority: "2019-03-28", published: "2020", regions: ["JP"], category: "制御・最適化", overview: "クロスヘッドの移動方向が切り替わる試験でも、精度良く制御できるようにする。" },
  { id: "JP2020159897A", title: "材料試験機および材料試験機の制御方法", priority: "2019-03-27", published: "2020", regions: ["JP"], category: "制御・最適化", overview: "試験片に左右されにくい安定した制御で、正確な試験を支える。" },
  { id: "JP2020165699A", title: "材料試験機および材料試験機の制御方法", priority: "2019-03-28", published: "2020", regions: ["JP"], category: "制御・最適化", overview: "伸び計の分解能に頼りすぎず、材料を正確に試験できるようにする。" },
  { id: "JP2020159963A", title: "同定装置、材料試験機、同定装置の制御方法およびプログラム", priority: "2019-03-27", published: "2020", regions: ["JP"], category: "制御・最適化", overview: "試験機の特徴を見分ける精度を高め、適切な制御につなげる。" },
  { id: "JP2020169837A", title: "材料試験機および材料試験機の制御方法", priority: "2019-04-01", published: "2020", regions: ["JP"], category: "制御・最適化", overview: "圧縮試験でのずれを扱い、材料試験機の制御精度を改善する。" },
  { id: "JP2016038227A", title: "材料試験機", priority: "2014-08-06", published: "2016", regions: ["JP"], category: "計測・データ信頼性", overview: "CT試験片を使うき裂進展試験の全体時間を短くする。" },
  { id: "JP2025179729A", title: "材料試験機および把持具の撮影方法", priority: "2024-05-28", published: "2025", regions: ["JP"], category: "接続・運用・安全", overview: "引張試験の準備中にも把持具を適切に撮影し、確認しやすい画像を作る。" },
];

export const patentCategories: { id: PatentCategory; label: string; description: string }[] = [
  { id: "振動・疲労試験", label: "振動・疲労試験", description: "繰り返し力・共振・超音波を使い、材料の粘り強さを確かめる発明。" },
  { id: "計測・データ信頼性", label: "計測・データ信頼性", description: "ノイズや揺れを見分け、測定結果を根拠ある数値へ近づける発明。" },
  { id: "制御・最適化", label: "制御・最適化", description: "試験機の応答を理解し、狙った条件を正確・効率よく実現する発明。" },
  { id: "接続・運用・安全", label: "接続・運用・安全", description: "機器の見守り、作業のしやすさ、安全性を高める発明。" },
];

export const patentLink = (id: string) => gp(id);
