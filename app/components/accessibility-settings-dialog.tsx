"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAccessibility } from "@/lib/accessibility/provider";
import { useLocale } from "@/app/hooks/use-locale";
import { Settings } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function AccessibilitySettingsDialog() {
  const { t } = useLocale();
  const {
    highContrast,
    toggleHighContrast,
    reducedMotion,
    toggleReducedMotion,
    showTooltips,
    toggleTooltips,
    enableAnimations,
    toggleAnimations,
  } = useAccessibility();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          aria-label={t("accessibilitySettings")}
        >
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("accessibilitySettings")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="high-contrast">{t("highContrastMode")}</Label>
            <Switch
              id="high-contrast"
              checked={highContrast}
              onCheckedChange={toggleHighContrast}
            />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="reduced-motion">{t("reducedMotion")}</Label>
            <Switch
              id="reduced-motion"
              checked={reducedMotion}
              onCheckedChange={toggleReducedMotion}
            />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="show-tooltips">{t("tooltips")}</Label>
            <Switch
              id="show-tooltips"
              checked={showTooltips}
              onCheckedChange={toggleTooltips}
            />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="enable-animations">{t("animations")}</Label>
            <Switch
              id="enable-animations"
              checked={enableAnimations}
              onCheckedChange={toggleAnimations}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}