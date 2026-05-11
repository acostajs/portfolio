import React, { Suspense, lazy } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import vscDarkPlus from "react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus";
import { Skeleton } from "../ui/Skeleton";

const Playground = lazy(() => import("../blog/Playground"));

const theme = vscDarkPlus as unknown as {
  [key: string]: React.CSSProperties;
};

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        code({ node, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          const isInline = !match;

          if (match?.[1] === "react-playground") {
            return (
              <Suspense
                fallback={<Skeleton className="h-[400px] w-full my-8" />}
              >
                <Playground code={String(children).replace(/\n$/, "")} />
              </Suspense>
            );
          }

          return !isInline ? (
            <SyntaxHighlighter style={theme} language={match[1]} PreTag="div">
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
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
