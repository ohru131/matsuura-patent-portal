import type { ReactNode } from "react";
import Footer from "./Footer";
import Header from "./Header";

/**
 * 余白方式について（Patents.tsx などページを書く人向けの申し送り）:
 * <Header> は `fixed` で高さ 64px。この <main> 自体には上方向の padding を
 * 一切持たせていない。各ページの一番上のセクション（ヒーロー）側で
 * `pt-16`（または同等の余白）を持たせて、固定ヘッダー分を吸収すること。
 * 例: Patents.tsx の概要セクション `<section className="... pt-16 ...">` と同じ方式。
 * これにより、ヒーローが画面幅いっぱいの背景色/グラフィックを持つデザイン
 * （藍地に背景を敷く等）でも、ヘッダーの下にきれいに続く。
 */
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-paper text-ink">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
