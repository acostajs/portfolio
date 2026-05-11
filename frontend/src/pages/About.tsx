import React, { useState, useEffect } from "react";
import { useTranslation } from "../../lib/hooks/useTranslation";
import { fetchPublic } from "../../lib/api";
import type { AboutData } from "../types/cms";
import SEO from "../components/layout/SEO";
import PageLoader from "../components/ui/PageLoader";

const About: React.FC = () => {
  const { t, locale } = useTranslation();
  const [data, setData] = useState<AboutData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPublic<AboutData>("/about")
      .then(setData)
      .catch((err) => console.error("Failed to fetch about data:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const getLocalized = (key: string) => {
    if (!data) return "";
    const localizedKey = `${key}_${locale}` as keyof AboutData;
    const fallbackKey = `${key}_en` as keyof AboutData;
    return (
      (data[localizedKey] as string) || (data[fallbackKey] as string) || ""
    );
  };

  if (isLoading) return <PageLoader />;

  return (
    <article className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
      <SEO title={t.nav.about} description={getLocalized("p1")} />
      <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
        <section>
          <h1 className="text-3xl md:text-4xl font-bold text-text-header mb-6">
            {t.about.title}
          </h1>
          <div className="space-y-4 text-text leading-relaxed text-lg">
            <p>{getLocalized("p1")}</p>
            <p>{getLocalized("p2")}</p>
          </div>
        </section>

        <section className="pt-8">
          <h2 className="text-xl font-bold text-text-header uppercase tracking-widest mb-6 text-text-muted">
            {t.about.skillsTitle}
          </h2>
          <div className="flex flex-wrap gap-2">
            {data?.skills?.map((skill: string) => (
              <span
                key={skill}
                className="px-4 py-2 bg-white/5 border border-border rounded-lg text-text-header font-medium hover:border-accent hover:text-accent transition-all cursor-default"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
};

export default About;
