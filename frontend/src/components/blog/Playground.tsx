import React from "react";
import { Sandpack } from "@codesandbox/sandpack-react";
import { useTheme } from "../../../lib/context/ThemeContextUtils";

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

  // Combine default file with any additional files
  const allFiles = {
    ...files,
    "/App.js": code,
  };

  return (
    <div className="my-8 rounded-2xl overflow-hidden border border-border shadow-2xl bg-white/5 backdrop-blur-sm animate-fade-in">
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
    </div>
  );
};

export default Playground;
