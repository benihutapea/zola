import { Metadata } from 'next'
import { APP_NAME } from '@/lib/config'

export const metadata: Metadata = {
  title: `Conversations | Dashboard | ${APP_NAME}`,
  description: 'View and manage all your conversations'
}

// This is a placeholder for future implementation
export default function ConversationsPage() {
  return (
    <div className="container max-w-6xl py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">All Conversations</h1>
        <p className="text-muted-foreground">
          Browse, search and manage your conversation history
        </p>
      </div>
      
      <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed">
        <div className="flex flex-col items-center text-center px-4">
          <h3 className="text-lg font-medium">Coming Soon</h3>
          <p className="text-sm text-muted-foreground mt-2">
            The full conversations management interface is under development.
            Check back later for advanced filtering, search, and organization features.
          </p>
        </div>
      </div>
    </div>
  )
}