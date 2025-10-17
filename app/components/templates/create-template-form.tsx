'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { CreateTemplateData } from '@/app/types/templates.types'

const formSchema = z.object({
  title: z.string().min(3, {
    message: 'Title must be at least 3 characters long.'
  }).max(100),
  description: z.string().max(500).optional(),
  content: z.string().min(10, {
    message: 'Template content must be at least 10 characters long.'
  }),
  category: z.string(),
  isPublic: z.boolean()
});

type FormValues = {
  title: string;
  description?: string;
  content: string;
  category: string;
  isPublic: boolean;
};

const categories = [
  'Development', 
  'Academic', 
  'Marketing', 
  'Writing',
  'Business',
  'Creative',
  'Research',
  'Personal',
  'Other'
]

export function CreateTemplateForm() {
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      content: '',
      category: 'Development',
      isPublic: false
    }
  })
  
  const addTag = () => {
    const normalizedTag = tagInput.trim().toLowerCase()
    if (normalizedTag && !tags.includes(normalizedTag) && tags.length < 10) {
      setTags(prev => [...prev, normalizedTag])
      setTagInput('')
    }
  }
  
  const removeTag = (tag: string) => {
    setTags(prev => prev.filter(t => t !== tag))
  }
  
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag()
    }
  }
  
  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true)
      
      // Prepare the data
      const templateData: CreateTemplateData = {
        ...values,
        tags
      }
      
      console.log('Creating template with data:', templateData)
      
      // In a real implementation, this would be an API call
      // const response = await fetch('/api/templates', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(templateData)
      // })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Template created successfully!', {
        description: 'Your new template is now available for use.'
      })
      
      // Redirect to templates list
      router.push('/templates')
    } catch (error) {
      console.error('Error creating template:', error)
      toast.error('Failed to create template', {
        description: 'Please try again later.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Template Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Code Explanation" {...field} />
                </FormControl>
                <FormDescription>
                  A clear and descriptive name for your template
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="A brief description of what this template does and when to use it" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Tags */}
          <FormItem>
            <FormLabel>Tags (optional)</FormLabel>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map(tag => (
                <Badge key={tag} variant="secondary" className="py-1 pl-2 pr-1">
                  {tag}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-1 h-4 w-4 rounded-full"
                    onClick={() => removeTag(tag)}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove tag</span>
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add tags (press Enter to add)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                maxLength={20}
              />
              <Button type="button" variant="outline" onClick={addTag}>
                Add
              </Button>
            </div>
            <FormDescription>
              Add up to 10 tags to help categorize your template
            </FormDescription>
          </FormItem>
          
          {/* Category */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose a category that best fits this template
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Template Content */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Template Content</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter your template content here. Use {{variableName}}, {{variable_name}}, or {{simple}} for placeholders."
                    className="min-h-[200px] font-mono"
                    {...field}
                  />
                </FormControl>
                  <FormDescription>
                  Use {`{{variableName}}`} syntax for placeholders. You can use camelCase, snake_case, or simple words.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Visibility */}
          <FormField
            control={form.control}
            name="isPublic"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Make Public</FormLabel>
                  <FormDescription>
                    Allow other users to see and use this template
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.push('/templates')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Template'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}