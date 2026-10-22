import BrandMark from "@/components/BrandMark";
import { Link } from "wouter";
import MobileNav from "./MobileNav";
import { NAV_ITEMS } from "./navItems";
import { useSiteNav } from "./useSiteNav";

/**
 * サイト共通の固定ヘッダー（高さ 64px）。左にブランド（BrandMark＋氏名）、右にページ内ナビゲーション。
 * サイトは公開特許カタログ1ページ構成のため、ナビ項目はすべてページ内アンカー。
 * その挙動（現在地判定・スクロール）は useSiteNav に集約。
 */
export default function Header() {
  const { isActive, handleNavClick } = useSiteNav();

  return (
    <header className="site-header fixed inset-x-0 top-0 z-50 border-b border-line">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-5 sm:px-8">
        {/*
          wouter の Link を使うことで、GitHub Pages のサブディレクトリ配下
          （base 付き）でも、rendered された href に base が含まれる
          （素の <a href="/"> だと、修飾キー付きクリックや右クリックでの
          「新しいタブで開く」時にリポジトリ名なしのルートへ飛んでしまう）。
        */}
        <Link
          aria-label="公開特許一覧のトップへ"
          className="flex min-h-11 items-center gap-2.5"
          href="/"
        >
          <BrandMark className="h-8 w-8 shrink-0" variant="onLight" />
          <span className="text-[15px] font-bold tracking-[0.06em] text-ink">松浦 融</span>
          <span className="hidden text-xs text-ink-mute sm:inline">公開特許一覧</span>
        </Link>

        <nav aria-label="ページ内ナビゲーション" className="hidden items-center gap-7 md:flex">
          {NAV_ITEMS.map((item) => (
            <a
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`nav-link ${isActive(item.href) ? "is-active" : ""}`}
              href={item.href}
              key={item.href}
              onClick={(event) => handleNavClick(event, item.href)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <MobileNav />
      </div>
    </header>
  );
}
