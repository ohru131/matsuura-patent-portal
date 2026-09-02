/**
 * Style reminder — 光学の航路:
 * Home.tsx から特許カタログを移設した実績ページ。世界観（生成り地・航路の朱・罫線）は維持しつつ、
 * ヒーローは写真を使わず藍地＋SVG/CSSグラフィックで構成する（画像アセットは実在しないため）。
 */
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  Compass,
  ExternalLink,
  Gauge,
  Landmark,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Waves,
  X,
} from "lucide-react";
import {
  patentCategories,
  patentLink,
  patents,
  type PatentCategory,
} from "@/data/patents";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSiteNav } from "@/components/layout/useSiteNav";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

const readingGuides = [
  {
    icon: Waves,
    label: "振動・疲労試験",
    body: "材料に何度も力をかけ、実際の使われ方に近い条件で強さを確かめる技術。",
    question: "この部品は長く使っても壊れにくいか。",
  },
  {
    icon: Gauge,
    label: "計測・データ信頼性",
    body: "本当に材料の変化なのか、装置の揺れやノイズなのかを見分ける技術。",
    question: "この数値をどこまで信頼できるか。",
  },
  {
    icon: SlidersHorizontal,
    label: "制御・最適化",
    body: "試験機をねらった速度・力・動きで動かし、無駄を減らす技術。",
    question: "欲しい条件を正確に、効率よく再現できるか。",
  },
  {
    icon: ShieldCheck,
    label: "接続・運用・安全",
    body: "機器の状態確認、複数機の管理、作業者の安全を支える技術。",
    question: "現場で安全に、迷わず使えるか。",
  },
];

