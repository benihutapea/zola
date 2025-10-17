'use client'

import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tag, Search, Folder, Check } from 'lucide-react'

interface TagFilterProps {
  selectedTags: string[]
  onSelectTag: (tag: string) => void
  className?: string
}

export function TagFilter({ 
  selectedTags, 
  onSelectTag,
  className = ''
}: TagFilterProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Fetch all available tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/tags')
        
        if (!response.ok) {
          throw new Error('Failed to fetch tags')
        }
        
        const data = await response.json()
        setAvailableTags(data.tags || [])
      } catch (error) {
        console.error('Error fetching tags:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchTags()
  }, [])
  
  // Filter tags based on search term
  const filteredTags = availableTags.filter(tag => 
    tag.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="relative">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search tags"
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div>
        <div className="flex items-center mb-2">
          <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Tags</h3>
        </div>
        
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-2">
            {isLoading ? (
              <p className="text-sm text-muted-foreground py-2">Loading tags...</p>
            ) : filteredTags.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">
                No tags found
              </p>
            ) : (
              filteredTags.map(tag => {
                const isSelected = selectedTags.includes(tag)
                return (
                  <button
                    key={tag}
                    className={`flex items-center justify-between w-full px-2 py-1.5 rounded-md text-sm hover:bg-muted ${
                      isSelected ? 'bg-muted font-medium' : ''
                    }`}
                    onClick={() => onSelectTag(tag)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="truncate">{tag}</span>
                    </div>
                    {isSelected && (
                      <Check className="h-4 w-4" />
                    )}
                  </button>
                )
              })
            )}
          </div>
        </ScrollArea>
      </div>
      
      <Separator />
      
      <div>
        <div className="flex items-center mb-2">
          <Folder className="mr-2 h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Folders</h3>
        </div>
        
        <div className="space-y-2">
          <button className="flex items-center justify-between w-full px-2 py-1.5 rounded-md text-sm hover:bg-muted">
            <div className="flex items-center gap-2">
              <span className="truncate">Work</span>
              <Badge variant="outline" className="text-xs">3</Badge>
            </div>
          </button>
          <button className="flex items-center justify-between w-full px-2 py-1.5 rounded-md text-sm hover:bg-muted">
            <div className="flex items-center gap-2">
              <span className="truncate">Personal</span>
              <Badge variant="outline" className="text-xs">2</Badge>
            </div>
          </button>
          <button className="flex items-center justify-between w-full px-2 py-1.5 rounded-md text-sm hover:bg-muted">
            <div className="flex items-center gap-2">
              <span className="truncate">Research</span>
              <Badge variant="outline" className="text-xs">5</Badge>
            </div>
          </button>
          <p className="text-xs text-muted-foreground mt-2 italic">
            Folder support coming soon
          </p>
        </div>
      </div>
    </div>
  )
}