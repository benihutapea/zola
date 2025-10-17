"use client";

import { useLocale } from "@/app/hooks/use-locale";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { CheckIcon, Globe } from "lucide-react";
import { useState } from "react";

// Definisi bahasa yang didukung
const languageDetails: Record<string, { name: string; flag: string; enabled: boolean }> = {
  en: { name: "English", flag: "🇺🇸", enabled: true },
  id: { name: "Bahasa Indonesia", flag: "🇮🇩", enabled: true },
  de: { name: "Deutsch", flag: "🇩🇪", enabled: false },
  fr: { name: "Français", flag: "🇫🇷", enabled: false },
  es: { name: "Español", flag: "🇪🇸", enabled: false }
};

export function LanguageSelector() {
  const { locale, setLocale, t, availableLocales } = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  // Buat daftar bahasa dengan data lengkap
  const languages = availableLocales.map(code => ({
    code,
    name: languageDetails[code]?.name || code,
    flag: languageDetails[code]?.flag || "🌐",
    disabled: languageDetails[code]?.enabled === false
  }));

  // Filter bahasa yang sudah tersedia dan yang masih dalam pengembangan
  const availableLanguages = languages.filter(lang => !lang.disabled);
  const upcomingLanguages = languages.filter(lang => lang.disabled);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-9 flex items-center gap-2 px-3"
          aria-label={t("switchLanguage")}
        >
          <Globe className="h-4 w-4" />
          <span className="hidden md:inline">{languages.find(l => l.code === locale)?.name || "English"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {availableLanguages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => {
              setLocale(language.code as "en" | "id");
              setIsOpen(false);
            }}
            className="flex items-center justify-between px-3 py-2 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <span className="text-base">{language.flag}</span>
              <span>{language.name}</span>
            </span>
            {locale === language.code && <CheckIcon className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}

        {upcomingLanguages.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="px-3 py-2 text-xs text-muted-foreground">{t("comingSoon")}</div>
            {upcomingLanguages.map((language) => (
              <DropdownMenuItem
                key={language.code}
                disabled
                className="flex items-center justify-between px-3 py-2 opacity-50 cursor-not-allowed"
              >
                <span className="flex items-center gap-2">
                  <span className="text-base">{language.flag}</span>
                  <span>{language.name}</span>
                </span>
                <span className="text-xs italic">{t("soon")}</span>
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}