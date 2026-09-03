/**
 * BrandMark — 「松浦融」の抽象シンボル。
 * 重なる書類の角（記録・公報）／レンズの絞り（観察・計測）／外へ伸びる一本の線（発明から社会への展開）を
 * 一つのマークに重ねたインラインSVG。画像アセットを使わず、currentColor 経由で親から色を制御する。
 *
 * variant:
 *  - "onDark"  … 藍地の上に置く（金系の線）
 *  - "onLight" … 生成り地の上に置く（藍系の線）
 */
type BrandMarkProps = {
  className?: string;
  variant?: "onDark" | "onLight";
};

const STROKE_COLOR: Record<NonNullable<BrandMarkProps["variant"]>, string> = {
  onDark: "#e7cd88",
  onLight: "#123650",
};

export default function BrandMark({ className, variant = "onDark" }: BrandMarkProps) {
  const stroke = STROKE_COLOR[variant];

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      focusable="false"
      style={{ color: stroke }}
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 重なる書類の角: 公開公報の記録を示す */}
      <path
        d="M13 32.5V13.8C13 12.8 13.8 12 14.8 12H27.2L34 18.8V32.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.4"
        opacity="0.55"
      />
      <path
        d="M27 12v6.4c0 .9.7 1.6 1.6 1.6H34"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.4"
        opacity="0.55"
      />
      {/* レンズの絞り（同心円）: 観察・計測を示す */}
      <circle cx="24" cy="26" r="8.4" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="24" cy="26" r="4.6" stroke="currentColor" strokeWidth="1.1" opacity="0.75" />
      <circle cx="24" cy="26" r="1.5" fill="currentColor" />
      {/* 外へ伸びる一本線: 発明から社会への展開を示す */}
      <path d="M32.4 34.4 40 42" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
    </svg>
  );
}
