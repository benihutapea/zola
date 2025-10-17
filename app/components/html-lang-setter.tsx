"use client";

import { useLocale } from "@/app/hooks/use-locale";
import { useEffect } from "react";

export function HtmlLangSetter() {
  const { locale } = useLocale();

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}