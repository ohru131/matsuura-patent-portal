/**
 * Style reminder — 光学の航路:
 * トップページは「代表個人のポートフォリオ」。事業のランディングページではなく、
 * 問い合わせ導線も置かない。世界観（生成り地・航路の朱・罫線・角丸・柔らかい影）は
 * Patents.tsx と揃え、ヒーローは写真を使わず藍地＋SVG/CSSグラフィックで構成する
 * （/manus-storage の画像アセットは実在しないため、画像参照は一切持たない）。
 */
import {
  ArrowUpRight,
  Clock,
  ExternalLink,
  Route as RouteIcon,
  Sparkles,
  Users,
  Watch,
} from "lucide-react";
import { Link } from "wouter";
import { patentLink, patents } from "@/data/patents";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

const dxCards = [
  {
    icon: RouteIcon,
    title: "訪問ルート最適化",
    body: "複数のご家庭を回る移動の順番を自動で組み立て、移動時間とスタッフの負担を減らします。",
  },
  {
    icon: Users,
    title: "スタッフ配置最適化",
    body: "資格・経験・希望・移動距離をふまえ、だれをどの訪問に割り当てるかの案を自動で作ります。",
  },
  {
    icon: Sparkles,
    title: "AI日報",
    body: "その日の記録をAIが下書きし、担当者は確認と手直しだけ。報告書づくりの時間を短くします。",
  },
  {
    icon: Clock,
    title: "勤怠管理",
    body: "訪問先での開始と終了、移動時間を記録し、給与計算や法令対応に使える形で残します。",
  },
  {
    icon: Watch,
    title: "スマートウォッチ連携",
    body: "腕時計型の端末から、打刻や体調・状況の共有を、手をふさがずに行えるようにします。",
  },
];

const expertiseCards = [
  {
    label: "はかる",
    sub: "センシングと信号処理",
    body: "現実の力・振動・位置・状態をセンサーで捉え、ノイズ（測定に混じる不要な揺れ）を取り除いて意味のある情報に変えます。",
  },
  {
    label: "ととのえる",
    sub: "制御と最適化",
    body: "目標とのズレを見て自動で調整する。試験機の制御で培った考え方を、人や移動の配置にも応用します。",
  },
  {
    label: "まとめる",
    sub: "監視と運用",
    body: "複数の機器・人・拠点の状況を一つの画面で把握し、異常や遅れに早く気づける形にします。",
  },
];

/**
 * ヒーローのリード文。日本語は文字単位でどこでも折り返せてしまうため、
 * 語の途中（例:「業務改／善」）で改行されるのを防ぐ目的で、意味のまとまりごとに
 * whitespace-nowrap の区切りを入れて描画する。連結すると元の文章と完全に一致する。
 */
const heroLeadPhrases = [
  "松浦融です。",
  "材料試験機の計測と制御に長く携わり、",
  "2003年から2024年にかけて",
  "公開された50件を超える発明に、",
  "発明者として名前が記載されています。",
  "いまは、",
  "ベビーシッター事業を運営する法人の",
  "業務改善（DX）に取り組んでいます。",
];

const featuredIds = ["JP2024138552A", "JP2022184622A", "JP2023013482A", "JP2019132768A"];
const featuredPatents = featuredIds
  .map((id) => patents.find((patent) => patent.id === id))
  .filter((patent): patent is (typeof patents)[number] => Boolean(patent));

/**
 * 代表4件は、一般の読者向けに要点だけをやさしい言葉で書き直したもの。
 * patents.ts の overview / technicalChallenge は公報の言い回しをそのまま整理した文章のため、
 * トップページでは使わず、ここで1〜2文の平易な説明を用意する（内容は公報の記載から外れないこと）。
 */
