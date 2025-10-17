'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, BarChart2, MessageSquare } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useUser } from '@/lib/user-store/provider'

// Sample data for development
const sampleActivity = [
  { 
    id: 1,
    type: 'conversation',
    title: 'Understanding Quantum Computing',
    date: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    modelName: 'GPT-4'
  },
  { 
    id: 2,
    type: 'conversation',
    title: 'Best practices for React components',
    date: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    modelName: 'Claude 3'
  },
  { 
    id: 3,
    type: 'template_use',
    title: 'Code Explanation',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    templateName: 'Code Explanation'
  },
  { 
    id: 4,
    type: 'conversation',
    title: 'Marketing email draft',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    modelName: 'Gemini'
  }
]

export function ProfileActivity() {
  const { user } = useUser()
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date)
  }
  
  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'conversation':
        return <MessageSquare className="h-4 w-4" />
      case 'template_use':
        return <Activity className="h-4 w-4" />
      default:
        return <BarChart2 className="h-4 w-4" />
    }
  }
  
  if (!user) return null
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your recent conversations and actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sampleActivity.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No recent activity</p>
            </div>
          ) : (
            <div className="space-y-1">
              {sampleActivity.map((activity) => (
                <div 
                  key={activity.id} 
                  className="flex items-center justify-between py-3 px-4 rounded-md hover:bg-muted/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 rounded-full p-2">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(activity.date)}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {activity.type === 'conversation' 
                      ? activity.modelName 
                      : 'Template'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Usage Statistics</CardTitle>
          <CardDescription>
            Overview of your account usage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="text-4xl font-bold">257</p>
              <p className="text-sm text-muted-foreground">Total Conversations</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="text-4xl font-bold">12.3k</p>
              <p className="text-sm text-muted-foreground">Messages Sent</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="text-4xl font-bold">5.2M</p>
              <p className="text-sm text-muted-foreground">Tokens Used</p>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">Most Used Models</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-sm min-w-[80px]">GPT-4</span>
                <div className="flex-1 mx-4">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">65%</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm min-w-[80px]">Claude 3</span>
                <div className="flex-1 mx-4">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: '20%' }}></div>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">20%</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm min-w-[80px]">Gemini</span>
                <div className="flex-1 mx-4">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: '10%' }}></div>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">10%</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm min-w-[80px]">Others</span>
                <div className="flex-1 mx-4">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500" style={{ width: '5%' }}></div>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">5%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}