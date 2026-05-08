import { useState } from "react";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Experience from "./pages/Experience";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import { type PageId } from "./components/layout/Sidebar";
import { useTranslation } from "../lib/hooks/useTranslation";

function App() {
  const [activePage, setActivePage] = useState<PageId>("home");
  const { locale } = useTranslation();

  const renderPage = () => {
    switch (activePage) {
      case "home":
        return <Home />;
      case "about":
        return <About />;
      case "experience":
        return <Experience />;
      case "projects":
        return <Projects />;
      case "contact":
        return <Contact />;
      default:
        return <Home />;
    }
  };

  return (
    <Layout activePage={activePage} onPageChange={setActivePage}>
      <div
        key={locale}
        className="flex-1 flex flex-col min-h-0 overflow-hidden"
      >
        {renderPage()}
      </div>
    </Layout>
  );
}

export default App;