const featuredSummaries: Record<string, string> = {
  JP2024138552A:
    "複数の試験機の進み具合を、現場に行かなくても一覧でまとめて確認できるようにする発明です。",
  JP2022184622A:
    "カメラの映像から人の存在を検知し、危険なときに機械の動きを自動で止める発明です。",
  JP2023013482A:
    "試験機がいまどんな状態にあるかを、現地に行かなくても遠くから把握できるようにする発明です。",
  JP2019132768A:
    "試験中に生じる機械自体の細かな揺れ（ノイズ）を取り除き、測定データの精度を高める発明です。",
};

const journey = [
  {
    when: "2003",
    title: "最初の発明が公開される",
    body: "材料試験機に関する発明が、公開公報として初めて公開されました（優先日ベース）。",
  },
  {
    when: "2003—2024",
    title: "材料試験・計測・制御に関する53件が公開",
    body: "株式会社島津製作所に在籍中、発明者として名前が記載された公開公報が、日本・米国・欧州・中国で公開されました。",
  },
  {
    when: "いま",
    title: "個人事業主として独立",
    body: "ベビーシッター事業を運営する法人向けの業務改善（DX）に取り組んでいます。",
  },
  {
    when: "これから",
    title: "フィジカルAIへの展開と公募への挑戦",
    body: "センサーで測り、制御で動かす技術をフィジカルAIの分野につなげたいと考えています。未踏事業などの公募への応募も検討中です。",
  },
] as const;

function RegionPills({ regions }: { regions: string[] }) {
  return (
    <div aria-label={`公開地域: ${regions.join("、")}`} className="flex flex-wrap gap-1.5">
      {regions.map((region) => (
        <span
          className={`font-mono text-[10px] font-medium tracking-[0.12em] ${
            region === "JP" ? "text-vermillion-strong" : "text-[#36526b]"
          }`}
          key={region}
        >
          {region}
        </span>
      ))}
    </div>
  );
}

