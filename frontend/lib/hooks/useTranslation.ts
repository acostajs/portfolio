import { useLanguage } from "../context/LanguageContextUtils";

export const useTranslation = () => {
  const { t, locale, setLocale } = useLanguage();
  return { t, locale, setLocale };
};
