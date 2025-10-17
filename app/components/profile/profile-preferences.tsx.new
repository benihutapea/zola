'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useUserPreferences } from '@/lib/user-preference-store/provider'

export function ProfilePreferences() {
  const { preferences, setMultiModelEnabled, setShowConversationPreviews } = useUserPreferences()
  const [layout, setLayoutValue] = useState<string>(preferences.layout)
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Interface Preferences</CardTitle>
          <CardDescription>
            Customize how the application looks and feels
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dense-mode">Dense Mode</Label>
                <div className="text-sm text-muted-foreground">
                  Show more content by reducing padding and margins
                </div>
              </div>
              <Switch 
                id="dense-mode" 
                checked={false}
                onCheckedChange={() => {}}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="reduce-animations">Reduce Animations</Label>
                <div className="text-sm text-muted-foreground">
                  Minimize motion for improved accessibility
                </div>
              </div>
              <Switch 
                id="reduce-animations" 
                checked={false}
                onCheckedChange={() => {}}
              />
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-medium mb-2">Default Layout</h3>
            <Select 
              value={layout} 
              onValueChange={(value) => setLayoutValue(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select layout" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sidebar">Sidebar</SelectItem>
                <SelectItem value="fullscreen">Fullscreen</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Chat Preferences</CardTitle>
          <CardDescription>
            Configure how chat features behave
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-scroll">Auto-scroll</Label>
                <div className="text-sm text-muted-foreground">
                  Automatically scroll to the latest message
                </div>
              </div>
              <Switch 
                id="auto-scroll" 
                checked={true}
                onCheckedChange={() => {}}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="multi-model">Multi-model Chat</Label>
                <div className="text-sm text-muted-foreground">
                  Enable chatting with multiple AI models simultaneously
                </div>
              </div>
              <Switch 
                id="multi-model" 
                checked={preferences.multiModelEnabled} 
                onCheckedChange={(checked) => setMultiModelEnabled(checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="conversation-previews">Conversation Previews</Label>
                <div className="text-sm text-muted-foreground">
                  Show preview of conversations in the sidebar
                </div>
              </div>
              <Switch 
                id="conversation-previews" 
                checked={preferences.showConversationPreviews} 
                onCheckedChange={(checked) => setShowConversationPreviews(checked)}
              />
            </div>
          </div>
          
          <Separator />
          
          <div className="grid gap-2">
            <Label htmlFor="message-font-size">Message Font Size</Label>
            <Select 
              value="medium"
              onValueChange={() => {}}
            >
              <SelectTrigger id="message-font-size">
                <SelectValue placeholder="Select font size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}