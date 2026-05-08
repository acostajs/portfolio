import React, { useState } from "react";
import { useTranslation } from "../../lib/hooks/useTranslation";
import { blogPosts, type BlogPost } from "../../lib/mocks";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import vscDarkPlus from "react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus";
import { ArrowLeft, Calendar, Tag, ChevronRight } from "lucide-react";

const theme = vscDarkPlus as unknown as {
  [key: string]: React.CSSProperties;
};

const Blog: React.FC = () => {
  const { t, locale } = useTranslation();
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const getLocalizedValue = (obj: { en: string; es: string; fr: string }) => {
    return obj[locale as keyof typeof obj] || obj.en;
  };

  if (selectedPost) {
    return (
      <section className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12 animate-fade-in bg-bg">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setSelectedPost(null)}
            className="flex items-center text-accent hover:underline mb-8 transition-all group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            {t.blog.backToList}
          </button>

          <article>
            <div className="flex items-center space-x-4 text-sm text-text opacity-70 mb-4">
              <span className="flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1.5" />
                {selectedPost.date}
              </span>
              <span className="flex items-center">
                <Tag className="w-3.5 h-3.5 mr-1.5" />
                {selectedPost.category}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-text-header mb-8 tracking-tight leading-tight">
              {getLocalizedValue(selectedPost.title)}
            </h1>

            <div className="prose prose-invert max-w-none markdown-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    const isInline = !match;
                    return !isInline ? (
                      <SyntaxHighlighter
                        style={theme}
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
                {getLocalizedValue(selectedPost.content)}
              </ReactMarkdown>
            </div>
          </article>
        </div>
      </section>
    );
  }

  return (
    <section className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12 animate-fade-in bg-bg">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-text-header mb-4 tracking-tighter">
            {t.blog.title}
          </h1>
          <div className="h-1.5 w-20 bg-accent rounded-full mb-6" />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogPosts.map((post) => (
            <div
              key={post.slug}
              className="group bg-white/5 border border-border p-8 rounded-3xl hover:border-accent transition-all duration-300 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="px-3 py-1 bg-accent/10 text-accent text-[10px] font-bold uppercase tracking-widest rounded-full border border-accent/20">
                    {post.category}
                  </span>
                  <span className="text-[11px] text-text opacity-60 font-medium">
                    {post.date}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-text-header mb-4 group-hover:text-accent transition-colors leading-snug">
                  {getLocalizedValue(post.title)}
                </h2>
                <p className="text-text opacity-80 leading-relaxed mb-6 line-clamp-3">
                  {getLocalizedValue(post.excerpt)}
                </p>
              </div>
              <button
                onClick={() => setSelectedPost(post)}
                className="flex items-center text-sm font-bold text-text-header hover:text-accent transition-all group/btn"
              >
                {t.blog.readMore}
                <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform text-accent" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
