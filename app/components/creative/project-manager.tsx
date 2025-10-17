import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
  Plus, 
  Folder, 
  Image as ImageIcon, 
  Video, 
  Music, 
  Clock, 
  Star,
  MoreVertical,
  Share2,
  Trash2,
  Edit,
  Users
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Example project data structure
interface MediaItem {
  id: string
  type: 'image' | 'video' | 'audio'
  url: string
  thumbnail?: string
  title: string
  dateCreated: Date
}

interface Project {
  id: string
  title: string
  description: string
  coverImage?: string
  dateCreated: Date
  dateModified: Date
  mediaItems: MediaItem[]
  collaborators: number
  isFavorite: boolean
}

// Sample projects data
const SAMPLE_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'Product Campaign',
    description: 'Marketing visuals for summer product launch',
    coverImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format',
    dateCreated: new Date('2025-09-15'),
    dateModified: new Date('2025-10-16'),
    mediaItems: [
      { 
        id: 'media-1', 
        type: 'image', 
        url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
        title: 'Product Hero',
        dateCreated: new Date('2025-10-15')
      },
      { 
        id: 'media-2', 
        type: 'video', 
        url: 'https://example.com/video1.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113',
        title: 'Product Demo',
        dateCreated: new Date('2025-10-16')
      },
    ],
    collaborators: 3,
    isFavorite: true
  },
  {
    id: 'proj-2',
    title: 'Website Redesign',
    description: 'New imagery for website homepage and key sections',
    coverImage: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=500&auto=format',
    dateCreated: new Date('2025-09-01'),
    dateModified: new Date('2025-10-05'),
    mediaItems: [
      { 
        id: 'media-3', 
        type: 'image', 
        url: 'https://images.unsplash.com/photo-1547658719-da2b51169166',
        title: 'Hero Banner',
        dateCreated: new Date('2025-10-01')
      },
      { 
        id: 'media-4', 
        type: 'image', 
        url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8',
        title: 'About Section',
        dateCreated: new Date('2025-10-03')
      },
    ],
    collaborators: 2,
    isFavorite: false
  },
  {
    id: 'proj-3',
    title: 'Social Media Kit',
    description: 'Monthly content for Instagram and Twitter',
    coverImage: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=500&auto=format',
    dateCreated: new Date('2025-10-01'),
    dateModified: new Date('2025-10-12'),
    mediaItems: [
      { 
        id: 'media-5', 
        type: 'image', 
        url: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0',
        title: 'Instagram Post 1',
        dateCreated: new Date('2025-10-10')
      },
      { 
        id: 'media-6', 
        type: 'image', 
        url: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb',
        title: 'Instagram Post 2',
        dateCreated: new Date('2025-10-11')
      },
      { 
        id: 'media-7', 
        type: 'audio', 
        url: 'https://example.com/audio1.mp3',
        title: 'Podcast Intro',
        dateCreated: new Date('2025-10-12')
      },
    ],
    collaborators: 5,
    isFavorite: true
  },
]

export const ProjectManager = () => {
  const t = useTranslations()
  const [projects, setProjects] = useState<Project[]>(SAMPLE_PROJECTS)
  const [newProjectTitle, setNewProjectTitle] = useState('')
  const [newProjectDescription, setNewProjectDescription] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  
  // Format date to readable string
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('default', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date)
  }
  
  // Toggle favorite status
  const toggleFavorite = (projectId: string) => {
    setProjects(projects.map(project => 
      project.id === projectId 
        ? { ...project, isFavorite: !project.isFavorite } 
        : project
    ))
  }
  
  // Create new project
  const createNewProject = () => {
    if (!newProjectTitle.trim()) return
    
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      title: newProjectTitle,
      description: newProjectDescription,
      coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format',
      dateCreated: new Date(),
      dateModified: new Date(),
      mediaItems: [],
      collaborators: 1,
      isFavorite: false
    }
    
    setProjects([newProject, ...projects])
    setNewProjectTitle('')
    setNewProjectDescription('')
    setIsCreateDialogOpen(false)
  }
  
  // Get icon based on media type
  const getMediaTypeIcon = (type: 'image' | 'video' | 'audio') => {
    switch (type) {
      case 'image': return <ImageIcon className="h-4 w-4" />
      case 'video': return <Video className="h-4 w-4" />
      case 'audio': return <Music className="h-4 w-4" />
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t('creativeProjects') || 'Creative Projects'}</h2>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t('newProject') || 'New Project'}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('createNewProject') || 'Create New Project'}</DialogTitle>
              <DialogDescription>
                {t('createProjectDescription') || 'Create a new project to organize your creative media.'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="project-title">{t('projectTitle') || 'Project Title'}</Label>
                <Input
                  id="project-title"
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  placeholder={t('enterProjectTitle') || 'Enter project title'}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="project-description">{t('projectDescription') || 'Description'}</Label>
                <Textarea
                  id="project-description"
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  placeholder={t('enterProjectDescription') || 'Enter project description'}
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                {t('cancel') || 'Cancel'}
              </Button>
              <Button onClick={createNewProject}>
                {t('create') || 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <Card key={project.id} className="overflow-hidden flex flex-col">
            <div className="relative h-40">
              {project.coverImage ? (
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <Folder className="h-12 w-12 text-muted-foreground/50" />
                </div>
              )}
              
              <button
                onClick={() => toggleFavorite(project.id)}
                className={`absolute top-2 right-2 p-1 rounded-full ${
                  project.isFavorite 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted/80 text-muted-foreground hover:bg-muted/90'
                }`}
              >
                <Star className="h-4 w-4" fill={project.isFavorite ? 'currentColor' : 'none'} />
              </button>
            </div>
            
            <CardHeader className="py-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="-mr-2">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{t('projectActions') || 'Actions'}</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      {t('edit') || 'Edit'}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share2 className="h-4 w-4 mr-2" />
                      {t('share') || 'Share'}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      {t('delete') || 'Delete'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            
            <CardContent className="pb-3 pt-0">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  <span>{formatDate(project.dateModified)}</span>
                </div>
                
                <div className="flex items-center">
                  <Users className="h-3.5 w-3.5 mr-1" />
                  <span>{project.collaborators}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  {project.mediaItems.slice(0, 3).map((item, idx) => (
                    <span key={idx} className="p-0.5 bg-muted rounded-sm">
                      {getMediaTypeIcon(item.type)}
                    </span>
                  ))}
                  {project.mediaItems.length > 3 && (
                    <span className="text-xs">+{project.mediaItems.length - 3}</span>
                  )}
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="pt-0 mt-auto">
              <Button variant="outline" className="w-full">
                {t('openProject') || 'Open Project'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}