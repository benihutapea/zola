'use client'

import { RecentActivity } from '@/app/components/dashboard/recent-activity'
import { useRecentConversations } from '@/app/hooks/use-recent-conversations'

export function RecentActivityClient() {
  const { conversations, isLoading } = useRecentConversations()
  
  return (
    <RecentActivity 
      conversations={conversations} 
      isLoading={isLoading} 
    />
  )
}