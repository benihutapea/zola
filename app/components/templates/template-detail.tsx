'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Template } from '@/app/types/templates.types'
import { ChevronLeft, Save, Trash2, Copy } from 'lucide-react'
import Link from 'next/link'

// Sample template for development
const sampleTemplate: Template = {
  id: '1',
  title: 'Code Explanation',
  description: 'Ask for detailed explanations of code snippets',
  content: 'Please explain the following code in detail:\n\n```{{language}}\n{{code}}\n```\n\nFocus on:\n1. What the code does\n2. Key functions or methods\n3. Any optimizations or issues\n4. How it could be improved',
  tags: ['programming', 'learning', 'code-review'],
  userId: 'user1',
  createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  isPublic: true,
  category: 'Development',
  usageCount: 42
}

interface TemplateDetailProps {
  templateId: string
}

export function TemplateDetail({ templateId }: TemplateDetailProps) {
  const [template, setTemplate] = useState<Template | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editedTemplate, setEditedTemplate] = useState<Partial<Template>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const router = useRouter()
  
  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        // In a real implementation, this would be an API call
        // const response = await fetch(`/api/templates/${templateId}`)
        // const data = await response.json()
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Use sample data for development
        setTemplate({...sampleTemplate, id: templateId})
        setEditedTemplate({...sampleTemplate})
      } catch (error) {
        console.error('Error fetching template:', error)
        toast.error('Failed to load template')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchTemplate()
  }, [templateId])
  
  const handleSave = async () => {
    try {
      setIsSaving(true)
      
      // Validate required fields
      if (!editedTemplate.title || !editedTemplate.content) {
        toast.error('Title and content are required')
        return
      }
      
      // In a real implementation, this would be an API call
      // await fetch(`/api/templates/${templateId}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(editedTemplate)
      // })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update the template
      setTemplate(prev => prev ? { ...prev, ...editedTemplate, updatedAt: new Date().toISOString() } : null)
      setIsEditing(false)
      
      toast.success('Template saved successfully')
    } catch (error) {
      console.error('Error saving template:', error)
      toast.error('Failed to save template')
    } finally {
      setIsSaving(false)
    }
  }
  
  const handleDelete = async () => {
    try {
      // In a real implementation, this would be an API call
      // await fetch(`/api/templates/${templateId}`, {
      //   method: 'DELETE'
      // })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Template deleted successfully')
      router.push('/templates')
    } catch (error) {
      console.error('Error deleting template:', error)
      toast.error('Failed to delete template')
    }
  }
  
  const handleUseTemplate = () => {
    router.push(`/c?template=${templateId}`)
  }
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-9 w-24" />
        </div>
        <Skeleton className="h-5 w-1/2" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
    )
  }
  
  if (!template) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="text-xl font-bold">Template Not Found</h2>
        <p className="text-muted-foreground mt-2">
          The template you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <Button asChild className="mt-4">
          <Link href="/templates">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Templates
          </Link>
        </Button>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm">
          <Link href="/templates">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to templates
          </Link>
        </Button>
        
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button 
                variant="ghost" 
                onClick={() => {
                  setIsEditing(false)
                  setEditedTemplate({...template})
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
                {!isSaving && <Save className="ml-2 h-4 w-4" />}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Edit Template
              </Button>
              <Button onClick={handleUseTemplate}>
                Use Template
                <Copy className="ml-2 h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
      
      <div>
        <h1 className="text-3xl font-bold mb-1">
          {isEditing ? (
            <Input
              value={editedTemplate.title || ''}
              onChange={(e) => setEditedTemplate({...editedTemplate, title: e.target.value})}
              placeholder="Template title"
              className="text-3xl font-bold p-0 h-auto border-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          ) : (
            template.title
          )}
        </h1>
        <p className="text-muted-foreground">
          {isEditing ? (
            <Input
              value={editedTemplate.description || ''}
              onChange={(e) => setEditedTemplate({...editedTemplate, description: e.target.value})}
              placeholder="Add a description (optional)"
              className="text-muted-foreground p-0 h-auto border-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          ) : (
            template.description || 'No description provided'
          )}
        </p>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {template.tags?.map(tag => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
          {(!template.tags || template.tags.length === 0) && (
            <span className="text-sm text-muted-foreground">No tags</span>
          )}
        </div>
        
        {isEditing && (
          <div className="flex items-center gap-2">
            <span className="text-sm">Public</span>
            <Switch 
              checked={editedTemplate.isPublic || false} 
              onCheckedChange={(checked) => setEditedTemplate({...editedTemplate, isPublic: checked})}
            />
          </div>
        )}
        
        {!isEditing && (
          <Badge variant={template.isPublic ? "default" : "outline"}>
            {template.isPublic ? 'Public' : 'Private'}
          </Badge>
        )}
      </div>
      
      <div className="space-y-2">
        <h2 className="text-lg font-medium">Template Content</h2>
        {isEditing ? (
          <Textarea
            value={editedTemplate.content || ''}
            onChange={(e) => setEditedTemplate({...editedTemplate, content: e.target.value})}
            placeholder="Enter your template content here"
            className="min-h-[200px] font-mono"
          />
        ) : (
          <div className="bg-muted p-4 rounded-md whitespace-pre-wrap font-mono text-sm">
            {template.content}
          </div>
        )}
      </div>
      
      {isEditing && (
        <div className="pt-4 border-t">
          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Template
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your template.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete} 
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  )
}