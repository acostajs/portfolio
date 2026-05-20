import React, { useState, useEffect, Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import Sidebar, { type PageId } from "./Sidebar";
import { useTranslation } from "../../../lib/hooks/useTranslation";
import { ArrowLeft } from "lucide-react";

const MeshBackground = lazy(() => import("./MeshBackground"));
const CommandPalette = lazy(() => import("./CommandPalette"));
const PortfolioCLI = lazy(() => import("../ui/PortfolioCLI"));

interface LayoutProps {
  children: React.ReactNode;
  activePage: PageId;
  hideSidebar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  activePage,
  hideSidebar = false,
}) => {
  const { t } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex h-dvh bg-bg transition-colors duration-300 overflow-hidden relative">
      <Suspense fallback={null}>
        {isCommandPaletteOpen && (
          <CommandPalette onClose={() => setIsCommandPaletteOpen(false)} />
        )}
        <PortfolioCLI />
      </Suspense>
      <a
        href="#main-content"
        className="absolute left-4 top-4 z-[100] px-4 py-2 bg-accent text-white rounded-none border-2 border-border -translate-y-[200%] focus:translate-y-0 transition-transform font-black uppercase tracking-widest text-xs shadow-shadow"
      >
        {t.common.skipToContent}
      </a>

      <Suspense fallback={<div className="fixed inset-0 bg-bg -z-10" />}>
        <MeshBackground />
      </Suspense>

      {!hideSidebar && (
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
          activePage={activePage}
        />
      )}

      <div className="flex flex-col flex-1 min-w-0 h-full relative z-10">
        <Header onMenuClick={toggleSidebar} hideMenuButton={hideSidebar} />

        <main
          id="main-content"
          className="flex-1 overflow-hidden flex flex-col"
        >
          {activePage !== "home" && (
            <div className="flex-none px-4 md:px-8 pt-4 md:pt-6">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-bg border-2 border-border text-text-header font-black uppercase tracking-widest text-[10px] hover:bg-accent hover:text-white transition-colors shadow-shadow active:scale-95"
              >
                <ArrowLeft className="w-3 h-3" />
                {t.nav.home}
              </Link>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
