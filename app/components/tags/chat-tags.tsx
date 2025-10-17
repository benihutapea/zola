'use client'

import React, { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Tag, Plus, X } from 'lucide-react'
import { toast } from 'sonner'

interface ChatTagsProps {
  chatId: string
  initialTags?: string[]
  onTagsChange?: (tags: string[]) => void
}

export function ChatTags({ chatId, initialTags = [], onTagsChange }: ChatTagsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [tags, setTags] = useState<string[]>(initialTags)
  const [tagInput, setTagInput] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [allAvailableTags, setAllAvailableTags] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Fetch tags for this chat
  useEffect(() => {
    const fetchTags = async () => {
      if (!chatId) return
      
      try {
        setIsLoading(true)
        const response = await fetch(`/api/chats/${chatId}/tags`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch tags')
        }
        
        const data = await response.json()
        setTags(data.tags || [])
      } catch (error) {
        console.error('Error fetching tags:', error)
        // Fall back to initial tags if provided
        if (initialTags?.length) {
          setTags(initialTags)
        }
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchTags()
  }, [chatId, initialTags])
  
  // Fetch all available tags
  useEffect(() => {
    const fetchAllTags = async () => {
      try {
        const response = await fetch('/api/tags')
        
        if (!response.ok) {
          throw new Error('Failed to fetch all tags')
        }
        
        const data = await response.json()
        setAllAvailableTags(data.tags || [])
      } catch (error) {
        console.error('Error fetching available tags:', error)
      }
    }
    
    fetchAllTags()
  }, [])
  
  const addTag = () => {
    const normalizedTag = tagInput.trim()
    
    // Don't add empty tags or duplicates
    if (!normalizedTag || tags.includes(normalizedTag)) {
      setTagInput('')
      return
    }
    
    // Max 10 tags
    if (tags.length >= 10) {
      toast.error('Maximum 10 tags allowed')
      return
    }
    
    const updatedTags = [...tags, normalizedTag]
    setTags(updatedTags)
    setTagInput('')
  }
  
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }
  
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag()
    }
  }
  
  const handleSaveTags = async () => {
    try {
      setIsUpdating(true)
      
      const response = await fetch(`/api/chats/${chatId}/tags`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags })
      })
      
      if (!response.ok) {
        throw new Error('Failed to update tags')
      }
      
      const data = await response.json()
      if (onTagsChange) {
        onTagsChange(data.tags)
      }
      
      toast.success('Tags updated successfully')
      setIsOpen(false)
    } catch (error) {
      console.error('Error updating tags:', error)
      toast.error('Failed to update tags')
    } finally {
      setIsUpdating(false)
    }
  }
  
  // Filter out tags that are already added to this chat
  const availableTags = allAvailableTags.filter(tag => !tags.includes(tag))
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-7" disabled={isLoading}>
          <Tag className="mr-2 h-3.5 w-3.5" />
          {isLoading ? 'Loading...' : tags.length > 0 ? `${tags.length} Tags` : 'Add Tags'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Tags</DialogTitle>
          <DialogDescription>
            Add tags to organize and filter your conversations.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                placeholder="Enter a tag (press Enter to add)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                className="pr-10"
                maxLength={30}
              />
              {tagInput && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={addTag}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 min-h-12">
            {tags.length === 0 ? (
              <div className="text-sm text-muted-foreground italic py-2">
                No tags added yet
              </div>
            ) : (
              tags.map(tag => (
                <Badge key={tag} variant="secondary">
                  {tag}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-1 h-4 w-4 rounded-full"
                    onClick={() => removeTag(tag)}
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              ))
            )}
          </div>
          
          {tags.length >= 10 && (
            <p className="text-sm text-muted-foreground">
              Maximum of 10 tags reached
            </p>
          )}
          
          {availableTags.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Available tags:</h4>
              <div className="flex flex-wrap gap-2">
                {availableTags.map(tag => (
                  <Badge 
                    key={tag} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-secondary"
                    onClick={() => {
                      if (tags.length >= 10) {
                        toast.error('Maximum 10 tags allowed')
                        return
                      }
                      setTags([...tags, tag])
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setIsOpen(false)
              // Re-fetch current tags to reset any changes
              fetch(`/api/chats/${chatId}/tags`)
                .then(res => res.json())
                .then(data => setTags(data.tags || []))
                .catch(console.error)
            }}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSaveTags}
            disabled={isUpdating}
          >
            {isUpdating ? 'Saving...' : 'Save Tags'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}