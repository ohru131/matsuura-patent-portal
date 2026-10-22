/**
 * サイト共通フッター。問い合わせフォーム・連絡先は置かない
 * （公開特許情報のカタログという位置づけのため）。
 */
export default function Footer() {
  return (
    <footer className="border-t border-line bg-paper-dim">
      <div className="section-shell flex flex-col gap-2 py-8 text-xs leading-6 text-ink-mute sm:flex-row sm:items-center sm:justify-between">
        <p>松浦 融｜公開特許一覧</p>
        <p>掲載内容は公開公報をもとに整理したもの。権利の状況は各公報の原典で確認してください。</p>
      </div>
    </footer>
  );
}
