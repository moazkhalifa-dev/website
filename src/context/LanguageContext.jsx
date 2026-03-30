import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { translations } from "@/i18n/translations";

const LANGUAGE_STORAGE_KEY = "site_language";
const SUPPORTED_LANGUAGES = ["en", "ar"];

const LanguageContext = createContext(undefined);

function getNestedValue(source, path) {
  return path
    .split(".")
    .reduce(
      (value, key) =>
        value && typeof value === "object" && key in value
          ? value[key]
          : undefined,
      source,
    );
}

function interpolate(template, params) {
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    if (!(key in params)) return `{${key}}`;
    return String(params[key]);
  });
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return SUPPORTED_LANGUAGES.includes(stored) ? stored : "en";
  });

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === "en" ? "ar" : "en"));
  }, []);

  const t = useCallback(
    (key, params = {}) => {
      const valueInCurrent = getNestedValue(translations[language], key);
      const valueInEnglish = getNestedValue(translations.en, key);
      const resolved = valueInCurrent ?? valueInEnglish ?? key;

      if (typeof resolved !== "string") return String(resolved);
      return interpolate(resolved, params);
    },
    [language],
  );

  const contextValue = useMemo(
    () => ({
      language,
      isArabic: language === "ar",
      setLanguage,
      toggleLanguage,
      t,
    }),
    [language, t, toggleLanguage],
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
