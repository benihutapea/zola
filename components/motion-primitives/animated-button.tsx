"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

interface AnimatedButtonProps extends HTMLMotionProps<"button"> {
  variant?: "default" | "ghost" | "hover";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ variant = "default", size = "md", children, className, ...props }, ref) => {
    const sizeClasses = {
      sm: "text-sm px-3 py-1",
      md: "px-4 py-2",
      lg: "text-lg px-6 py-3",
    };

    const variantClasses = {
      default:
        "bg-primary text-primary-foreground hover:bg-primary/90 rounded-md",
      ghost:
        "bg-transparent hover:bg-muted hover:text-foreground rounded-md",
      hover:
        "bg-transparent hover:bg-muted/50 rounded-md",
    };

    return (
      <motion.button
        ref={ref}
        className={cn(
          "font-medium transition-colors",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";

export const ButtonWithIcon = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <AnimatedButton
        ref={ref}
        className={cn("flex items-center gap-2", className)}
        {...props}
      >
        {children}
      </AnimatedButton>
    );
  }
);

ButtonWithIcon.displayName = "ButtonWithIcon";