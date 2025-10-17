import React from 'react';
import { ImageGeneration } from './image-generation';
import { VideoGeneration } from './video-generation';
import { AudioGeneration } from './audio-generation';
import { CreativeComponentWrapper } from './component-wrapper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageIcon, Video, Music } from 'lucide-react';

export const CreativeMediaGenerators = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6 text-center">AI Creative Studio</h1>
      
      <Tabs defaultValue="image" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="image" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            <span>Image Generation</span>
          </TabsTrigger>
          <TabsTrigger value="video" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            <span>Video Generation</span>
          </TabsTrigger>
          <TabsTrigger value="audio" className="flex items-center gap-2">
            <Music className="h-4 w-4" />
            <span>Audio Generation</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="image">
          <CreativeComponentWrapper componentName="Image Generation">
            <ImageGeneration />
          </CreativeComponentWrapper>
        </TabsContent>
        
        <TabsContent value="video">
          <CreativeComponentWrapper componentName="Video Generation">
            <VideoGeneration />
          </CreativeComponentWrapper>
        </TabsContent>
        
        <TabsContent value="audio">
          <CreativeComponentWrapper componentName="Audio Generation">
            <AudioGeneration />
          </CreativeComponentWrapper>
        </TabsContent>
      </Tabs>
    </div>
  );
};