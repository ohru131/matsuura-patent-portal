export type NavItem = {
  href: string;
  label: string;
};

/**
 * サイト共通のページ内ナビゲーション。
 * サイトは公開特許カタログ1ページ構成（"/" と "/patents" の両方に同じページが乗る）ため、
 * ナビ項目はすべてカタログページ内のセクションIDへのアンカー（Patents.tsx の id="map" 等）。
 */
export const NAV_ITEMS: NavItem[] = [
  { href: "#map", label: "分類から探す" },
  { href: "#catalog", label: "一覧・検索" },
  { href: "#method", label: "調査について" },
];
