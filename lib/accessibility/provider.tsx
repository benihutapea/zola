"use client";

import { useState, createContext, useContext, useEffect } from "react";
import { useLocale } from "@/app/hooks/use-locale";
import { useMediaQuery } from "@/lib/hooks/use-media-query";

interface AccessibilityContextType {
  highContrast: boolean;
  toggleHighContrast: () => void;
  reducedMotion: boolean;
  toggleReducedMotion: () => void;
  showTooltips: boolean;
  toggleTooltips: () => void;
  enableAnimations: boolean;
  toggleAnimations: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(
  undefined
);

export function AccessibilityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const prefersReducedMotion = useMediaQuery(
    "(prefers-reduced-motion: reduce)"
  );
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [showTooltips, setShowTooltips] = useState(true);
  const [enableAnimations, setEnableAnimations] = useState(true);

  // Deteksi preferensi sistem untuk reduced motion
  useEffect(() => {
    setReducedMotion(prefersReducedMotion);
  }, [prefersReducedMotion]);

  // Load settings dari localStorage
  useEffect(() => {
    const savedHighContrast = localStorage.getItem("highContrast");
    const savedReducedMotion = localStorage.getItem("reducedMotion");
    const savedShowTooltips = localStorage.getItem("showTooltips");
    const savedEnableAnimations = localStorage.getItem("enableAnimations");

    if (savedHighContrast) {
      setHighContrast(savedHighContrast === "true");
    }
    
    if (savedReducedMotion) {
      setReducedMotion(savedReducedMotion === "true");
    } else {
      setReducedMotion(prefersReducedMotion);
    }
    
    if (savedShowTooltips) {
      setShowTooltips(savedShowTooltips === "true");
    }
    
    if (savedEnableAnimations) {
      setEnableAnimations(savedEnableAnimations === "true");
    } else {
      setEnableAnimations(!prefersReducedMotion);
    }
  }, [prefersReducedMotion]);

  // Apply settings ke document
  useEffect(() => {
    document.documentElement.classList.toggle(
      "high-contrast-mode",
      highContrast
    );
    document.documentElement.classList.toggle(
      "reduce-motion",
      reducedMotion
    );
    document.documentElement.classList.toggle(
      "no-animations",
      !enableAnimations
    );
    document.documentElement.classList.toggle(
      "show-tooltips",
      showTooltips
    );
  }, [highContrast, reducedMotion, showTooltips, enableAnimations]);

  const toggleHighContrast = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    localStorage.setItem("highContrast", String(newValue));
  };

  const toggleReducedMotion = () => {
    const newValue = !reducedMotion;
    setReducedMotion(newValue);
    localStorage.setItem("reducedMotion", String(newValue));
  };

  const toggleTooltips = () => {
    const newValue = !showTooltips;
    setShowTooltips(newValue);
    localStorage.setItem("showTooltips", String(newValue));
  };

  const toggleAnimations = () => {
    const newValue = !enableAnimations;
    setEnableAnimations(newValue);
    localStorage.setItem("enableAnimations", String(newValue));
  };

  return (
    <AccessibilityContext.Provider
      value={{
        highContrast,
        toggleHighContrast,
        reducedMotion,
        toggleReducedMotion,
        showTooltips,
        toggleTooltips,
        enableAnimations,
        toggleAnimations,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error(
      "useAccessibility must be used within an AccessibilityProvider"
    );
  }
  return context;
}