"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface PulseLoaderProps {
  color?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PulseLoader({
  color,
  size = "md",
  className,
}: PulseLoaderProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Hindari hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const sizeClasses = {
    sm: "h-1 w-1",
    md: "h-2 w-2",
    lg: "h-3 w-3",
  };

  const defaultColor = mounted && theme === "dark" ? "#ffffff" : "#000000";
  const dotColor = color || defaultColor;

  return (
    <div
      className={cn(
        "flex items-center justify-center space-x-2",
        className
      )}
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={cn(
            "rounded-full",
            sizeClasses[size],
          )}
          style={{
            backgroundColor: dotColor,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
}