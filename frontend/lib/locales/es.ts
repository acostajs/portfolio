import type { TranslationType } from "./en";

export const es: TranslationType = {
  common: {
    name: "Juan Acosta",
    role: "Desarrollador Web basado en Montréal",
    location: "Montréal",
    availability: "Abierto a oportunidades de pasantías",
    email: "acosta.juan@icloud.com",
    linkedin: "juan-acosta-pinilla",
    github: "acostajs",
    downloadResume: "Descargar CV",
    resumePath: "/files/Juan_Acosta_CV_ES.pdf",
    availabilityTitle: "Disponibilidad:",
  },
  nav: {
    home: "Inicio",
    about: "Sobre mí",
    experience: "Experiencia",
    projects: "Proyectos",
    blog: "Blog",
    contact: "Contacto",
  },
  home: {
    welcome: "¡Hola! Soy el asistente del portafolio de Juan Acosta. 👋",
    subwelcome:
      "Puedes interactuar conmigo para conocer la trayectoria de Juan. Puedo contarte sobre:",
    chatbotPlaceholder: "Pregúntame sobre Juan...",
    features: [
      "Habilidades y Tecnologías",
      "Proyectos y Experiencia",
      "Información de Contacto",
    ],
    closing:
      "Juan habla inglés, francés y español—¡puedes cambiar el idioma y el tema usando los botones superiores! También admito /comandos para navegación rápida. ¿Qué te gustaría saber?",
    commands: {
      help: "Comandos disponibles:",
      subjectsTitle: "También puedo hablar sobre:",
      subjects: [
        "Habilidades y Tecnologías",
        "Proyectos y Experiencia",
        "Biografía y Perfil Profesional",
        "Habilidades Blandas y Filosofía de Trabajo",
        "Pasatiempos e Intereses",
        "Información de Contacto",
      ],
      clear: "Historial de chat borrado.",
      clearSuccess: "Historial de chat borrado. ¿En qué más puedo ayudarte?",
      error: "Comando desconocido. Escribe /help para ver los comandos.",
      list: [
        { cmd: "/clear", desc: "Borrar el historial." },
        { cmd: "/help", desc: "Mostrar este mensaje de ayuda." },
        { cmd: "/about", desc: "Ir a la página Sobre mí." },
        { cmd: "/experience", desc: "Ir a la página de Experiencia." },
        { cmd: "/projects", desc: "Ir a la página de Proyectos." },
        { cmd: "/blog", desc: "Ir a la página de Blog." },
        { cmd: "/contact", desc: "Ir a la página de Contacto." },
      ],
    },
  },
  header: {
    title: "Asistente de Portafolio",
    subtitle: "Pregúntame cualquier cosa sobre Juan",
    toggleSidebar: "Alternar barra lateral",
    toggleTheme: "Cambiar tema",
    language: "Idioma",
  },
  about: {
    title: "Sobre mí",
    p1: "Soy un apasionado Desarrollador Web con sede en Montréal, dedicado a construir aplicaciones web limpias, eficientes y centradas en el usuario.",
    p2: "Mi viaje en la tecnología está impulsado por la curiosidad de resolver problemas complejos y el deseo de crear experiencias digitales que marquen la diferencia.",
    skillsTitle: "Habilidades Principales",
  },
  experience: {
    title: "Experiencia Profesional",
  },
  projects: {
    title: "Proyectos Recientes",
    viewProject: "Ver Proyecto",
    viewGithub: "GitHub",
  },
  blog: {
    title: "Notas Técnicas",
    readMore: "Leer más",
    backToList: "Volver a la lista",
  },
  contact: {
    title: "Ponte en Contacto",
    p1: "¿Tienes alguna pregunta o quieres trabajar conmigo? ¡No dudes en contactarme!",
    formName: "Nombre",
    formEmail: "Correo electrónico",
    formMessage: "Mensaje",
    formSend: "Enviar Mensaje",
    successTitle: "¡Mensaje Enviado!",
    successMessage: "Gracias por contactarme. Te responderé pronto.",
    errorTitle: "¡Ups!",
    errorMessage: "Algo salió mal. Por favor, inténtalo de nuevo más tarde.",
  },
};
