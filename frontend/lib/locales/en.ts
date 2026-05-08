export const en = {
  common: {
    name: "Juan Acosta",
    role: "Web Developer based in Montréal",
    location: "Montréal",
    availability: "Open to internship opportunities",
    email: "acosta.juan@icloud.com",
    linkedin: "juan-acosta-pinilla",
    github: "acostajs",
    downloadResume: "Download Resume",
    resumePath: "/files/Juan_Acosta_CV_EN.pdf",
    availabilityTitle: "Availability:",
  },
  nav: {
    home: "Home",
    about: "About",
    experience: "Experience",
    projects: "Projects",
    blog: "Blog",
    contact: "Contact",
  },
  home: {
    welcome: "Hi! I'm Juan Acosta's portfolio assistant. 👋",
    subwelcome: "I can tell you about:",
    chatbotPlaceholder: "Ask me about Juan's skills, projects...",
    features: [
      "Skills & Technologies",
      "Projects & Experience",
      "Contact Information",
    ],
    closing:
      "You can also explore specific pages using the navigation sidebar. What would you like to know?",
    commands: {
      help: "Available commands:",
      clear: "Chat history cleared.",
      error: "Unknown command. Type /help to see available commands.",
      list: [
        { cmd: "/clear", desc: "Clear chat history." },
        { cmd: "/help", desc: "Show available commands." },
        { cmd: "/about", desc: "Go to About page." },
        { cmd: "/experience", desc: "Go to Experience page." },
        { cmd: "/projects", desc: "Go to Projects page." },
        { cmd: "/blog", desc: "Go to Blog page." },
        { cmd: "/contact", desc: "Go to Contact page." },
      ],
    },
  },
  header: {
    title: "Portfolio Assistant",
    subtitle: "Ask me anything about Juan",
    toggleSidebar: "Toggle Sidebar",
    toggleTheme: "Toggle Theme",
    language: "Language",
  },
  about: {
    title: "About Me",
    p1: "I'm a passionate Web Developer based in Montréal, dedicated to building clean, efficient, and user-centric web applications.",
    p2: "My journey in tech is driven by a curiosity for solving complex problems and a desire to create digital experiences that make a difference.",
    skillsTitle: "Core Skills",
  },
  experience: {
    title: "Professional Experience",
  },
  projects: {
    title: "Recent Projects",
    viewProject: "View Project",
    viewGithub: "GitHub",
  },
  blog: {
    title: "Technical Notes",
    readMore: "Read More",
    backToList: "Back to List",
  },
  contact: {
    title: "Get in Touch",
    p1: "Have a question or want to work together? Feel free to reach out!",
    formName: "Name",
    formEmail: "Email",
    formMessage: "Message",
    formSend: "Send Message",
    successTitle: "Message Sent!",
    successMessage: "Thank you for reaching out. I'll get back to you soon.",
    errorTitle: "Oops!",
    errorMessage: "Something went wrong. Please try again later.",
  },
};

export type TranslationType = typeof en;
