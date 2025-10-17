import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { motion } from 'framer-motion'
import { CreativeToast } from './toast'
import { 
  Play, 
  Clock, 
  Settings, 
  Video as VideoIcon,
  Mountain,
  Film, 
  Camera, 
  Tv, 
  Info
} from 'lucide-react'

import { LoadingOverlay, FadeInContent, SlideUpContent } from './ui/motion-elements'
import { VideoResult } from './ui/result-display'

// Videography style presets with optimized prompts
const VIDEOGRAPHY_PRESETS = [
  {
    id: 'cinematic',
    name: 'Cinematic',
    icon: Film,
    description: 'Hollywood-style cinematic footage',
    promptPrefix: 'Professional cinematic footage with precise camera movements, shallow depth of field, and dramatic lighting. Cinematic color grading with rich contrast. Shot on an Arri Alexa with anamorphic lenses. Film-like quality with 24fps and natural motion blur.',
  },
  {
    id: 'documentary',
    name: 'Documentary',
    icon: Camera,
    description: 'Authentic documentary style',
    promptPrefix: 'Professional documentary style footage with natural lighting and authentic movement. Observational camera work with intentional framing. High-quality 4K resolution capturing realistic textures and environmental details.',
  },
  {
    id: 'aerial',
    name: 'Aerial',
    icon: Mountain,
    description: 'Drone-like aerial footage',
    promptPrefix: 'Professional aerial footage with smooth, stable movement and wide perspective. Cinematic drone shots with perfect exposure. 4K resolution with HDR color depth capturing expansive vistas with crisp details.',
  },
  {
    id: 'commercial',
    name: 'Commercial',
    icon: Tv,
    description: 'Polished commercial quality',
    promptPrefix: 'Premium commercial-grade footage with perfect lighting and composition. Professional studio quality with pristine clarity. 4K resolution with vibrant colors, crisp details and flawless production values.',
  }
]

// Prompt enhancer adds videography expertise to prompts
const enhancePromptWithVideographyExpertise = (basePrompt: string, preset: string, preserveFaces: boolean) => {
  const selectedPreset = VIDEOGRAPHY_PRESETS.find(p => p.id === preset);
  let enhancedPrompt = basePrompt;
  
  if (selectedPreset) {
    enhancedPrompt = `${selectedPreset.promptPrefix}. ${enhancedPrompt}`;
  } else {
    // Default professional videography instructions if no preset selected
    enhancedPrompt = `Professional video footage with excellent composition and lighting. Shot with high-end equipment for maximum clarity. 4K resolution. ${enhancedPrompt}`;
  }
  
  if (preserveFaces) {
    enhancedPrompt += ' Important: Maintain accurate and authentic facial features of all subjects. Preserve natural expressions and do not alter, idealize, or modify faces or identities in any way.';
  }
  
  // Add technical quality markers
  enhancedPrompt += ' Technical specifications: Professional lighting, stable framing, consistent exposure, proper white balance, no artifacts or jitter, photorealistic quality, detailed textures.';
  
  return enhancedPrompt;
};

