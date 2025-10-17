import { useCallback, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Award, Check, MessageCircle, X } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const USER_ACTIVITY_KEY = 'zulu-user-activity'
const ACTIVITY_THRESHOLD = 5

interface ProgressProps {
  step: number
  totalSteps: number
}

const Progress: React.FC<ProgressProps> = ({ step, totalSteps }) => {
  return (
    <div className="flex justify-center gap-1.5 mt-4">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <motion.div
          key={i}
          className={`h-1.5 rounded-full ${
            i < step ? 'bg-primary' : 'bg-muted'
          }`}
          initial={{ width: 0 }}
          animate={{ width: i < step ? '100%' : '20px' }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
        />
      ))}
    </div>
  )
}

interface UserAchievementProps {
  onClose: () => void
}

export const UserAchievement: React.FC<UserAchievementProps> = ({ onClose }) => {
  const [show, setShow] = useState(false)
  const [activityCount, setActivityCount] = useState(0)
  const t = useTranslations()

  // Get stored activity count
  useEffect(() => {
    try {
      const storedActivity = localStorage.getItem(USER_ACTIVITY_KEY)
      if (storedActivity) {
        const activity = JSON.parse(storedActivity)
        setActivityCount(activity.count || 0)
      }
    } catch {
      // If error, start with 0
    }
  }, [])

  // Show achievement when threshold is reached
  useEffect(() => {
    if (activityCount >= ACTIVITY_THRESHOLD && !localStorage.getItem('zulu-achievement-shown')) {
      setShow(true)
    }
  }, [activityCount])

  const handleClose = useCallback(() => {
    setShow(false)
    localStorage.setItem('zulu-achievement-shown', 'true')
    setTimeout(onClose, 300) // Allow animation to complete
  }, [onClose])

  if (!show) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-background/80 backdrop-blur-sm">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="w-full max-w-md p-1"
        >
          <Card className="p-6 overflow-hidden">
            <div className="absolute top-2 right-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: 'spring',
                    damping: 10,
                    stiffness: 100,
                    delay: 0.3
                  }}
                  className="bg-gradient-to-tr from-primary/20 to-primary/10 rounded-full p-4"
                >
                  <Award className="h-12 w-12 text-primary" />
                </motion.div>
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="absolute -right-1 -bottom-1 bg-green-500 text-white rounded-full p-1"
                >
                  <Check className="h-4 w-4" />
                </motion.div>
              </div>

              <motion.h3 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-2xl font-bold mb-2"
              >
                {t('achievementUnlocked')}
              </motion.h3>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center text-muted-foreground mb-6"
              >
                {t('conversationMaster')}
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex items-center gap-2 mb-6 bg-muted/50 p-2 rounded-lg"
              >
                <MessageCircle className="h-5 w-5 text-primary" />
                <span>{t('completedConversations', { count: ACTIVITY_THRESHOLD })}</span>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="w-full"
              >
                <Button
                  onClick={handleClose}
                  className="w-full"
                  variant="default"
                >
                  {t('continue')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </motion.div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}