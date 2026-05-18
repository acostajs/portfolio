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
                    className="rounded-none border-4 border-border !bg-bg shadow-shadow my-6"
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                </Suspense>
              );
            }

            return (
              <code
                className={`${className} px-1.5 py-0.5 rounded-none bg-accent-bg text-accent font-mono text-sm border border-accent/20`}
                {...props}
              >
                {children}
              </code>
            );
          },
          // Customizing other elements for a consistent look
          h1: ({ children }) => (
            <h1 className="text-2xl font-black text-text-header mt-10 mb-6 uppercase italic tracking-tighter border-b-4 border-accent inline-block">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-black text-text-header mt-8 mb-4 uppercase italic tracking-tight">
              {children}
            </h2>
          ),
          p: ({ children }) => (
            <p className="text-text leading-relaxed mb-6 font-medium">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-none space-y-3 mb-6 text-text font-medium">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-3 mb-6 text-text font-medium">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-accent mt-2 mr-3 shrink-0" />
              <span className="leading-relaxed">{children}</span>
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-8 border-accent bg-accent-bg px-8 py-6 italic rounded-none my-8 shadow-shadow">
              {children}
            </blockquote>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent font-black uppercase tracking-widest text-xs hover:underline decoration-2 underline-offset-4"
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
