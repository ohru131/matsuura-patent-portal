# GitHub Pages への公開

このドキュメントは、このサイト（Vite + React の公開特許カタログ）を
GitHub Pages で公開する仕組みと、運用時の注意点をまとめたものです。

## 1. 公開URL

```
https://ohru131.github.io/matsuura-patent-portal/
```

リポジトリ名 `matsuura-patent-portal` の**サブディレクトリ配下**で公開されます
（GitHub Pagesの「project page」。ユーザー/組織ページ用の `<user>.github.io`
リポジトリではないため、ドメイン直下ではありません）。

## 2. デプロイのタイミング

- ワークフロー: `.github/workflows/deploy-pages.yml`
- 実行タイミング:
  - `main` ブランチへの `push`（マージ・直接pushのどちらでも）
  - いつでも手動実行可能（`Actions` タブ → `Deploy to GitHub Pages` → `Run workflow`）
- ジョブ構成: `build`（ビルドしてアーティファクトをアップロード）→ `deploy`
  （`environment: github-pages` でPages環境にデプロイ、デプロイURLをジョブの
  出力に残す）
- 同時実行の扱い: `concurrency: { group: pages, cancel-in-progress: false }`。
  デプロイの取りこぼしを避けるため、実行中のデプロイを取り消さず、
  後続の実行はキューで待機します。

## 3. Pages の有効化について

ワークフローは `actions/configure-pages@v5` を `enablement: true` 付きで
実行しているため、**リポジトリでPagesが未設定でも、ワークフローの初回実行時に
自動で有効化されます**（Source が自動的に「GitHub Actions」に設定されます）。

もし何らかの理由で自動有効化がうまくいかない場合（組織のポリシーで
Pagesの自動有効化が制限されている、等）は、手動で以下を設定してください。

1. リポジトリの `Settings` → `Pages` を開く
2. `Build and deployment` の `Source` を `GitHub Actions` にする
3. `deploy-pages.yml` を再度実行する（`workflow_dispatch` で手動実行可）

## 4. サブディレクトリ配下で動かすための仕組み

GitHub Pagesのproject pageは `https://<user>.github.io/<repo>/` という
サブディレクトリ配下で配信されます。素の状態（Viteの `base` がデフォルトの `/`）
のままビルドすると、JS/CSSが `/assets/...` を指してしまい404になるため、
いくつかの対応をしています。

### 4-1. アセットのベースパス（`--base`）

`vite.config.ts` 自体の `base` はデフォルト（`/`）のまま**変更していません**。
理由は、ローカルの `pnpm dev` / `pnpm build` を今までどおり `/` 基準で
動かし続けたいためです（Pages以外の配信先で使う可能性、開発体験の維持）。

代わりに、`deploy-pages.yml` のビルドコマンドで `--base` をコマンドライン引数
として渡しています。

```bash
pnpm exec vite build --base=/${{ github.event.repository.name }}/
```

`github.event.repository.name` からリポジトリ名を取得しているため、
将来リポジトリ名が変わった場合や、このリポジトリをフォークして別名で
Pages公開する場合でも、ワークフローを書き換えずに追随します。

また、Pagesへは**クライアント（`client/` → `dist/public`）のみ**をデプロイします。
`pnpm build`（= `vite build && esbuild server/index.ts ...`）ではなく
`vite build` を直接呼んでいるのは、`server/` がExpressの静的配信サーバーで
Pagesには不要なため、無駄なesbuildの実行を避けるためです。

### 4-2. wouterのベースパス

`--base` を付けてビルドすると、Viteが `import.meta.env.BASE_URL` に
末尾スラッシュ付きのベースパス（例: `/matsuura-patent-portal/`）を注入します。
これをそのまま使わず、ルーティングライブラリ（wouter）が期待する形式
（**末尾スラッシュなし**。ルート直下なら空文字）に変換して、
`client/src/App.tsx` の `<Router base={...}>` に渡しています。

```ts
// client/src/App.tsx
const wouterBase = import.meta.env.BASE_URL.replace(/\/$/, "");
```

- ローカル開発時（`base` 未指定）は `BASE_URL` が `"/"` になるため
  `wouterBase` は空文字になり、従来どおりの挙動（ルート直下）になります。
- Pagesビルド時は `BASE_URL` が `/matsuura-patent-portal/` になるため
  `wouterBase` は `/matsuura-patent-portal` になり、`<Link>` や
  `useLocation()` の `navigate` がすべてこのベースを前提に動きます
  （wouter内部では `useLocation()` が返すパス名からbaseを除去し、
  `navigate()` / `<Link>` の `href` にはbaseを付加します）。

あわせて、`client/src/components/layout/Header.tsx` のロゴリンクが
素の `<a href="/">` になっていた箇所を、wouterの `<Link href="/">` に
変更しています。素の `<a href="/">` のままだと、`onClick` で
`preventDefault` してJS側のルーティングに任せている通常クリックは
問題ありませんが、**修飾キー付きクリック（Ctrl/Cmd/Shift/Alt）や
右クリックからの「新しいタブで開く」では、ブラウザがhref属性の値へ
そのまま遷移する**ため、ベースパスを含まない `/`（＝リポジトリ名なしの
`https://ohru131.github.io/`）に飛んでしまう問題がありました。
wouterの `<Link>` はレンダリング時点で `href` 属性自体に
`router.base` を含めて出力するため、この問題が起きません。

