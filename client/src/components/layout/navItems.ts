export type NavItem = {
  href: string;
  label: string;
};

/**
 * サイト共通のページ内・ページ間ナビゲーション。
 * "/#xxx" はトップページ（Home.tsx）のセクションIDへのアンカー。
 * Home.tsx 側で id="work" / id="past" / id="journey" を用意する前提。
 */
export const NAV_ITEMS: NavItem[] = [
  { href: "/#work", label: "いまの取り組み" },
  { href: "/#past", label: "これまでの仕事" },
  { href: "/#journey", label: "歩み" },
  { href: "/patents", label: "特許実績" },
];
