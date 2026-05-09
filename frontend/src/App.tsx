import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Experience from "./pages/Experience";
import Projects from "./pages/Projects";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import { type PageId } from "./components/layout/Sidebar";
import { useTranslation } from "../lib/hooks/useTranslation";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const { locale } = useTranslation();
  const location = useLocation();

  // Map pathname to PageId for Sidebar highlighting
  const getActivePage = (pathname: string): PageId => {
    const path = pathname.split("/")[1] || "home";
    return path as PageId;
  };

  const activePage = getActivePage(location.pathname);

  return (
    <Layout activePage={activePage}>
      <Toaster richColors position="top-center" />
      <AnimatePresence mode="wait">
        <motion.div
          key={`${location.pathname}-${locale}`}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex-1 flex flex-col min-h-0 overflow-hidden"
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}

export default App;
