import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { NAV_ITEMS } from "./navItems";

/**
 * Header / MobileNav で共有するナビゲーションのロジック。
 *
 * wouter の useLocation はパス名だけを見て変化を検知するため、トップページ（"/"）に
 * いる状態で "/#work" のようなハッシュだけが変わるリンクを押しても、パス名は
 * "/" → "/" のままで再レンダリングが起きない（= ScrollToTop の効果が発火しない）。
 * そのため、location === "/" のときはここで直接 scrollIntoView するフォールバックを持つ。
 * 別ページ（例: /patents）からの遷移は navigate() でパス変更を起こし、
 * ScrollToTop 側がマウント後にハッシュを見てスクロールする。
 */
export function useSiteNav() {
  const [location, navigate] = useLocation();
  const [activeHash, setActiveHash] = useState("");

  useEffect(() => {
    if (location !== "/") {
      setActiveHash("");
      return;
    }

    const sectionIds = NAV_ITEMS.filter((item) => item.href.startsWith("/#")).map((item) =>
      item.href.slice(2),
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
  }, [location]);

  const isActive = (href: string) => {
    if (href === "/patents") return location === "/patents";
    if (href.startsWith("/#")) return location === "/" && activeHash === href.slice(1);
    return false;
  };

  const navigateTo = (href: string) => {
    if (href.startsWith("/#") && location === "/") {
      const id = href.slice(2);
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      window.history.replaceState(null, "", href);
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
