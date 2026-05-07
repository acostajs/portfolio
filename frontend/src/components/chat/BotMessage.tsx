import React, { useState } from "react";
import Typewriter from "./Typewriter";

interface BotMessageProps {
  content: string;
  isInitial?: boolean;
  features?: string[];
  subwelcome?: string;
  closing?: string;
}

const BotMessage: React.FC<BotMessageProps> = ({
  content,
  isInitial,
  features,
  subwelcome,
  closing,
}) => {
  const [showSub, setShowSub] = useState(!isInitial);
  const [showFeatures, setShowFeatures] = useState(!isInitial);

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
        <p className="text-text-header font-medium mb-4 leading-relaxed">
          <Typewriter
            text={content}
            onComplete={() => isInitial && setShowSub(true)}
          />
        </p>

        {isInitial && showSub && (
          <div className="space-y-4 animate-fade-in">
            <p className="text-sm text-text font-semibold uppercase tracking-wider opacity-70">
              <Typewriter
                text={subwelcome || ""}
                onComplete={() => setShowFeatures(true)}
              />
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
            <Typewriter text={closing || ""} speed={10} />
          </p>
        )}
      </div>
    </div>
  );
};

export default BotMessage;
