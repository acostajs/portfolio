import React from "react";
import { useTranslation } from "../../lib/hooks/useTranslation";
import { useSuspenseFetch } from "../../lib/api";
import type { ProjectData } from "../types/cms";
import { ExternalLink, Link as LinkIcon, Code } from "lucide-react";
import SEO from "../components/layout/SEO";
import SocialShare from "../components/layout/SocialShare";
import ProgressiveImage from "../components/chat/ProgressiveImage";

const Projects: React.FC = () => {
  const { t, locale } = useTranslation();
  const items = useSuspenseFetch<ProjectData[]>("/projects");

  const getLocalized = (item: ProjectData, key: "description") => {
    const localizedKey = `${key}_${locale}` as keyof ProjectData;
    const fallbackKey = `${key}_en` as keyof ProjectData;
    return (
      (item[localizedKey] as string) || (item[fallbackKey] as string) || ""
    );
  };

  return (
    <section className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
      <SEO title={t.nav.projects} />
      <div className="max-w-5xl mx-auto animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold text-text-header mb-8">
          {t.projects.title}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {items.map((project, idx) => (
            <article
              key={idx}
              aria-labelledby={`project-title-${idx}`}
              className="group bg-bg border-4 border-border rounded-none overflow-hidden hover:-translate-y-2 hover:-translate-x-2 transition-all flex flex-col shadow-shadow"
            >
              <div className="h-56 bg-accent-bg border-b-4 border-border flex items-center justify-center relative overflow-hidden">
                {project.image ? (
                  <ProgressiveImage
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 grayscale"
                  />
                ) : (
                  <Code className="w-20 h-20 text-accent opacity-30 group-hover:scale-110 transition-transform duration-500" />
                )}
                <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <header>
                  <h3
                    id={`project-title-${idx}`}
                    className="text-2xl font-black text-text-header mb-2 uppercase italic tracking-tighter"
                  >
                    {project.title}
                  </h3>
                </header>
                <p className="text-text text-sm mb-6 leading-relaxed flex-1 font-medium">
                  {getLocalized(project, "description")}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map((techItem: string) => (
                    <span
                      key={techItem}
                      className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-accent text-white border-2 border-accent shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]"
                    >
                      {techItem}
                    </span>
                  ))}
                </div>

                <footer className="flex items-center justify-between mt-auto pt-6 border-t-4 border-border">
                  <div className="flex items-center gap-4">
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-xs font-black uppercase tracking-widest text-accent hover:underline decoration-4 underline-offset-4"
                      >
                        <ExternalLink className="w-4 h-4 mr-1.5" />
                        {t.projects.viewProject}
                      </a>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-xs font-black uppercase tracking-widest text-text hover:text-accent"
                      >
                        <LinkIcon className="w-4 h-4 mr-1.5" />
                        {t.projects.viewGithub}
                      </a>
                    )}
                  </div>
                  <SocialShare title={project.title} url="/projects" />
                </footer>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
