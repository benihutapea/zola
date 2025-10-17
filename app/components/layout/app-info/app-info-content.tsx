"use client";

import { useLocale } from "@/app/hooks/use-locale";

export function AppInfoContent() {
  const { t } = useLocale();
  
  return (
    <div className="space-y-4">
      <p className="text-foreground leading-relaxed">
        <span className="font-medium">Zola</span> {t("appInfoDescription1")}
        <br />
        {t("appInfoDescription2")}
        <br />
        {t("appInfoDescription3")}
        <br />
      </p>
      <p className="text-foreground leading-relaxed">
        {t("codeAvailableOn")}{" "}
        <a
          href="https://github.com/ibelick/zola"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          GitHub
        </a>
        .
      </p>
    </div>
  )
}
