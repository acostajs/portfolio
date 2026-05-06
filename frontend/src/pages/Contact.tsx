import React from "react";
import { useTranslation } from "../../lib/hooks/useTranslation";
import { Mail, MessageSquare, User, Send } from "lucide-react";

const Contact: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-text-header mb-4">
          {t.contact.title}
        </h1>
        <p className="text-text mb-10 text-lg">{t.contact.p1}</p>

        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-text opacity-70 ml-1">
                {t.contact.formName}
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text opacity-50" />
                <input
                  type="text"
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
                rows={5}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-border focus:border-accent rounded-xl outline-none transition-all text-text-header resize-none"
                placeholder="..."
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-accent text-white rounded-xl font-bold hover:brightness-110 transition-all flex items-center justify-center shadow-lg shadow-accent/20"
          >
            <Send className="w-5 h-5 mr-2" />
            {t.contact.formSend}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
