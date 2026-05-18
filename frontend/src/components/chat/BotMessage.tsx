import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, ThumbsDown, Check, MessageSquare } from "lucide-react";
import ProgressiveImage from "./ProgressiveImage";
import { useTranslation } from "../../../lib/hooks/useTranslation";

import SharedMarkdown from "../ui/SharedMarkdown";
import Typewriter from "../ui/Typewriter";

interface BotMessageProps {
  content: string;
  isInitial?: boolean;
  skipTypewriter?: boolean;
  onFeedback?: (isHelpful: boolean) => void;
  onLiveChatRequest?: () => void;
}

const BotMessage: React.FC<BotMessageProps> = ({
  content,
  skipTypewriter,
  onFeedback,
  onLiveChatRequest,
}) => {
  const { t } = useTranslation();
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [isTypingComplete, setIsTypingComplete] = useState(!!skipTypewriter);

  const handleFeedback = (isHelpful: boolean) => {
    setFeedbackGiven(true);
    if (onFeedback) onFeedback(isHelpful);
  };

  return (
    <div className="flex items-start max-w-3xl">
      <motion.div
        initial={false}
        animate={
          !isTypingComplete
            ? {
                translateY: [0, -4, 0],
                translateX: [0, -4, 0],
                borderColor: [
                  "var(--border)",
                  "var(--accent)",
                  "var(--border)",
                ],
              }
            : {}
        }
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
        className="w-10 h-10 rounded-none overflow-hidden border-2 border-border mr-4 mt-1 shrink-0 shadow-shadow"
      >
        <ProgressiveImage
          src="/avatar.jpeg"
          alt={t.home.assistantAvatarAlt}
          className="w-full h-full grayscale"
        />
      </motion.div>
      <div className="bg-bg border-4 border-border p-6 rounded-none shadow-shadow w-full">
        <div className="flex flex-col space-y-6">
          <div className="text-text-header font-medium leading-relaxed markdown-content min-h-[1.5em]">
            {skipTypewriter ? (
              <SharedMarkdown content={content} />
            ) : (
              <Typewriter
                text={content}
                onComplete={() => setIsTypingComplete(true)}
              />
            )}
          </div>
        </div>

        {/* Feedback & Actions */}
        {isTypingComplete && (
          <div className="mt-6 pt-4 border-t-2 border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col gap-3 w-full sm:w-auto">
              {onLiveChatRequest && (
                <button
                  onClick={onLiveChatRequest}
                  className="flex items-center gap-2 px-4 py-2 bg-accent text-white font-black uppercase tracking-widest text-[10px] border-2 border-border shadow-shadow hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all active:translate-y-0 active:translate-x-0"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  {t.home.escalateToLiveChat}
                </button>
              )}
              <p className="text-[10px] text-text-muted uppercase tracking-widest font-black">
                {feedbackGiven ? t.home.feedbackSuccess : t.home.wasThisHelpful}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <AnimatePresence mode="wait">
                {feedbackGiven ? (
                  <motion.div
                    key="thank-you"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-1.5 text-success bg-success/10 border-2 border-success rounded-none"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="buttons"
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-2"
                  >
                    <button
                      onClick={() => {
                        handleFeedback(true);
                        import("../../../lib/haptic").then(
                          ({ hapticFeedback }) => hapticFeedback(10),
                        );
                      }}
                      className="p-1.5 text-text-muted hover:text-white hover:bg-success border-2 border-transparent hover:border-border rounded-none transition-all focus-visible:ring-2 focus-visible:ring-success"
                      title={t.home.helpful}
                      aria-label={t.home.helpful}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        handleFeedback(false);
                        import("../../../lib/haptic").then(
                          ({ hapticFeedback }) => hapticFeedback(10),
                        );
                      }}
                      className="p-1.5 text-text-muted hover:text-white hover:bg-danger border-2 border-transparent hover:border-border rounded-none transition-all focus-visible:ring-2 focus-visible:ring-danger"
                      title={t.home.notHelpful}
                      aria-label={t.home.notHelpful}
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BotMessage;