export const VideoGeneration = () => {
  const t = useTranslations()
  const [prompt, setPrompt] = useState('')
  const [duration, setDuration] = useState(5)
  const [resolution, setResolution] = useState('720p')
  const [model, setModel] = useState('gen-2')
  const [fps, setFps] = useState(24)
  const [loading, setLoading] = useState(false)
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'prompt' | 'advanced'>('prompt')
  const [selectedPreset, setSelectedPreset] = useState('cinematic')
  const [preserveFaces, setPreserveFaces] = useState(true)
  
  // Handle video generation with enhanced prompts
  const handleGenerateVideo = async () => {
    if (!prompt.trim()) {
      CreativeToast.error(t('errorEmptyPrompt') || 'Please enter a prompt');
      return;
    }
    
    // Video generation takes longer, show longer loading toast
    const toastId = CreativeToast.loading(t('generatingVideo') || 'Generating video, this may take a minute...');
    
    setLoading(true);
    
    try {
      // Create the enhanced prompt with videography expertise
      const enhancedPrompt = enhancePromptWithVideographyExpertise(prompt, selectedPreset, preserveFaces);
      
      console.log("Enhanced video prompt:", enhancedPrompt);
      
      // Map resolution from UI to actual dimensions
      const resolutionMap: Record<string, string> = {
        '480p': '854x480',
        '720p': '1280x720',
        '1080p': '1920x1080',
        '4k': '3840x2160'
      };
      
      // Call our API
      const response = await fetch('/api/creative/video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: model === 'gen-2' ? 'stability' : 'google', // Map UI model to provider
          modelId: model,
          prompt: enhancedPrompt,
          duration: duration,
          fps: fps,
          resolution: resolutionMap[resolution] || '1280x720',
          style: selectedPreset
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate video');
      }
      
      const data = await response.json();
      
      // Update the UI with the generated video
      setGeneratedVideo(data.url);
      
      // Show success toast
      CreativeToast.success(t('videoGeneratedSuccess') || 'Video generated successfully!');
    } catch (error) {
      console.error('Error generating video:', error);
      
      // Show error toast with the error message
      CreativeToast.error(
        t('videoGenerationFailed') || 'Failed to generate video', 
        error instanceof Error ? error.message : undefined
      );
    } finally {
      // Dismiss loading toast and set loading state to false
      CreativeToast.dismiss(toastId);
      setLoading(false);
    }
  }
  
  // Handle video download
  const handleDownload = () => {
    if (!generatedVideo) return
    
    const link = document.createElement('a')
    link.href = generatedVideo
    link.download = `generated-video-${Date.now()}.mp4`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  // Handle copy video URL
  const handleCopyVideoUrl = () => {
    if (!generatedVideo) return;
    
    navigator.clipboard.writeText(generatedVideo);
    CreativeToast.success('Video URL copied to clipboard!');
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-6 relative">
        <LoadingOverlay 
          show={loading} 
          message="Crafting your video masterpiece..." 
        />
        
        <FadeInContent>
          <h2 className="text-2xl font-bold mb-4">{t('createVideo')}</h2>
          
          <Tabs defaultValue="prompt" onValueChange={(val) => setActiveTab(val as 'prompt' | 'advanced')}>
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="prompt">{t('prompt')}</TabsTrigger>
              <TabsTrigger value="advanced">{t('advancedSettings')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="prompt">
              <motion.div 
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div className="mb-4" variants={itemVariants}>
                  <label className="block mb-2 text-sm font-medium">Videography Style</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {VIDEOGRAPHY_PRESETS.map((preset) => {
                      const Icon = preset.icon;
                      return (
                        <motion.div
                          key={preset.id}
                          onClick={() => setSelectedPreset(preset.id)}
                          className={`p-3 rounded-lg cursor-pointer transition-all ${
                            selectedPreset === preset.id
                              ? 'bg-primary text-primary-foreground shadow-lg'
                              : 'bg-muted/40 hover:bg-muted hover:scale-105'
                          }`}
                          whileHover={{ scale: selectedPreset === preset.id ? 1 : 1.05 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Icon className="h-5 w-5 mb-1 mx-auto" />
                          <span className="text-sm font-medium text-center block">{preset.name}</span>
                        </motion.div>
                      );
                    })}
                  </div>
                  {selectedPreset && (
                    <div className="mt-2 text-xs text-muted-foreground flex items-center">
                      <Info className="h-3 w-3 mr-1" />
                      {VIDEOGRAPHY_PRESETS.find(p => p.id === selectedPreset)?.description}
                    </div>
                  )}
                </motion.div>

                <motion.div className="mb-4" variants={itemVariants}>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="preserveFacesVideo"
                      checked={preserveFaces}
                      onChange={(e) => setPreserveFaces(e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="preserveFacesVideo" className="text-sm font-medium">
                      Preserve facial features accurately
                    </label>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 ml-5">
                    Ensures AI maintains authentic facial features and identities in video footage
                  </p>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block mb-2 text-sm font-medium">{t('videoPrompt')}</label>
                  <Textarea
                    placeholder="Describe your video with specific details like subject, setting, action, mood, camera movement, and lighting. For example: 'A slow tracking shot of a person walking through a vibrant autumn forest with dappled sunlight filtering through the trees'"
                    rows={6}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="resize-none"
                  />
                </motion.div>
                
                <motion.div className="grid grid-cols-2 gap-4" variants={itemVariants}>
                  <div>
                    <label className="block mb-2 text-sm font-medium">{t('model')}</label>
                    <Select value={model} onValueChange={setModel}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('selectModel')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gen-2">Gen-2</SelectItem>
                        <SelectItem value="stable-video">Stable Video</SelectItem>
                        <SelectItem value="runway">Runway ML</SelectItem>
                        <SelectItem value="pika-labs">Pika Labs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block mb-2 text-sm font-medium">
                      {t('duration')}: {formatTime(duration)}
                    </label>
                    <Slider
                      value={[duration]}
                      min={3}
                      max={30}
                      step={1}
                      onValueChange={(values) => setDuration(values[0])}
                      className="my-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Short (3s)</span>
                      <span>Long (30s)</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="advanced">
              <motion.div 
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div className="grid grid-cols-2 gap-4" variants={itemVariants}>
                  <div>
                    <label className="block mb-2 text-sm font-medium">{t('resolution')}</label>
                    <Select value={resolution} onValueChange={setResolution}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('selectResolution')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="480p">480p</SelectItem>
                        <SelectItem value="720p">720p HD</SelectItem>
                        <SelectItem value="1080p">1080p Full HD</SelectItem>
                        <SelectItem value="4k">4K UHD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block mb-2 text-sm font-medium">
                      {t('fps')}: {fps}
                    </label>
                    <Select value={fps.toString()} onValueChange={(val) => setFps(parseInt(val))}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('selectFps')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24">24 fps (Film)</SelectItem>
                        <SelectItem value="30">30 fps (Standard)</SelectItem>
                        <SelectItem value="60">60 fps (Smooth)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <label className="block mb-2 text-sm font-medium">{t('stylePresets')}</label>
                  <div className="flex flex-wrap gap-2">
                    {['Cinematic', 'Animation', 'Documentary', 'Drone', 'Timelapse'].map((style) => (
                      <Badge 
                        key={style} 
                        variant="outline" 
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        {style}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </TabsContent>
          </Tabs>
          
          <div className="pt-4">
            <motion.div variants={itemVariants}>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  onClick={handleGenerateVideo}
                  disabled={loading || !prompt.trim()} 
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin mr-2">◌</span>
                      {t('generatingVideo')}
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      {t('generateVideo')}
                    </>
                  )}
                </Button>
              </motion.div>
              
              {activeTab === 'prompt' && (
                <div className="mt-4 text-center">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setActiveTab('advanced')}
                    className="text-xs text-muted-foreground flex items-center hover:bg-muted/50 transition-colors"
                  >
                    <Settings className="h-3 w-3 mr-1" />
                    {t('showAdvancedSettings')}
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </FadeInContent>
      </Card>
      
      <Card className="p-6 flex flex-col relative">
        <LoadingOverlay 
          show={loading} 
          message="Processing your cinematic masterpiece..." 
        />
        
        <h2 className="text-2xl font-bold mb-4">{t('preview')}</h2>
        
        <div className="flex-1 flex items-center justify-center bg-muted/30 rounded-lg overflow-hidden">
          {generatedVideo ? (
            <VideoResult 
              videoUrl={generatedVideo}
              onDownload={handleDownload}
              onCopy={handleCopyVideoUrl}
            />
          ) : (
            <SlideUpContent>
              <div className="text-center p-8">
                <VideoIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground">{t('videoWillAppearHere')}</p>
                <p className="text-xs text-muted-foreground mt-4 max-w-md mx-auto">
                  Fill out the form on the left and click &ldquo;Generate Video&rdquo; to create your AI-generated video clip
                </p>
                
                {loading && (
                  <motion.div 
                    className="mt-6 flex items-center justify-center gap-2 bg-muted/30 p-3 rounded-lg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Clock className="h-4 w-4 animate-pulse text-amber-500" />
                    <p className="text-sm font-medium">{t('videoGenerationTime')}</p>
                  </motion.div>
                )}
              </div>
            </SlideUpContent>
          )}
        </div>
      </Card>
    </div>
  )
}