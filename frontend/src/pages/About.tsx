import React from "react";
import { useTranslation } from "../../lib/hooks/useTranslation";
import { techStack } from "../../lib/mocks";
import SEO from "../components/layout/SEO";

const About: React.FC = () => {
  const { t } = useTranslation();

  return (
    <article className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
      <SEO title={t.nav.about} description={t.about.p1} />
      <div className="max-w-3xl mx-auto space-y-8">
        <section>
          <h1 className="text-3xl md:text-4xl font-bold text-text-header mb-6">
            {t.about.title}
          </h1>
          <div className="space-y-4 text-text leading-relaxed text-lg">
            <p>{t.about.p1}</p>
            <p>{t.about.p2}</p>
          </div>
        </section>

        <section className="pt-8">
          <h2 className="text-xl font-bold text-text-header uppercase tracking-widest mb-6 opacity-70">
            {t.about.skillsTitle}
          </h2>
          <div className="flex flex-wrap gap-2">
            {techStack.map((skill) => (
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
