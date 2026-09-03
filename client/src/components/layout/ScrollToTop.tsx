import { useEffect } from "react";
import { useLocation } from "wouter";

/**
 * ルート（パス名）が変わるたびに実行する。
 * ハッシュがあれば該当要素へ scrollIntoView、なければページ先頭へ。
 * 固定ヘッダー分のオフセットは各要素の `scroll-margin-top`（index.css）に任せる。
 *
 * 注意: wouter の useLocation はパス名の変化にしか反応しない。トップページ内で
 * ハッシュだけが変わるナビゲーション（例: "/" にいる状態で "/#work" を押す）は
 * ここでは検知できないため、そのケースは Header/MobileNav 側（useSiteNav）で
 * 直接 scrollIntoView するフォールバックを持たせている。
 */
export default function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    const hash = window.location.hash;
    requestAnimationFrame(() => {
      if (hash) {
        const id = hash.slice(1);
        const target = document.getElementById(id);
        if (target) {
          target.scrollIntoView({ behavior: "auto" });
          return;
        }
      }
      window.scrollTo({ top: 0 });
    });
  }, [location]);

  return null;
}
