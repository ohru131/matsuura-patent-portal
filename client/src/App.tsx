/** Style reminder — 光学の航路: 濃藍のヒーローと生成りの研究資料面を往復し、常に高い文字コントラストを保つ。 */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import Layout from "./components/layout/Layout";
import ScrollToTop from "./components/layout/ScrollToTop";
import { ThemeProvider } from "./contexts/ThemeContext";
import Patents from "./pages/Patents";

/**
 * サイトは公開特許カタログ1ページ構成。
 * "/" と "/patents"（共有済みの可能性があるURL）の両方に同じカタログを割り当てる。
 */
function Router() {
  return (
    <Layout>
      <ScrollToTop />
      <Switch>
        <Route component={Patents} path="/" />
        <Route component={Patents} path="/patents" />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
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
