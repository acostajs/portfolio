import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, ThumbsDown, Check } from "lucide-react";
import ProgressiveImage from "./ProgressiveImage";
import { useTranslation } from "../../../lib/hooks/useTranslation";

import SharedMarkdown from "../ui/SharedMarkdown";
import Typewriter from "../ui/Typewriter";

interface BotMessageProps {
  content: string;
  isInitial?: boolean;
  skipTypewriter?: boolean;
  onFeedback?: (isHelpful: boolean) => void;
}

const BotMessage: React.FC<BotMessageProps> = ({
  content,
  skipTypewriter,
  onFeedback,
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
                scale: [1, 1.05, 1],
                borderColor: [
                  "rgba(255,255,255,0.1)",
                  "rgba(9,105,218,0.5)",
                  "rgba(255,255,255,0.1)",
                ],
              }
            : {}
        }
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-10 h-10 rounded-full overflow-hidden border-2 border-border mr-4 mt-1 shrink-0 shadow-lg"
      >
        <ProgressiveImage
          src="/avatar.jpeg"
          alt="Assistant"
          className="w-full h-full grayscale"
        />
      </motion.div>
      <div className="bg-white/5 border border-border p-6 rounded-2xl rounded-tl-none shadow-xl backdrop-blur-sm w-full">
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

        {/* Feedback Buttons */}
        {isTypingComplete && (
          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
            <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">
              {feedbackGiven ? t.home.feedbackSuccess : t.home.wasThisHelpful}
            </p>
            <div className="flex items-center gap-2">
              <AnimatePresence mode="wait">
                {feedbackGiven ? (
                  <motion.div
                    key="thank-you"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-1.5 text-success bg-success/10 rounded-lg"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="buttons"
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="flex items-center gap-2"
                  >
                    <button
                      onClick={() => {
                        handleFeedback(true);
                        import("../../../lib/haptic").then(
                          ({ hapticFeedback }) => hapticFeedback(10),
                        );
                      }}
                      className="p-1.5 text-text-muted hover:text-success hover:bg-success/10 rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-success"
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
                      className="p-1.5 text-text-muted hover:text-error hover:bg-error/10 rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-error"
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
