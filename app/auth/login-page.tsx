"use client"

import { Button } from "@/components/ui/button"
import { signInWithGoogle } from "@/lib/api"
import { createClient } from "@/lib/supabase/client"
import { useLocale } from "@/app/hooks/use-locale"
import { AccessibilitySettingsDialog } from "@/app/components/accessibility-settings-dialog"
import { ThemeToggle } from "@/app/components/theme-toggle"
import { LanguageSwitcher } from "@/app/components/language-switcher"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { HeaderGoBack } from "../components/header-go-back"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { t } = useLocale()

  async function handleSignInWithGoogle() {
    const supabase = createClient()

    if (!supabase) {
      throw new Error("Supabase is not configured")
    }

    try {
      setIsLoading(true)
      setError(null)

      const data = await signInWithGoogle(supabase)

      // Redirect to the provider URL
      if (data?.url) {
        window.location.href = data.url
      }
    } catch (err: unknown) {
      console.error("Error signing in with Google:", err)
      
      // More descriptive error messages based on common issues
      let errorMessage = t("errorOccurred")
      
      if (err instanceof Error) {
        // Handle specific error types or messages
        if (err.message.includes("network")) {
          errorMessage = t("networkError")
        } else if (err.message.includes("CORS")) {
          errorMessage = t("corsError")
        } else if (err.message.includes("popup")) {
          errorMessage = t("popupError")
        } else if (err.message.includes("configuration")) {
          errorMessage = t("configError")
        } else {
          // Use the original error message if available
          errorMessage = err.message || errorMessage
        }
      }
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-background flex h-dvh w-full flex-col">
      <div className="flex justify-between items-center">
        <HeaderGoBack href="/" />
        <div className="flex items-center gap-2 p-2">
          <AccessibilitySettingsDialog />
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </div>

      <main className="flex flex-1 flex-col items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-foreground text-3xl font-medium tracking-tight sm:text-4xl">
              {t("welcome")}
            </h1>
            <p className="text-muted-foreground mt-3">
              {t("messageLimits")}
            </p>
          </div>
          {error && (
            <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">
              {error}
            </div>
          )}
          <div className="mt-8">
            <Button
              variant="secondary"
              className="w-full text-base sm:text-base"
              size="lg"
              onClick={handleSignInWithGoogle}
              disabled={isLoading}
            >
              <Image
                src="https://www.google.com/favicon.ico"
                alt="Google logo"
                width={20}
                height={20}
                className="mr-2 size-4"
              />
              <span>
                {isLoading ? t("connecting") : t("continueWithGoogle")}
              </span>
            </Button>
          </div>
        </div>
      </main>

      <footer className="text-muted-foreground py-6 text-center text-sm">
        {/* @todo */}
        <p>
          {t("agreementText", {
            terms: `<Link href="/" className="text-foreground hover:underline">${t("termsOfService")}</Link>`,
            privacy: `<Link href="/" className="text-foreground hover:underline">${t("privacyPolicy")}</Link>`
          }).replace(
            /<Link([^>]*)>(.*?)<\/Link>/g, 
            (_, props, content) => (
              `<Link ${props}>${content}</Link>`
            )
          )}
        </p>
      </footer>
    </div>
  )
}
