import React, { useState } from "react";
import Header from "./Header";
import Sidebar, { type PageId } from "./Sidebar";
import MeshBackground from "./MeshBackground";
import CommandPalette from "./CommandPalette";

interface LayoutProps {
  children: React.ReactNode;
  activePage: PageId;
  onPageChange: (page: PageId) => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  activePage,
  onPageChange,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-dvh bg-bg transition-colors duration-300 overflow-hidden relative">
      <CommandPalette onPageChange={onPageChange} />
      <a
        href="#main-content"
        className="absolute left-4 top-4 z-[100] px-4 py-2 bg-accent text-white rounded-lg -translate-y-[200%] focus:translate-y-0 transition-transform font-bold shadow-2xl"
      >
        Skip to content
      </a>

      <MeshBackground />

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        activePage={activePage}
        onPageChange={onPageChange}
      />

      <div className="flex flex-col flex-1 min-w-0 h-full relative z-10">
        <Header
          onMenuClick={toggleSidebar}
          onLogoClick={() => onPageChange("home")}
        />

        <main
          id="main-content"
          className="flex-1 overflow-hidden flex flex-col"
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
