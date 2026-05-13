export interface AboutData {
  id?: number;
  p1_en: string;
  p1_es: string;
  p1_fr: string;
  p2_en: string;
  p2_es: string;
  p2_fr: string;
  skills: string[];
}

export interface ExperienceData {
  id?: number;
  company: string;
  role: string;
  period: string;
  description_en: string[];
  description_es?: string[];
  description_fr?: string[];
  tech: string[];
  order: number;
}

export interface ProjectData {
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

export interface BlogPost {
  id?: number;
  slug: string;
  date: string;
  category: string;
  title_en: string;
  title_es: string;
  title_fr: string;
  excerpt_en: string;
  excerpt_es: string;
  excerpt_fr: string;
  content_en: string;
  content_es: string;
  content_fr: string;
  published: boolean;
}

export interface ChatbotResponse {
  id?: number;
  module: string;
  category?: string;
  triggers: string[];
  answers_en: string[];
  answers_es: string[];
  answers_fr: string[];
}

export interface ChatMessage {
  id?: number;
  role: string;
  content: string;
  timestamp: string;
}

export interface ChatFeedback {
  id?: number;
  user_message: string;
  assistant_reply: string;
  is_helpful: boolean;
  module?: string;
  category?: string;
  timestamp: string;
}

export type CMSData =
  | AboutData
  | ExperienceData
  | ProjectData
  | BlogPost
  | ChatbotResponse
  | ChatMessage
  | ChatFeedback;
