'use client'

import React, { useEffect, useState } from 'react'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Template } from '@/app/types/templates.types'
import { useRouter } from 'next/navigation'
import {
  Search,
  MoreVertical,
  Tag,
  Clock,
  Folder,
  Star,
  Trash2,
  Plus,
  Copy,
  Edit
} from 'lucide-react'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

// Mock data for development - will be replaced with actual API data
const sampleTemplates: Template[] = [
  {
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
  },
  {
    id: '2',
    title: 'Academic Paper Summary',
    description: 'Summarize academic papers or research articles',
    content: 'Please provide a detailed summary of the following academic paper:\n\nTitle: {{title}}\nAuthors: {{authors}}\nJournal/Source: {{journal}}\n\nSummarize the key points, methodology, findings, and implications. Also mention any limitations or areas for future research.',
    tags: ['academic', 'research', 'summary'],
    userId: 'user1',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    isPublic: true,
    category: 'Academic',
    usageCount: 18
  },
  {
    id: '3',
    title: 'Marketing Email',
    description: 'Generate compelling marketing emails',
    content: 'Please write a marketing email for the following:\n\nProduct/Service: {{product}}\nTarget Audience: {{audience}}\nKey Benefits: {{benefits}}\nCTA: {{call_to_action}}\n\nEnsure the email is engaging, concise, and focuses on the benefits rather than features. Include a compelling subject line.',
    tags: ['marketing', 'email', 'copywriting'],
    userId: 'user1',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    isPublic: false,
    category: 'Marketing',
    usageCount: 7
  }
]

export function TemplateList() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const router = useRouter()
  
  useEffect(() => {
    // In the real implementation, this would be an API call
    const fetchTemplates = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        setTemplates(sampleTemplates)
      } catch (error) {
        console.error('Error fetching templates:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchTemplates()
  }, [])
  
  const filteredTemplates = templates.filter(template => {
    // Filter by search term
    const matchesSearch = 
      template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    // Filter by tab
    if (activeTab === 'all') return matchesSearch
    if (activeTab === 'public') return matchesSearch && template.isPublic
    if (activeTab === 'private') return matchesSearch && !template.isPublic
    
    return matchesSearch
  })
  
  const handleDelete = async (id: string) => {
    try {
      // In real implementation, this would call an API
      console.log('Deleting template:', id)
      setTemplates(templates.filter(t => t.id !== id))
      // await fetch(`/api/templates/${id}`, { method: 'DELETE' })
    } catch (error) {
      console.error('Error deleting template:', error)
    }
  }
  
  const handleUseTemplate = (id: string) => {
    router.push(`/c?template=${id}`)
  }
  
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-muted rounded w-full mb-2"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </CardContent>
            <CardFooter>
              <div className="h-4 bg-muted rounded w-1/4"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full sm:w-auto"
        >
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="public">Public</TabsTrigger>
            <TabsTrigger value="private">Private</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {filteredTemplates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No templates found</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-2 mb-4">
            {searchTerm 
              ? `No templates match your search "${searchTerm}". Try a different search term.` 
              : "You haven't created any templates yet. Create your first template to get started."}
          </p>
          <Button asChild>
            <Link href="/templates/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Template
            </Link>
          </Button>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredTemplates.map(template => (
            <motion.div key={template.id} variants={itemVariants}>
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {template.title}
                        {template.isPublic ? (
                          <Badge variant="secondary" className="text-xs">Public</Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">Private</Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {template.description || "No description provided"}
                      </CardDescription>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleUseTemplate(template.id)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Use template
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/templates/${template.id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit template
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive" 
                          onClick={() => handleDelete(template.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete template
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1">
                  <div className="flex flex-wrap gap-1 mb-3">
                    {template.tags?.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        <Tag className="mr-1 h-3 w-3" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="text-sm text-muted-foreground line-clamp-3 font-mono bg-muted p-2 rounded text-xs">
                    {template.content}
                  </div>
                </CardContent>
                
                <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Clock className="mr-1 h-3.5 w-3.5" />
                    Updated {formatDistanceToNow(new Date(template.updatedAt), { addSuffix: true })}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <Folder className="mr-1 h-3.5 w-3.5" />
                      {template.category || 'Uncategorized'}
                    </div>
                    <div className="flex items-center">
                      <Star className="mr-1 h-3.5 w-3.5" />
                      {template.usageCount || 0} uses
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}