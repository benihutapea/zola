import React, { useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { useDropzone } from 'react-dropzone'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { motion } from 'framer-motion'
import { Upload, Download, Move, Play, XCircle, MoveVertical } from 'lucide-react'
import Image from 'next/image'

export const VideoFromImages = () => {
  const t = useTranslations()
  const [images, setImages] = useState<Array<{ id: string; src: string }>>([])
  const [prompt, setPrompt] = useState('')
  const [duration, setDuration] = useState(5)
  const [transitionStyle, setTransitionStyle] = useState('fade')
  const [transitionDuration, setTransitionDuration] = useState(1)
  const [addAudio, setAddAudio] = useState(false)
  const [audioPrompt, setAudioPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null)
  
  // Handle file drops for images
  const onDrop = useCallback((acceptedFiles: Array<File>) => {
    const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'))
    
    // Create preview URLs for the dropped images
    const newImages = imageFiles.map(file => ({
      id: `image-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      src: URL.createObjectURL(file)
    }))
    
    setImages(prev => [...prev, ...newImages])
  }, [])
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    }
  })
  
  // Remove an image
  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id))
  }
  
  // Reorder images - move up
  const moveImageUp = (index: number) => {
    if (index <= 0) return
    
    const newImages = [...images]
    const temp = newImages[index]
    newImages[index] = newImages[index - 1]
    newImages[index - 1] = temp
    
    setImages(newImages)
  }
  
  // Reorder images - move down
  const moveImageDown = (index: number) => {
    if (index >= images.length - 1) return
    
    const newImages = [...images]
    const temp = newImages[index]
    newImages[index] = newImages[index + 1]
    newImages[index + 1] = temp
    
    setImages(newImages)
  }
  
  // Handle video generation
  const handleGenerateVideo = async () => {
    if (images.length < 2) return
    
    setLoading(true)
    
    try {
      // Simulate API call for now - in real implementation, this would call your API
      setTimeout(() => {
        // For demo purposes, using a placeholder video
        setGeneratedVideo('https://static.videezy.com/system/resources/previews/000/005/529/original/Earth_Spin_Free_Stock_Footage_Video.mp4')
        setLoading(false)
      }, 5000)
    } catch (error) {
      console.error('Error generating video from images:', error)
      setLoading(false)
    }
  }
  
  // Handle video download
  const handleDownload = () => {
    if (!generatedVideo) return
    
    const link = document.createElement('a')
    link.href = generatedVideo
    link.download = `image-to-video-${Date.now()}.mp4`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-4">{t('createVideoFromImages')}</h2>
        
        <div 
          {...getRootProps()}
          className={`mb-4 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/20'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          {isDragActive ? (
            <p>{t('dropImagesToAdd')}</p>
          ) : (
            <p>{t('dragDropImages')}</p>
          )}
          <p className="text-xs text-muted-foreground mt-2">{t('addMultipleImages')}</p>
        </div>
        
        <div className="flex-1 overflow-y-auto mb-4">
          {images.length > 0 ? (
            <div className="space-y-3">
              <h3 className="font-medium">{t('imageSequence')}</h3>
              {images.map((img, index) => (
                <div 
                  key={img.id}
                  className="flex items-center bg-muted/30 rounded-md p-2"
                >
                  <div className="h-16 w-16 relative rounded-md overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={img.src}
                      alt={`Image ${index + 1}`}
                      fill
                      objectFit="cover"
                    />
                  </div>
                  <span className="mx-3 font-medium">{index + 1}</span>
                  <div className="flex-grow"></div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={index === 0}
                      onClick={() => moveImageUp(index)}
                      className="h-8 w-8"
                    >
                      <MoveVertical className="h-4 w-4 rotate-180" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={index === images.length - 1}
                      onClick={() => moveImageDown(index)}
                      className="h-8 w-8"
                    >
                      <MoveVertical className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeImage(img.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive/90"
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <Move className="h-12 w-12 mb-2" />
              <p>{t('noImagesUploadedYet')}</p>
            </div>
          )}
        </div>
        
        <div className="space-y-4 border-t pt-4">
          <div>
            <label className="block mb-2 text-sm font-medium">{t('enhancementPrompt')}</label>
            <Textarea
              placeholder={t('videoEnhancementPromptPlaceholder')}
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="resize-none"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium">{t('transition')}</label>
              <Select value={transitionStyle} onValueChange={setTransitionStyle}>
                <SelectTrigger>
                  <SelectValue placeholder={t('selectTransition')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fade">Fade</SelectItem>
                  <SelectItem value="dissolve">Dissolve</SelectItem>
                  <SelectItem value="slide">Slide</SelectItem>
                  <SelectItem value="zoom">Zoom</SelectItem>
                  <SelectItem value="wipe">Wipe</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium">{t('duration')}: {duration}s</label>
              <Slider
                value={[duration]}
                min={3}
                max={30}
                step={1}
                onValueChange={(values) => setDuration(values[0])}
                className="my-2"
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Switch
                id="add-audio"
                checked={addAudio}
                onCheckedChange={setAddAudio}
              />
              <Label htmlFor="add-audio">{t('addGeneratedAudio')}</Label>
            </div>
            
            {addAudio && (
              <Textarea
                placeholder={t('audioPromptPlaceholder')}
                rows={2}
                value={audioPrompt}
                onChange={(e) => setAudioPrompt(e.target.value)}
                className="resize-none"
              />
            )}
          </div>
          
          <Button 
            onClick={handleGenerateVideo}
            disabled={loading || images.length < 2} 
            className="w-full"
          >
            {loading ? (
              <>
                <span className="animate-spin mr-2">◌</span>
                {t('creatingVideo')}
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                {t('createVideo')}
              </>
            )}
          </Button>
        </div>
      </Card>
      
      <Card className="p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-4">{t('preview')}</h2>
        
        <div className="flex-1 flex items-center justify-center bg-muted/30 rounded-lg overflow-hidden">
          {generatedVideo ? (
            <div className="relative w-full h-full">
              <video 
                src={generatedVideo} 
                controls
                className="w-full h-full object-contain"
              >
                {t('videoNotSupported')}
              </video>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute bottom-4 right-4"
              >
                <Button variant="secondary" onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  {t('download')}
                </Button>
              </motion.div>
            </div>
          ) : (
            <div className="text-center p-8">
              <div className="flex flex-col items-center justify-center">
                {images.length > 0 ? (
                  <>
                    <div className="grid grid-cols-3 gap-2 mb-4 max-w-xs">
                      {images.slice(0, Math.min(6, images.length)).map((img, index) => (
                        <div 
                          key={img.id}
                          className="aspect-square relative rounded-md overflow-hidden bg-muted"
                        >
                          <Image
                            src={img.src}
                            alt={`Thumbnail ${index + 1}`}
                            fill
                            objectFit="cover"
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-muted-foreground">{t('clickCreateToGenerate')}</p>
                  </>
                ) : (
                  <>
                    <Play className="h-16 w-16 text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">{t('uploadImagesToCreateVideo')}</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}