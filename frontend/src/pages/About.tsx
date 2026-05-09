import React, { useState, useEffect } from "react";
import { useTranslation } from "../../lib/hooks/useTranslation";
import SEO from "../components/layout/SEO";

interface AboutData {
  id?: number;
  p1_en: string;
  p1_es: string;
  p1_fr: string;
  p2_en: string;
  p2_es: string;
  p2_fr: string;
  skills: string[];
}

const About: React.FC = () => {
  const { t, locale } = useTranslation();
  const [data, setData] = useState<AboutData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/v1/about");
        if (response.ok) {
          setData(await response.json());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getLocalized = (key: string) => {
    if (!data) return "";
    return data[`${key}_${locale}`] || data[`${key}_en`] || "";
  };

  if (isLoading)
    return <div className="p-8 animate-pulse text-text">Loading...</div>;

  return (
    <article className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
      <SEO title={t.nav.about} description={getLocalized("p1")} />
      <div className="max-w-3xl mx-auto space-y-8">
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
          <h2 className="text-xl font-bold text-text-header uppercase tracking-widest mb-6 opacity-70">
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
