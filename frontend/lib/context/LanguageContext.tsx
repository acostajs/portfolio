import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { locales, LocaleKey, TranslationType } from "../locales";

interface LanguageContextType {
  locale: LocaleKey;
  t: TranslationType;
  setLocale: (locale: LocaleKey) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [locale, setLocaleState] = useState<LocaleKey>("en");

  // Load from localStorage or system language on mount
  useEffect(() => {
    const savedLocale = localStorage.getItem("portfolio-locale") as LocaleKey;
    if (savedLocale && locales[savedLocale]) {
      setLocaleState(savedLocale);
    } else {
      const systemLang = navigator.language.split("-")[0] as LocaleKey;
      if (locales[systemLang]) {
        setLocaleState(systemLang);
      }
    }
  }, []);

  const setLocale = (newLocale: LocaleKey) => {
    setLocaleState(newLocale);
    localStorage.setItem("portfolio-locale", newLocale);
  };

  const t = locales[locale];

  return (
    <LanguageContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
