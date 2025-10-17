import { Metadata } from 'next'
import { ConversationMetrics } from '@/app/components/dashboard/conversation-metrics'
import { RecentActivityClient } from '@/app/components/dashboard/recent-activity-client'
import { TokenUsageClient } from '@/app/components/dashboard/token-usage-client'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { APP_NAME } from '@/lib/config'

export const metadata: Metadata = {
  title: `Dashboard | ${APP_NAME}`,
  description: 'Your conversation statistics and insights'
}

export default function DashboardPage() {
  return (
    <div className="container max-w-6xl py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          View insights and statistics about your conversations
        </p>
      </div>
      
      <ConversationMetrics />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your most recent conversations</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <RecentActivityClient />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Token Usage</CardTitle>
            <CardDescription>Track your token consumption by model</CardDescription>
          </CardHeader>
          <CardContent className="p-0 px-4">
            <TokenUsageClient />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}