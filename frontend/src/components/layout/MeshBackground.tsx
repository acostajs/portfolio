import React, { useEffect, useState } from "react";

const MeshBackground: React.FC = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-bg transition-colors duration-300" />

      {/* Primary Blob */}
      <div
        className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent/10 blur-[120px] ${
          prefersReducedMotion ? "" : "animate-mesh-1"
        }`}
      />

      {/* Secondary Blob */}
      <div
        className={`absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-success/5 blur-[120px] ${
          prefersReducedMotion ? "" : "animate-mesh-2"
        }`}
      />

      {/* Tertiary Blob */}
      <div
        className={`absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-[100px] ${
          prefersReducedMotion ? "" : "animate-mesh-3"
        }`}
      />
    </div>
  );
};

export default MeshBackground;
