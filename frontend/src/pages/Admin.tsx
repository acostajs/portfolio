import React, { useState, useEffect } from "react";
import AdminHeader from "../components/admin/AdminHeader";
import AdminSidebar, { type AdminTab } from "../components/admin/AdminSidebar";
import Login from "../components/admin/Login";
import AboutManager from "../components/admin/AboutManager";
import ExperienceManager from "../components/admin/ExperienceManager";
import ProjectsManager from "../components/admin/ProjectsManager";
import BlogManager from "../components/admin/BlogManager";
import ChatbotManager from "../components/admin/ChatbotManager";
import AnalyticsManager from "../components/admin/AnalyticsManager";
import { hapticFeedback } from "../../lib/haptic";

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if token exists.
    return !!localStorage.getItem("admin-token");
  });

  const [activeTab, setActiveTab] = useState<AdminTab>("about");

  const handleLogout = () => {
    hapticFeedback(20);
    setIsAuthenticated(false);
    localStorage.removeItem("admin-token");
  };

  // Verify token on mount to prevent stale sessions
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("admin-token");
      if (!token) return;

      try {
        const response = await fetch("/api/v1/admin/verify", {
          headers: { "X-Admin-Token": token },
        });
        if (!response.ok) {
          handleLogout();
        }
      } catch (err) {
        console.error("Token verification failed:", err);
      }
    };
    void verifyToken();
  }, []);

  const handleLogin = (password: string) => {
    setIsAuthenticated(true);
    localStorage.setItem("admin-token", password);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-bg">
      <AdminHeader onLogout={handleLogout} />

      <div className="flex-1 flex overflow-hidden">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
          <div className="max-w-4xl mx-auto">
            {activeTab === "about" && <AboutManager />}
            {activeTab === "experience" && <ExperienceManager />}
            {activeTab === "projects" && <ProjectsManager />}
            {activeTab === "blog" && <BlogManager />}
            {activeTab === "chatbot" && <ChatbotManager />}
            {activeTab === "analytics" && <AnalyticsManager />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;
