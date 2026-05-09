import React, { useState, useEffect } from "react";
import { useTranslation } from "../../lib/hooks/useTranslation";
import { ExternalLink, Link as LinkIcon, Code } from "lucide-react";
import SEO from "../components/layout/SEO";
import SocialShare from "../components/layout/SocialShare";
import ProgressiveImage from "../components/chat/ProgressiveImage";

interface ProjectData {
  id?: number;
  title: string;
  description_en: string;
  description_es?: string;
  description_fr?: string;
  tech: string[];
  link?: string;
  github?: string;
  image?: string;
  order: number;
}

const Projects: React.FC = () => {
  const { t, locale } = useTranslation();
  const [items, setItems] = useState<ProjectData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/v1/projects");
        if (response.ok) {
          setItems(await response.json());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getLocalized = (item: ProjectData, key: "description") => {
    const localizedKey = `${key}_${locale}` as keyof ProjectData;
    const fallbackKey = `${key}_en` as keyof ProjectData;
    return (
      (item[localizedKey] as string) || (item[fallbackKey] as string) || ""
    );
  };

  if (isLoading)
    return <div className="p-8 animate-pulse text-text">Loading...</div>;

  return (
    <section className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
      <SEO title={t.nav.projects} />
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-text-header mb-8">
          {t.projects.title}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((project, idx) => (
            <article
              key={idx}
              className="group bg-white/5 border border-border rounded-2xl overflow-hidden hover:border-accent/50 transition-all flex flex-col shadow-xl backdrop-blur-sm"
            >
              <div className="h-48 bg-gradient-to-br from-accent/20 to-bg flex items-center justify-center relative overflow-hidden">
                {project.image ? (
                  <ProgressiveImage
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <Code className="w-20 h-20 text-accent opacity-20 group-hover:scale-110 transition-transform duration-500" />
                )}
                <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <header>
                  <h3 className="text-xl font-bold text-text-header mb-2">
                    {project.title}
                  </h3>
                </header>
                <p className="text-text text-sm mb-6 leading-relaxed flex-1">
                  {getLocalized(project, "description")}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map((techItem: string) => (
                    <span
                      key={techItem}
                      className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-white/5 border border-border rounded-lg text-text opacity-80"
                    >
                      {techItem}
                    </span>
                  ))}
                </div>

                <footer className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                  <div className="flex items-center gap-4">
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm font-bold text-accent hover:underline"
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
                        className="flex items-center text-sm font-bold text-text hover:text-text-header"
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
