import React, { useState } from "react";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { hapticFeedback } from "../../../lib/haptic";
import { useTranslation } from "../../../lib/hooks/useTranslation";

interface LoginProps {
  onLogin: (password: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const { t } = useTranslation();
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    hapticFeedback(10);

    try {
      const response = await fetch("/api/v1/admin/verify", {
        headers: {
          "X-Admin-Token": password,
        },
      });

      if (response.ok) {
        onLogin(password);
        toast.success("Welcome, Admin");
      } else {
        toast.error("Invalid password");
      }
    } catch (err) {
      console.error(err);
      toast.error("Connection error");
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-bg border-4 border-border p-8 rounded-none shadow-shadow">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-accent-bg border-2 border-accent rounded-none flex items-center justify-center mb-4 shadow-shadow -translate-y-2">
            <Lock className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-3xl font-black text-text-header uppercase italic tracking-tighter">
            {t.admin.loginTitle}
          </h1>
          <p className="text-text-muted font-mono font-bold text-xs uppercase mt-2">
            {t.admin.loginSubtitle}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t.admin.passwordPlaceholder}
            className="w-full px-4 py-4 bg-accent-bg border-4 border-border focus:border-accent rounded-none outline-none text-text-header font-bold shadow-shadow"
            autoFocus
          />
          <button
            type="submit"
            className="w-full py-4 bg-accent text-white rounded-none border-4 border-border font-black uppercase tracking-widest hover:-translate-y-1 hover:-translate-x-1 active:translate-y-0 active:translate-x-0 transition-all shadow-shadow"
          >
            {t.admin.loginButton}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
