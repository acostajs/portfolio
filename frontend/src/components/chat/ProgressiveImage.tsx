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

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setIsLoaded(true);
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Blurred Placeholder */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-white/10 backdrop-blur-lg animate-pulse"
          />
        )}
      </AnimatePresence>

      <motion.img
        src={src}
        alt={alt}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full h-full object-cover ${isLoaded ? "" : "scale-110 blur-xl"}`}
      />
    </div>
  );
};

export default ProgressiveImage;
