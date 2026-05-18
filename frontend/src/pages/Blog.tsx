import React, { useState } from "react";
import { useTranslation } from "../../lib/hooks/useTranslation";
import { useSuspenseFetch } from "../../lib/api";
import type { BlogPost as DBBlogPost } from "../types/cms";
import { ArrowLeft, Calendar, Tag, ChevronRight } from "lucide-react";
import SEO from "../components/layout/SEO";
import SocialShare from "../components/layout/SocialShare";
import SharedMarkdown from "../components/ui/SharedMarkdown";

const Blog: React.FC = () => {
  const { t, locale } = useTranslation();
  const [selectedPost, setSelectedPost] = useState<DBBlogPost | null>(null);
  const posts = useSuspenseFetch<DBBlogPost[]>("/blog");

  const getLocalized = (
    item: DBBlogPost,
    key: "title" | "excerpt" | "content",
  ) => {
    const k = `${key}_${locale}` as keyof DBBlogPost;
    const fallback = `${key}_en` as keyof DBBlogPost;
    return (item[k] as string) || (item[fallback] as string) || "";
  };

  if (selectedPost) {
    const title = getLocalized(selectedPost, "title");
    const excerpt = getLocalized(selectedPost, "excerpt");
    const content = getLocalized(selectedPost, "content");

    return (
      <section className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12 animate-fade-in bg-bg">
        <SEO title={title} description={excerpt} type="article" />
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setSelectedPost(null)}
            className="flex items-center text-accent font-black uppercase tracking-widest text-xs border-2 border-accent px-4 py-2 bg-accent-bg hover:-translate-y-1 hover:-translate-x-1 active:translate-y-0 active:translate-x-0 transition-all shadow-shadow mb-12 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            {t.blog.backToList}
          </button>

          <article>
            <div className="flex items-center space-x-6 text-[10px] font-mono font-black uppercase text-text-muted mb-6">
              <span className="flex items-center border-b-2 border-border pb-1">
                <Calendar className="w-3.5 h-3.5 mr-1.5" />
                {selectedPost.date}
              </span>
              <span className="flex items-center border-b-2 border-border pb-1">
                <Tag className="w-3.5 h-3.5 mr-1.5" />
                {selectedPost.category}
              </span>
            </div>

            <h1 className="text-3xl md:text-6xl font-black text-text-header mb-8 uppercase italic tracking-tighter leading-none">
              {title}
            </h1>

            <div className="mb-12">
              <SocialShare
                title={title}
                url={`/blog/${selectedPost.slug}`}
                text={excerpt}
              />
            </div>

            <div className="border-t-4 border-border pt-12">
              <SharedMarkdown content={content} className="max-w-none" />
            </div>
          </article>
        </div>
      </section>
    );
  }

  return (
    <section className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12 animate-fade-in bg-bg">
      <SEO title={t.nav.blog} />
      <div className="max-w-5xl mx-auto">
        <header className="mb-16">
          <h1 className="text-4xl md:text-7xl font-black text-text-header mb-4 uppercase italic tracking-tighter">
            {t.blog.title}
          </h1>
          <div className="h-2 w-32 bg-accent" />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {posts.map((post, idx) => (
            <article
              key={post.slug}
              aria-labelledby={`blog-title-${idx}`}
              className="group bg-bg border-4 border-border p-8 rounded-none hover:-translate-y-2 hover:-translate-x-2 transition-all duration-300 shadow-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="px-3 py-1 bg-accent text-white text-[10px] font-black uppercase tracking-widest rounded-none border-2 border-accent shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]">
                    {post.category}
                  </span>
                  <span className="text-[11px] text-text-muted font-mono font-bold uppercase">
                    {post.date}
                  </span>
                </div>
                <h2
                  id={`blog-title-${idx}`}
                  className="text-2xl font-black text-text-header mb-4 group-hover:text-accent transition-colors leading-tight uppercase italic tracking-tight"
                >
                  {getLocalized(post, "title")}
                </h2>
                <p className="text-text font-medium leading-relaxed mb-8 line-clamp-3">
                  {getLocalized(post, "excerpt")}
                </p>
              </div>
              <button
                onClick={() => setSelectedPost(post)}
                className="flex items-center text-xs font-black uppercase tracking-widest text-text-header hover:text-accent transition-all group/btn border-b-2 border-accent self-start pb-1"
                aria-label={`${t.blog.readMore}: ${getLocalized(post, "title")}`}
              >
                {t.blog.readMore}
                <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform text-accent" />
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
