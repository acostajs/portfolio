import type { TranslationType } from "./en";

export const fr: TranslationType = {
  common: {
    name: "Juan Acosta",
    role: "Développeur Web basé à Montréal",
    location: "Montréal",
    availability: "Ouvert aux opportunités de stage",
    email: "acosta.juan@icloud.com",
    linkedin: "juan-acosta-pinilla",
    github: "acostajs",
    downloadResume: "Télécharger le CV",
    resumePath: "/files/Juan_Acosta_CV_FR.pdf",
    availabilityTitle: "Disponibilité :",
  },
  nav: {
    home: "Accueil",
    about: "À propos",
    experience: "Expérience",
    projects: "Projets",
    contact: "Contact",
  },
  home: {
    welcome: "Salut ! Je suis l'assistant du portfolio de Juan Acosta. 👋",
    subwelcome: "Je peux vous parler de :",
    chatbotPlaceholder:
      "Demandez-moi n'importe quoi sur les compétences, les projets ou l'expérience de Juan...",
    features: [
      "Compétences et technologies",
      "Projets et expérience",
      "Informations de contact",
    ],
    closing:
      "Vous pouvez également explorer des pages spécifiques à l'aide de la barre latérale de navigation. Que aimeriez-vous savoir ?",
  },
  header: {
    title: "Assistant Portfolio",
    subtitle: "Posez-moi n'importe quoi sur Juan",
    toggleSidebar: "Basculer la barre latérale",
    toggleTheme: "Changer le thème",
    language: "Langue",
  },
  about: {
    title: "À propos de moi",
    p1: "Je suis un développeur web passionné basé à Montréal, dédié à la création d'applications web propres, efficaces et centrées sur l'utilisateur.",
    p2: "Mon parcours dans la technologie est guidé par une curiosité pour la résolution de problèmes complexes et un désir de créer des expériences numériques qui font la différence.",
    skillsTitle: "Compétences clés",
  },
  experience: {
    title: "Expérience professionnelle",
  },
  projects: {
    title: "Projets récents",
    viewProject: "Voir le projet",
    viewGithub: "GitHub",
  },
  contact: {
    title: "Contactez-moi",
    p1: "Vous avez une question ou vous voulez travailler ensemble ? N'hésitez pas à nous contacter !",
    formName: "Nom",
    formEmail: "Email",
    formMessage: "Message",
    formSend: "Envoyer le message",
    successTitle: "Message envoyé !",
    successMessage: "Merci de m'avoir contacté. Je vous répondrai bientôt.",
    errorTitle: "Oups !",
    errorMessage:
      "Quelque chose s'est mal passé. Veuillez réessayer plus tard.",
  },
};
