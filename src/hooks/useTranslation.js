import { useLanguage } from "@/context/LanguageContext";

export function useTranslation() {
  const { t, language, isArabic, toggleLanguage } = useLanguage();
  return { t, language, isArabic, toggleLanguage };
}