その他のナビゲーション（`navItems.ts` のNAV_ITEMS、`useSiteNav.ts`、
`MobileNav.tsx`、`Footer.tsx`、`ScrollToTop.tsx`）は、すべて
`#map` のようなページ内アンカー（ハッシュ）か、wouterの
`useLocation()` / `navigate()` 経由のパス操作のみで、
`window.location.pathname` の直接比較や、ベースパスを考慮していない
決め打ちの絶対パスは使っていないことを確認済みです。

### 4-3. SPAのディープリンク対策（404.html）

GitHub Pagesは静的ホスティングのため、サーバー側のSPAフォールバックが
ありません。`https://ohru131.github.io/matsuura-patent-portal/patents` に
直接アクセス（リロードや外部リンクからの遷移）すると、本来は404になります。

これを避けるため、ワークフローがビルド後に `dist/public/index.html` を
**そのまま** `dist/public/404.html` としてコピーしています。

```yaml
- name: Add 404.html SPA fallback
  run: cp dist/public/index.html dist/public/404.html
```

GitHub Pagesは、存在しないパスへのリクエストに対してHTTPステータス404を
返しつつ、リポジトリ直下の `404.html` の中身を返します。中身はSPAの
`index.html` そのものなので、ブラウザ上でJavaScriptが実行され、
wouterのルーターがURL（`/matsuura-patent-portal/patents` など）を見て
正しい画面を描画します。

### 4-4. `.nojekyll`

GitHub Pagesはデフォルトで公開前にJekyll処理を行い、`_` で始まる
ファイル/ディレクトリ名を無視します。Viteのビルド成果物は現状 `_` 始まりの
ファイルを生成しませんが、将来的な依存追加やプラグイン変更で
意図せずJekyllに無視されるファイルが生まれるのを防ぐため、
成果物ルートに空の `.nojekyll` ファイルを置いています（Pages公開の定番の
おまじないです）。

### 4-5. NotFoundページ

`404.html` の仕組みにより、存在しないパスでも実際にはSPAの `index.html`
が返るため、`client/src/App.tsx` のcatch-all Route（`NotFound`）が
描画されます。`NotFound.tsx` の「Go Home」ボタンは `setLocation("/")`
（wouterの`useLocation()`が返す関数）を呼んでいますが、これは
`<Router base>` に設定したベースパスを自動的に考慮して遷移するため、
`/matsuura-patent-portal/` 配下でも正しくトップへ戻ります
（4-2で説明したwouterの`base`処理の対象になるため、`NotFound.tsx` 自体は
変更していません）。

## 5. カスタムドメインを使いたくなった場合

将来、独自ドメイン（例: `patents.example.com`）で公開したくなった場合は、
以下を変更してください。

1. リポジトリの `Settings` → `Pages` → `Custom domain` にドメインを設定する
   （このとき `dist/public/CNAME` を自動生成するか、`public/CNAME` を
   置いてビルド成果物に含める運用に変える）
2. `.github/workflows/deploy-pages.yml` の `--base=/${{ github.event.repository.name }}/`
   を `--base=/`（＝サブディレクトリなし）に変更する
   （カスタムドメインはドメイン直下で配信されるため、リポジトリ名の
   サブディレクトリは不要になります）
3. `client/src/App.tsx` の `wouterBase` はロジックそのまま
   （`import.meta.env.BASE_URL` から自動導出）で問題ありません。
   `--base=/` を渡せば `BASE_URL` が `"/"` になり、`wouterBase` は
   自動的に空文字（ルート直下）になります。

## 6. 独自の注意点

- ローカルの `pnpm dev` / `pnpm build` はこのワークフローの影響を一切
  受けません（`vite.config.ts` の `base` は変更していないため）。
  Pages向けのビルドを手元で再現したい場合は、ワークフローと同じ手順を
  手動でどうぞ。

  ```bash
  pnpm install --frozen-lockfile
  pnpm exec vite build --base=/matsuura-patent-portal/
  cp dist/public/index.html dist/public/404.html
  touch dist/public/.nojekyll
  ```

- `check-new-patents.yml` と同様、このワークフローも `pages: write` /
  `id-token: write` という**Pagesデプロイに必要な最小権限**のみを付与しており、
  `contents: write` は付与していません（このワークフローはリポジトリへの
  コミット・pushを一切行いません）。
- 使用しているActionはすべて `actions/` 公式org配下のもの
  （`actions/checkout`、`actions/setup-node`、`actions/configure-pages`、
  `actions/upload-pages-artifact`、`actions/deploy-pages`）で、タグ参照
  （`@v4` / `@v5`）です。サードパーティ製Actionは使っていません。
  `pnpm` の有効化も `pnpm/action-setup`（サードパーティ）ではなく
  `corepack enable`（Node.js同梱、`package.json` の `packageManager`
  フィールドからpnpmのバージョンを自動で読む）を使っています。
- ビルドサイズについて: `vite build` 実行時に
  「Some chunks are larger than 500 kB」という警告が出ますが、
  これは既存のバンドル構成に起因するもので、このPages対応で新たに
  発生したものではありません（対応不要）。
