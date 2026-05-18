import React from "react";
import { LayoutDashboard, LogOut } from "lucide-react";
import { useTranslation } from "../../../lib/hooks/useTranslation";

interface AdminHeaderProps {
  onLogout: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onLogout }) => {
  const { t } = useTranslation();

  return (
    <header className="flex-none p-4 md:p-6 border-b-4 border-border bg-bg flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-accent border-2 border-border shadow-shadow">
          <LayoutDashboard className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-black uppercase italic tracking-tighter text-text-header">
          {t.admin.dashboardTitle}
        </h1>
      </div>
      <button
        onClick={onLogout}
        className="flex items-center gap-2 px-4 py-2 bg-error-bg text-error border-2 border-border shadow-shadow text-xs font-black uppercase tracking-widest hover:-translate-y-1 hover:-translate-x-1 active:translate-y-0 active:translate-x-0 transition-all rounded-none"
      >
        <LogOut className="w-4 h-4" />
        {t.admin.logoutButton}
      </button>
    </header>
  );
};

export default AdminHeader;
