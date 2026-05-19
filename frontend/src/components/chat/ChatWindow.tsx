import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import BotMessage from "./BotMessage";
import { Message } from "../../types/chat";
import { useTranslation } from "../../../lib/hooks/useTranslation";

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  isLive: boolean;
  handleSend: (msg: string) => void;
  handleFeedback: (
    isHelpful: boolean,
    userMsg: string,
    reply: string,
    module?: string,
    category?: string,
  ) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  isLoading,
  isLive,
  handleSend,
  handleFeedback,
}) => {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

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

  return (
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
        <div className="h-4" />
      </div>
    </div>
  );
};

export default ChatWindow;
