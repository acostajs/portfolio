import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

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
    <div className="flex items-start max-w-3xl animate-slide-in-left">
      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-border mr-4 mt-1 shrink-0">
        <img
          src="/avatar.jpeg"
          alt="Assistant"
          className="w-full h-full object-cover grayscale"
        />
      </div>
      <div className="bg-white/5 border border-border p-6 rounded-2xl rounded-tl-none shadow-xl backdrop-blur-sm">
        <div className="text-text-header font-medium mb-4 leading-relaxed markdown-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                const isInline = !match;
                return !isInline ? (
                  <SyntaxHighlighter
                    style={
                      vscDarkPlus as { [key: string]: React.CSSProperties }
                    }
                    language={match[1]}
                    PreTag="div"
                    {...props}
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

        {isInitial && showSub && (
          <div className="space-y-4 animate-fade-in">
            <p className="text-sm text-text font-semibold uppercase tracking-wider opacity-70">
              {subwelcome}
            </p>
            {showFeatures && (
              <ul className="space-y-2">
                {features?.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-center text-text-header animate-slide-in-left"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <span className="w-1.5 h-1.5 bg-accent rounded-full mr-3 shadow-[0_0_8px_rgba(9,105,218,0.8)]"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {isInitial && showFeatures && (
          <p className="text-text mt-8 leading-relaxed italic opacity-80 animate-fade-in">
            {closing}
          </p>
        )}
      </div>
    </div>
  );
};

export default BotMessage;
