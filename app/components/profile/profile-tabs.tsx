'use client'

import React from 'react'
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs'
// Import components directly
import { ProfileSecurity } from './profile-security'

// Component definitions - moved inline to avoid import issues
const ProfilePreferences = () => {
  return (
    <div className="space-y-6">
      <div className="p-4 border rounded-lg bg-muted/30">
        <h3 className="text-lg font-medium mb-2">Preference Settings</h3>
        <p className="text-muted-foreground">
          User interface and appearance preferences will appear here.
        </p>
      </div>
    </div>
  )
}

const ProfileActivity = () => {
  return (
    <div className="space-y-6">
      <div className="p-4 border rounded-lg bg-muted/30">
        <h3 className="text-lg font-medium mb-2">Activity History</h3>
        <p className="text-muted-foreground">
          Your recent chat history and activity will appear here.
        </p>
      </div>
    </div>
  )
}

export function ProfileTabs() {
  return (
    <Tabs defaultValue="preferences" className="space-y-4">
      <TabsList>
        <TabsTrigger value="preferences">Preferences</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
      </TabsList>
      
      <TabsContent value="preferences">
        <ProfilePreferences />
      </TabsContent>
      
      <TabsContent value="activity">
        <ProfileActivity />
      </TabsContent>
      
      <TabsContent value="security">
        <ProfileSecurity />
      </TabsContent>
    </Tabs>
  )
}