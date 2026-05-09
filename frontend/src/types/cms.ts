export interface ChatbotResponse {
  id?: number;
  module: string;
  category?: string;
  triggers: string[];
  answers_en: string[];
  answers_es: string[];
  answers_fr: string[];
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
}

export interface PageContent {
  id?: number;
  section: string;
  key: string;
  en: string;
  es: string;
  fr: string;
}

export type CMSData = ChatbotResponse | BlogPost | PageContent;
