export interface Template {
  id: string
  title: string
  description?: string
  content: string
  tags?: string[]
  userId: string
  createdAt: string
  updatedAt: string
  isPublic: boolean
  category?: string
  usageCount?: number
}

export interface CreateTemplateData {
  title: string
  description?: string
  content: string
  tags?: string[]
  isPublic: boolean
  category?: string
}