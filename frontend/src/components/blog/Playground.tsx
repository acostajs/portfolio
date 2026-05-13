import React, { useState, useEffect, useRef } from "react";
import { Sandpack } from "@codesandbox/sandpack-react";
import { useTheme } from "../../../lib/context/ThemeContextUtils";
import PageLoader from "../ui/PageLoader";

interface PlaygroundProps {
  code: string;
  template?: "react" | "react-ts" | "vanilla" | "vanilla-ts" | "node";
  files?: Record<string, string>;
}

const Playground: React.FC<PlaygroundProps> = ({
  code,
  template = "react",
  files = {},
}) => {
  const { resolvedTheme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "200px", // Start loading 200px before it enters the viewport
      },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Combine default file with any additional files
  const allFiles = {
    ...files,
    "/App.js": code,
  };

  return (
    <div
      ref={containerRef}
      className="my-8 rounded-2xl overflow-hidden border border-border shadow-2xl bg-white/5 backdrop-blur-sm animate-fade-in min-h-[450px]"
    >
      {isVisible ? (
        <Sandpack
          template={template}
          theme={resolvedTheme === "dark" ? "dark" : "light"}
          files={allFiles}
          options={{
            showNavigator: true,
            showTabs: true,
            closableTabs: false,
            showLineNumbers: true,
            showInlineErrors: true,
            editorHeight: 400,
            editorWidthPercentage: 60,
          }}
          customSetup={{
            dependencies: {
              "lucide-react": "latest",
              "framer-motion": "latest",
            },
          }}
        />
      ) : (
        <div className="h-[450px] flex items-center justify-center">
          <PageLoader />
        </div>
      )}
    </div>
  );
};

export default Playground;
