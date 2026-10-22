import { Link } from "wouter";

export default function NotFound() {
  return (
    <section className="section-shell pb-24 pt-40">
      <p className="font-mono text-sm text-ink-mute">404</p>
      <h1 className="mt-2 text-2xl font-bold text-ink">ページが見つかりません</h1>
      <p className="mt-3 text-sm leading-7 text-ink-soft">URLが変更されたか、ページが削除された可能性があります。</p>
      <Link className="text-link mt-4" href="/">
        公開特許一覧へ戻る
      </Link>
    </section>
  );
}
