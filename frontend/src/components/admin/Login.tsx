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
          "X-Admin-Password": password,
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
      <div className="w-full max-w-md bg-white/5 border border-border p-8 rounded-3xl shadow-2xl backdrop-blur-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-2xl font-bold text-text-header">
            {t.admin.loginTitle}
          </h1>
          <p className="text-text opacity-60 text-sm">
            {t.admin.loginSubtitle}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t.admin.passwordPlaceholder}
            className="w-full px-4 py-3 bg-white/5 border border-border focus:border-accent rounded-xl outline-none text-text-header"
            autoFocus
          />
          <button
            type="submit"
            className="w-full py-3 bg-accent text-white rounded-xl font-bold hover:brightness-110 transition-all shadow-lg shadow-accent/20"
          >
            {t.admin.loginButton}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
