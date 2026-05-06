import { useLanguage } from "../context/LanguageContext";

export const useTranslation = () => {
  const { t, locale, setLocale } = useLanguage();
  return { t, locale, setLocale };
};
