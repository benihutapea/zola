import React from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { MessageSquare, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { motion } from 'framer-motion'

interface Conversation {
  id: string
  title: string
  modelId: string
  modelName: string
  lastMessageAt: Date
  messageCount: number
}

interface RecentActivityProps {
  conversations?: Conversation[]
  isLoading?: boolean
}

export function RecentActivity({ conversations, isLoading = false }: RecentActivityProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center gap-4 p-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!conversations || conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <MessageSquare className="h-12 w-12 text-muted-foreground mb-2" />
        <h3 className="text-lg font-medium">No recent conversations</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Start chatting to see your recent activity here
        </p>
        <Button asChild>
          <Link href="/">Start a new chat</Link>
        </Button>
      </div>
    )
  }

  return (
    <motion.div
      className="space-y-2"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {conversations.map(conversation => (
        <motion.div key={conversation.id} variants={itemVariants}>
          <Link href={`/c/${conversation.id}`}>
            <Card className="hover:bg-muted/50 transition-colors">
              <CardContent className="p-4 flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm truncate">
                      {conversation.title}
                    </h4>
                    <Badge variant="outline" className="whitespace-nowrap">
                      {conversation.messageCount} messages
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      variant="secondary" 
                      className="text-xs font-normal px-1.5 py-0"
                    >
                      {conversation.modelName}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(conversation.lastMessageAt, { addSuffix: true })}
                    </span>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
      
      <div className="pt-2 flex justify-center">
        <Button variant="outline" size="sm" asChild>
          <Link href="/c">
            View all conversations
            <ArrowRight className="ml-2 h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </motion.div>
  )
}