import React, { useState, type ReactNode } from "react";
import { locales } from "../locales";
import {
  LanguageContext,
  getInitialLocale,
  type LocaleKey,
} from "./LanguageContextUtils";

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [locale, setLocaleState] = useState<LocaleKey>(getInitialLocale);

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
