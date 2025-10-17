import React, { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { FileSpreadsheet, History, LanguagesIcon, Palette, Settings } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FloatingActionButton } from './floating-action-button'

interface QuickAccessToolbarProps {
  onToggleHistory?: () => void
  onToggleSettings?: () => void
  onToggleTheme?: () => void
  onToggleLanguage?: () => void
  onToggleAccessibility?: () => void
  className?: string
}

export const QuickAccessToolbar = ({
  onToggleHistory,
  onToggleSettings,
  onToggleTheme,
  onToggleLanguage,
  onToggleAccessibility,
  className = ''
}: QuickAccessToolbarProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const t = useTranslations()

  // Check viewport size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Auto-collapse after selection on mobile
  const handleAction = (action: (() => void) | undefined) => {
    if (action) action()
    if (isMobile) {
      setIsExpanded(false)
    }
  }

  const toolbarItems = [
    {
      icon: <History className="h-5 w-5" />,
      label: 'history',
      action: () => handleAction(onToggleHistory)
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: 'settings',
      action: () => handleAction(onToggleSettings)
    },
    {
      icon: <Palette className="h-5 w-5" />,
      label: 'toggleTheme',
      action: () => handleAction(onToggleTheme)
    },
    {
      icon: <LanguagesIcon className="h-5 w-5" />,
      label: 'switchLanguage',
      action: () => handleAction(onToggleLanguage)
    },
    {
      icon: <FileSpreadsheet className="h-5 w-5" />,
      label: 'accessibilitySettings',
      action: () => handleAction(onToggleAccessibility)
    }
  ]

  return (
    <>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
            className={`fixed ${isMobile ? 'bottom-24 right-6' : 'bottom-24 right-6'} z-40 ${className}`}
          >
            <Card className="p-2 flex flex-col gap-2 shadow-lg">
              {toolbarItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05, duration: 0.2 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={item.action}
                    className="w-full flex items-center justify-start gap-2"
                  >
                    {item.icon}
                    <span>{t(item.label)}</span>
                  </Button>
                </motion.div>
              ))}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      
      <FloatingActionButton
        icon={
          isExpanded ? (
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 45 }}
              className="h-6 w-6 flex items-center justify-center"
            >
              +
            </motion.div>
          ) : (
            <motion.div
              initial={{ rotate: 45 }}
              animate={{ rotate: 0 }}
              className="h-6 w-6 flex items-center justify-center"
            >
              +
            </motion.div>
          )
        }
        label={isExpanded ? 'close' : 'quickAccess'}
        onClick={() => setIsExpanded(!isExpanded)}
        position="bottom-right"
        className={className}
      />
    </>
  )
}