import React from "react";
import { useTranslation } from "../../lib/hooks/useTranslation";
import { projects } from "../../lib/mocks";
import { ExternalLink, Link as LinkIcon, Code } from "lucide-react";

const Projects: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-text-header mb-8">
          {t.projects.title}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, idx) => (
            <article
              key={idx}
              className="group bg-white/5 border border-border rounded-2xl overflow-hidden hover:border-accent/50 transition-all flex flex-col shadow-xl backdrop-blur-sm"
            >
              <div className="h-48 bg-gradient-to-br from-accent/20 to-bg flex items-center justify-center relative overflow-hidden">
                <Code className="w-20 h-20 text-accent opacity-20 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <header>
                  <h3 className="text-xl font-bold text-text-header mb-2">
                    {project.title}
                  </h3>
                </header>
                <p className="text-text text-sm mb-6 leading-relaxed flex-1">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-white/5 border border-border rounded-lg text-text opacity-80"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <footer className="flex items-center gap-4 mt-auto">
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
