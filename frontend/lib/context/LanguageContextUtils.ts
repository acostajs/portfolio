import { createContext, useContext } from "react";
import { locales, type LocaleKey, type TranslationType } from "../locales";

export interface LanguageContextType {
  locale: LocaleKey;
  t: TranslationType;
  setLocale: (locale: LocaleKey) => void;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const getInitialLocale = (): LocaleKey => {
  if (typeof window === "undefined") return "en";

  const savedLocale = localStorage.getItem("portfolio-locale") as LocaleKey;
  if (savedLocale && locales[savedLocale]) {
    return savedLocale;
  }

  const systemLang = navigator.language.split("-")[0] as LocaleKey;
  if (locales[systemLang]) {
    return systemLang;
  }

  return "en";
};
