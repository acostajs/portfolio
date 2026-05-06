import React from "react";
import { useTranslation } from "../../lib/hooks/useTranslation";
import { Send, Bot } from "lucide-react";

const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="flex flex-col h-full max-h-[calc(100vh-8rem)]">
      {/* Welcome Section */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-text-header mb-2">
          {t.home.welcome}
        </h1>
        <p className="text-text max-w-2xl mx-auto">
          {t.common.role} @ {t.common.location}
        </p>
      </div>

      {/* Chatbot Interface Shell */}
      <div className="flex-1 flex flex-col bg-code-bg/50 rounded-2xl border border-border overflow-hidden shadow-lg backdrop-blur-sm">
        {/* Chat Header */}
        <div className="px-6 py-4 bg-accent/5 border-b border-border flex items-center">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center mr-3">
            <Bot className="text-white w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-header uppercase tracking-wider">
              Assistant
            </h3>
            <div className="flex items-center text-xs text-green-500 font-medium">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
              Online
            </div>
          </div>
        </div>

        {/* Chat Messages Area (Scrollable) */}
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          {/* Bot Message Example */}
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center mr-3 mt-1 shrink-0">
              <Bot className="text-accent w-5 h-5" />
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-tl-none border border-border max-w-[80%] shadow-sm">
              <p className="text-text leading-relaxed">{t.home.welcome}</p>
            </div>
          </div>
        </div>

        {/* Chat Input Area */}
        <div className="p-4 border-t border-border bg-white/50 dark:bg-gray-900/50">
          <div className="relative max-w-4xl mx-auto">
            <input
              type="text"
              placeholder={t.home.chatbotPlaceholder}
              className="w-full pl-6 pr-12 py-4 bg-bg border-2 border-border focus:border-accent rounded-xl outline-none transition-all shadow-sm"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors shadow-md">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
