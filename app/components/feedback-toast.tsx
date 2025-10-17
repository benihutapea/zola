import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface FeedbackToastProps {
  message: string
  type: 'success' | 'error' | 'info'
  duration?: number
  onClose?: () => void
}

export const FeedbackToast: React.FC<FeedbackToastProps> = ({
  message,
  type,
  duration = 5000,
  onClose
}) => {
  const [visible, setVisible] = useState(true)
  const t = useTranslations()

  const handleClose = useCallback(() => {
    setVisible(false)
    if (onClose) {
      setTimeout(onClose, 300) // Allow exit animation to complete
    }
  }, [onClose])

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, handleClose])

  const handleClose = () => {
    setVisible(false)
    if (onClose) {
      setTimeout(onClose, 300) // Allow exit animation to complete
    }
  }

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100 border-green-500 text-green-900 dark:bg-green-900/30 dark:text-green-100 dark:border-green-700'
      case 'error':
        return 'bg-red-100 border-red-500 text-red-900 dark:bg-red-900/30 dark:text-red-100 dark:border-red-700'
      case 'info':
      default:
        return 'bg-blue-100 border-blue-500 text-blue-900 dark:bg-blue-900/30 dark:text-blue-100 dark:border-blue-700'
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )
      case 'error':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        )
      case 'info':
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2h2a1 1 0 100-2H9z"
              clipRule="evenodd"
            />
          </svg>
        )
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className={`fixed bottom-5 right-5 max-w-xs p-4 rounded-lg shadow-lg border-l-4 z-50 flex items-start gap-3 ${getToastStyles()}`}
        >
          <div className="flex-shrink-0">{getIcon()}</div>
          <div className="flex-1">{message}</div>
          <button
            onClick={handleClose}
            className="flex-shrink-0 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-primary"
            aria-label={t('close')}
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export const ToastContainer: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <div className="fixed bottom-5 right-5 flex flex-col gap-4 z-50">
      {children}
    </div>
  )
}