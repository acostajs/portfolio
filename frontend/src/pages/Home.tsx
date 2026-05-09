import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../lib/hooks/useTranslation";
import {
  Send,
  Loader2,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw,
} from "lucide-react";
import BotMessage from "../components/chat/BotMessage";
import { motion, AnimatePresence } from "framer-motion";
import { hapticFeedback } from "../../lib/haptic";
import { useSpeech } from "../../lib/hooks/useSpeech";
import SEO from "../components/layout/SEO";

interface Message {
  role: "user" | "assistant";
  content: string;
  isInitial?: boolean;
  shouldAnimate?: boolean;
}

const Home: React.FC = () => {
  const { t, locale } = useTranslation();
  const navigate = useNavigate();
  const {
    isListening,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    error: speechError,
  } = useSpeech();
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
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
  const [isFocused, setIsFocused] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<Message[]>([]);

  // Keep messagesRef in sync with messages state to avoid stale closures
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Unified suggestions logic
  const commandSuggestions = t.home.commands.list.filter((cmd) =>
    cmd.cmd.toLowerCase().startsWith(input.toLowerCase()),
  );

  const activeSuggestions = input.startsWith("/")
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
            subtext: t.home.commands.list.find((c) => c.cmd === "/clear")?.desc,
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
      : [];

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

    if (cleanCmd === "/clear") {
      setMessages([
        {
          role: "assistant",
          content: t.home.commands.clearSuccess,
          shouldAnimate: true,
        },
      ]);
      localStorage.removeItem("portfolio-chat-history");
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
      const response = await fetch("/api/v1/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          language: locale,
          history: messagesRef.current.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply, shouldAnimate: true },
      ]);

      if (isVoiceEnabled) {
        // Use a small delay to let the UI update first
        setTimeout(() => speak(data.reply, locale), 500);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again later.",
          shouldAnimate: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePTTStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    hapticFeedback(20);
    setIsVoiceEnabled(true);
    startListening(locale, (text) => {
      handleSend(text);
    });
  };

  const handlePTTEnd = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (isListening) {
      hapticFeedback(10);
      stopListening();
    }
  };

  const toggleVoiceOutput = () => {
    hapticFeedback(10);
    if (isVoiceEnabled) {
      stopSpeaking();
      setIsVoiceEnabled(false);
    } else {
      setIsVoiceEnabled(true);
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
  ) => {
    try {
      await fetch("/api/v1/chat/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_message: userMessage,
          assistant_reply: assistantReply,
          is_helpful: isHelpful,
        }),
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
                    features={msg.isInitial ? t.home.features : undefined}
                    subwelcome={msg.isInitial ? t.home.subwelcome : undefined}
                    closing={msg.isInitial ? t.home.closing : undefined}
                    onFeedback={(isHelpful) => {
                      const userMsg =
                        idx > 0 ? messages[idx - 1].content : "initial";
                      handleFeedback(isHelpful, userMsg, msg.content);
                    }}
                  />
                ) : (
                  <div className="bg-accent text-white p-4 rounded-2xl rounded-tr-none shadow-lg max-w-2xl border border-white/10">
                    <p className="leading-relaxed">{msg.content}</p>
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
              <div className="bg-white/5 border border-border p-4 rounded-2xl rounded-tl-none shadow-xl backdrop-blur-sm flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin text-accent" />
                <span className="text-sm text-text opacity-70">
                  Thinking...
                </span>
              </div>
            </motion.div>
          )}

          {/* Spacer */}
          <div className="h-4" />
        </div>
      </div>

      {/* Chat Input Area - Anchored at the bottom */}
      <div className="flex-none p-4 pt-0 pb-[calc(1rem+env(safe-area-inset-bottom))] md:p-8 md:pt-0 bg-bg/80 backdrop-blur-sm border-t border-border/50 md:border-none md:bg-transparent">
        <div className="max-w-5xl mx-auto relative">
          {/* Speech Status Indicator */}
          <AnimatePresence>
            {(isListening || speechError) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full left-0 mb-4 flex items-center gap-2 px-3 py-1.5 bg-sidebar-bg/90 backdrop-blur-md border border-border rounded-full shadow-lg z-10"
              >
                {isListening ? (
                  <>
                    <div className="w-2 h-2 bg-error rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-text">
                      Listening...
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-error rounded-full" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-error">
                      Speech Error: {speechError}
                    </span>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-full left-0 w-full mb-4 bg-sidebar-bg/90 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden z-50"
              >
                <div className="px-4 py-2 border-b border-border bg-white/5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-text opacity-40">
                    {input.startsWith("/") ? "Commands" : "Suggestions"}
                  </span>
                </div>
                <ul className="py-2 max-h-60 overflow-y-auto custom-scrollbar">
                  {activeSuggestions.map((suggestion, idx) => (
                    <li
                      key={suggestion.value}
                      onMouseEnter={() => setSuggestionIndex(idx)}
                      onClick={() => {
                        handleSend(suggestion.value);
                      }}
                      className={`px-6 py-3 cursor-pointer transition-colors flex items-center justify-between group ${
                        idx === suggestionIndex
                          ? "bg-accent text-white"
                          : "text-text hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center">
                        {suggestion.isCommand && (
                          <span className="w-1.5 h-1.5 rounded-full bg-accent mr-3 group-hover:bg-white transition-colors" />
                        )}
                        <span
                          className={`font-medium ${suggestion.isCommand ? "font-mono" : ""}`}
                        >
                          {suggestion.text}
                        </span>
                      </div>
                      {suggestion.subtext && (
                        <span
                          className={`text-xs ${
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
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 z-10">
              <button
                type="button"
                onMouseDown={handlePTTStart}
                onMouseUp={handlePTTEnd}
                onMouseLeave={handlePTTEnd}
                onTouchStart={handlePTTStart}
                onTouchEnd={handlePTTEnd}
                className={`p-2 rounded-xl transition-all ${
                  isListening
                    ? "bg-error text-white animate-pulse"
                    : "text-text hover:text-text-header hover:bg-white/5"
                }`}
                title="Hold to Speak"
              >
                {isListening ? (
                  <Mic className="w-5 h-5" />
                ) : (
                  <MicOff className="w-5 h-5" />
                )}
              </button>
              <button
                type="button"
                onClick={toggleVoiceOutput}
                className={`p-2 rounded-xl transition-all ${
                  isVoiceEnabled
                    ? "text-accent bg-accent/10"
                    : "text-text opacity-40 hover:opacity-100 hover:bg-white/5"
                }`}
                title={isVoiceEnabled ? "Mute Assistant" : "Unmute Assistant"}
              >
                {isVoiceEnabled ? (
                  <Volume2 className="w-5 h-5" />
                ) : (
                  <VolumeX className="w-5 h-5" />
                )}
              </button>
              <button
                type="button"
                onClick={handleNewChat}
                className="p-2 rounded-xl text-text opacity-70 hover:opacity-100 hover:bg-white/5 transition-all"
                title={t.home.newChat}
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
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
              placeholder={t.home.chatbotPlaceholder}
              aria-label="Chat message"
              disabled={isLoading}
              className="w-full pl-32 pr-14 py-4 md:py-5 bg-white/5 border border-border focus:border-accent rounded-2xl outline-none transition-all shadow-2xl backdrop-blur-md placeholder:text-text/40 placeholder:text-xs md:placeholder:text-base text-text-header disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-white/10 text-text hover:text-white hover:bg-accent rounded-xl transition-all shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
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
