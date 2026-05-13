import React, { useState, useEffect } from "react";
import { useTranslation } from "../../lib/hooks/useTranslation";
import { fetchPublic } from "../../lib/api";
import type { ExperienceData } from "../types/cms";
import { Calendar, Briefcase } from "lucide-react";
import SEO from "../components/layout/SEO";
import PageLoader from "../components/ui/PageLoader";

const Experience: React.FC = () => {
  const { t, locale } = useTranslation();
  const [items, setItems] = useState<ExperienceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPublic<ExperienceData[]>("/experience")
      .then(setItems)
      .catch((err) => console.error("Failed to fetch experience data:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const getLocalized = (item: ExperienceData, key: "description") => {
    const localizedKey = `${key}_${locale}` as keyof ExperienceData;
    const fallbackKey = `${key}_en` as keyof ExperienceData;
    return (
      (item[localizedKey] as string[]) || (item[fallbackKey] as string[]) || []
    );
  };

  return (
    <section className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
      <SEO title={t.nav.experience} />
      <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold text-text-header mb-8">
          {t.experience.title}
        </h1>

        {isLoading ? (
          <PageLoader />
        ) : (
          <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-accent/50 before:via-border before:to-transparent">
            {items.map((exp, idx) => (
              <article
                key={idx}
                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
              >
                {/* Icon */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-bg text-accent shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform group-hover:scale-110">
                  <Briefcase className="w-5 h-5" />
                </div>

                {/* Content Card */}
                <div className="w-[calc(100%-4rem)] md:w-[45%] p-6 rounded-2xl bg-white/5 border border-border shadow-xl backdrop-blur-sm group-hover:border-accent/50 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <header className="flex flex-wrap items-center justify-between w-full">
                      <h3 className="font-bold text-text-header text-lg">
                        {exp.role}
                      </h3>
                      <div className="flex items-center text-xs text-text-muted">
                        <Calendar className="w-3.5 h-3.5 mr-1.5" />
                        {exp.period}
                      </div>
                    </header>
                  </div>
                  <div className="text-accent font-semibold mb-4">
                    {exp.company}
                  </div>
                  <ul className="space-y-2 list-disc list-inside text-sm text-text leading-relaxed">
                    {getLocalized(exp, "description").map(
                      (item: string, i: number) => (
                        <li key={i}>{item}</li>
                      ),
                    )}
                  </ul>
                  <footer className="mt-4 flex flex-wrap gap-1.5">
                    {exp.tech.map((techItem: string) => (
                      <span
                        key={techItem}
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-accent/10 text-accent rounded-md border border-accent/20"
                      >
                        {techItem}
                      </span>
                    ))}
                  </footer>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Experience;
