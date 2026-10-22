/**
 * サイト唯一のコンテンツページ（公開特許一覧）。
 * 構成: 概要 → 一覧（絞り込み・検索） → 掲載範囲。装飾より検索と読みやすさを優先する。
 */
import { useMemo, useState } from "react";
import { ExternalLink, Search, X } from "lucide-react";
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
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

const priorityYears = patents.map(patent =>
  Number(patent.priority.slice(0, 4))
);
const firstYear = Math.min(...priorityYears);
const lastYear = Math.max(...priorityYears);
const foreignFilingCount = patents.filter(
  patent => patent.regions.length > 1
).length;

export default function Patents() {
  useDocumentMeta({
    title: "公開特許一覧｜松浦 融",
    description: `松浦 融が発明者として記載された公開特許${patents.length}件の一覧。材料試験機の制御・信号処理・機器管理などの分野別に検索できます。`,
  });

  const [activeCategory, setActiveCategory] = useState<PatentCategory | "all">(
    "all"
  );
  const [activeYear, setActiveYear] = useState("all");
  const [query, setQuery] = useState("");

  const availableYears = useMemo(
    () =>
      Array.from(
        new Set(patents.map(patent => patent.priority.slice(0, 4)))
      ).sort((a, b) => b.localeCompare(a)),
    []
  );

  const yearCounts = useMemo(
    () =>
      availableYears.reduce(
        (counts, year) => ({
          ...counts,
          [year]: patents.filter(patent => patent.priority.startsWith(year))
            .length,
        }),
        {} as Record<string, number>
      ),
    [availableYears]
  );

  const categoryCounts = useMemo(
    () =>
      patentCategories.reduce(
        (counts, category) => ({
          ...counts,
          [category.id]: patents.filter(
            patent => patent.category === category.id
          ).length,
        }),
        {} as Record<PatentCategory, number>
      ),
    []
  );

  const filteredPatents = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("ja-JP");
    return patents
      .filter(patent => {
        const inCategory =
          activeCategory === "all" || patent.category === activeCategory;
        const inYear =
          activeYear === "all" || patent.priority.startsWith(activeYear);
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
      .sort(
        (a, b) =>
          b.priority.localeCompare(a.priority) || b.id.localeCompare(a.id)
      );
  }, [activeCategory, activeYear, query]);

  const activeCategoryInfo = patentCategories.find(
    category => category.id === activeCategory
  );
  const isFiltered =
    activeCategory !== "all" || activeYear !== "all" || query !== "";

  const resetFilters = () => {
    setActiveCategory("all");
    setActiveYear("all");
    setQuery("");
  };

  return (
    <div>
      {/* 概要: 固定ヘッダー(64px)分は pt-16 で吸収する（Layout.tsx の申し送り方式） */}
      <section className="border-b border-line bg-paper-dim pt-16">
        <div className="section-shell grid grid-cols-1 items-end gap-10 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-16">
          <div>
            <p className="text-sm text-ink-mute">
              材料試験機の計測・制御に関する発明
            </p>
            <h1 className="jp-wrap mt-2 text-3xl font-bold tracking-[0.02em] text-ink sm:text-4xl">
              松浦 融 公開特許一覧
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-8 text-ink-soft">
              島津製作所・物質・材料研究機構の出願のうち、発明者に
              <span className="whitespace-nowrap">松浦 融</span>
              が記載された公開特許をまとめています。
              各特許には公報の要点と、Google
              Patentsの原典へのリンクを付けています。
            </p>
            <dl className="mt-8 grid max-w-2xl grid-cols-3 gap-6 border-t border-line-strong pt-5">
              <div className="stat">
                <dt>掲載件数</dt>
                <dd>{patents.length}件</dd>
              </div>
              <div className="stat">
                <dt>優先日</dt>
                <dd>
                  {firstYear}–{lastYear}
                </dd>
              </div>
              <div className="stat">
                <dt>外国にも出願</dt>
                <dd>{foreignFilingCount}件</dd>
              </div>
            </dl>
          </div>
          <YearChart
            activeYear={activeYear}
            onSelect={year => {
              setActiveYear(year === activeYear ? "all" : year);
              document
                .getElementById("catalog")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            yearCounts={yearCounts}
          />
        </div>
      </section>

      <section className="section-shell py-10 sm:py-14" id="catalog">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12">
          {/* 絞り込み（lg 以上: サイドバー） */}
          <aside className="hidden lg:sticky lg:top-24 lg:block">
            <p className="filter-heading">分野</p>
            <div className="space-y-0.5">
              <button
                className={`filter-button ${activeCategory === "all" ? "is-active" : ""}`}
                onClick={() => setActiveCategory("all")}
                type="button"
              >
                <span>すべて</span>
                <span>{patents.length}</span>
              </button>
              {patentCategories.map(category => (
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
            <p className="filter-heading mt-7">優先日の年</p>
            <YearSelect
              availableYears={availableYears}
              onChange={setActiveYear}
              value={activeYear}
              yearCounts={yearCounts}
            />
          </aside>

          <div className="min-w-0">
            <h2 className="section-title">特許一覧</h2>
            <p className="section-lead">
              公開番号・題名・技術用語で検索できます。並び順は優先日（最初に出願した日）の新しい順です。
            </p>

            <label className="relative mt-5 block">
              <Search
                aria-hidden="true"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-mute"
                size={18}
              />
              <input
                aria-label="特許を検索"
                className="catalog-search"
                onChange={event => setQuery(event.target.value)}
                placeholder="例: ノイズ除去、疲労試験、JP2019056614A"
                type="search"
                value={query}
              />
              {query && (
                <button
                  aria-label="検索語を消去"
                  className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center text-ink-mute hover:text-ink"
                  onClick={() => setQuery("")}
                  type="button"
                >
                  <X size={16} />
                </button>
              )}
            </label>

            {/* 絞り込み（lg 未満: 横スクロールのチップ＋年セレクト） */}
            <div className="mt-4 lg:hidden">
              <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:-mx-8 sm:px-8">
                <button
                  className={`filter-chip ${activeCategory === "all" ? "is-active" : ""}`}
                  onClick={() => setActiveCategory("all")}
                  type="button"
                >
                  すべて <span>{patents.length}</span>
                </button>
                {patentCategories.map(category => (
                  <button
                    className={`filter-chip ${activeCategory === category.id ? "is-active" : ""}`}
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    type="button"
                  >
                    {category.label} <span>{categoryCounts[category.id]}</span>
                  </button>
                ))}
              </div>
              <div className="mt-3 max-w-[14rem]">
                <YearSelect
                  availableYears={availableYears}
                  onChange={setActiveYear}
                  value={activeYear}
                  yearCounts={yearCounts}
                />
              </div>
            </div>

            {activeCategoryInfo && (
              <p className="mt-5 rounded-md bg-accent-blue-soft px-4 py-3 text-sm leading-7 text-ink-soft">
                <span className="font-bold text-accent-blue">
                  {activeCategoryInfo.label}
                </span>
                ：{activeCategoryInfo.description}
              </p>
            )}

            <div className="mt-6 flex min-h-11 items-center justify-between border-b border-ink pb-2 text-sm text-ink-soft">
              <p aria-live="polite">
                <span className="font-mono font-medium text-ink">
                  {filteredPatents.length}
                </span>{" "}
                件
                {isFiltered && (
                  <span className="text-ink-mute">
                    （全{patents.length}件中）
                  </span>
                )}
              </p>
              {isFiltered && (
                <button
                  className="text-link"
                  onClick={resetFilters}
                  type="button"
                >
                  条件を解除
                </button>
              )}
            </div>

            <div className="divide-y divide-line">
              {filteredPatents.map(patent => (
                <article className="patent-row" key={patent.id}>
                  <div className="min-w-0">
                    <div className="patent-meta">
                      <span className="patent-id">{patent.id}</span>
                      <span>優先日 {patent.priority}</span>
                      <span
                        className="flex gap-1"
                        aria-label={`出願地域: ${patent.regions.join("、")}`}
                      >
                        {patent.regions.map(region => (
                          <span className="region-tag" key={region}>
                            {region}
                          </span>
                        ))}
                      </span>
                    </div>
                    <h3 className="jp-wrap mt-2 text-lg font-bold leading-snug text-ink">
                      {patent.title}
                    </h3>
                    <p className="mt-1 text-xs leading-6 text-ink-mute">
                      原題：{patent.originalTitle}
                    </p>
                    <p className="mt-3 max-w-3xl text-[15px] leading-7 text-ink-soft">
                      {patent.overview}
                    </p>
                    <Accordion
                      className="patent-summary-accordion max-w-3xl"
                      collapsible
                      type="single"
                    >
                      <AccordionItem
                        className="border-0"
                        value={`summary-${patent.id}`}
                      >
                        <AccordionTrigger className="patent-summary-trigger flex-none justify-start">
                          公報の要点を見る
                        </AccordionTrigger>
                        <AccordionContent className="pb-2">
                          <div className="patent-summary-content">
                            <dl>
                              <div>
                                <dt>課題</dt>
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
                                <dt>請求項の要旨</dt>
                                <dd>{patent.claimSummary}</dd>
                              </div>
                            </dl>
                            <ul
                              aria-label="技術用語"
                              className="patent-keywords"
                            >
                              {patent.keywords.map(keyword => (
                                <li key={keyword}>{keyword}</li>
                              ))}
                            </ul>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                  <div className="flex flex-row-reverse items-center justify-end gap-3 sm:flex-col sm:items-end sm:justify-start">
                    <a
                      aria-label={`${patent.id} をGoogle Patentsで開く`}
                      className="source-link"
                      href={patentLink(patent.id)}
                      rel="noreferrer"
                      target="_blank"
                    >
                      原典 <ExternalLink aria-hidden="true" size={14} />
                    </a>
                    <span className="category-tag">{patent.category}</span>
                  </div>
                </article>
              ))}
              {filteredPatents.length === 0 && (
                <div className="py-16 text-center text-sm text-ink-soft">
                  <p>条件に合う特許はありません。</p>
                  <button
                    className="text-link mt-2"
                    onClick={resetFilters}
                    type="button"
                  >
                    条件を解除
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-paper-dim" id="method">
        <div className="section-shell grid grid-cols-1 gap-6 py-12 sm:py-14 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12">
          <h2 className="section-title">掲載範囲</h2>
          <div className="max-w-3xl">
            <ul className="method-list">
              <li>
                Google Patentsで、発明者{" "}
                <span className="font-mono text-[13px]">Toru Matsuura</span>
                、出願人 <span className="font-mono text-[13px]">Shimadzu</span>
                （島津製作所）または{" "}
                <span className="font-mono text-[13px]">Materials Science</span>
                （物質・材料研究機構）で検索した結果のうち{patents.length}
                件を掲載しています。
              </li>
              <li>
                一覧は日本の公開番号を基準にしています。US・EP・CNの表示は、同じ発明が各国・地域にも出願されていることを示します。
              </li>
              <li>
                題名・分野・要点は公報をもとに当サイトで整理したものです。権利の有効性や各国での手続状況は原典で確認してください。
              </li>
            </ul>
            <a
              className="text-link mt-4"
              href="https://patents.google.com/?inventor=Matsuura+Toru&assignee=shimadzu,Materials+Science"
              rel="noreferrer"
              target="_blank"
            >
              Google Patentsの検索結果{" "}
              <ExternalLink aria-hidden="true" size={14} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

/** 優先日の年ごとの件数。棒をクリックするとその年で絞り込む（再クリックで解除）。 */
function YearChart({
  activeYear,
  onSelect,
  yearCounts,
}: {
  activeYear: string;
  onSelect: (year: string) => void;
  yearCounts: Record<string, number>;
}) {
  const years = Array.from({ length: lastYear - firstYear + 1 }, (_, index) =>
    String(firstYear + index)
  );
  const max = Math.max(...Object.values(yearCounts));

  return (
    <figure className="hidden sm:block">
      <figcaption className="text-xs text-ink-mute">
        優先日の年ごとの件数（クリックで絞り込み）
      </figcaption>
      <div className="year-chart mt-8">
        {years.map(year => {
          const count = yearCounts[year] ?? 0;
          const isActive = activeYear === year;
          const isDimmed = activeYear !== "all" && !isActive;
          return (
            <button
              aria-label={`${year}年: ${count}件`}
              aria-pressed={isActive}
              className="year-chart-col group"
              disabled={count === 0}
              key={year}
              onClick={() => onSelect(year)}
              type="button"
            >
              <span className="year-chart-tip">
                {year}年 <b>{count}件</b>
              </span>
              <span
                className={`year-chart-bar ${isDimmed ? "is-dimmed" : ""}`}
                style={{ height: count ? `${(count / max) * 100}%` : 0 }}
              />
            </button>
          );
        })}
      </div>
      <div className="mt-1.5 flex justify-between font-mono text-[11px] text-ink-mute">
        <span>{firstYear}</span>
        <span>{lastYear}</span>
      </div>
    </figure>
  );
}

function YearSelect({
  availableYears,
  onChange,
  value,
  yearCounts,
}: {
  availableYears: string[];
  onChange: (value: string) => void;
  value: string;
  yearCounts: Record<string, number>;
}) {
  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger aria-label="優先日の年で絞り込む" className="year-select">
        <SelectValue placeholder="すべての年" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">すべての年</SelectItem>
        {availableYears.map(year => (
          <SelectItem key={year} value={year}>
            {year}年（{yearCounts[year]}件）
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