export default function Home() {
  useDocumentMeta({
    title: "松浦 融｜ポートフォリオ",
    description:
      "材料試験機の計測・制御技術の発明者として名前が記載されている公開特許53件と、現在取り組んでいるベビーシッター事業者向け業務改善DXを紹介するポートフォリオです。",
  });

  return (
    <div>
      {/* ヒーロー: ヘッダー(76px)分は pt-[76px] で吸収する（Layout.tsx の申し送り方式） */}
      <section className="relative isolate overflow-hidden bg-[#071e38] pt-[76px] text-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -right-16 top-16 h-72 w-72 rounded-full border border-[#e7cd88]/20 sm:h-96 sm:w-96" />
          <div className="absolute right-8 top-40 h-52 w-52 rounded-full border border-[#e7cd88]/25 sm:h-64 sm:w-64" />
          <div className="absolute right-24 top-1/2 hidden h-px w-72 -translate-y-1/2 bg-gradient-to-r from-transparent via-[#e7cd88]/50 to-transparent lg:block" />
          <div className="absolute -left-10 bottom-0 h-56 w-56 rounded-full border border-white/10" />
        </div>
        <div className="section-shell relative py-20 lg:py-28">
          <div className="max-w-4xl">
            <p className="mb-4 font-mono text-[11px] tracking-[0.16em] text-[#b2c4d5]">
              PORTFOLIO / 松浦融
            </p>
            <h1 className="jp-wrap font-serif text-3xl leading-[1.4] tracking-[-0.02em] sm:text-5xl sm:leading-[1.3] lg:text-6xl lg:leading-[1.3] lg:tracking-[-0.03em]">
              現実を測る技術から、
              <br />
              現場の負担を
              <br className="sm:hidden" />
              減らす仕組みへ。
            </h1>
            <p className="jp-wrap mt-8 max-w-2xl text-base leading-8 text-[#d5dfe7] sm:text-lg">
              {heroLeadPhrases.map((phrase) => (
                <span className="whitespace-nowrap" key={phrase}>
                  {phrase}
                </span>
              ))}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a className="primary-action" href="#work">
                いまの取り組みを見る <ArrowUpRight size={17} />
              </a>
              <Link className="secondary-action" href="/patents">
                公開特許の一覧（53件） <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* いまの取り組み */}
      <section className="section-shell editorial-section py-20 lg:py-28" id="work">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="eyebrow">01 / NOW</p>
            <h2 className="display-heading mt-5">いま取り組んでいること。</h2>
          </div>
          <div>
            <p className="body-copy max-w-2xl">
              ベビーシッターを派遣する法人では、スタッフが一日に複数のご家庭を訪問します。
              だれをどこへ、どの順番で向かわせるか。働いた時間をどう記録するか。その日の様子をどう報告するか。
              こうした事務作業は件数が増えるほど重くなり、現場の時間を奪いがちです。
              本業である「子どもと向き合う時間」に集中できるよう、その裏側の手間を減らす仕組みをつくっています。
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#7d6b4c]">
              ※ サービスの提供先は、ベビーシッター事業を運営する法人・事業者です。
            </p>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {dxCards.map((card) => (
            <div
              className="rounded-2xl border border-line bg-cream-card p-6 shadow-[var(--shadow-soft)] transition-shadow duration-150 hover:shadow-[var(--shadow-soft-lg)]"
              key={card.title}
            >
              <card.icon aria-hidden="true" className="text-vermillion-strong" size={26} strokeWidth={1.6} />
              <p className="mt-5 font-serif text-lg text-[#123650]">{card.title}</p>
              <p className="mt-3 text-[15px] leading-7 text-[#5f7284]">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* これまでの仕事 */}
      <section className="relative overflow-hidden bg-[#e8dfcf] py-20 sm:mx-8 sm:rounded-2xl lg:mx-12 lg:py-24" id="past">
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 lg:block">
          <div className="absolute right-10 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full border border-[#aa372a]/20" />
          <div className="absolute right-32 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full border border-[#aa372a]/25" />
        </div>
        <div className="section-shell relative">
          <p className="eyebrow text-[#915246]">02 / BEFORE</p>
          <h2 className="display-heading mt-5">これまでの仕事。</h2>
          <p className="body-copy mt-7 max-w-2xl">
            株式会社島津製作所に在籍中、材料試験機の計測・制御・遠隔管理に関する開発に携わりました。
            その成果は公開特許として残っています（特許を受ける権利は、出願人である企業に帰属します）。
          </p>

          <div className="mt-10 grid grid-cols-1 divide-y divide-[#cbb99a] rounded-2xl border border-[#cbb99a] bg-[#f7f3eb] shadow-[var(--shadow-soft)] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="stat-block">
              <p className="stat-number">{patents.length}</p>
              <p className="stat-label">
                発明者として名前が記載された
                <br />
                公開公報
              </p>
            </div>
            <div className="stat-block">
              <p className="stat-number">2003—2024</p>
              <p className="stat-label">
                優先日（最初に出願した日）で見る
                <br />
                公開情報の対象期間
              </p>
            </div>
            <div className="stat-block">
              <p className="stat-number">JP · US · EP · CN</p>
              <p className="stat-label">
                原典上で確認できる
                <br />
                国内外への公開展開
              </p>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredPatents.map((patent) => (
              <article
                className="flex min-h-[15rem] flex-col rounded-2xl border border-line bg-cream-card p-6 shadow-[var(--shadow-soft)]"
                key={patent.id}
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-[10px] tracking-[0.14em] text-[#677f93]">{patent.id}</span>
                  <RegionPills regions={patent.regions} />
                </div>
                <h3 className="mt-4 font-serif text-lg leading-snug text-[#102c45]">{patent.title}</h3>
                <p className="jp-wrap mt-3 flex-1 text-sm leading-6 text-[#5f7284]">
                  {featuredSummaries[patent.id] ?? patent.overview}
                </p>
                <a
                  className="mt-5 inline-flex min-h-9 items-center gap-1.5 text-xs font-medium text-vermillion-strong"
                  href={patentLink(patent.id)}
                  rel="noreferrer"
                  target="_blank"
                >
                  Google Patentsで見る <ExternalLink size={13} />
                </a>
              </article>
            ))}
          </div>

          <Link className="text-link mt-10 inline-flex" href="/patents">
            53件すべてを見る <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>

      {/* できること（専門領域） */}
      <section className="section-shell editorial-section py-20 lg:py-28">
        <p className="eyebrow">03 / SKILLS</p>
        <h2 className="display-heading mt-5">できること。</h2>
        <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {expertiseCards.map((card) => (
            <div
              className="rounded-2xl border border-line bg-cream-card p-7 shadow-[var(--shadow-soft)]"
              key={card.label}
            >
              <p className="font-serif text-2xl text-[#123650]">{card.label}</p>
              <p className="mt-1 font-mono text-[11px] tracking-[0.1em] text-vermillion-strong">{card.sub}</p>
              <p className="mt-4 text-[15px] leading-7 text-[#5f7284]">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 歩み */}
      <section className="relative overflow-hidden bg-[#0a2741] py-20 text-white lg:py-24" id="journey">
        <div className="section-shell">
          <p className="eyebrow text-[#e8cb83]">04 / JOURNEY</p>
          <h2 className="mt-5 font-serif text-3xl leading-tight tracking-[-0.02em] sm:text-4xl">歩み。</h2>
          <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <ol className="relative min-w-0 max-w-2xl">
              <div aria-hidden="true" className="absolute bottom-2 left-[7px] top-2 w-px bg-[repeating-linear-gradient(to_bottom,#e4c679_0_5px,transparent_5px_13px)] opacity-70" />
              {journey.map((item) => (
                <li className="relative pb-12 pl-9 last:pb-0" key={item.title}>
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border border-[#e4c679] bg-[#0a2741] shadow-[0_0_0_4px_#0a2741]"
                  />
                  <p className="font-mono text-xs tracking-[0.12em] text-[#e4c679]">{item.when}</p>
                  <p className="jp-wrap mt-2 font-serif text-xl leading-snug text-white">{item.title}</p>
                  <p className="jp-wrap mt-2 max-w-xl text-[15px] leading-7 text-[#c3d1de]">{item.body}</p>
                </li>
              ))}
            </ol>
            {/* デスクトップの右半分を占める装飾（測定リング＋航路線）。情報を持たないため aria-hidden。 */}
            <div aria-hidden="true" className="relative hidden min-h-[26rem] lg:block">
              <div className="absolute right-4 top-6 h-72 w-72 rounded-full border border-[#e4c679]/25" />
              <div className="absolute right-24 top-28 h-44 w-44 rounded-full border border-[#e4c679]/30" />
              <div className="absolute right-40 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full border border-white/10" />
              <div className="absolute right-10 top-1/2 h-px w-56 -translate-y-1/2 bg-gradient-to-r from-transparent via-[#e4c679]/50 to-transparent" />
              <div className="optical-route" />
            </div>
          </div>
        </div>
      </section>

      {/* これから（関心領域） */}
      <section className="section-shell editorial-section py-20 lg:py-28">
        <p className="eyebrow">05 / WHAT'S NEXT</p>
        <h2 className="display-heading mt-5">これから。</h2>
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-line bg-cream-card p-7 shadow-[var(--shadow-soft)]">
            <p className="font-serif text-xl text-[#123650]">フィジカルAI</p>
            <p className="mt-4 text-[15px] leading-7 text-[#5f7284]">
              画面の中だけで完結せず、現実のものや人の動きを感じ取って働くAI（フィジカルAI）に関心があります。
              センサーで測り、制御で動かすという材料試験機の仕事は、この分野とまっすぐつながっています。
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-cream-card p-7 shadow-[var(--shadow-soft)]">
            <p className="font-serif text-xl text-[#123650]">公募への挑戦</p>
            <p className="mt-4 text-[15px] leading-7 text-[#5f7284]">
              未踏事業などの公募への応募も検討しています。個人でものづくりに挑戦する機会を、これからも探していきます。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
