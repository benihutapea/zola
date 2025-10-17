"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/app/hooks/use-locale";
import { X } from "lucide-react";
import { useUser } from "@/lib/user-store/provider";

interface OnboardingTipProps {
  title: string;
  description: string;
  step: number;
  totalSteps: number;
  onDismiss: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

function OnboardingTip({
  title,
  description,
  step,
  totalSteps,
  onDismiss,
  onNext,
  onPrevious,
}: OnboardingTipProps) {
  const { t } = useLocale();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-card border-border shadow-xl fixed bottom-20 right-4 z-50 max-w-xs rounded-lg border p-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-lg">{title}</h3>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={onDismiss}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">{t("close")}</span>
        </Button>
      </div>
      <p className="text-muted-foreground mt-2 text-sm">{description}</p>
      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs">
          {step} / {totalSteps}
        </div>
        <div className="flex gap-2">
          {step > 1 && (
            <Button size="sm" variant="outline" onClick={onPrevious}>
              {t("previous")}
            </Button>
          )}
          {step < totalSteps ? (
            <Button size="sm" onClick={onNext}>
              {t("next")}
            </Button>
          ) : (
            <Button size="sm" onClick={onDismiss}>
              {t("finish")}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function Onboarding() {
  const [step, setStep] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const { t } = useLocale();
  const { user } = useUser();
  
  // Periksa localStorage untuk melihat apakah onboarding sudah ditutup
  useEffect(() => {
    const onboardingCompleted = localStorage.getItem("onboardingCompleted");
    if (onboardingCompleted === "true") {
      setDismissed(true);
    } else {
      // Cek apakah ini adalah kunjungan pertama
      setStep(1);
    }
  }, []);
  
  const onboardingSteps = [
    {
      title: t("welcomeToZulu"),
      description: t("welcomeOnboardingDesc"),
    },
    {
      title: t("chooseYourModel"),
      description: t("modelSelectionDesc"),
    },
    {
      title: t("accessibilityFeatures"),
      description: t("accessibilityDesc"),
    },
    {
      title: t("multiLanguageSupport"),
      description: t("languageSupportDesc"),
    },
  ];
  
  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem("onboardingCompleted", "true");
  };
  
  const handleNext = () => {
    setStep(prev => Math.min(prev + 1, onboardingSteps.length));
  };
  
  const handlePrevious = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };
  
  // Jangan tampilkan onboarding jika user belum login atau sudah ditutup
  if (!user || dismissed || step === 0) {
    return null;
  }
  
  const currentStep = onboardingSteps[step - 1];
  
  return (
    <AnimatePresence>
      <OnboardingTip
        title={currentStep.title}
        description={currentStep.description}
        step={step}
        totalSteps={onboardingSteps.length}
        onDismiss={handleDismiss}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </AnimatePresence>
  );
}