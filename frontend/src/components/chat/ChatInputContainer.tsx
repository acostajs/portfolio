import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, X } from "lucide-react";
import { useTranslation } from "../../../lib/hooks/useTranslation";
import { hapticFeedback } from "../../../lib/haptic";
import { Suggestion } from "../../types/chat";

interface ChatInputContainerProps {
  input: string;
  setInput: (val: string) => void;
  isLoading: boolean;
  isLive: boolean;
  setIsFocused: (val: boolean) => void;
  suggestionIndex: number;
  setSuggestionIndex: (val: number) => void;
  hints: string[];
  activeSuggestions: Suggestion[];
  handleSend: (override?: string) => void;
}

const ChatInputContainer: React.FC<ChatInputContainerProps> = ({
  input,
  setInput,
  isLoading,
  isLive,
  setIsFocused,
  suggestionIndex,
  setSuggestionIndex,
  hints,
  activeSuggestions,
  handleSend,
}) => {
  const { t } = useTranslation();

  const showSuggestions = activeSuggestions.length > 0;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showSuggestions) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        hapticFeedback(5);
        setSuggestionIndex((prev) => (prev + 1) % activeSuggestions.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        hapticFeedback(5);
        setSuggestionIndex(
          (prev) =>
            (prev - 1 + activeSuggestions.length) % activeSuggestions.length,
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        hapticFeedback(10);
        setIsFocused(false);
        handleSend(activeSuggestions[suggestionIndex].value);
      } else if (e.key === "Tab") {
        e.preventDefault();
        hapticFeedback(10);
        setInput(activeSuggestions[suggestionIndex].value);
      } else if (e.key === "Escape") {
        setIsFocused(false);
      }
    }
  };

  return (
    <div className="flex-none p-4 pt-0 pb-[calc(1rem+env(safe-area-inset-bottom))] md:p-8 md:pt-0 bg-bg border-t-4 border-border md:border-none md:bg-transparent">
      <div className="max-w-5xl mx-auto relative">
        <AnimatePresence>
          {!showSuggestions && hints.length > 0 && !isLive && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex flex-wrap gap-2 mb-4"
            >
              {hints.map((hint, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(hint)}
                  className="px-3 py-1.5 bg-accent-bg border-2 border-border text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-accent hover:text-white hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all shadow-shadow active:translate-y-0 active:translate-x-0"
                >
                  {hint}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-full left-0 w-full mb-4 bg-bg border-4 border-border rounded-none shadow-shadow overflow-hidden z-50"
            >
              <div className="px-4 py-2 border-b-4 border-border bg-accent-bg">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-header">
                  {input.startsWith("/")
                    ? t.home.terminalCommands
                    : t.home.suggestedQueries}
                </span>
              </div>
              <ul
                className="py-2 max-h-60 overflow-y-auto custom-scrollbar"
                role="listbox"
              >
                {activeSuggestions.map((suggestion, idx) => (
                  <li
                    key={suggestion.value}
                    role="option"
                    aria-selected={idx === suggestionIndex}
                    onMouseEnter={() => setSuggestionIndex(idx)}
                    onClick={() => handleSend(suggestion.value)}
                    className={`px-6 py-3 cursor-pointer transition-colors flex items-center justify-between group border-y-2 border-transparent ${
                      idx === suggestionIndex
                        ? "bg-accent text-white border-accent"
                        : "text-text hover:bg-accent-bg hover:border-accent/10"
                    }`}
                  >
                    <div className="flex items-center">
                      {suggestion.isCommand && (
                        <span className="w-2 h-2 bg-accent mr-3 group-hover:bg-white transition-colors" />
                      )}
                      <span
                        className={`font-black uppercase tracking-tight ${suggestion.isCommand ? "font-mono" : ""}`}
                      >
                        {suggestion.text}
                      </span>
                    </div>
                    {suggestion.subtext && (
                      <span
                        className={`text-[10px] font-mono uppercase ${
                          idx === suggestionIndex
                            ? "text-white/80"
                            : "text-text/60"
                        }`}
                      >
                        {suggestion.subtext}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative group"
        >
          <AnimatePresence>
            {isLive && (
              <motion.button
                type="button"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onClick={() => handleSend("/close-live-chat")}
                className="absolute -top-12 right-0 flex items-center gap-2 px-3 py-1.5 bg-danger text-white font-black uppercase tracking-widest text-[10px] border-2 border-border shadow-shadow hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all active:translate-y-0 active:translate-x-0"
              >
                <X className="w-3 h-3" />
                {t.home.closeLiveChat}
              </motion.button>
            )}
          </AnimatePresence>
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setSuggestionIndex(0);
            }}
            onFocus={() => {
              hapticFeedback(5);
              setIsFocused(true);
              setSuggestionIndex(0);
            }}
            onBlur={() => {
              setTimeout(() => setIsFocused(false), 200);
            }}
            onKeyDown={handleKeyDown}
            placeholder={
              isLive ? t.home.liveChatPlaceholder : t.home.chatbotPlaceholder
            }
            aria-label={t.home.chatAriaLabel}
            disabled={isLoading}
            className={`w-full pl-6 pr-16 py-4 md:py-6 bg-accent-bg border-4 border-border focus:border-accent focus:shadow-shadow rounded-none outline-none transition-all shadow-shadow placeholder:text-text/40 placeholder:text-xs md:placeholder:text-sm text-text-header disabled:opacity-50 font-mono font-bold ${
              isLive ? "border-accent ring-2 ring-accent/20" : ""
            }`}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            aria-label={t.home.sendAriaLabel}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-accent text-white border-2 border-border hover:-translate-y-0.5 hover:-translate-x-0.5 active:translate-y-0 active:translate-x-0 rounded-none transition-all shadow-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInputContainer;
