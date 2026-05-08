import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import vscDarkPlus from "react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus";
import { motion, AnimatePresence } from "framer-motion";
import ProgressiveImage from "./ProgressiveImage";

const theme = vscDarkPlus as unknown as {
  [key: string]: React.CSSProperties;
};

interface BotMessageProps {
  content: string;
  isInitial?: boolean;
  features?: string[];
  subwelcome?: string;
  closing?: string;
  skipTypewriter?: boolean;
}

const BotMessage: React.FC<BotMessageProps> = ({
  content,
  isInitial,
  features,
  subwelcome,
  closing,
  skipTypewriter,
}) => {
  const [displayedContent, setDisplayedContent] = useState(
    skipTypewriter ? content : "",
  );
  const [showSub, setShowSub] = useState(skipTypewriter || !isInitial);
  const [showFeatures, setShowFeatures] = useState(
    skipTypewriter || !isInitial,
  );

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
      <div className="bg-white/5 border border-border p-6 rounded-2xl rounded-tl-none shadow-xl backdrop-blur-sm">
        <div className="text-text-header font-medium mb-4 leading-relaxed markdown-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              code({ node, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                const isInline = !match;
                return !isInline ? (
                  <SyntaxHighlighter
                    style={theme}
                    language={match[1]}
                    PreTag="div"
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {displayedContent}
          </ReactMarkdown>
        </div>

        <AnimatePresence>
          {isInitial && showSub && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <p className="text-sm text-text font-semibold uppercase tracking-wider opacity-70">
                {subwelcome}
              </p>
              {showFeatures && (
                <ul className="space-y-2">
                  {features?.map((feature, idx) => (
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
      </div>
    </div>
  );
};

export default BotMessage;
