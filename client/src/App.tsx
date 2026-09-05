/** Style reminder — 光学の航路: 濃藍のヒーローと生成りの研究資料面を往復し、常に高い文字コントラストを保つ。 */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Router as WouterRouter, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import Layout from "./components/layout/Layout";
import ScrollToTop from "./components/layout/ScrollToTop";
import { ThemeProvider } from "./contexts/ThemeContext";
import Patents from "./pages/Patents";

/**
 * GitHub Pages ではリポジトリ名のサブディレクトリ配下（例:
 * "/matsuura-patent-portal/"）で公開されるため、Vite がビルド時の --base から
 * 注入する import.meta.env.BASE_URL（末尾スラッシュ付き）を、wouter の
 * <Router base> が期待する形式（末尾スラッシュなし。ルート直下なら空文字）に
 * 変換する。ローカル開発（base 未指定）では BASE_URL が "/" になるため、
 * wouterBase は "" になり従来どおりの挙動になる。
 */
const wouterBase = import.meta.env.BASE_URL.replace(/\/$/, "");

/**
 * サイトは公開特許カタログ1ページ構成。
 * "/" と "/patents"（共有済みの可能性があるURL）の両方に同じカタログを割り当てる。
 */
function Router() {
  return (
    <WouterRouter base={wouterBase}>
      <Layout>
        <ScrollToTop />
        <Switch>
          <Route component={Patents} path="/" />
          <Route component={Patents} path="/patents" />
          <Route path="/404" component={NotFound} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </WouterRouter>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
