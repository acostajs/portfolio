import React from "react";
import { LayoutDashboard, LogOut } from "lucide-react";
import { useTranslation } from "../../../lib/hooks/useTranslation";

interface AdminHeaderProps {
  onLogout: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onLogout }) => {
  const { t } = useTranslation();

  return (
    <header className="flex-none p-4 md:p-6 border-b border-border bg-white/5 backdrop-blur-md flex items-center justify-between">
      <div className="flex items-center gap-3">
        <LayoutDashboard className="w-6 h-6 text-accent" />
        <h1 className="text-xl font-bold text-text-header">
          {t.admin.dashboardTitle}
        </h1>
      </div>
      <button
        onClick={onLogout}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text hover:text-error transition-colors"
      >
        <LogOut className="w-4 h-4" />
        {t.admin.logoutButton}
      </button>
    </header>
  );
};

export default AdminHeader;
