import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "../../lib/hooks/useTranslation";
import { Send, Loader2 } from "lucide-react";
import BotMessage from "../components/chat/BotMessage";

interface Message {
  role: "user" | "assistant";
  content: string;
  isInitial?: boolean;
}

const Home: React.FC = () => {
  const { t, locale } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: t.home.welcome,
      isInitial: true,
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
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
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Chat Messages Area - This scrolls */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth"
      >
        <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6 md:space-y-8">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "assistant" ? (
                <BotMessage
                  content={msg.content}
                  isInitial={msg.isInitial}
                  features={msg.isInitial ? t.home.features : undefined}
                  subwelcome={msg.isInitial ? t.home.subwelcome : undefined}
                  closing={msg.isInitial ? t.home.closing : undefined}
                />
              ) : (
                <div className="bg-accent text-white p-4 rounded-2xl rounded-tr-none shadow-lg max-w-2xl animate-slide-in-right">
                  <p className="leading-relaxed">{msg.content}</p>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-white/5 border border-border p-4 rounded-2xl rounded-tl-none shadow-xl backdrop-blur-sm flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin text-accent" />
                <span className="text-sm text-text opacity-70">
                  Thinking...
                </span>
              </div>
            </div>
          )}

          {/* Spacer */}
          <div className="h-4" />
        </div>
      </div>

      {/* Chat Input Area - Anchored at the bottom */}
      <div className="flex-none p-4 pt-0 pb-[calc(1rem+env(safe-area-inset-bottom))] md:p-8 md:pt-0 bg-bg/80 backdrop-blur-sm border-t border-border/50 md:border-none md:bg-transparent">
        <div className="max-w-5xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="relative group"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.home.chatbotPlaceholder}
              disabled={isLoading}
              className="w-full pl-6 pr-14 py-4 md:py-5 bg-white/5 border border-border focus:border-accent rounded-2xl outline-none transition-all shadow-2xl backdrop-blur-md placeholder:text-text/40 placeholder:text-xs md:placeholder:text-base text-text-header disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
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
