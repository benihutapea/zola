import { Metadata } from 'next'
import { APP_NAME } from '@/lib/config'

export const metadata: Metadata = {
  title: `Usage & Billing | Dashboard | ${APP_NAME}`,
  description: 'Track your usage and manage billing'
}

// This is a placeholder for future implementation
export default function UsagePage() {
  return (
    <div className="container max-w-6xl py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Usage & Billing</h1>
        <p className="text-muted-foreground">
          Track your token usage and manage your subscription
        </p>
      </div>
      
      <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed">
        <div className="flex flex-col items-center text-center px-4">
          <h3 className="text-lg font-medium">Coming Soon</h3>
          <p className="text-sm text-muted-foreground mt-2">
            The complete usage tracking and billing management interface is under development.
            Check back later for detailed analytics, usage limits, and subscription options.
          </p>
        </div>
      </div>
    </div>
  )
}