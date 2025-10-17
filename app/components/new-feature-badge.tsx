import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { AnimatePresence, motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Sparkles } from 'lucide-react'

interface NewFeatureBadgeProps {
  featureKey: string
  children: React.ReactNode
  dismissable?: boolean
  expiryDays?: number
}

export const NewFeatureBadge = ({
  featureKey,
  children,
  dismissable = true,
  expiryDays = 7
}: NewFeatureBadgeProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const t = useTranslations()

  // Check if the feature has been seen before
  useEffect(() => {
    const checkFeatureSeen = () => {
      try {
        const seenFeatures = JSON.parse(localStorage.getItem('zulu-seen-features') || '{}')
        
        // If the feature hasn't been seen or has expired
        if (!seenFeatures[featureKey]) {
          setIsVisible(true)
          return
        }
        
        // Check if the feature badge has expired
        const seenDate = new Date(seenFeatures[featureKey])
        const now = new Date()
        const diffTime = now.getTime() - seenDate.getTime()
        const diffDays = diffTime / (1000 * 3600 * 24)
        
        if (diffDays > expiryDays) {
          setIsVisible(true)
        }
      } catch {
        // If there's an error reading localStorage, show the badge
        setIsVisible(true)
      }
    }
    
    checkFeatureSeen()
  }, [featureKey, expiryDays])
  
  // Mark feature as seen
  const dismissFeature = () => {
    if (!dismissable) return
    
    try {
      const seenFeatures = JSON.parse(localStorage.getItem('zulu-seen-features') || '{}')
      seenFeatures[featureKey] = new Date().toISOString()
      localStorage.setItem('zulu-seen-features', JSON.stringify(seenFeatures))
      setIsVisible(false)
    } catch (error) {
      console.error('Failed to save feature state:', error)
    }
  }

  if (!isVisible) {
    return children
  }

  return (
    <div className="relative group">
      {children}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute -top-2 -right-2 z-10"
        >
          <Badge 
            variant="default" 
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 cursor-pointer px-3 py-1 flex items-center gap-1"
            onClick={dismissFeature}
          >
            <Sparkles className="h-3 w-3" />
            <span>{t('new')}</span>
          </Badge>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}