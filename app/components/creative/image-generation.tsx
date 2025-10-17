import React, { useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { motion } from 'framer-motion'
import { AdvancedModelCustomization } from './advanced-model-customization'
import { CreativeToast } from './toast'
import { 
  ImageIcon, 
  Upload, 
  Wand2,  
  Mountain, 
  User, 
  ShoppingBag, 
  Building, 
  Info
} from 'lucide-react'

import { LoadingOverlay, FadeInContent, SlideUpContent } from './ui/motion-elements'
import { ImageResult } from './ui/result-display'

// Photography style presets with optimized prompts
const PHOTOGRAPHY_PRESETS = [
  {
    id: 'portrait',
    name: 'Portrait',
    icon: User,
    description: 'Professional portrait photography',
    promptPrefix: 'High-quality professional portrait photograph with natural lighting, bokeh background, shot on a DSLR camera with an 85mm lens at f/1.8. Maintain authentic facial features and accurate representation. 4K resolution with precise details',
  },
  {
    id: 'landscape',
    name: 'Landscape',
    icon: Mountain,
    description: 'Scenic landscape photography',
    promptPrefix: 'Breathtaking landscape photograph captured during golden hour with a wide-angle lens. Sharp foreground details with graduated depth of field. Shot on a professional DSLR with HDR processing. 4K resolution with rich colors and contrast',
  },
  {
    id: 'product',
    name: 'Product',
    icon: ShoppingBag,
    description: 'Commercial product photography',
    promptPrefix: 'Professional product photograph with studio lighting setup, soft shadows, and clean background. Shot with a macro lens for intricate details. Commercial quality with 4K resolution and perfect white balance',
  },
  {
    id: 'architecture',
    name: 'Architecture',
    icon: Building,
    description: 'Architectural photography',
    promptPrefix: 'Stunning architectural photograph with perfect perspective correction, captured with a tilt-shift lens. Dramatic lighting highlighting structural elements. Professional 4K quality with precise straight lines and geometric accuracy',
  }
]

// Prompt enhancer adds photography-specific instructions
const enhancePromptWithPhotographyExpertise = (basePrompt: string, preset: string, preserveFaces: boolean) => {
  const selectedPreset = PHOTOGRAPHY_PRESETS.find(p => p.id === preset);
  let enhancedPrompt = basePrompt;
  
  if (selectedPreset) {
    enhancedPrompt = `${selectedPreset.promptPrefix}. ${enhancedPrompt}`;
  } else {
    // Default professional photography instructions if no preset selected
    enhancedPrompt = `Professional photograph with excellent composition and lighting. Shot with high-end equipment for maximum clarity. 4K resolution. ${enhancedPrompt}`;
  }
  
  if (preserveFaces) {
    enhancedPrompt += ' Important: Maintain accurate and authentic facial features of all subjects. Do not alter, idealize, or modify faces or identities in any way.';
  }
  
  // Add technical quality markers
  enhancedPrompt += ' Technical specifications: RAW image quality, optimal exposure, perfect white balance, no artifacts or noise, photorealistic, detailed textures.';
  
  return enhancedPrompt;
};

export const ImageGeneration = () => {
  const t = useTranslations()
  const [prompt, setPrompt] = useState('')
  const [size, setSize] = useState('1792x1024') // Default to high-res landscape
  const [model, setModel] = useState('dall-e-3')
  const [quality, setQuality] = useState(90) // Default to higher quality
  const [loading, setLoading] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [referenceSources, setReferenceSources] = useState<Array<string>>([])
  const [selectedPreset, setSelectedPreset] = useState('portrait')
  const [preserveFaces, setPreserveFaces] = useState(true)

  // Handle file drops for reference images
  const onDrop = useCallback((acceptedFiles: Array<File>) => {
    const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'))
    
    // Create preview URLs for the dropped images
    const newReferenceSources = imageFiles.map(file => URL.createObjectURL(file))
    setReferenceSources(prev => [...prev, ...newReferenceSources])
  }, [])
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    maxFiles: 5
  })
  
  // Remove a reference image
  const removeReferenceImage = (index: number) => {
    setReferenceSources(prev => prev.filter((_, i) => i !== index))
  }
  
  // Handle image generation with enhanced prompts
  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      CreativeToast.error(t('errorEmptyPrompt') || 'Please enter a prompt');
      return;
    }
    
    // Show loading toast
    const toastId = CreativeToast.loading(t('generatingImage') || 'Generating image...');
    
    setLoading(true);
    
    try {
      // Create the enhanced prompt with photography expertise
      const enhancedPrompt = enhancePromptWithPhotographyExpertise(prompt, selectedPreset, preserveFaces);
      
      console.log("Enhanced prompt:", enhancedPrompt);
      
      // Call our API
      const response = await fetch('/api/creative/image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: model, // Use the selected model as provider
          modelId: model, // For now, use the same value for modelId
          prompt: enhancedPrompt, // Use enhanced prompt with photography expertise
          size: size,
          quality: quality,
          preserveFacialFeatures: preserveFaces
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate image');
      }
      
      const data = await response.json();
      
      // Update the UI with the generated image
      setGeneratedImage(data.url);
      
      // Show success toast
      CreativeToast.success(t('imageGeneratedSuccess') || 'Image generated successfully!');
    } catch (error) {
      console.error('Error generating image:', error);
      
      // Show error toast with the error message
      CreativeToast.error(
        t('imageGenerationFailed') || 'Failed to generate image', 
        error instanceof Error ? error.message : undefined
      );
    } finally {
      // Dismiss loading toast and set loading state to false
      CreativeToast.dismiss(toastId);
      setLoading(false);
    }
  }
  
  // Handle image download
  const handleDownload = () => {
    if (!generatedImage) return
    
    const link = document.createElement('a')
    link.href = generatedImage
    link.download = `generated-image-${Date.now()}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
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

  // Handle copy image URL
  const handleCopyImageUrl = () => {
    if (!generatedImage) return;
    
    navigator.clipboard.writeText(generatedImage);
    
    CreativeToast.success('Image URL copied to clipboard!');
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <Tabs defaultValue="basic">
          <TabsList className="mb-4">
            <TabsTrigger value="basic">{t('basicSettings') || 'Basic Settings'}</TabsTrigger>
            <TabsTrigger value="advanced">{t('advancedSettings') || 'Advanced Settings'}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
            <Card className="p-6 relative">
              <LoadingOverlay 
                show={loading} 
                message="Generating your image masterpiece..." 
              />
              
              <FadeInContent>
                <h2 className="text-2xl font-bold mb-4">{t('createImage')}</h2>
              
                <motion.div 
                  className="space-y-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div variants={itemVariants}>
                    <label className="block mb-2 text-sm font-medium">{t('prompt')}</label>
                    <Textarea
                      placeholder="Describe your image with specific details like subject, setting, mood, colors, and lighting. For example: 'A serene mountain lake at sunset with warm golden light reflecting off the water surface, surrounded by pine trees'"
                      rows={5}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="resize-none"
                    />
                  </motion.div>
                  
                  <motion.div className="mb-4" variants={itemVariants}>
                    <label className="block mb-2 text-sm font-medium">Photography Preset</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {PHOTOGRAPHY_PRESETS.map((preset) => {
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
                        {PHOTOGRAPHY_PRESETS.find(p => p.id === selectedPreset)?.description}
                      </div>
                    )}
                  </motion.div>

                  <motion.div className="mb-4" variants={itemVariants}>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="preserveFaces"
                        checked={preserveFaces}
                        onChange={(e) => setPreserveFaces(e.target.checked)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor="preserveFaces" className="text-sm font-medium">
                        Preserve facial features accurately
                      </label>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 ml-5">
                      Ensures AI maintains authentic facial features and identities without idealization
                    </p>
                  </motion.div>

                  <motion.div className="grid grid-cols-2 gap-4" variants={itemVariants}>
                    <div>
                      <label className="block mb-2 text-sm font-medium">{t('model')}</label>
                      <Select value={model} onValueChange={setModel}>
                        <SelectTrigger>
                          <SelectValue placeholder={t('selectModel')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dall-e-3">DALL-E 3</SelectItem>
                          <SelectItem value="dall-e-2">DALL-E 2</SelectItem>
                          <SelectItem value="stable-diffusion">Stable Diffusion</SelectItem>
                          <SelectItem value="midjourney">Midjourney</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block mb-2 text-sm font-medium">{t('size')}</label>
                      <Select value={size} onValueChange={setSize}>
                        <SelectTrigger>
                          <SelectValue placeholder={t('selectSize')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1024x1024">1024x1024</SelectItem>
                          <SelectItem value="1024x1792">1024x1792</SelectItem>
                          <SelectItem value="1792x1024">1792x1024</SelectItem>
                          <SelectItem value="512x512">512x512</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <label className="block mb-2 text-sm font-medium">{t('quality')}: {quality}%</label>
                    <Slider
                      value={[quality]}
                      min={25}
                      max={100}
                      step={1}
                      onValueChange={([value]) => setQuality(value)}
                      className="my-4"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Standard</span>
                      <span>Professional</span>
                    </div>
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <label className="block mb-2 text-sm font-medium">{t('referenceImages')}</label>
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
                        isDragActive ? 'border-primary bg-primary/10 scale-102' : 'border-muted-foreground/20 hover:border-primary/40 hover:bg-muted/10'
                      }`}
                    >
                      <input {...getInputProps()} />
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      {isDragActive ? (
                        <p>{t('dropToUpload')}</p>
                      ) : (
                        <p>{t('dragDropOrClick')}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">{t('maxFiles')}</p>
                    </div>
                    
                    {referenceSources.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                        {referenceSources.map((src, index) => (
                          <motion.div 
                            key={index} 
                            className="relative group rounded-md overflow-hidden"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            whileHover={{ scale: 1.05 }}
                          >
                            <div className="w-full h-24 relative">
                              {/* Use Image from next/image */}
                              <Image 
                                src={src}
                                alt={`Reference ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300"></div>
                            <button
                              onClick={() => removeReferenceImage(index)}
                              className="absolute top-1 right-1 bg-black/70 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              aria-label={t('remove')}
                            >
                              <span className="text-white text-xs">✕</span>
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        onClick={handleGenerateImage}
                        disabled={loading || !prompt.trim()} 
                        className="w-full"
                      >
                        {loading ? (
                          <>
                            <span className="animate-spin mr-2">◌</span>
                            {t('generating')}
                          </>
                        ) : (
                          <>
                            <Wand2 className="mr-2 h-4 w-4" />
                            {t('generateImage')}
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </FadeInContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="advanced">
            <AdvancedModelCustomization />
          </TabsContent>
        </Tabs>
      </div>
      
      <Card className="p-6 flex flex-col relative">
        <LoadingOverlay 
          show={loading} 
          message="Creating your visual masterpiece..." 
        />
        
        <h2 className="text-2xl font-bold mb-4">{t('preview')}</h2>
        
        <div className="flex-1 flex items-center justify-center bg-muted/30 rounded-lg overflow-hidden">
          {generatedImage ? (
            <div className="relative w-full h-full">
              <ImageResult 
                imageUrl={generatedImage}
                alt={t('generatedImage')}
                onDownload={handleDownload}
                onCopy={handleCopyImageUrl}
              />
            </div>
          ) : (
            <SlideUpContent>
              <div className="text-center p-8">
                <ImageIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground">{t('imageWillAppearHere')}</p>
                <p className="text-xs text-muted-foreground mt-4 max-w-md mx-auto">
                  Fill out the form on the left and click &ldquo;Generate Image&rdquo; to create your AI-generated photograph
                </p>
              </div>
            </SlideUpContent>
          )}
        </div>
      </Card>
    </div>
  )
}