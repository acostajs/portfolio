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
    blog: "Blog",
    contact: "Contact",
  },
  home: {
    welcome:
      "Bienvenue ! Je suis l'assistant virtuel de Juan. Je suis ici pour vous aider à naviguer dans son portfolio et répondre à vos questions sur son travail. 👋",
    subwelcome:
      "J'ai été formé sur le parcours professionnel, les compétences et les projets de Juan. Voici ce dont nous pouvons discuter :",
    chatbotPlaceholder: "Demandez-moi sur Juan...",
    newChat: "Nouveau Chat",
    helpful: "Utile",
    notHelpful: "Pas utile",
    feedbackSuccess: "Merci pour votre avis !",
    features: [
      "Compétences techniques clés",
      "Parcours professionnel",
      "Projets et contributions majeures",
      "Philosophie de travail et savoir-être",
    ],
    closing:
      "N'hésitez pas à me poser des questions ou à utiliser /commandes pour accéder directement à des sections spécifiques. Vous pouvez même essayer de me parler en utilisant le bouton du micro ! Comment puis-je vous aider aujourd'hui ?",
    suggestions: [
      "Quelles sont vos compétences techniques clés ?",
      "Parlez-moi de vos projets les plus récents",
      "Comment gérez-vous les retours professionnels ?",
      "Quelle est votre expérience du télétravail ?",
      "Pouvez-vous me parler de votre parcours ?",
      "Comment gérez-vous la pression et les délais ?",
      "Où puis-je télécharger votre CV ?",
      "Quelles sont vos motivations professionnelles ?",
    ],
    commands: {
      help: "Commandes disponibles :",
      subjectsTitle: "Je peux aussi parler de :",
      subjects: [
        "Compétences et Technologies",
        "Projets et Expérience",
        "Biographie et Parcours Professionnel",
        "Savoir-être et Philosophie de Travail",
        "Loisirs et Centres d'intérêt",
        "Informations de Contact",
      ],
      clear: "Historique du chat effacé.",
      clearSuccess:
        "Historique du chat effacé. Comment puis-je vous aider d'autre ?",
      error: "Commande inconnue. Tapez /help pour voir les commandes.",
      list: [
        { cmd: "/clear", desc: "Effacer l'historique." },
        { cmd: "/help", desc: "Afficher ce message d'aide." },
        { cmd: "/about", desc: "Aller à la page À propos." },
        { cmd: "/experience", desc: "Aller à la page Expérience." },
        { cmd: "/projects", desc: "Aller à la page Projets." },
        { cmd: "/blog", desc: "Aller à la page Blog." },
        { cmd: "/contact", desc: "Aller à la page Contact." },
      ],
    },
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
    p1: "Je suis un développeur web passionné basé à Montréal, dédié à la création d' applications web propres, efficaces et centrées sur l'utilisateur.",
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
  blog: {
    title: "Notes techniques",
    readMore: "Lire la suite",
    backToList: "Retour à la liste",
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
