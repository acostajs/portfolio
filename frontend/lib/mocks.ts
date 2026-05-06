export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string[];
  tech: string[];
}

export interface Project {
  title: string;
  description: string;
  tech: string[];
  link?: string;
  github?: string;
}

export const techStack = [
  "TypeScript",
  "React",
  "Bun",
  "Tailwind CSS",
  "FastAPI",
  "Python",
  "PostgreSQL",
  "Docker",
];

export const experience: Experience[] = [
  {
    company: "Freelance",
    role: "Full-Stack Developer",
    period: "2023 - Present",
    description: [
      "Building high-performance web applications using React and FastAPI.",
      "Optimizing frontend performance with Bun and Vite.",
      "Implementing AI-driven features and chatbots.",
    ],
    tech: ["React", "FastAPI", "Bun", "OpenAI"],
  },
];

export const projects: Project[] = [
  {
    title: "AI Portfolio",
    description:
      "A multilingual interactive portfolio with an AI chatbot assistant.",
    tech: ["React", "FastAPI", "Tailwind CSS", "Bun"],
    github: "https://github.com/juan/portfolio",
  },
];
