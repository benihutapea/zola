"use client";

import { motion } from "framer-motion";
import { useLocale } from "@/app/hooks/use-locale";

export function WelcomeHeader() {
  const { t } = useLocale();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
      }
    },
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center mb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 
        className="text-4xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
        variants={itemVariants}
      >
        {t("welcome")}
      </motion.h1>
      
      <motion.p 
        className="text-lg text-muted-foreground max-w-md"
        variants={itemVariants}
      >
        {t("askAnything")}
      </motion.p>
    </motion.div>
  );
}