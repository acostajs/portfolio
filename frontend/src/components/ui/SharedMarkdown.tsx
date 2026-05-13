import React, { Suspense, lazy } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import PageLoader from "./PageLoader";

const SyntaxHighlighter = lazy(async () => {
  const [mod, themeMod] = await Promise.all([
    import("react-syntax-highlighter").then((m) => m.Prism),
    import("react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus").then(
      (m) => m.default,
    ),
  ]);
  return {
    default: (props: Record<string, unknown>) => (
      <SyntaxHighlighterBase {...props} style={themeMod} Prism={mod} />
    ),
  };
});

// A small wrapper to handle the Prism prop correctly
interface SyntaxHighlighterBaseProps {
  Prism: React.ElementType;
  [key: string]: unknown;
}

const SyntaxHighlighterBase: React.FC<SyntaxHighlighterBaseProps> = ({
  Prism,
  ...props
}) => {
  const Component = Prism;
  return <Component {...props} />;
};

const Playground = lazy(() => import("../blog/Playground"));

interface SharedMarkdownProps {
  content: string;
  className?: string;
}

const SharedMarkdown: React.FC<SharedMarkdownProps> = ({
  content,
  className = "",
}) => {
  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !match;

            if (match?.[1] === "react-playground") {
              return (
                <Suspense fallback={<PageLoader />}>
                  <Playground code={String(children).replace(/\n$/, "")} />
                </Suspense>
              );
            }

            if (!isInline) {
              return (
                <Suspense fallback={<PageLoader />}>
                  <SyntaxHighlighter
                    language={match[1]}
                    PreTag="div"
                    className="rounded-xl border border-white/5 !bg-white/5"
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                </Suspense>
              );
            }

            return (
              <code
                className={`${className} px-1.5 py-0.5 rounded bg-white/10 text-accent-light font-mono text-sm`}
                {...props}
              >
                {children}
              </code>
            );
          },
          // Customizing other elements for a consistent look
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold text-text-header mt-8 mb-4">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-bold text-text-header mt-6 mb-3">
              {children}
            </h2>
          ),
          p: ({ children }) => (
            <p className="text-text leading-relaxed mb-4">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-2 mb-4 text-text">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-2 mb-4 text-text">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-accent bg-accent/5 px-6 py-4 italic rounded-r-xl my-6">
              {children}
            </blockquote>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline font-medium"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default SharedMarkdown;
