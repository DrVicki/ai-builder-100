import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ProgressProvider } from "./contexts/ProgressContext";
import Home from "./pages/Home";
import ModulePage from "./pages/ModulePage";
import Dashboard from "./pages/Dashboard";
import Certificate from "./pages/Certificate";
import Notes from "./pages/Notes";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/module/:slug" component={ModulePage} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/certificate" component={Certificate} />
      <Route path="/notes" component={Notes} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <ProgressProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ProgressProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
