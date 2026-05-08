import { useState } from "react";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Experience from "./pages/Experience";
import Projects from "./pages/Projects";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Analytics from "./pages/Analytics";
import { type PageId } from "./components/layout/Sidebar";
import { useTranslation } from "../lib/hooks/useTranslation";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [activePage, setActivePage] = useState<PageId>("home");
  const { locale } = useTranslation();

  const renderPage = () => {
    switch (activePage) {
      case "home":
        return <Home onNavigate={setActivePage} />;
      case "about":
        return <About />;
      case "experience":
        return <Experience />;
      case "projects":
        return <Projects />;
      case "blog":
        return <Blog />;
      case "contact":
        return <Contact />;
      case "analytics":
        return <Analytics />;
      default:
        return <Home />;
    }
  };

  return (
    <Layout activePage={activePage} onPageChange={setActivePage}>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activePage}-${locale}`}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex-1 flex flex-col min-h-0 overflow-hidden"
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}

export default App;
