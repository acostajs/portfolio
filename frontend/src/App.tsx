import { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import Layout from "./components/layout/Layout";
import { type PageId } from "./components/layout/Sidebar";
import { useTranslation } from "../lib/hooks/useTranslation";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSkeleton, CardSkeleton } from "./components/ui/Skeleton";

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

  // Map pathname to PageId for Sidebar highlighting
  const getActivePage = (pathname: string): PageId => {
    const path = pathname.split("/")[1] || "home";
    return path as PageId;
  };

  const activePage = getActivePage(location.pathname);
  const isHideSidebar = location.pathname.startsWith("/admin");

  // Determine which skeleton to show based on the route
  const getFallback = () => {
    if (location.pathname === "/" || location.pathname === "/home") {
      return (
        <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
          <MessageSkeleton />
        </div>
      );
    }
    if (location.pathname === "/blog" || location.pathname === "/projects") {
      return (
        <div className="max-w-5xl mx-auto p-6 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      );
    }
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
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
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/experience" element={<Experience />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </Suspense>
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}

export default App;
