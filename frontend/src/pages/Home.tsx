import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../lib/hooks/useTranslation";
import { postPublic, fetchPublic } from "../../lib/api";
import { Send, Loader2, X } from "lucide-react";
import BotMessage from "../components/chat/BotMessage";
import { motion, AnimatePresence } from "framer-motion";
import { hapticFeedback } from "../../lib/haptic";
import { getSessionId } from "../../lib/session";
import SEO from "../components/layout/SEO";

interface Message {
  id?: number;
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
  isInitial?: boolean;
  shouldAnimate?: boolean;
  module?: string;
  category?: string;
}

interface HomeProps {
  previousPage?: string;
}

const Home: React.FC<HomeProps> = ({ previousPage = "home" }) => {
  const { t, locale } = useTranslation();
  const navigate = useNavigate();
  const sessionId = getSessionId();

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("portfolio-chat-history");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Strip shouldAnimate from saved messages so they don't re-type on refresh
        return parsed.map((m: Message) => ({ ...m, shouldAnimate: false }));
      } catch (e) {
        console.error("Failed to parse chat history:", e);
      }
    }
    return [
      {
        role: "assistant",
        content: t.home.welcome,
        isInitial: true,
        shouldAnimate: true,
      },
    ];
  });

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [hints, setHints] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<Message[]>([]);

  // Keep messagesRef in sync with messages state to avoid stale closures
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Fetch hints on mount or when previousPage changes
  useEffect(() => {
    const loadHints = async () => {
      try {
        const data = await fetchPublic<string[]>(
          `/chat/hints?page_id=${previousPage}&lang=${locale}`,
        );
        setHints(data);
      } catch (e) {
        console.error("Failed to fetch hints:", e);
      }
    };
    loadHints();
  }, [previousPage, locale]);

  // Polling for live chat sync
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isLive) {
      interval = setInterval(async () => {
        try {
          const data = await fetchPublic<{
            messages: Message[];
            is_active: boolean;
          }>(`/chat/sync/${sessionId}`);

          if (!data.is_active && isLive) {
            setIsLive(false);
          }

          setMessages((prev) => {
            const updated = [...prev];
            let changed = false;

            data.messages.forEach((dbMsg) => {
              // Check if we already have this message by ID
              const existingIdx = updated.findIndex((m) => m.id === dbMsg.id);
              if (existingIdx !== -1) return;

              // Check if it matches a local message without ID (to "claim" it)
              const matchIdx = updated.findIndex(
                (m) =>
                  !m.id &&
                  m.role === dbMsg.role &&
                  m.content.trim() === dbMsg.content.trim(),
              );

              if (matchIdx !== -1) {
                updated[matchIdx] = { ...updated[matchIdx], id: dbMsg.id };
                changed = true;
              } else {
                // It's a truly new message (likely from developer)
                updated.push({ ...dbMsg, shouldAnimate: true });
                changed = true;
              }
            });

            if (changed) hapticFeedback(10);
            return changed ? updated : prev;
          });
        } catch (e) {
          console.error("Sync error:", e);
        }
      }, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLive, sessionId]);

  // Unified suggestions logic
  const commandSuggestions = t.home.commands.list.filter((cmd) =>
    cmd.cmd.toLowerCase().startsWith(input.toLowerCase()),
  );

  const activeSuggestions = (
    input.startsWith("/")
      ? commandSuggestions.map((s) => ({
          text: s.cmd,
          subtext: s.desc,
          value: s.cmd,
          isCommand: true,
        }))
      : !input && isFocused && !isLoading
        ? [
            {
              text: t.home.newChat,
              subtext: t.home.commands.list.find((c) => c.cmd === "/clear")
                ?.desc,
              value: "/clear",
              isCommand: true,
            },
            ...t.home.suggestions.map((s) => ({
              text: s,
              subtext: undefined,
              value: s,
              isCommand: false,
            })),
          ]
        : []
  ).filter(() => !isLive); // Disable suggestions during live chat

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

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("portfolio-chat-history", JSON.stringify(messages));
  }, [messages]);

  // Scroll to bottom whenever messages change or loading state changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Use a MutationObserver to scroll to bottom when the height changes (e.g. during typewriter)
  useEffect(() => {
    if (!scrollRef.current) return;

    const observer = new MutationObserver(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    });

    observer.observe(scrollRef.current, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, []);

  const handleCommand = (cmd: string): boolean => {
    const cleanCmd = cmd.toLowerCase().trim();

    if (cleanCmd === "/clear" || cleanCmd === "/new") {
      handleNewChat();
      return true;
    }

    if (cleanCmd === "/help") {
      const helpContent = `${t.home.commands.help}\n\n${t.home.commands.list
        .map((item) => `- **${item.cmd}**: ${item.desc}`)
        .join(
          "\n",
        )}\n\n${t.home.commands.subjectsTitle}\n\n${t.home.commands.subjects
        .map((subject) => `- ${subject}`)
        .join("\n")}`;

      setMessages((prev) => [
        ...prev,
        { role: "user", content: cmd },
        { role: "assistant", content: helpContent, shouldAnimate: true },
      ]);
      return true;
    }

    // Navigation commands
    const navMatch = [
      "/about",
      "/experience",
      "/projects",
      "/blog",
      "/contact",
    ].find((n) => cleanCmd === n);

    if (navMatch) {
      navigate(navMatch);
      return true;
    }

    if (cleanCmd === "/live-chat" || cleanCmd === "/close-live-chat") {
      return false;
    }

    if (cleanCmd.startsWith("/")) {
      setMessages((prev) => [
        ...prev,
        { role: "user", content: cmd },
        {
          role: "assistant",
          content: t.home.commands.error,
          shouldAnimate: true,
        },
      ]);
      return true;
    }

    return false;
  };

  const handleSend = async (overrideMessage?: string) => {
    const userMessage = (overrideMessage || input).trim();
    if (!userMessage || isLoading) return;

    hapticFeedback(15);
    setInput("");

    // Check for slash commands first
    if (handleCommand(userMessage)) return;

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const data = await postPublic<
        {
          message: string;
          language: string;
          session_id: string;
          page_id: string;
          history: { role: string; content: string }[];
        },
        { reply: string; module?: string; category?: string; is_live: boolean }
      >("/chat", {
        message: userMessage,
        language: locale,
        session_id: sessionId,
        page_id: previousPage,
        history: messagesRef.current.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      });

      if (data.is_live) {
        setIsLive(true);
      } else {
        setIsLive(false);
      }

      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.reply,
            module: data.module,
            category: data.category,
          },
        ]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: t.home.errorRetry,
          shouldAnimate: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    hapticFeedback(25);
    setMessages([
      {
        role: "assistant",
        content: t.home.welcome,
        isInitial: true,
        shouldAnimate: true,
      },
    ]);
    localStorage.removeItem("portfolio-chat-history");
  };

  const handleFeedback = async (
    isHelpful: boolean,
    userMessage: string,
    assistantReply: string,
    module?: string,
    category?: string,
  ) => {
    try {
      await postPublic("/chat/feedback", {
        user_message: userMessage,
        assistant_reply: assistantReply,
        is_helpful: isHelpful,
        module,
        category,
      });
    } catch (error) {
      console.error("Feedback error:", error);
    }
  };

  return (
    <section className="flex-1 flex flex-col h-full overflow-hidden">
      <SEO />
      {/* Chat Messages Area - This scrolls */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth"
      >
        <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6 md:space-y-8">
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.4,
                  ease: [0.23, 1, 0.32, 1],
                  delay: msg.shouldAnimate ? 0 : 0.05,
                }}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "assistant" ? (
                  <BotMessage
                    content={msg.content}
                    isInitial={msg.isInitial}
                    skipTypewriter={!msg.shouldAnimate}
                    onLiveChatRequest={
                      msg.module === "fallback" && !isLive
                        ? () => handleSend("/live-chat")
                        : undefined
                    }
                    onFeedback={(isHelpful) => {
                      const userMsg =
                        idx > 0 ? messages[idx - 1].content : "initial";
                      handleFeedback(
                        isHelpful,
                        userMsg,
                        msg.content,
                        msg.module,
                        msg.category,
                      );
                    }}
                  />
                ) : (
                  <div className="bg-accent text-white p-4 rounded-none border-2 border-accent shadow-shadow max-w-2xl -translate-y-1 -translate-x-1">
                    <p className="leading-relaxed font-bold">{msg.content}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-accent-bg border-2 border-accent p-4 rounded-none shadow-shadow flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin text-accent" />
                <span className="text-sm text-text-header font-black uppercase tracking-widest">
                  {t.home.thinking}
                </span>
              </div>
            </motion.div>
          )}

          {/* Spacer */}
          <div className="h-4" />
        </div>
      </div>

      {/* Chat Input Area - Anchored at the bottom */}
      <div className="flex-none p-4 pt-0 pb-[calc(1rem+env(safe-area-inset-bottom))] md:p-8 md:pt-0 bg-bg border-t-4 border-border md:border-none md:bg-transparent">
        <div className="max-w-5xl mx-auto relative">
          {/* Contextual Hints Chips */}
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
                  id="chat-suggestions"
                >
                  {activeSuggestions.map((suggestion, idx) => (
                    <li
                      key={suggestion.value}
                      role="option"
                      aria-selected={idx === suggestionIndex}
                      onMouseEnter={() => setSuggestionIndex(idx)}
                      onClick={() => {
                        handleSend(suggestion.value);
                      }}
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
                // Delay blur to allow clicks on suggestions
                setTimeout(() => setIsFocused(false), 200);
              }}
              onKeyDown={handleKeyDown}
              placeholder={
                isLive ? t.home.liveChatPlaceholder : t.home.chatbotPlaceholder
              }
              aria-label={t.home.chatAriaLabel}
              aria-haspopup="listbox"
              aria-owns="chat-suggestions"
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
    </section>
  );
};

export default Home;
