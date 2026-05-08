import React, { useState } from "react";
import Header from "./Header";
import Sidebar, { type PageId } from "./Sidebar";

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
    <div className="flex h-dvh bg-bg transition-colors duration-300 overflow-hidden">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        activePage={activePage}
        onPageChange={onPageChange}
      />

      <div className="flex flex-col flex-1 min-w-0 h-full relative">
        <Header onMenuClick={toggleSidebar} />

        <main className="flex-1 overflow-hidden flex flex-col">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
