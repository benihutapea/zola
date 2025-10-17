import { Metadata } from 'next'
import { APP_NAME } from '@/lib/config'

export const metadata: Metadata = {
  title: `Settings | Dashboard | ${APP_NAME}`,
  description: 'Manage your preferences and account settings'
}

// This is a placeholder for future implementation
export default function SettingsPage() {
  return (
    <div className="container max-w-6xl py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard Settings</h1>
        <p className="text-muted-foreground">
          Customize your dashboard experience and preferences
        </p>
      </div>
      
      <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed">
        <div className="flex flex-col items-center text-center px-4">
          <h3 className="text-lg font-medium">Coming Soon</h3>
          <p className="text-sm text-muted-foreground mt-2">
            The dashboard settings interface is under development.
            Check back later to customize your dashboard layout, widgets, and data preferences.
          </p>
        </div>
      </div>
    </div>
  )
}