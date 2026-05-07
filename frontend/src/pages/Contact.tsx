import React, { useState } from "react";
import { useTranslation } from "../../lib/hooks/useTranslation";
import {
  Mail,
  MessageSquare,
  User,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

const Contact: React.FC = () => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData(e.currentTarget);
    formData.append("access_key", "ac899b83-2b9a-4333-afac-7c0048e1782d");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setStatus("error");
    }
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
      <section className="max-w-3xl mx-auto">
        <header>
          <h1 className="text-3xl md:text-4xl font-bold text-text-header mb-4">
            {t.contact.title}
          </h1>
          <p className="text-text mb-10 text-lg">{t.contact.p1}</p>
        </header>

        {status === "success" ? (
          <div className="bg-success/10 border border-success/30 p-8 rounded-2xl text-center animate-fade-in">
            <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-text-header mb-2">
              {t.contact.successTitle}
            </h2>
            <p className="text-text">{t.contact.successMessage}</p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-6 px-6 py-2 bg-success text-white rounded-lg hover:brightness-110 transition-all"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {status === "error" && (
              <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl flex items-center text-red-500 animate-fade-in">
                <AlertCircle className="w-5 h-5 mr-3 shrink-0" />
                <p className="text-sm font-medium">{t.contact.errorMessage}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-text opacity-70 ml-1">
                  {t.contact.formName}
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text opacity-50" />
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-border focus:border-accent rounded-xl outline-none transition-all text-text-header"
                    placeholder="John Doe"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-text opacity-70 ml-1">
                  {t.contact.formEmail}
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text opacity-50" />
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-border focus:border-accent rounded-xl outline-none transition-all text-text-header"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-text opacity-70 ml-1">
                {t.contact.formMessage}
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-5 w-4 h-4 text-text opacity-50" />
                <textarea
                  name="message"
                  required
                  rows={5}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-border focus:border-accent rounded-xl outline-none transition-all text-text-header resize-none"
                  placeholder="..."
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-4 bg-accent text-white rounded-xl font-bold hover:brightness-110 transition-all flex items-center justify-center shadow-lg shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "loading" ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <Send className="w-5 h-5 mr-2" />
              )}
              {t.contact.formSend}
            </button>
          </form>
        )}
      </section>
    </div>
  );
};

export default Contact;
