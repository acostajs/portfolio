import React, { useState, useEffect, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, ThumbsDown, Check } from "lucide-react";
import ProgressiveImage from "./ProgressiveImage";
import { useTranslation } from "../../../lib/hooks/useTranslation";
import { Skeleton } from "../ui/Skeleton";

const SharedMarkdown = lazy(() => import("../ui/SharedMarkdown"));

interface BotMessageProps {
  content: string;
  isInitial?: boolean;
  features?: string[];
  subwelcome?: string;
  closing?: string;
  skipTypewriter?: boolean;
  onFeedback?: (isHelpful: boolean) => void;
}

const BotMessage: React.FC<BotMessageProps> = ({
  content,
  isInitial,
  features,
  subwelcome,
  closing,
  skipTypewriter,
  onFeedback,
}) => {
  const { t } = useTranslation();
  const [displayedContent, setDisplayedContent] = useState(
    skipTypewriter ? content : "",
  );
  const [showSub, setShowSub] = useState(skipTypewriter || !isInitial);
  const [showFeatures, setShowFeatures] = useState(
    skipTypewriter || !isInitial,
  );
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  const handleFeedback = (isHelpful: boolean) => {
    setFeedbackGiven(true);
    if (onFeedback) onFeedback(isHelpful);
  };

  useEffect(() => {
    if (skipTypewriter) return;

    let i = 0;
    const interval = setInterval(() => {
      setDisplayedContent(content.slice(0, i));
      i++;
      if (i > content.length) {
        clearInterval(interval);
        if (isInitial) {
          setShowSub(true);
          // Sequential show for features after a small delay
          setTimeout(() => setShowFeatures(true), 500);
        }
      }
    }, 15);
    return () => clearInterval(interval);
  }, [content, isInitial, skipTypewriter]);

  return (
    <div className="flex items-start max-w-3xl">
      <motion.div
        initial={false}
        animate={
          !skipTypewriter
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
        <div className="text-text-header font-medium mb-4 leading-relaxed markdown-content min-h-[1.5em]">
          <Suspense
            fallback={
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            }
          >
            <SharedMarkdown content={displayedContent} />
          </Suspense>
        </div>

        <AnimatePresence>
          {isInitial && showSub && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <p className="text-sm text-text-muted font-semibold uppercase tracking-wider">
                {subwelcome}
              </p>
              {showFeatures && features && features.length > 0 && (
                <ul className="space-y-2">
                  {features.map((feature, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center text-text-header"
                    >
                      <span className="w-1.5 h-1.5 bg-accent rounded-full mr-3 shadow-[0_0_8px_rgba(9,105,218,0.8)]"></span>
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isInitial && showFeatures && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              className="text-text mt-8 leading-relaxed italic"
            >
              {closing}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Feedback Buttons */}
        {!isInitial && (
          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
            <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">
              {feedbackGiven ? t.home.feedbackSuccess : "Was this helpful?"}
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
                      onClick={() => handleFeedback(true)}
                      className="p-1.5 text-text-muted hover:text-success hover:bg-success/10 rounded-lg transition-all"
                      title={t.home.helpful}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleFeedback(false)}
                      className="p-1.5 text-text-muted hover:text-error hover:bg-error/10 rounded-lg transition-all"
                      title={t.home.notHelpful}
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
