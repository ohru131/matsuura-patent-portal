import BrandMark from "@/components/BrandMark";
import MobileNav from "./MobileNav";
import { NAV_ITEMS } from "./navItems";
import { useSiteNav } from "./useSiteNav";

/**
 * サイト共通の固定ヘッダー。左にブランド（BrandMark＋氏名）、右にページ内ナビゲーション。
 * サイトは公開特許カタログ1ページ構成のため、ナビ項目はすべてページ内アンカー。
 * その挙動（現在地判定・スクロール）は useSiteNav に集約。
 */
export default function Header() {
  const { isActive, handleNavClick } = useSiteNav();

  return (
    <header className="site-header fixed inset-x-0 top-0 z-50 border-b border-white/10 text-white">
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
        <a
          aria-label="公開特許カタログのトップへ"
          className="group flex min-h-11 items-center gap-3"
          href="/"
          onClick={(event) => handleNavClick(event, "/")}
        >
          <BrandMark className="h-10 w-10 shrink-0 sm:h-11 sm:w-11" variant="onDark" />
          <span className="leading-none">
            <span className="block font-serif text-[15px] tracking-[0.16em]">松浦 融</span>
            <span className="mt-1 block font-mono text-[9px] tracking-[0.2em] text-[#aebdcb]">
              TORU MATSUURA
            </span>
          </span>
        </a>

        <nav
          aria-label="主なページ内ナビゲーション"
          className="hidden items-center gap-6 text-sm text-[#d9e1e8] md:flex lg:gap-8"
        >
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
