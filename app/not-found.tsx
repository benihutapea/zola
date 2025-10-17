"use client";

import { useLocale } from "@/app/hooks/use-locale";

export default function NotFound() {
  const { t } = useLocale();
  
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-xl font-semibold">{t("pageNotFoundTitle")}</h1>
        <p className="text-muted-foreground mt-2">
          {t("pageNotFoundDescription")}
        </p>
      </div>
    </div>
  )
}
