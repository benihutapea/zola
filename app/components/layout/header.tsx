"use client"

import { HistoryTrigger } from "@/app/components/history/history-trigger"
import { AppInfoTrigger } from "@/app/components/layout/app-info/app-info-trigger"
import { ButtonNewChat } from "@/app/components/layout/button-new-chat"
import { UserMenu } from "@/app/components/layout/user-menu"
import { useBreakpoint } from "@/app/hooks/use-breakpoint"
import { useLocale } from "@/app/hooks/use-locale"
import { LanguageSwitcher } from "@/app/components/language-switcher"
import { ThemeToggle } from "@/app/components/theme-toggle"
import { AccessibilitySettingsDialog } from "@/app/components/accessibility-settings-dialog"
import { ZuluIcon } from "@/components/icons/zulu"
import { Button } from "@/components/ui/button"
import { BarChart3 } from "lucide-react"
import { APP_NAME } from "@/lib/config"
import { useUserPreferences } from "@/lib/user-preference-store/provider"
import { useUser } from "@/lib/user-store/provider"
import { Info } from "@phosphor-icons/react"
import Link from "next/link"
import { DialogPublish } from "./dialog-publish"
import { HeaderSidebarTrigger } from "./header-sidebar-trigger"

export function Header({ hasSidebar }: { hasSidebar: boolean }) {
  const isMobile = useBreakpoint(768)
  const { user } = useUser()
  const { preferences } = useUserPreferences()
  const isMultiModelEnabled = preferences.multiModelEnabled
  const { t } = useLocale()

  const isLoggedIn = !!user

  return (
    <header className="h-app-header pointer-events-none fixed top-0 right-0 left-0 z-50">
      <div className="relative mx-auto flex h-full max-w-full items-center justify-between bg-transparent px-4 sm:px-6 lg:bg-transparent lg:px-8">
        <div className="flex flex-1 items-center justify-between">
          <div className="-ml-0.5 flex flex-1 items-center gap-2 lg:-ml-2.5">
            <div className="flex flex-1 items-center gap-2">
              <Link
                href="/"
                className="pointer-events-auto inline-flex items-center text-xl font-medium tracking-tight"
              >
                <ZuluIcon className="mr-1 size-4" />
                {APP_NAME}
              </Link>
              {hasSidebar && isMobile && <HeaderSidebarTrigger />}
            </div>
          </div>
          <div />
          {!isLoggedIn ? (
            <div className="pointer-events-auto flex flex-1 items-center justify-end gap-4">
              <AppInfoTrigger
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-background hover:bg-muted text-muted-foreground h-8 w-8 rounded-full"
                    aria-label={`About ${APP_NAME}`}
                  >
                    <Info className="size-4" />
                  </Button>
                }
              />
              <AccessibilitySettingsDialog />
              <ThemeToggle />
              <LanguageSwitcher />
              <Link
                href="/auth"
                className="font-base text-muted-foreground hover:text-foreground text-base transition-colors"
              >
                {t("login")}
              </Link>
            </div>
          ) : (
            <div className="pointer-events-auto flex flex-1 items-center justify-end gap-2">
              {!isMultiModelEnabled && <DialogPublish />}
              <ButtonNewChat />
              {!hasSidebar && <HistoryTrigger hasSidebar={hasSidebar} />}
              <Link href="/dashboard">
                <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Dashboard">
                  <BarChart3 className="h-4 w-4" />
                </Button>
              </Link>
              <AccessibilitySettingsDialog />
              <ThemeToggle />
              <LanguageSwitcher />
              <UserMenu />
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
