import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

interface FloatingActionButtonProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  className?: string
}

export const FloatingActionButton = ({
  icon,
  label,
  onClick,
  position = 'bottom-right',
  className = ''
}: FloatingActionButtonProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const t = useTranslations()
  
  // Position classes
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  }

  // Show button after a short delay for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [])
  
  // Handle button click with animation
  const handleClick = useCallback(() => {
    // Add click effect
    setIsVisible(false)
    // Wait for exit animation
    setTimeout(() => {
      onClick()
      // Show again after action
      setTimeout(() => setIsVisible(true), 300)
    }, 200)
  }, [onClick])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`fixed z-40 ${positionClasses[position]} ${className}`}
        >
          <Button
            onClick={handleClick}
            size="lg"
            variant="default"
            className="h-14 w-14 rounded-full p-3 shadow-lg hover:shadow-xl transition-all"
            aria-label={label}
          >
            {icon}
            <span className="sr-only">{label}</span>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}