import React from "react";
import { useTranslation } from "../../lib/hooks/useTranslation";
import { Send } from "lucide-react";

const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Chat Messages Area - This scrolls */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
          {/* Bot Message Example */}
          <div className="flex items-start max-w-3xl">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-border mr-4 mt-1 shrink-0">
              <img
                src="/avatar.jpeg"
                alt="Assistant"
                className="w-full h-full object-cover grayscale"
              />
            </div>
            <div className="bg-white/5 border border-border p-6 rounded-2xl rounded-tl-none shadow-xl backdrop-blur-sm">
              <p className="text-text-header font-medium mb-4 leading-relaxed">
                {t.home.welcome}
              </p>

              <div className="space-y-4">
                <p className="text-sm text-text font-semibold uppercase tracking-wider opacity-70">
                  {t.home.subwelcome}
                </p>
                <ul className="space-y-2">
                  {t.home.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center text-text-header"
                    >
                      <span className="w-1.5 h-1.5 bg-accent rounded-full mr-3 shadow-[0_0_8px_rgba(9,105,218,0.8)]"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-text mt-8 leading-relaxed italic opacity-80">
                {t.home.closing}
              </p>
            </div>
          </div>

          {/* Spacer to allow scrolling past the input bar area if needed, 
              though flex-col handles it, extra padding helps */}
          <div className="h-4" />
        </div>
      </div>

      {/* Chat Input Area - This is fixed at the bottom of the Home component */}
      <div className="p-4 md:p-8 pt-0">
        <div className="max-w-5xl mx-auto">
          <div className="relative group">
            <input
              type="text"
              placeholder={t.home.chatbotPlaceholder}
              className="w-full pl-6 pr-14 py-4 md:py-5 bg-white/5 border border-border focus:border-accent rounded-2xl outline-none transition-all shadow-2xl backdrop-blur-md placeholder:text-text/40 text-text-header"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-white/10 text-text hover:text-white hover:bg-accent rounded-xl transition-all shadow-inner">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
