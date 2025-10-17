import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
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
import { motion } from 'framer-motion'
import { CreativeToast } from './toast'
import { 
  Music, 
  Volume2, 
  Mic2, 
  Radio, 
  Headphones, 
  Info
} from 'lucide-react'

import { LoadingOverlay, FadeInContent, SlideUpContent } from './ui/motion-elements'
import { AudioResult } from './ui/result-display'

// Audio production presets with optimized prompts
const AUDIO_PRESETS = [
  {
    id: 'music',
    name: 'Music',
    icon: Music,
    description: 'Professional music production',
    promptPrefix: 'Professional studio-quality music with clear instrumentation, proper mixing and mastering. Rich frequency spectrum with clean dynamics and spatial stereo imaging.',
  },
  {
    id: 'voice',
    name: 'Voice',
    icon: Mic2,
    description: 'Professional voiceover',
    promptPrefix: 'Professional studio voiceover with clear articulation, natural intonation and proper microphone technique. Broadcast-ready quality with clean audio, no background noise or room reflections.',
  },
  {
    id: 'ambience',
    name: 'Ambience',
    icon: Volume2,
    description: 'Immersive ambient soundscapes',
    promptPrefix: 'Richly detailed ambient soundscape with realistic spatial positioning and natural acoustics. High-fidelity stereo field with proper frequency balance and organic texture.',
  },
  {
    id: 'sound-effects',
    name: 'SFX',
    icon: Radio,
    description: 'Professional sound effects',
    promptPrefix: 'Professional sound effect with precise design and clean recording. Studio-quality with proper dynamics, frequency balance and spatial characteristics. Ready for production use.',
  }
]

// Prompt enhancer adds audio production expertise
const enhancePromptWithAudioExpertise = (basePrompt: string, preset: string) => {
  const selectedPreset = AUDIO_PRESETS.find(p => p.id === preset);
  let enhancedPrompt = basePrompt;
  
  if (selectedPreset) {
    enhancedPrompt = `${selectedPreset.promptPrefix}. ${enhancedPrompt}`;
  } else {
    // Default professional audio instructions if no preset selected
    enhancedPrompt = `Professional audio production with excellent clarity and balance. Studio quality recording with proper levels. ${enhancedPrompt}`;
  }
  
  // Add technical quality markers
  enhancedPrompt += ' Technical specifications: High-fidelity 48kHz/24-bit quality, clean dynamics, proper EQ balance, no clipping or distortion, appropriate stereo imaging.';
  
  return enhancedPrompt;
};

