import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex min-h-screen bg-bg transition-colors duration-300">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <div className="flex flex-col flex-1 min-w-0">
        <Header onMenuClick={toggleSidebar} />

        <main className="flex-1 mt-16 p-4 md:p-8 lg:p-12 overflow-x-hidden">
          <div className="max-w-5xl mx-auto h-full">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
