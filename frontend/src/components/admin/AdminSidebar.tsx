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
    className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-none transition-all font-black uppercase tracking-widest text-xs border-2 ${
      active
        ? "bg-accent text-white border-border shadow-shadow -translate-y-1 -translate-x-1"
        : "text-text border-transparent hover:bg-accent-bg hover:border-border hover:-translate-y-1 hover:-translate-x-1"
    }`}
  >
    <Icon className="w-5 h-5" />
    <span className="hidden md:block">{label}</span>
  </button>
);

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const { t } = useTranslation();

  return (
    <nav className="w-16 md:w-64 flex-none border-r-4 border-border bg-bg flex flex-col py-6 gap-2">
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