export const AudioGeneration = () => {
  const t = useTranslations()
  const [prompt, setPrompt] = useState('')
  const [duration, setDuration] = useState(30)
  const [model, setModel] = useState('audio-gen')
  const [loading, setLoading] = useState(false)
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null)
  const [selectedPreset, setSelectedPreset] = useState('music')
  
  // Handle audio generation
  const handleGenerateAudio = async () => {
    if (!prompt.trim()) {
      CreativeToast.error(t('errorEmptyPrompt') || 'Please enter a prompt');
      return;
    }
    
    // Audio generation may take a while, show a loading toast
    const toastId = CreativeToast.loading(t('generatingAudio') || 'Generating audio...');
    
    setLoading(true);
    
    try {
      // Create the enhanced prompt with audio expertise
      const enhancedPrompt = enhancePromptWithAudioExpertise(prompt, selectedPreset);
      
      console.log("Enhanced audio prompt:", enhancedPrompt);
      
      // Determine the provider based on the model
      let provider = 'openai';
      if (model === 'music-gen' || model === 'audio-gen') {
        provider = 'openai';
      } else if (model === 'bark') {
        provider = 'google';
      } else if (model === 'riffusion') {
        provider = 'local';
      }
      
      // Call our API
      const response = await fetch('/api/creative/audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider,
          modelId: model,
          prompt: enhancedPrompt,
          duration,
          style: selectedPreset,
          format: 'mp3'
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate audio');
      }
      
      const data = await response.json();
      
      // Update the UI with the generated audio
      setGeneratedAudio(data.url);
      
      // Show success toast
      CreativeToast.success(t('audioGeneratedSuccess') || 'Audio generated successfully!');
    } catch (error) {
      console.error('Error generating audio:', error);
      
      // Show error toast with the error message
      CreativeToast.error(
        t('audioGenerationFailed') || 'Failed to generate audio',
        error instanceof Error ? error.message : undefined
      );
    } finally {
      // Dismiss loading toast and set loading state to false
      CreativeToast.dismiss(toastId);
      setLoading(false);
    }
  }
  
  // Handle audio download
  const handleDownload = () => {
    if (!generatedAudio) return
    
    const link = document.createElement('a')
    link.href = generatedAudio
    link.download = `generated-audio-${Date.now()}.mp3`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  // Handle copy audio URL
  const handleCopyAudioUrl = () => {
    if (!generatedAudio) return;
    
    navigator.clipboard.writeText(generatedAudio);
    CreativeToast.success('Audio URL copied to clipboard!');
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
          message="Creating your audio masterpiece..." 
        />
        
        <FadeInContent>
          <h2 className="text-2xl font-bold mb-4">{t('createAudio') || 'Create Audio'}</h2>
          
          <motion.div 
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="mb-4" variants={itemVariants}>
              <label className="block mb-2 text-sm font-medium">Audio Style</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {AUDIO_PRESETS.map((preset) => {
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
                  {AUDIO_PRESETS.find(p => p.id === selectedPreset)?.description}
                </div>
              )}
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <label className="block mb-2 text-sm font-medium">{t('prompt') || 'Prompt'}</label>
              <Textarea
                placeholder="Describe your audio with specific details like instruments, mood, tempo, style, genre, or voice characteristics. For example: 'An uplifting orchestral piece with strings and piano, building to a powerful climax with percussion'"
                rows={5}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="resize-none"
              />
            </motion.div>
            
            <motion.div className="grid grid-cols-2 gap-4" variants={itemVariants}>
              <div>
                <label className="block mb-2 text-sm font-medium">{t('model') || 'Model'}</label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectModel') || 'Select Model'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="audio-gen">AudioGen</SelectItem>
                    <SelectItem value="music-gen">MusicGen</SelectItem>
                    <SelectItem value="bark">Bark</SelectItem>
                    <SelectItem value="riffusion">Riffusion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium">
                  {t('duration') || 'Duration'}: {formatTime(duration)}
                </label>
                <Slider
                  value={[duration]}
                  min={10}
                  max={120}
                  step={5}
                  onValueChange={(values) => setDuration(values[0])}
                  className="my-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Short (10s)</span>
                  <span>Long (2m)</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  onClick={handleGenerateAudio}
                  disabled={loading || !prompt.trim()} 
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin mr-2">◌</span>
                      {t('generating') || 'Generating...'}
                    </>
                  ) : (
                    <>
                      <Music className="mr-2 h-4 w-4" />
                      {t('generateAudio') || 'Generate Audio'}
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </FadeInContent>
      </Card>
      
      <Card className="p-6 flex flex-col relative">
        <LoadingOverlay 
          show={loading} 
          message="Mixing your audio..." 
        />
        
        <h2 className="text-2xl font-bold mb-4">{t('preview') || 'Preview'}</h2>
        
        <div className="flex-1 flex flex-col items-center justify-center bg-muted/30 rounded-lg overflow-hidden p-6">
          {generatedAudio ? (
            <AudioResult 
              audioUrl={generatedAudio}
              onDownload={handleDownload}
              onCopy={handleCopyAudioUrl}
            />
          ) : (
            <SlideUpContent>
              <div className="text-center p-8">
                <Headphones className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground">{t('audioWillAppearHere') || 'Audio will appear here'}</p>
                <p className="text-xs text-muted-foreground mt-4 max-w-md mx-auto">
                  Fill out the form on the left and click &ldquo;Generate Audio&rdquo; to create your AI-generated audio
                </p>
                
                {loading && (
                  <motion.div 
                    className="mt-6 flex items-center justify-center gap-2 bg-muted/30 p-3 rounded-lg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Music className="h-4 w-4 animate-pulse text-amber-500" />
                    <p className="text-sm font-medium">{t('generatingAudio') || 'Generating audio...'}</p>
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