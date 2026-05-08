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

export interface BlogPost {
  slug: string;
  date: string;
  category: string;
  title: {
    en: string;
    es: string;
    fr: string;
  };
  excerpt: {
    en: string;
    es: string;
    fr: string;
  };
  content: {
    en: string;
    es: string;
    fr: string;
  };
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

export const blogPosts: BlogPost[] = [
  {
    slug: "mastering-react-19",
    date: "2026-05-01",
    category: "Frontend",
    title: {
      en: "Mastering React 19 Features",
      es: "Dominando las funciones de React 19",
      fr: "Maîtriser les fonctionnalités de React 19",
    },
    excerpt: {
      en: "A deep dive into the latest features of React 19 and how they improve performance.",
      es: "Una inmersión profunda en las últimas funciones de React 19 y cómo mejoran el rendimiento.",
      fr: "Une plongée profonde dans les dernières fonctionnalités de React 19 et comment elles améliorent les performances.",
    },
    content: {
      en: "React 19 introduces several game-changing features like **Actions**, **Optimistic Updates**, and improved support for **Server Components**. \n\n```tsx\n// Example of a basic Action\nconst [isPending, startTransition] = useTransition();\n\nconst handleSubmit = () => {\n  startTransition(async () => {\n    await updateProfile(name);\n  });\n};\n```\nThese features simplify state management and improve the developer experience significantly.",
      es: "React 19 presenta varias funciones revolucionarias como **Actions**, **Actualizaciones optimistas** y un soporte mejorado para **Server Components**. \n\n```tsx\n// Ejemplo de una Acción básica\nconst [isPending, startTransition] = useTransition();\n\nconst handleSubmit = () => {\n  startTransition(async () => {\n    await updateProfile(name);\n  });\n};\n```\nEstas funciones simplifican la gestión del estado y mejoran significativamente la experiencia del desarrollador.",
      fr: "React 19 introduit plusieurs fonctionnalités révolutionnaires telles que les **Actions**, les **mises à jour optimistes** et un support amélioré pour les **composants serveur**. \n\n```tsx\n// Exemple d'une Action de base\nconst [isPending, startTransition] = useTransition();\n\nconst handleSubmit = () => {\n  startTransition(async () => {\n    await updateProfile(name);\n  });\n};\n```\nCes fonctionnalités simplifient la gestion de l'état et améliorent considérablement l'expérience du développeur.",
    },
  },
  {
    slug: "fastapi-best-practices",
    date: "2026-04-15",
    category: "Backend",
    title: {
      en: "FastAPI Best Practices for 2026",
      es: "Mejores prácticas de FastAPI para 2026",
      fr: "Meilleures pratiques FastAPI pour 2026",
    },
    excerpt: {
      en: "How to build scalable and maintainable APIs with FastAPI and Python 3.12+.",
      es: "Cómo crear APIs escalables y mantenibles con FastAPI y Python 3.12+.",
      fr: "Comment créer des API évolutives et maintenables avec FastAPI et Python 3.12+.",
    },
    content: {
      en: "Building modern APIs requires a focus on type safety and performance. FastAPI combined with **Pydantic v2** and **SQLModel** provides a robust foundation.\n\n```python\nfrom fastapi import FastAPI\nfrom sqlmodel import SQLModel, Field\n\nclass Hero(SQLModel, table=True):\n    id: int | None = Field(default=None, primary_key=True)\n    name: str\n    secret_name: str\n\napp = FastAPI()\n```\nAlways prioritize structured logging and automated testing to keep your codebase healthy.",
      es: "La creación de APIs modernas requiere centrarse en la seguridad de tipos y el rendimiento. FastAPI combinado con **Pydantic v2** y **SQLModel** proporciona una base sólida.\n\n```python\nfrom fastapi import FastAPI\nfrom sqlmodel import SQLModel, Field\n\nclass Hero(SQLModel, table=True):\n    id: int | None = Field(default=None, primary_key=True)\n    name: str\n    secret_name: str\n\napp = FastAPI()\n```\nPrioriza siempre el registro estructurado y las pruebas automatizadas para mantener tu base de código saludable.",
      fr: "La création d'API modernes nécessite de se concentrer sur la sécurité des types et les performances. FastAPI combiné à **Pydantic v2** et **SQLModel** offre une base solide.\n\n```utilisateur\nfrom fastapi import FastAPI\nfrom sqlmodel import SQLModel, Field\n\nclass Hero(SQLModel, table=True):\n    id: int | None = Field(default=None, primary_key=True)\n    name: str\n    secret_name: str\n\napp = FastAPI()\n```\nDonnez toujours la priorité à la journalisation structurée et aux tests automatisés pour maintenir votre base de code en bonne santé.",
    },
  },
];
