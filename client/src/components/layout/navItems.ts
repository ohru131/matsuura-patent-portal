export type NavItem = {
  href: string;
  label: string;
};

/**
 * サイト共通のページ内ナビゲーション。
 * サイトは公開特許カタログ1ページ構成（"/" と "/patents" の両方に同じページが乗る）ため、
 * ナビ項目はすべてカタログページ内のセクションIDへのアンカー（Patents.tsx の id="catalog" 等）。
 */
export const NAV_ITEMS: NavItem[] = [
  { href: "#catalog", label: "特許一覧" },
  { href: "#method", label: "掲載範囲" },
];
