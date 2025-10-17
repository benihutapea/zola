import { useState, useEffect } from 'react'

interface Conversation {
  id: string
  title: string
  modelId: string
  modelName: string
  lastMessageAt: Date
  messageCount: number
}

interface UseRecentConversationsResult {
  conversations: Conversation[] | undefined
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

export function useRecentConversations(): UseRecentConversationsResult {
  const [conversations, setConversations] = useState<Conversation[]>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  const [refreshKey, setRefreshKey] = useState<number>(0)

  const refetch = () => {
    setRefreshKey(prev => prev + 1)
  }

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch('/api/dashboard/recent-conversations')
        
        if (!response.ok) {
          throw new Error('Failed to fetch recent conversations')
        }

        const data = await response.json()
        
        // Parse dates
        const parsedConversations = data.conversations.map((conv: {
          id: string;
          title: string;
          modelId: string;
          modelName: string;
          lastMessageAt: string;
          messageCount: number;
        }) => ({
          ...conv,
          lastMessageAt: new Date(conv.lastMessageAt)
        }))

        setConversations(parsedConversations)
      } catch (err) {
        console.error('Error fetching conversations:', err)
        setError(err instanceof Error ? err : new Error('Unknown error occurred'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchConversations()
  }, [refreshKey])

  return { conversations, isLoading, error, refetch }
}