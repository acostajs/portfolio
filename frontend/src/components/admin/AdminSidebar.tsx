import React from "react";
import {
  User,
  Briefcase,
  FolderKanban,
  Newspaper,
  MessageSquare,
  BarChart3,
} from "lucide-react";
import { hapticFeedback } from "../../../lib/haptic";
import { useTranslation } from "../../../lib/hooks/useTranslation";

export type AdminTab =
  | "about"
  | "experience"
  | "projects"
  | "blog"
  | "chatbot"
  | "analytics";

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
}

const TabButton: React.FC<{
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
}> = ({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={() => {
      hapticFeedback(5);
      onClick();
    }}
    className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-xl transition-all ${
      active
        ? "bg-accent text-white shadow-lg shadow-accent/20"
        : "text-text hover:bg-white/5 hover:text-text-header"
    }`}
  >
    <Icon className="w-5 h-5" />
    <span className="hidden md:block font-medium">{label}</span>
  </button>
);

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const { t } = useTranslation();

  return (
    <nav className="w-16 md:w-64 flex-none border-r border-border bg-white/5 flex flex-col py-4">
      <TabButton
        active={activeTab === "about"}
        onClick={() => setActiveTab("about")}
        icon={User}
        label={t.admin.tabs.about}
      />
      <TabButton
        active={activeTab === "experience"}
        onClick={() => setActiveTab("experience")}
        icon={Briefcase}
        label={t.admin.tabs.experience}
      />
      <TabButton
        active={activeTab === "projects"}
        onClick={() => setActiveTab("projects")}
        icon={FolderKanban}
        label={t.admin.tabs.projects}
      />
      <TabButton
        active={activeTab === "blog"}
        onClick={() => setActiveTab("blog")}
        icon={Newspaper}
        label={t.admin.tabs.blog}
      />
      <TabButton
        active={activeTab === "chatbot"}
        onClick={() => setActiveTab("chatbot")}
        icon={MessageSquare}
        label={t.admin.tabs.chatbot}
      />
      <TabButton
        active={activeTab === "analytics"}
        onClick={() => setActiveTab("analytics")}
        icon={BarChart3}
        label={t.admin.tabs.analytics}
      />
    </nav>
  );
};

export default AdminSidebar;
