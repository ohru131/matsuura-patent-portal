import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { NAV_ITEMS } from "./navItems";

/**
 * Header / MobileNav で共有するナビゲーションのロジック。
 *
 * カタログページ（Patents.tsx）は "/" と "/patents" の両方にマウントされる同一コンポーネント。
 * NAV_ITEMS はすべてページ内アンカー（"#map" 等）なので、どちらのパスにいても同じロジックで
 * スクロール・現在地判定ができるようにしている。
 *
 * wouter の useLocation はパス名だけを見て変化を検知するため、カタログページにいる状態で
 * ハッシュだけが変わるリンクを押しても、パス名は変わらず再レンダリングが起きない
 * （= ScrollToTop の効果が発火しない）。そのため、カタログページにいる間はここで直接
 * scrollIntoView するフォールバックを持つ。カタログページ以外（NotFound 等）からアンカーへ
 * 遷移する場合は navigate() でパス変更を起こし、ScrollToTop 側がマウント後にハッシュを見て
 * スクロールする。
 */
const CATALOG_PATHS = ["/", "/patents"];

export function useSiteNav() {
  const [location, navigate] = useLocation();
  const [activeHash, setActiveHash] = useState("");
  const isCatalogRoute = CATALOG_PATHS.includes(location);

  useEffect(() => {
    if (!isCatalogRoute) {
      setActiveHash("");
      return;
    }

    const sectionIds = NAV_ITEMS.filter((item) => item.href.startsWith("#")).map((item) =>
      item.href.slice(1),
    );
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActiveHash(`#${visible.target.id}`);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [location, isCatalogRoute]);

  const isActive = (href: string) => {
    if (href.startsWith("#")) return isCatalogRoute && activeHash === href;
    return false;
  };

  const navigateTo = (href: string) => {
    if (href.startsWith("#")) {
      if (isCatalogRoute) {
        const id = href.slice(1);
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        window.history.replaceState(null, "", href);
        return;
      }
      navigate(`/${href}`);
      return;
    }
    navigate(href);
  };

  const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigateTo(href);
  };

  return { location, isActive, navigateTo, handleNavClick };
}
