"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { CheckIcon } from "lucide-react";
import Image from "next/image";

interface AnimatedModelCardProps {
  id: string;
  name: string;
  description?: string;
  iconUrl?: string;
  iconComponent?: React.ReactNode;
  isSelected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function AnimatedModelCard({
  id,
  name,
  description,
  iconUrl,
  iconComponent,
  isSelected = false,
  onClick,
  disabled = false,
  className,
}: AnimatedModelCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "relative flex flex-col items-start gap-2 rounded-lg border p-4",
        "cursor-pointer transition-all duration-200",
        isSelected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={!disabled ? onClick : undefined}
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-3">
          {iconUrl && (
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-md bg-background">
              <Image
                src={iconUrl}
                alt={name}
                width={24}
                height={24}
                className="h-6 w-6 object-contain"
              />
            </div>
          )}
          {!iconUrl && iconComponent && (
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-md bg-background">
              {iconComponent}
            </div>
          )}
          <span className="font-medium">{name}</span>
        </div>
        {isSelected && (
          <div className="rounded-full bg-primary p-1 text-primary-foreground">
            <CheckIcon className="h-3 w-3" />
          </div>
        )}
      </div>
      {description && (
        <p className="text-muted-foreground text-sm">{description}</p>
      )}
    </motion.div>
  );
}