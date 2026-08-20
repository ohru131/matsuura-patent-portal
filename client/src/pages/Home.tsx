/**
 * Style reminder — 光学の航路:
 * 日本の科学誌エディトリアルと情報地図。深い藍・生成り・航路朱で、資料の信頼性と発見の連なりを見せる。
 * 中央寄せの均一グリッドを避け、索引から特許の航路へ読み進める非対称レイアウトにする。
 */
import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  BookOpen,
  ChevronRight,
  Compass,
  ExternalLink,
  Landmark,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import {
  patentCategories,
  patentLink,
  patents,
  type PatentCategory,
} from "@/data/patents";

const heroImage = "/manus-storage/matsuura-hero-patent-atlas_163d44b2.jpg";
const globalImage = "/manus-storage/matsuura-global-threads_d0121101.jpg";
const detailImage = "/manus-storage/matsuura-illumination-detail_3c10cdac.jpg";
const markImage = "/manus-storage/matsuura-mark_782339e2.png";

const featuredIds = [
  "JP2019132766A",
  "JP2019053009A",
  "JP2019132768A",
  "JP2023043191A",
];

function RegionPills({ regions }: { regions: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5" aria-label={`公開地域: ${regions.join("、")}`}>
      {regions.map((region) => (
        <span
          className={`font-mono text-[10px] font-medium tracking-[0.12em] ${
            region === "JP" ? "text-[#a93629]" : "text-[#36526b]"
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
  const [activeCategory, setActiveCategory] = useState<PatentCategory | "all">("all");
  const [query, setQuery] = useState("");

  const filteredPatents = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("ja-JP");
    return patents.filter((patent) => {
      const inCategory = activeCategory === "all" || patent.category === activeCategory;
      const searchable = `${patent.id} ${patent.title} ${patent.overview} ${patent.category}`.toLocaleLowerCase("ja-JP");
      return inCategory && (!needle || searchable.includes(needle));
    });
  }, [activeCategory, query]);

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
  const featuredPatents = featuredIds
    .map((id) => patents.find((patent) => patent.id === id))
    .filter((patent): patent is (typeof patents)[number] => Boolean(patent));

  const moveToCatalog = () => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f5f0e7] text-[#102c45]">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#071e38]/95 text-white backdrop-blur-md">
        <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <a className="group flex items-center gap-3" href="#top" aria-label="松浦融 特許ポータルの先頭へ">
            <span className="brand-mark"><img alt="松浦融 特許ポータルのシンボル" className="h-12 w-12 object-contain" src={markImage} /></span>
            <div className="leading-none">
              <p className="font-serif text-[15px] tracking-[0.16em]">松浦 融</p>
              <p className="mt-1 font-mono text-[9px] tracking-[0.2em] text-[#aebdcb]">PATENT ARCHIVE</p>
            </div>
          </a>
          <nav className="hidden items-center gap-7 text-sm text-[#d9e1e8] md:flex" aria-label="主なページ内ナビゲーション">
            <a className="nav-link" href="#map">分類からたどる</a>
            <a className="nav-link" href="#catalog">特許カタログ</a>
            <a className="nav-link" href="#method">調査について</a>
          </nav>
          <button className="header-action" onClick={moveToCatalog} type="button">
            特許を探す <ArrowDownRight size={15} strokeWidth={1.8} />
          </button>
        </div>
      </header>

      <main id="top">
        <section className="relative isolate min-h-[720px] overflow-hidden bg-[#071e38] pt-[68px] text-white">
          <img
            alt="分析技術と特許の航路を表す抽象イメージ"
            className="absolute inset-0 h-full w-full object-cover object-[68%_center] opacity-90"
            src={heroImage}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#071e38_0%,#071e38_33%,rgba(7,30,56,0.9)_49%,rgba(7,30,56,0.22)_80%,rgba(7,30,56,0.55)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#071e38] to-transparent" />
          <div className="relative mx-auto flex min-h-[652px] max-w-[1440px] items-end px-5 pb-20 pt-20 sm:px-8 lg:px-12 lg:pb-24">
            <div className="max-w-3xl">
              <div className="mb-8 flex items-center gap-3 text-xs font-medium tracking-[0.18em] text-[#e5c98a]">
                <span className="h-px w-10 bg-[#d9ad53]" />
                SHIMADZU CORPORATION · INVENTION ARCHIVE
              </div>
              <p className="mb-4 font-mono text-[11px] tracking-[0.16em] text-[#b2c4d5]">TORU MATSUURA / 松浦融</p>
              <h1 className="max-w-[13ch] font-serif text-5xl leading-[1.16] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                材料試験を
                <br />
                支える技術。
              </h1>
              <p className="mt-8 max-w-xl text-[15px] leading-8 text-[#d5dfe7] sm:text-base">
                材料の強さ、振動、測定結果の評価に関わる発明を、
                技術分野と公開公報の原典からたどるための記録です。
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <button className="primary-action" onClick={moveToCatalog} type="button">
                  <Search size={17} /> 公開公報をたどる
                </button>
                <a className="secondary-action" href="#map">
                  分類からたどる <ChevronRight size={17} />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 -mt-10 mx-4 border border-[#decfae] bg-[#f7f3eb] shadow-[0_16px_45px_rgba(20,37,50,0.13)] sm:mx-8 lg:mx-12">
          <div className="grid divide-y divide-[#dfd5c5] md:grid-cols-3 md:divide-x md:divide-y-0">
            <div className="stat-block">
              <p className="stat-number">{patents.length}</p>
              <p className="stat-label">Google Patentsで確認した<br />公開公報の起点</p>
            </div>
            <div className="stat-block">
              <p className="stat-number">2003—2024</p>
              <p className="stat-label">優先日で見る<br />公開情報の対象期間</p>
            </div>
            <div className="stat-block">
              <p className="stat-number">JP · US · EP · CN</p>
              <p className="stat-label">原典上で確認できる<br />国内外への公開展開</p>
            </div>
          </div>
        </section>

        <section className="section-shell editorial-section pt-28 lg:pt-36" id="map">
          <div className="grid gap-14 lg:grid-cols-[0.88fr_1.3fr] lg:gap-20">
            <div>
              <p className="eyebrow">01 / INVENTION MAP</p>
              <h2 className="display-heading mt-5">技術分野から見る。</h2>
              <p className="body-copy mt-7">
                本サイトでは、公開公報の内容を材料試験における役割に沿って四つの分野へ整理しています。
                気になる分野を選ぶと、該当する特許一覧を確認できます。
              </p>
              <a className="text-link mt-8 inline-flex" href="#catalog">
                特許一覧を見る <ArrowUpRight size={16} />
              </a>
            </div>
            <div className="invention-map-grid relative grid gap-px overflow-hidden border border-[#d7cab8] bg-[#d7cab8] sm:grid-cols-2">
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
                  <p className="mt-3 max-w-[25ch] text-sm leading-7 text-[#597083]">{category.description}</p>
                  <div className="mt-7 flex items-end justify-between">
                    <span className="font-mono text-xs tracking-[0.1em] text-[#8b6c3d]">{categoryCounts[category.id]} RECORDS</span>
                    <ArrowUpRight className="text-[#a93629] transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1" size={18} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="section-shell editorial-section py-28 lg:py-36">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">02 / FOUR MILESTONES</p>
              <h2 className="display-heading mt-5">主な公開公報。</h2>
            </div>
            <p className="max-w-sm text-sm leading-7 text-[#62778a]">材料試験、計測、機器管理に関する代表的な公開公報です。各カードから原典を確認できます。</p>
          </div>
          <div className="milestone-grid grid gap-px overflow-hidden border-y border-[#d8cbb9] bg-[#d8cbb9] lg:grid-cols-4">
            {featuredPatents.map((patent, index) => (
              <article className="featured-card" key={patent.id}>
                <div className="flex items-start justify-between">
                  <span className="font-mono text-xs tracking-[0.16em] text-[#b13f31]">0{index + 1}</span>
                  <RegionPills regions={patent.regions} />
                </div>
                <p className="mt-12 font-mono text-[10px] tracking-[0.14em] text-[#677f93]">{patent.id}</p>
                <h3 className="mt-3 font-serif text-2xl leading-snug text-[#102c45]">{patent.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[#5f7284]">{patent.overview}</p>
                <a className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-[#a93629]" href={patentLink(patent.id)} rel="noreferrer" target="_blank">
                  公開公報を開く <ExternalLink size={14} />
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="route-map-section relative overflow-hidden bg-[#e8dfcf] py-20 lg:py-24">
          <img alt="世界の特許公開の広がりを表す地図のイメージ" className="absolute inset-y-0 right-0 hidden h-full w-1/2 object-cover opacity-75 lg:block" src={globalImage} />
          <div className="absolute inset-y-0 right-0 hidden w-2/3 bg-gradient-to-r from-[#e8dfcf] via-[#e8dfcf]/80 to-transparent lg:block" />
          <div className="section-shell relative">
            <div className="max-w-2xl">
              <p className="eyebrow text-[#915246]">03 / INTERNATIONAL PATHS</p>
              <h2 className="display-heading mt-5">国内外の公開情報。</h2>
              <p className="body-copy mt-7">Google Patentsの検索結果では、日本の公開番号に加え、US・EP・CNなどの同族公開が表示されるものがあります。ここでは公開情報の範囲として示しており、権利の有効性を示すものではありません。</p>
            <div className="mt-9 flex flex-wrap gap-x-8 gap-y-4 border-y border-[#c9b79f] py-5">
                <div className="route-region"><span aria-hidden="true" className="route-dot is-red" /><div><p className="font-mono text-2xl text-[#123650]">{internationalCount}</p><p className="mt-1 text-xs text-[#5f7284]">複数地域表示のファミリー</p></div></div>
                {["JP", "US", "EP", "CN"].map((region) => (
                  <div className="route-region" key={region}><span aria-hidden="true" className="route-dot" /><div><p className="font-mono text-2xl text-[#123650]">{patents.filter((patent) => patent.regions.includes(region)).length}</p><p className="mt-1 text-xs text-[#5f7284]">{region} 表示の起点</p></div></div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell editorial-section py-28 lg:py-36" id="catalog">
          <div className="mb-12 grid gap-8 border-b border-[#d8cbbb] pb-9 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
            <div>
              <p className="eyebrow">04 / PATENT CATALOG</p>
              <h2 className="display-heading mt-5">特許一覧。</h2>
            </div>
            <p className="body-copy max-w-2xl">題名、公開番号、または技術分野から検索できます。解説は公開公報の内容を短く整理したものです。詳しい内容や各国の法的状態は、Google Patentsの原典でご確認ください。</p>
          </div>

          <div className="grid items-start gap-10 lg:grid-cols-[264px_minmax(0,1fr)] lg:gap-14">
            <aside className="lg:sticky lg:top-24">
              <div className="border-y border-[#cabba8] py-5">
                <div className="flex items-center gap-2 text-xs font-medium tracking-[0.12em] text-[#6b5a43]"><SlidersHorizontal size={14} /> FILTER THE ATLAS</div>
                <div className="mt-5 space-y-1">
                  <button className={`filter-button ${activeCategory === "all" ? "is-active" : ""}`} onClick={() => setActiveCategory("all")} type="button">
                    <span>すべての特許</span><span>{patents.length}</span>
                  </button>
                  {patentCategories.map((category) => (
                    <button className={`filter-button ${activeCategory === category.id ? "is-active" : ""}`} key={category.id} onClick={() => setActiveCategory(category.id)} type="button">
                      <span>{category.label}</span><span>{categoryCounts[category.id]}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-8 border-l-2 border-[#b84233] pl-4 text-sm leading-7 text-[#687c8e]">
                <p className="font-serif text-lg text-[#173650]">公開番号から、原典を確認できます。</p>
                <p className="mt-2">一覧の各カードからGoogle Patentsの公開公報を開けます。</p>
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
                  placeholder="公開番号、題名、目的で検索"
                  value={query}
                />
                {query && <button aria-label="検索をクリア" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[#7890a0] hover:text-[#a93629]" onClick={() => setQuery("")} type="button"><X size={16} /></button>}
              </label>
              <div className="mt-5 flex items-center justify-between text-xs text-[#6a7e8f]">
                <p><span className="font-mono text-[#a93629]">{String(filteredPatents.length).padStart(2, "0")}</span> 件を表示</p>
                {activeCategory !== "all" && <button className="text-link" onClick={() => setActiveCategory("all")} type="button">分類を解除</button>}
              </div>
              <div className="mt-5 divide-y divide-[#dbd1c3] border-y border-[#dbd1c3]">
                {filteredPatents.map((patent, index) => (
                  <article className="patent-row" key={patent.id}>
                    <div className="route-index hidden pt-1 font-mono text-xs tracking-[0.12em] text-[#9a7b50] sm:block"><span className="route-node" />{String(index + 1).padStart(2, "0")}<small>{patent.priority.slice(0, 4)}</small></div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="font-mono text-[11px] tracking-[0.09em] text-[#4f6d84]">{patent.id}</span>
                        <span className="h-3 w-px bg-[#d1c5b6]" />
                        <span className="text-xs text-[#7a8d9b]">優先 {patent.priority}</span>
                        <RegionPills regions={patent.regions} />
                      </div>
                      <h3 className="mt-2 font-serif text-xl leading-snug text-[#123650] sm:text-2xl">{patent.title}</h3>
                      <p className="mt-2 max-w-3xl text-sm leading-7 text-[#63798a]">{patent.overview}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
                      <span className="inline-flex bg-[#e9e0d2] px-2.5 py-1 text-[10px] font-medium tracking-[0.08em] text-[#4e6577]">{patent.category}</span>
                      <a aria-label={`${patent.id} をGoogle Patentsで開く`} className="source-link" href={patentLink(patent.id)} rel="noreferrer" target="_blank">
                        <span className="hidden sm:inline">原典を開く</span><ExternalLink size={15} />
                      </a>
                    </div>
                  </article>
                ))}
                {filteredPatents.length === 0 && (
                  <div className="py-20 text-center">
                    <Compass className="mx-auto text-[#ba9c65]" size={30} strokeWidth={1.2} />
                    <p className="mt-4 font-serif text-xl text-[#1d405b]">該当する特許が見つかりません。</p>
                    <button className="text-link mt-3" onClick={() => { setQuery(""); setActiveCategory("all"); }} type="button">検索条件をリセット</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="detail-route-section relative overflow-hidden bg-[#0a2741] py-20 text-white lg:py-24">
          <img alt="材料の分析と光の計測を表す抽象イメージ" className="absolute inset-y-0 right-0 h-full w-full object-cover object-right opacity-35 lg:w-1/2" src={detailImage} />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#0a2741_0%,#0a2741_42%,rgba(10,39,65,0.88)_58%,rgba(10,39,65,0.35)_100%)]" />
          <div aria-hidden="true" className="optical-route" />
          <div className="section-shell relative">
            <div className="max-w-2xl">
              <p className="eyebrow text-[#e8cb83]">05 / THE UNDERLYING IDEA</p>
              <h2 className="mt-5 font-serif text-4xl leading-tight tracking-[-0.03em] sm:text-5xl">材料試験の精度と、
                <br />日々の運用を支える。</h2>
              <p className="mt-7 max-w-xl text-[15px] leading-8 text-[#d4dfe8]">振動の制御、測定値の処理、試験機の状態管理。公開公報を横断して見ると、材料試験を安定して行うための技術が積み重ねられていることがわかります。</p>
              <a className="mt-8 inline-flex items-center gap-2 border-b border-[#e2bf6a] pb-2 text-sm font-medium text-[#f0d992] transition-colors hover:text-white" href="#catalog">公開公報をたどる <ArrowUpRight size={16} /></a>
            </div>
          </div>
        </section>

        <section className="section-shell editorial-section py-24 lg:py-28" id="method">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="eyebrow">06 / RESEARCH NOTE</p>
              <h2 className="display-heading mt-5">調査方法と
                <br />ご利用にあたって。</h2>
            </div>
            <div className="border-t border-[#d5c7b5]">
              <div className="research-line"><BookOpen size={18} /><p>Google Patentsで、発明者を <span className="font-mono text-[12px]">Toru Matsuura</span>、出願人を <span className="font-mono text-[12px]">Shimadzu</span> として検索し、表示された53件を起点に編集しています。</p></div>
              <div className="research-line"><Landmark size={18} /><p>一覧は日本公開番号を基準に整理しています。US・EP・CNなどは、Google Patentsの同じ結果カードに表示される国・地域情報です。</p></div>
              <div className="research-line"><Sparkles size={18} /><p>分類と要約は、公開公報を読みやすく整理したものです。権利の有効性、各国手続、最新の法的状態は原典でご確認ください。</p></div>
              <a className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-[#a93629]" href="https://patents.google.com/?inventor=Matsuura+Toru&assignee=Shimadzu&num=100" rel="noreferrer" target="_blank">検索結果の原典一覧を開く <ExternalLink size={15} /></a>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#071e38] text-[#becbd5]">
        <div className="section-shell flex flex-col gap-8 py-10 md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-3"><span className="brand-mark brand-mark-footer"><img alt="" className="h-12 w-12 object-contain" src={markImage} /></span><div><p className="font-serif text-lg text-white">松浦融 特許ポータル</p><p className="mt-1 font-mono text-[10px] tracking-[0.16em]">INVENTION ARCHIVE / 2003—2024</p></div></div>
          <p className="max-w-xl text-xs leading-6 text-[#91a7b8]">本サイトは公開特許情報をもとにした案内サイトです。公開番号・国際展開・法的状態等は、リンク先のGoogle Patentsおよび公的データベースでご確認ください。</p>
        </div>
      </footer>
    </div>
  );
}
