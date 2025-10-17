"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type Locale = "en" | "id" | "de" | "fr" | "es";
type Translations = Record<string, string>;

interface LocaleContextType {
  locale: Locale;
  translations: Translations;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string>) => string;
  availableLocales: Locale[];
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

// Daftar bahasa yang tersedia dalam aplikasi
const availableLocales: Locale[] = ["en", "id", "de", "fr", "es"];

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");
  const [translations, setTranslations] = useState<Translations>({});

  useEffect(() => {
    // Check for stored locale preference
    const savedLocale = localStorage.getItem("locale") as Locale | null;
    if (savedLocale && availableLocales.includes(savedLocale)) {
      setLocale(savedLocale);
    } else {
      // Detect browser language
      const browserLocale = navigator.language.split("-")[0] as Locale;
      if (availableLocales.includes(browserLocale)) {
        setLocale(browserLocale);
      }
    }
  }, []);

  useEffect(() => {
    // Load translations for the selected locale
    const loadTranslations = async () => {
      try {
        const translations = (await import(`../locales/${locale}.json`)).default;
        setTranslations(translations);
        localStorage.setItem("locale", locale);
      } catch (error) {
        console.error(`Failed to load translations for ${locale}:`, error);
        // Fallback to English if translation file cannot be loaded
        if (locale !== "en") {
          const enTranslations = (await import("../locales/en.json")).default;
          setTranslations(enTranslations);
        }
      }
    };

    loadTranslations();
  }, [locale]);

  const t = (key: string, params?: Record<string, string>): string => {
    let text = translations[key] || key;
    
    if (params) {
      Object.keys(params).forEach(param => {
        const regex = new RegExp(`{${param}}`, "g");
        text = text.replace(regex, params[param]);
      });
    }
    
    return text;
  };

  return (
    <LocaleContext.Provider value={{ locale, translations, setLocale, t, availableLocales }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}