import BrandMark from "@/components/BrandMark";

/**
 * サイト共通フッター。問い合わせフォーム・連絡先は置かない
 * （公開特許情報のカタログという位置づけのため）。
 */
export default function Footer() {
  return (
    <footer className="bg-[#071e38] text-[#becbd5]">
      <div className="section-shell flex flex-col gap-8 py-12 md:flex-row md:items-start md:justify-between">
        <div className="flex items-center gap-3">
          <BrandMark className="h-11 w-11 shrink-0" variant="onDark" />
          <div>
            <p className="font-serif text-lg text-white">松浦 融</p>
            <p className="mt-1 font-mono text-[10px] tracking-[0.16em]">PATENT CATALOG</p>
          </div>
        </div>
        <p className="max-w-xl text-sm leading-7 text-[#91a7b8]">
          内容は公開特許情報にもとづく案内です。詳細は各公報の原典でご確認ください。
        </p>
      </div>
    </footer>
  );
}
