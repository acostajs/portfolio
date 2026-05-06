import { en } from "./en";
import { fr } from "./fr";
import { es } from "./es";

export const locales = {
  en,
  fr,
  es,
};

export type LocaleKey = keyof typeof locales;
export type { TranslationType } from "./en";
