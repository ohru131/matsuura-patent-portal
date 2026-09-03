import { useState } from "react";
import { Menu } from "lucide-react";
import BrandMark from "@/components/BrandMark";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NAV_ITEMS } from "./navItems";
import { useSiteNav } from "./useSiteNav";

/**
 * md 未満で表示するハンバーガーメニュー。
 * モバイルではナビが完全に消えていた既存の穴を塞ぐのが目的。
 */
export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const { isActive, handleNavClick } = useSiteNav();

  const onLinkClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    handleNavClick(event, href);
    setOpen(false);
  };

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <button
          aria-label="メニューを開く"
          className="mobile-nav-trigger md:hidden"
          type="button"
        >
          <Menu aria-hidden="true" size={22} />
        </button>
      </SheetTrigger>
      <SheetContent className="w-[85vw] max-w-sm bg-[#f5f0e7] p-0" side="right">
        <SheetHeader className="border-b border-[#d8cbb9] px-5 py-5">
          <SheetTitle asChild>
            <span className="flex items-center gap-3">
              <BrandMark className="h-9 w-9" variant="onLight" />
              <span className="font-serif text-base tracking-[0.1em] text-[#123650]">松浦 融</span>
            </span>
          </SheetTitle>
        </SheetHeader>
        <nav aria-label="主なページ内ナビゲーション（モバイル）" className="flex flex-col gap-1 p-4">
          {NAV_ITEMS.map((item) => (
            <a
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`mobile-nav-link ${isActive(item.href) ? "is-active" : ""}`}
              href={item.href}
              key={item.href}
              onClick={(event) => onLinkClick(event, item.href)}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
