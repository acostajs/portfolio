import { Suspense, lazy, useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import Layout from "./components/layout/Layout";
import { type PageId } from "./components/layout/Sidebar";
import { useTranslation } from "../lib/hooks/useTranslation";
import { motion, AnimatePresence } from "framer-motion";
import PageLoader from "./components/ui/PageLoader";

// Lazy load pages
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Experience = lazy(() => import("./pages/Experience"));
const Projects = lazy(() => import("./pages/Projects"));
const Blog = lazy(() => import("./pages/Blog"));
const Contact = lazy(() => import("./pages/Contact"));
const Admin = lazy(() => import("./pages/Admin"));

function App() {
  const { locale } = useTranslation();
  const location = useLocation();
  const [previousPage, setPreviousPage] = useState<PageId>("home");

  // Map pathname to PageId for Sidebar highlighting
  const getActivePage = (pathname: string): PageId => {
    const path = pathname.split("/")[1] || "home";
    return path as PageId;
  };

  const activePage = getActivePage(location.pathname);
  const isHideSidebar = location.pathname.startsWith("/admin");

  // Track the most recent public non-home page to provide context to the Chatbot
  useEffect(() => {
    if (activePage !== "home" && !location.pathname.startsWith("/admin")) {
      // Wrap in a microtask to avoid "setState synchronously within an effect" warning
      void Promise.resolve().then(() => {
        setPreviousPage(activePage);
      });
    }
  }, [activePage, location.pathname]);

  // Determine which loader to show based on the route
  const getFallback = () => {
    return <PageLoader />;
  };

  return (
    <Layout activePage={activePage} hideSidebar={isHideSidebar}>
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
          <Suspense fallback={getFallback()}>
            <Routes location={location}>
              <Route path="/" element={<Home previousPage={previousPage} />} />
              <Route path="/about" element={<About />} />
              <Route path="/experience" element={<Experience />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<Home previousPage={previousPage} />} />
            </Routes>
          </Suspense>
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}

export default App;
