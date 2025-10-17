import React, { useState, useRef, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { useDropzone } from 'react-dropzone'
import { Cropper, ReactCropperElement } from 'react-cropper'
import 'cropperjs/dist/cropper.css'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { motion } from 'framer-motion'
import { Upload, Wand2, Eraser, Brush, Shuffle, Layers, Download } from 'lucide-react'
import Image from 'next/image'

export const ImageEditing = () => {
  const t = useTranslations()
  const [sourceImage, setSourceImage] = useState<string | null>(null)
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [editMode, setEditMode] = useState<'inpaint' | 'outpaint' | 'variation'>('inpaint')
  const [prompt, setPrompt] = useState('')
  const [model, setModel] = useState('dall-e-3')
  const [strength, setStrength] = useState(50)
  const [loading, setLoading] = useState(false)
  const [preserveFaces, setPreserveFaces] = useState(true)
  const cropperRef = useRef<ReactCropperElement>(null)
  
  // Handle file drop for source image
  const onDrop = useCallback((acceptedFiles: Array<File>) => {
    const imageFile = acceptedFiles[0]
    if (imageFile && imageFile.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = () => {
        setSourceImage(reader.result as string)
        setResultImage(null) // Clear any previous result
      }
      reader.readAsDataURL(imageFile)
    }
  }, [])
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    maxFiles: 1
  })
  
  // Get cropped area data
  const getCropData = () => {
    if (cropperRef.current && cropperRef.current.cropper) {
      const canvas = cropperRef.current.cropper.getCroppedCanvas()
      return canvas.toDataURL('image/png')
    }
    return null
  }
  
  // Enhanced prompt with face preservation instructions
  const enhancePromptWithFacePreservation = (basePrompt: string, shouldPreserveFaces: boolean) => {
    let enhancedPrompt = basePrompt;
    
    // Add face preservation instructions if enabled
    if (shouldPreserveFaces) {
      enhancedPrompt += ' Important: Maintain accurate and authentic facial features of all subjects. Do not alter, idealize, or modify faces or identities in any way.';
    }
    
    // Add technical quality markers
    enhancedPrompt += ' Technical specifications: High-quality output with proper lighting, accurate details, and professional editing quality.';
    
    return enhancedPrompt;
  };

  // Handle image editing based on mode
  const handleEditImage = async () => {
    if (!sourceImage || !prompt.trim()) return
    
    setLoading(true)
    
    try {
      // Get the cropped area if needed
      const croppedImage = editMode === 'inpaint' ? getCropData() : null;
      // In a real implementation, we would use croppedImage in the API call
      
      // Create the enhanced prompt with face preservation if enabled
      const enhancedPrompt = enhancePromptWithFacePreservation(prompt, preserveFaces);
      
      console.log("Enhanced editing prompt:", enhancedPrompt);
      console.log("Edit mode:", editMode);
      console.log("Preserve faces:", preserveFaces);
      
      // Simulate API call for now - in real implementation, this would call your API
      setTimeout(() => {
        // For demo purposes, using a placeholder image
        setResultImage('https://source.unsplash.com/random/1024x1024/?edited')
        setLoading(false)
      }, 3000)
    } catch (error) {
      console.error('Error editing image:', error)
      setLoading(false)
    }
  }
  
  // Handle image download
  const handleDownload = () => {
    if (!resultImage) return
    
    const link = document.createElement('a')
    link.href = resultImage
    link.download = `edited-image-${Date.now()}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">{t('editImage')}</h2>
        
        {!sourceImage ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/20'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            {isDragActive ? (
              <p className="text-lg">{t('dropImageToEdit')}</p>
            ) : (
              <p className="text-lg">{t('uploadImageToEdit')}</p>
            )}
            <p className="text-sm text-muted-foreground mt-2">{t('supportedFormats')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-md overflow-hidden bg-muted/30 aspect-square">
              {editMode === 'inpaint' ? (
                <Cropper
                  ref={cropperRef}
                  src={sourceImage}
                  style={{ height: '100%', width: '100%' }}
                  guides={true}
                  viewMode={1}
                  minCropBoxHeight={10}
                  minCropBoxWidth={10}
                  background={false}
                  responsive={true}
                  autoCropArea={0.5}
                />
              ) : (
                <div className="relative w-full h-full">
                  {sourceImage && (
                    <div className="relative w-full h-full">
                      <Image
                        src={sourceImage}
                        alt={t('sourceImage')}
                        fill
                        objectFit="contain"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => setSourceImage(null)}
              className="w-full"
            >
              {t('chooseAnotherImage')}
            </Button>
            
            <div className="border-t border-muted pt-4 mt-4">
              <ToggleGroup 
                type="single" 
                value={editMode} 
                onValueChange={(value) => value && setEditMode(value as 'inpaint' | 'outpaint' | 'variation')}
                className="justify-center"
              >
                <ToggleGroupItem value="inpaint" aria-label={t('inpaint')}>
                  <Eraser className="h-4 w-4 mr-2" />
                  {t('inpaint')}
                </ToggleGroupItem>
                <ToggleGroupItem value="outpaint" aria-label={t('outpaint')}>
                  <Brush className="h-4 w-4 mr-2" />
                  {t('outpaint')}
                </ToggleGroupItem>
                <ToggleGroupItem value="variation" aria-label={t('variation')}>
                  <Shuffle className="h-4 w-4 mr-2" />
                  {t('variation')}
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium">{t('prompt')}</label>
              <Textarea
                placeholder={
                  editMode === 'inpaint'
                    ? t('inpaintPromptPlaceholder')
                    : editMode === 'outpaint'
                    ? t('outpaintPromptPlaceholder')
                    : t('variationPromptPlaceholder')
                }
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="resize-none"
              />
            </div>
            
            <div className="mb-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="preserveFacesEdit"
                  checked={preserveFaces}
                  onChange={(e) => setPreserveFaces(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="preserveFacesEdit" className="text-sm font-medium">
                  {t('preserveFacialFeatures') || 'Preserve facial features accurately'}
                </label>
              </div>
              <p className="text-xs text-muted-foreground mt-1 ml-5">
                {t('preserveFacialFeaturesTooltip') || 'Ensures AI maintains authentic facial features and identities without idealization'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium">{t('model')}</label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectModel')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dall-e-3">DALL-E 3</SelectItem>
                    <SelectItem value="stable-diffusion">Stable Diffusion</SelectItem>
                    <SelectItem value="midjourney">Midjourney</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium">
                  {t('strength')}: {strength}%
                </label>
                <Slider
                  value={[strength]}
                  min={10}
                  max={100}
                  step={5}
                  onValueChange={(values) => setStrength(values[0])}
                  className="my-2"
                />
              </div>
            </div>
            
            <Button 
              onClick={handleEditImage}
              disabled={loading || !prompt.trim()} 
              className="w-full"
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2">◌</span>
                  {t('processing')}
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  {t('editImage')}
                </>
              )}
            </Button>
          </div>
        )}
      </Card>
      
      <Card className="p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-4">{t('result')}</h2>
        
        <div className="flex-1 flex items-center justify-center bg-muted/30 rounded-lg overflow-hidden">
          {resultImage ? (
            <div className="relative w-full h-full">
              <div className="relative w-full h-full">
                <Image
                  src={resultImage}
                  alt={t('resultImage')}
                  fill
                  objectFit="contain"
                />
              </div>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute bottom-4 right-4"
              >
                <Button onClick={handleDownload} variant="secondary">
                  <Download className="mr-2 h-4 w-4" />
                  {t('download')}
                </Button>
              </motion.div>
            </div>
          ) : (
            <div className="text-center p-8">
              <Layers className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground">{t('editedImageWillAppearHere')}</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}