import BrandMark from "@/components/BrandMark";

/**
 * サイト共通フッター。問い合わせフォーム・連絡先は置かない
 * （プロフィールからリンクされるポートフォリオという位置づけのため）。
 */
export default function Footer() {
  return (
    <footer className="bg-[#071e38] text-[#becbd5]">
      <div className="section-shell flex flex-col gap-8 py-12 md:flex-row md:items-start md:justify-between">
        <div className="flex items-center gap-3">
          <BrandMark className="h-11 w-11 shrink-0" variant="onDark" />
          <div>
            <p className="font-serif text-lg text-white">松浦 融</p>
            <p className="mt-1 font-mono text-[10px] tracking-[0.16em]">PORTFOLIO</p>
          </div>
        </div>
        <p className="max-w-xl text-sm leading-7 text-[#91a7b8]">
          本サイトは、公開されている特許情報と現在の活動をまとめた個人のポートフォリオです。
          掲載した公開公報の発明者は松浦融ですが、出願人（特許を受ける権利の帰属先）は在籍していた企業です。
          各特許の法的状態は、リンク先の原典でご確認ください。
        </p>
      </div>
    </footer>
  );
}
