import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
}

const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  alt,
  className,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [prevSrc, setPrevSrc] = useState(src);

  if (src !== prevSrc) {
    setPrevSrc(src);
    setIsLoaded(false);
    setHasError(false);
  }

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setHasError(true);
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Blurred Placeholder / Error State */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-white/10 backdrop-blur-lg flex items-center justify-center"
          >
            {hasError ? (
              <span className="text-[10px] text-text opacity-40 uppercase font-bold">
                Error Loading
              </span>
            ) : (
              <div className="w-full h-full bg-white/5 animate-pulse" />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!hasError && (
        <motion.img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className={`w-full h-full object-cover ${isLoaded ? "" : "scale-110 blur-xl"}`}
        />
      )}
    </div>
  );
};

export default ProgressiveImage;