function RegionPills({ regions }: { regions: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5" aria-label={`公開地域: ${regions.join("、")}`}>
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

export default function Patents() {
  useDocumentMeta({
    title: "特許実績｜松浦 融 ポートフォリオ",
    description:
      "株式会社島津製作所在籍中に発明者として関わった、材料試験機の計測・制御・遠隔管理に関する公開特許53件を、技術分野ごとに分類して掲載しています。",
  });

  const { navigateTo } = useSiteNav();

  const [activeCategory, setActiveCategory] = useState<PatentCategory | "all">("all");
  const [activeYear, setActiveYear] = useState("all");
  const [query, setQuery] = useState("");

  const categoryIndexes = useMemo(
    () => new Map(patentCategories.map((category, index) => [category.id, index + 1])),
    [],
  );

  const availableYears = useMemo(
    () => Array.from(new Set(patents.map((patent) => patent.priority.slice(0, 4)))).sort((a, b) => b.localeCompare(a)),
    [],
  );

  const yearCounts = useMemo(
    () =>
      availableYears.reduce(
        (counts, year) => ({
          ...counts,
          [year]: patents.filter((patent) => patent.priority.startsWith(year)).length,
        }),
        {} as Record<string, number>,
      ),
    [availableYears],
  );

  const filteredPatents = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("ja-JP");
    return patents
      .filter((patent) => {
        const inCategory = activeCategory === "all" || patent.category === activeCategory;
        const inYear = activeYear === "all" || patent.priority.startsWith(activeYear);
        const searchable = [
          patent.id,
          patent.title,
          patent.originalTitle,
          patent.overview,
          patent.technicalChallenge,
          patent.priorArt,
          patent.solution,
          patent.claimSummary,
          patent.keywords.join(" "),
          patent.category,
        ]
          .join(" ")
          .toLocaleLowerCase("ja-JP");
        return inCategory && inYear && (!needle || searchable.includes(needle));
      })
      .sort((a, b) => b.priority.localeCompare(a.priority) || b.id.localeCompare(a.id));
  }, [activeCategory, activeYear, query]);

  const categoryCounts = useMemo(
    () =>
      patentCategories.reduce(
        (counts, category) => ({
          ...counts,
          [category.id]: patents.filter((patent) => patent.category === category.id).length,
        }),
        {} as Record<PatentCategory, number>,
      ),
    [],
  );

  const internationalCount = patents.filter((patent) => patent.regions.length > 1).length;

  const moveToCatalog = () => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
  const resetFilters = () => {
    setActiveCategory("all");
    setActiveYear("all");
    setQuery("");
  };

  return (
    <div>
      {/* ヒーロー: ヘッダー(76px)分は pt-[76px] で吸収する（Layout.tsx の申し送り方式） */}
      <section className="relative isolate overflow-hidden bg-[#071e38] pt-[76px] text-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -right-24 top-10 h-[26rem] w-[26rem] rounded-full border border-[#e7cd88]/20" />
          <div className="absolute -right-6 top-32 h-64 w-64 rounded-full border border-[#e7cd88]/25" />
          <div className="absolute right-40 top-1/2 h-px w-64 -translate-y-1/2 bg-gradient-to-r from-transparent via-[#e7cd88]/50 to-transparent" />
        </div>
        <div className="section-shell relative py-20 lg:py-28">
          <div className="max-w-3xl">
            <p className="mb-4 font-mono text-[11px] tracking-[0.16em] text-[#b2c4d5]">
              PATENT RECORD / 松浦融
            </p>
            <h1 className="font-serif text-4xl leading-[1.2] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
              公開特許 53件。
            </h1>
            <p className="jp-wrap mt-7 max-w-2xl text-base leading-8 text-[#d5dfe7] sm:text-lg">
              株式会社島津製作所に在籍中、材料試験機の計測・制御・遠隔管理に関する開発に携わりました。
              その成果は公開公報として残っており、技術の役割ごとに10分類して掲載しています。
              特許を受ける権利の帰属先は出願人である企業です。
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-10 mx-4 rounded-2xl border border-[#decfae] bg-[#f7f3eb] shadow-[var(--shadow-soft-lg)] sm:mx-8 lg:mx-12">
        <div className="grid grid-cols-1 divide-y divide-[#dfd5c5] md:grid-cols-3 md:divide-x md:divide-y-0">
          <div className="stat-block">
            <p className="stat-number">{patents.length}</p>
            <p className="stat-label">
              Google Patentsで確認した
              <br />
              公開公報の起点
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
      </section>

      {/* 一般向けの入口: 専門的な10分類の前に、やさしい4つの読み方を置く */}
      <section className="section-shell py-20 lg:py-24">
        <p className="eyebrow">はじめに / HOW TO READ</p>
        <h2 className="display-heading mt-5 max-w-2xl">四つの読み方。</h2>
        <p className="body-copy mt-6 max-w-2xl">
          専門的な分類の前に、やさしい入口として4つの視点をご紹介します。気になる視点から読み進めてください。
        </p>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {readingGuides.map((guide) => (
            <div
              className="rounded-2xl border border-[#d8cbb9] bg-[#faf7f0] p-6 shadow-[var(--shadow-soft)]"
              key={guide.label}
            >
              <guide.icon aria-hidden="true" className="text-vermillion-strong" size={26} strokeWidth={1.6} />
              <p className="mt-5 font-serif text-lg text-[#123650]">{guide.label}</p>
              <p className="mt-3 text-[15px] leading-7 text-[#5f7284]">{guide.body}</p>
              <p className="mt-4 border-t border-[#e2d6c3] pt-3 text-sm leading-6 text-[#7d6b4c]">
                問い：{guide.question}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell editorial-section py-20 lg:py-28" id="map">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.88fr_1.3fr] lg:gap-20">
          <div>
            <p className="eyebrow">01 / INVENTION MAP</p>
            <h2 className="display-heading mt-5">技術分野から見る。</h2>
            <p className="body-copy mt-7">
              公開公報の内容を、材料試験における役割に沿って10の分野へ整理しています。
              気になる分野を選ぶと、下の一覧から該当する特許を確認できます。
            </p>
            <a className="text-link mt-8 inline-flex" href="#catalog" onClick={(event) => { event.preventDefault(); moveToCatalog(); }}>
              特許一覧を見る <ArrowUpRight size={16} />
            </a>
          </div>
          <div className="invention-map-grid relative grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[#d7cab8] bg-[#d7cab8] sm:grid-cols-2">
            {patentCategories.map((category, index) => (
              <button
                className="group relative min-h-60 bg-[#fbf8f2] p-7 text-left transition-colors hover:bg-[#f0e9dd]"
                key={category.id}
                onClick={() => {
                  setActiveCategory(category.id);
                  moveToCatalog();
                }}
                type="button"
              >
                <span aria-hidden="true" className="measurement-ring" />
                <span className="font-mono text-[11px] tracking-[0.16em] text-[#aa372a]">0{index + 1}</span>
                <p className="mt-9 font-serif text-2xl text-[#123650]">{category.label}</p>
                <p className="mt-3 max-w-[28ch] text-[15px] leading-7 text-[#597083]">{category.description}</p>
                <div className="mt-7 flex items-end justify-between">
                  <span className="font-mono text-xs tracking-[0.1em] text-[#8b6c3d]">{categoryCounts[category.id]}件</span>
                  <ArrowUpRight className="text-vermillion-strong transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1" size={18} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-2xl bg-[#e8dfcf] py-20 sm:mx-8 lg:mx-12 lg:py-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 lg:block">
          <div className="absolute right-10 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full border border-[#aa372a]/20" />
          <div className="absolute right-32 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full border border-[#aa372a]/25" />
        </div>
        <div className="section-shell relative">
          <div className="max-w-2xl">
            <p className="eyebrow text-[#915246]">02 / INTERNATIONAL PATHS</p>
            <h2 className="display-heading mt-5">国内外の公開情報。</h2>
            <p className="body-copy mt-7">
              Google Patentsの検索結果では、日本の公開番号に加えて、US・EP・CNなどの「同族」（同じ発明を他の国にも出願したもの）が表示されるものがあります。
              ここでは公開情報の範囲として示しており、権利の有効性を示すものではありません。
            </p>
            <div className="mt-9 flex flex-wrap gap-x-8 gap-y-4 border-y border-[#c9b79f] py-5">
              <div className="route-region">
                <span aria-hidden="true" className="route-dot is-red" />
                <div>
                  <p className="font-mono text-2xl text-[#123650]">{internationalCount}</p>
                  <p className="mt-1 text-sm text-[#5f7284]">複数地域表示のファミリー</p>
                </div>
              </div>
              {["JP", "US", "EP", "CN"].map((region) => (
                <div className="route-region" key={region}>
                  <span aria-hidden="true" className="route-dot" />
                  <div>
                    <p className="font-mono text-2xl text-[#123650]">
                      {patents.filter((patent) => patent.regions.includes(region)).length}
                    </p>
                    <p className="mt-1 text-sm text-[#5f7284]">{region} 表示の起点</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell editorial-section py-20 lg:py-28" id="catalog">
        <div className="mb-12 grid grid-cols-1 gap-8 border-b border-[#d8cbbb] pb-9 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
          <div>
            <p className="eyebrow">03 / PATENT CATALOG</p>
            <h2 className="display-heading mt-5">特許一覧。</h2>
          </div>
          <p className="body-copy max-w-2xl">
            表示題名、原題、公開番号、技術カテゴリー、4項目の要約、技術用語から検索できます。
            解説は公開公報の記載を整理したものであり、詳しい内容や各国の法的状態はGoogle Patentsの原典でご確認ください。
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[272px_minmax(0,1fr)] lg:gap-14">
          <aside className="lg:sticky lg:top-24">
            <div className="rounded-2xl border border-[#cabba8] bg-[#faf7f0] p-5 shadow-[var(--shadow-soft)]">
              <div className="flex items-center gap-2 text-xs font-medium tracking-[0.12em] text-[#6b5a43]">
                <SlidersHorizontal size={14} /> 絞り込み
              </div>
              <div className="mt-5 space-y-1">
                <p className="filter-heading">技術カテゴリー</p>
                <button
                  className={`filter-button ${activeCategory === "all" ? "is-active" : ""}`}
                  onClick={() => setActiveCategory("all")}
                  type="button"
                >
                  <span>すべての特許</span>
                  <span>{patents.length}</span>
                </button>
                {patentCategories.map((category) => (
                  <button
                    className={`filter-button ${activeCategory === category.id ? "is-active" : ""}`}
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    type="button"
                  >
                    <span>{category.label}</span>
                    <span>{categoryCounts[category.id]}</span>
                  </button>
                ))}
              </div>
              <div className="mt-6 border-t border-[#d9cdbd] pt-5">
                <p className="filter-heading">出願年（優先日）</p>
                <Select onValueChange={setActiveYear} value={activeYear}>
                  <SelectTrigger aria-label="出願年で絞り込む" className="year-select">
                    <SelectValue placeholder="すべての年" />
                  </SelectTrigger>
                  <SelectContent className="border-[#c8b89e] bg-[#faf7f0] text-[#153951]">
                    <SelectItem value="all">すべての年（{patents.length}件）</SelectItem>
                    {availableYears.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}年（{yearCounts[year]}件）
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="mt-3 text-sm leading-6 text-[#718392]">
                  優先日（その発明を最初に出願した日）の新しい順に表示します。
                </p>
              </div>
            </div>
            <div className="mt-8 rounded-2xl border-l-2 border-vermillion bg-[#faf7f0]/60 p-4 text-[15px] leading-7 text-[#687c8e]">
              <p className="font-serif text-lg text-[#173650]">公開番号から、原典を確認できます。</p>
              <p className="mt-2">一覧の各カードからGoogle Patentsの公開公報（特許庁が内容を公開した文書）を開けます。</p>
            </div>
          </aside>

          <div className="catalog-route relative">
            <div aria-hidden="true" className="route-rail" />
            <label className="relative block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7890a0]" size={18} />
              <input
                aria-label="特許を検索"
                className="catalog-search"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="公開番号、表示題名、原題、技術用語で検索"
                value={query}
              />
              {query && (
                <button
                  aria-label="検索をクリア"
                  className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center text-[#7890a0] hover:text-vermillion-strong"
                  onClick={() => setQuery("")}
                  type="button"
                >
                  <X size={16} />
                </button>
              )}
            </label>
            <div className="mt-5 flex items-center justify-between text-sm text-[#6a7e8f]">
              <p>
                <span className="font-mono text-vermillion-strong">{String(filteredPatents.length).padStart(2, "0")}</span> 件を表示
              </p>
              {(activeCategory !== "all" || activeYear !== "all" || query) && (
                <button className="text-link" onClick={resetFilters} type="button">
                  条件をリセット
                </button>
              )}
            </div>
            <div className="mt-5 divide-y divide-[#dbd1c3] border-y border-[#dbd1c3]">
              {filteredPatents.map((patent, index) => (
                <article className="patent-row" key={patent.id}>
                  <div className="route-index hidden pt-1 font-mono text-xs tracking-[0.12em] text-[#9a7b50] sm:block">
                    <span className="route-node" />
                    C{String(categoryIndexes.get(patent.category) ?? index + 1).padStart(2, "0")}
                    <small>
                      {patent.priority.slice(0, 4)}
                      <br />
                      {patent.regions.join(" · ")}
                    </small>
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="font-mono text-[11px] tracking-[0.09em] text-[#4f6d84]">{patent.id}</span>
                      <span className="h-3 w-px bg-[#d1c5b6]" />
                      <span className="text-xs text-[#7a8d9b]">優先日 {patent.priority}</span>
                      <RegionPills regions={patent.regions} />
                    </div>
                    <h3 className="mt-2 font-serif text-xl leading-snug text-[#123650] sm:text-2xl">{patent.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-[#7a8d9b]">原題：{patent.originalTitle}</p>
                    <p className="mt-3 max-w-3xl text-base leading-7 text-[#63798a]">{patent.overview}</p>
                    <Accordion className="patent-summary-accordion max-w-3xl" collapsible type="single">
                      <AccordionItem value={`summary-${patent.id}`}>
                        <AccordionTrigger className="patent-summary-trigger">
                          技術課題・従来技術・解決手段・請求項を見る
                        </AccordionTrigger>
                        <AccordionContent className="patent-summary-content">
                          <dl>
                            <div>
                              <dt>技術課題</dt>
                              <dd>{patent.technicalChallenge}</dd>
                            </div>
                            <div>
                              <dt>従来技術</dt>
                              <dd>{patent.priorArt}</dd>
                            </div>
                            <div>
                              <dt>解決手段</dt>
                              <dd>{patent.solution}</dd>
                            </div>
                            <div>
                              <dt>請求項（要旨）</dt>
                              <dd>{patent.claimSummary}</dd>
                            </div>
                          </dl>
                          <p className="patent-keywords">
                            <span>検索語</span>
                            {patent.keywords.join(" ／ ")}
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                  <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
                    <span className="inline-flex rounded-full bg-[#e9e0d2] px-2.5 py-1 text-[10px] font-medium tracking-[0.08em] text-[#4e6577]">
                      {patent.category}
                    </span>
                    <a
                      aria-label={`${patent.id} をGoogle Patentsで開く`}
                      className="source-link"
                      href={patentLink(patent.id)}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <span className="hidden sm:inline">Google Patentsで見る</span>
                      <ExternalLink size={15} />
                    </a>
                  </div>
                </article>
              ))}
              {filteredPatents.length === 0 && (
                <div className="py-20 text-center">
                  <Compass className="mx-auto text-[#ba9c65]" size={30} strokeWidth={1.2} />
                  <p className="mt-4 font-serif text-xl text-[#1d405b]">該当する特許が見つかりません。</p>
                  <button className="text-link mt-3" onClick={resetFilters} type="button">
                    検索条件をリセット
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell editorial-section py-20 lg:py-24" id="method">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="eyebrow">04 / RESEARCH NOTE</p>
            <h2 className="display-heading mt-5">
              調査方法と
              <br />
              ご利用にあたって。
            </h2>
          </div>
          <div className="border-t border-[#d5c7b5]">
            <div className="research-line">
              <BookOpen size={18} />
              <p>
                Google Patentsで、発明者を <span className="font-mono text-[13px]">Toru Matsuura</span>、出願人を{" "}
                <span className="font-mono text-[13px]">Shimadzu</span> として検索し、表示された53件を起点に編集しています。
              </p>
            </div>
            <div className="research-line">
              <Landmark size={18} />
              <p>
                一覧は日本公開番号（特許庁が発行する公開公報の番号）を基準に整理しています。
                US・EP・CNなどは、Google Patentsの同じ結果カードに表示される国・地域情報です。
              </p>
            </div>
            <div className="research-line">
              <Sparkles size={18} />
              <p>分類と要約は、公開公報を読みやすく整理したものです。権利の有効性、各国手続、最新の法的状態は原典でご確認ください。</p>
            </div>
            <a
              className="mt-7 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-vermillion-strong"
              href="https://patents.google.com/?inventor=Matsuura+Toru&assignee=Shimadzu&num=100"
              rel="noreferrer"
              target="_blank"
            >
              Google Patentsの検索結果を見る <ExternalLink size={15} />
            </a>
          </div>
        </div>
      </section>

      <section className="section-shell pb-24 pt-4 lg:pb-28">
        <a
          className="text-link"
          href="/"
          onClick={(event) => {
            event.preventDefault();
            navigateTo("/");
          }}
        >
          トップへ戻る
        </a>
      </section>
    </div>
  );
}
