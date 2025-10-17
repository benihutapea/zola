import React from 'react'
import { useTranslations } from 'next-intl'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ImageGeneration } from './creative/image-generation'
import { ImageEditing } from './creative/image-editing'
import { VideoGeneration } from './creative/video-generation'
import { VideoFromImages } from './creative/video-from-images'
import { AudioGeneration } from './creative/audio-generation'
import { StyleLibrary } from './creative/style-library'
import { ProjectManager } from './creative/project-manager'
import { Gallery } from './creative/gallery'
import { 
  ImageIcon, 
  Edit, 
  Video, 
  Images, 
  LayoutGrid, 
  Music,
  Palette,
  FolderKanban
} from 'lucide-react'

export const MediaCreationHub = () => {
  const t = useTranslations()
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
        {t('mediaCreationHub')}
      </h1>
      
      <Tabs defaultValue="image-generation" className="w-full">
        <TabsList className="grid grid-cols-8 mb-8">
          <TabsTrigger value="image-generation" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            <span className="hidden sm:inline">{t('imageGeneration')}</span>
          </TabsTrigger>
          
          <TabsTrigger value="image-editing" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            <span className="hidden sm:inline">{t('imageEditing')}</span>
          </TabsTrigger>
          
          <TabsTrigger value="video-generation" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            <span className="hidden sm:inline">{t('videoGeneration')}</span>
          </TabsTrigger>
          
          <TabsTrigger value="video-from-images" className="flex items-center gap-2">
            <Images className="h-4 w-4" />
            <span className="hidden sm:inline">{t('videoFromImages')}</span>
          </TabsTrigger>

          <TabsTrigger value="audio-generation" className="flex items-center gap-2">
            <Music className="h-4 w-4" />
            <span className="hidden sm:inline">{t('audioGeneration') || 'Audio'}</span>
          </TabsTrigger>
          
          <TabsTrigger value="style-library" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">{t('styleLibrary') || 'Styles'}</span>
          </TabsTrigger>
          
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <FolderKanban className="h-4 w-4" />
            <span className="hidden sm:inline">{t('projects') || 'Projects'}</span>
          </TabsTrigger>
          
          <TabsTrigger value="gallery" className="flex items-center gap-2">
            <LayoutGrid className="h-4 w-4" />
            <span className="hidden sm:inline">{t('gallery')}</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="image-generation" className="mt-4">
          <ImageGeneration />
        </TabsContent>
        
        <TabsContent value="image-editing" className="mt-4">
          <ImageEditing />
        </TabsContent>
        
        <TabsContent value="video-generation" className="mt-4">
          <VideoGeneration />
        </TabsContent>
        
        <TabsContent value="video-from-images" className="mt-4">
          <VideoFromImages />
        </TabsContent>
        
        <TabsContent value="audio-generation" className="mt-4">
          <AudioGeneration />
        </TabsContent>
        
        <TabsContent value="style-library" className="mt-4">
          <StyleLibrary />
        </TabsContent>
        
        <TabsContent value="projects" className="mt-4">
          <ProjectManager />
        </TabsContent>
        
        <TabsContent value="gallery" className="mt-4">
          <Gallery />
        </TabsContent>
      </Tabs>
    </div>
  )
}