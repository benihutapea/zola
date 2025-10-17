import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  AlertCircle,
  Save,
  RefreshCw,
  FileSpreadsheet,
  Zap,
  Download,
  Share2,
  CopyCheck,
  Code
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

// Sample configuration presets
const CONFIGURATION_PRESETS = [
  {
    id: 'balanced',
    name: 'Balanced',
    description: 'Balanced settings for general purpose use',
    config: {
      guidanceScale: 7.5,
      samplingMethod: 'ddpm',
      samplingSteps: 30,
      noiseLevel: 20,
      enhanceDetails: true,
      useHyperTiling: false,
      negativePrompt: 'blurry, low quality, deformed, unrealistic',
      seed: Math.floor(Math.random() * 9999999),
    }
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'More creative and varied outputs',
    config: {
      guidanceScale: 5.0,
      samplingMethod: 'dpmpp-2m',
      samplingSteps: 25,
      noiseLevel: 30,
      enhanceDetails: false,
      useHyperTiling: false,
      negativePrompt: 'blurry, low quality',
      seed: Math.floor(Math.random() * 9999999),
    }
  },
  {
    id: 'detailed',
    name: 'Maximum Detail',
    description: 'Highly detailed and precise outputs',
    config: {
      guidanceScale: 9.0,
      samplingMethod: 'ddim',
      samplingSteps: 50,
      noiseLevel: 10,
      enhanceDetails: true,
      useHyperTiling: true,
      negativePrompt: 'blurry, low quality, deformed, unrealistic, grainy, noisy, poorly drawn, bad anatomy, cropped, out of frame, ugly',
      seed: Math.floor(Math.random() * 9999999),
    }
  },
  {
    id: 'fast',
    name: 'Fast Generation',
    description: 'Quick results with fewer steps',
    config: {
      guidanceScale: 6.0,
      samplingMethod: 'k_dpmpp_2m',
      samplingSteps: 15,
      noiseLevel: 25,
      enhanceDetails: false,
      useHyperTiling: false,
      negativePrompt: 'blurry, low quality',
      seed: Math.floor(Math.random() * 9999999),
    }
  }
]

// Sampling methods options
const SAMPLING_METHODS = [
  { id: 'ddim', name: 'DDIM' },
  { id: 'ddpm', name: 'DDPM' },
  { id: 'k_euler', name: 'Euler' },
  { id: 'k_euler_ancestral', name: 'Euler Ancestral' },
  { id: 'k_dpmpp_2m', name: 'DPM++ 2M' },
  { id: 'dpmpp-2m', name: 'DPM++ 2M Karras' },
]

export const AdvancedModelCustomization = () => {
  const t = useTranslations()
  const [selectedPreset, setSelectedPreset] = useState('balanced')
  const [config, setConfig] = useState(CONFIGURATION_PRESETS.find(p => p.id === 'balanced')?.config)
  const [isPresetModified, setIsPresetModified] = useState(false)
  const [configName, setConfigName] = useState('')
  
  // Handle preset selection
  const handlePresetChange = (presetId: string) => {
    const preset = CONFIGURATION_PRESETS.find(p => p.id === presetId)
    if (preset) {
      setConfig(preset.config)
      setSelectedPreset(presetId)
      setIsPresetModified(false)
    }
  }
  
  // Update config value
  const updateConfig = (key: string, value: any) => {
    if (config) {
      setConfig({ ...config, [key]: value })
      setIsPresetModified(true)
    }
  }
  
  // Generate new random seed
  const generateNewSeed = () => {
    const newSeed = Math.floor(Math.random() * 9999999)
    updateConfig('seed', newSeed)
  }
  
  // Save current config as preset (would connect to backend in real implementation)
  const saveAsPreset = () => {
    if (!configName.trim() || !config) return
    
    // In real app, would save to backend/database
    console.log('Saving preset:', { name: configName, config })
    
    // Reset form
    setConfigName('')
    setIsPresetModified(false)
    // Show success notification (would be implemented in real app)
  }
  
  // Export configuration as JSON
  const exportConfig = () => {
    if (!config) return
    
    const dataStr = JSON.stringify(config, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `ai-model-config-${selectedPreset}-${Date.now()}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }
  
  // Copy config as JSON to clipboard
  const copyConfigToClipboard = () => {
    if (!config) return
    
    const dataStr = JSON.stringify(config, null, 2)
    navigator.clipboard.writeText(dataStr)
    // Show success notification (would be implemented in real app)
  }
  
  if (!config) return null
  
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">{t('advancedModelSettings') || 'Advanced Model Settings'}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {t('advancedSettingsDescription') || 'Fine-tune AI generation parameters for optimal results'}
            </p>
          </div>
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={exportConfig}>
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('exportConfig') || 'Export Configuration'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={copyConfigToClipboard}>
                    <CopyCheck className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('copyToClipboard') || 'Copy to Clipboard'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left column - presets and config management */}
          <div className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-medium">{t('configurationPresets') || 'Configuration Presets'}</label>
              <div className="grid grid-cols-1 gap-2">
                {CONFIGURATION_PRESETS.map(preset => (
                  <div
                    key={preset.id}
                    onClick={() => handlePresetChange(preset.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedPreset === preset.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/40 hover:bg-muted'
                    }`}
                  >
                    <div className="font-medium">{preset.name}</div>
                    <p className="text-xs opacity-80">{preset.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t border-border pt-6">
              <label className="block mb-2 text-sm font-medium">
                {t('saveCurrentConfig') || 'Save Current Configuration'}
              </label>
              <div className="flex gap-2">
                <Input
                  value={configName}
                  onChange={(e) => setConfigName(e.target.value)}
                  placeholder={t('configurationName') || 'Configuration name'}
                  className="flex-1"
                />
                <Button onClick={saveAsPreset} disabled={!configName.trim()}>
                  <Save className="h-4 w-4 mr-2" />
                  {t('save') || 'Save'}
                </Button>
              </div>
              {isPresetModified && (
                <p className="text-xs text-muted-foreground mt-2 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {t('unsavedChanges') || 'You have unsaved changes'}
                </p>
              )}
            </div>
          </div>
          
          {/* Right column - parameter controls */}
          <div className="md:col-span-2 space-y-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="sampling">
                <AccordionTrigger>
                  {t('samplingParameters') || 'Sampling Parameters'}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>{t('guidanceScale') || 'Guidance Scale'}: {config.guidanceScale}</Label>
                        <span className="text-xs text-muted-foreground">1-15</span>
                      </div>
                      <Slider
                        value={[config.guidanceScale]}
                        min={1}
                        max={15}
                        step={0.5}
                        onValueChange={(values) => updateConfig('guidanceScale', values[0])}
                      />
                      <p className="text-xs text-muted-foreground">
                        {t('guidanceScaleHelp') || 'Controls how closely the model follows your prompt. Higher values follow prompt more strictly.'}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>{t('samplingMethod') || 'Sampling Method'}</Label>
                      <Select 
                        value={config.samplingMethod}
                        onValueChange={(value) => updateConfig('samplingMethod', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('selectMethod') || 'Select method'} />
                        </SelectTrigger>
                        <SelectContent>
                          {SAMPLING_METHODS.map(method => (
                            <SelectItem key={method.id} value={method.id}>{method.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        {t('samplingMethodHelp') || 'Different algorithms produce different qualities and styles of images.'}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>{t('samplingSteps') || 'Sampling Steps'}: {config.samplingSteps}</Label>
                        <span className="text-xs text-muted-foreground">10-150</span>
                      </div>
                      <Slider
                        value={[config.samplingSteps]}
                        min={10}
                        max={150}
                        step={1}
                        onValueChange={(values) => updateConfig('samplingSteps', values[0])}
                      />
                      <p className="text-xs text-muted-foreground">
                        {t('samplingStepsHelp') || 'More steps produce better quality but take longer to generate.'}
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="noise">
                <AccordionTrigger>
                  {t('noiseAndVariation') || 'Noise & Variation'}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>{t('noiseLevel') || 'Noise Level'}: {config.noiseLevel}%</Label>
                      </div>
                      <Slider
                        value={[config.noiseLevel]}
                        min={0}
                        max={100}
                        step={5}
                        onValueChange={(values) => updateConfig('noiseLevel', values[0])}
                      />
                      <p className="text-xs text-muted-foreground">
                        {t('noiseLevelHelp') || 'Adds creative randomness. Higher values produce more varied results.'}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>{t('seed') || 'Generation Seed'}</Label>
                        <Button variant="ghost" size="icon" onClick={generateNewSeed}>
                          <RefreshCw className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <Input
                        type="number"
                        value={config.seed}
                        onChange={(e) => updateConfig('seed', parseInt(e.target.value))}
                      />
                      <p className="text-xs text-muted-foreground">
                        {t('seedHelp') || 'Controls randomness. Same seed produces similar results for the same prompt.'}
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="advanced">
                <AccordionTrigger>
                  {t('advancedOptions') || 'Advanced Options'}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between space-x-2">
                      <div>
                        <Label>{t('enhanceDetails') || 'Enhance Details'}</Label>
                        <p className="text-xs text-muted-foreground">
                          {t('enhanceDetailsHelp') || 'Additional processing to improve details and sharpness.'}
                        </p>
                      </div>
                      <Switch
                        checked={config.enhanceDetails}
                        onCheckedChange={(checked) => updateConfig('enhanceDetails', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <div>
                        <Label>{t('hyperTiling') || 'Use Hyper Tiling'}</Label>
                        <p className="text-xs text-muted-foreground">
                          {t('hyperTilingHelp') || 'Process image in tiles to achieve higher resolution details.'}
                        </p>
                      </div>
                      <Switch
                        checked={config.useHyperTiling}
                        onCheckedChange={(checked) => updateConfig('useHyperTiling', checked)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>{t('negativePrompt') || 'Negative Prompt'}</Label>
                      <Textarea
                        value={config.negativePrompt}
                        onChange={(e) => updateConfig('negativePrompt', e.target.value)}
                        placeholder={t('negativePromptPlaceholder') || 'Things to avoid in the generation...'}
                        rows={2}
                      />
                      <p className="text-xs text-muted-foreground">
                        {t('negativePromptHelp') || 'Describe elements you want to avoid in the generated output.'}
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="code">
                <AccordionTrigger>
                  {t('configurationCode') || 'Configuration Code'}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="relative">
                    <pre className="bg-muted/50 rounded-md p-4 text-xs overflow-auto max-h-60">
                      <code>{JSON.stringify(config, null, 2)}</code>
                    </pre>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="absolute top-2 right-2"
                      onClick={copyConfigToClipboard}
                    >
                      <Code className="h-4 w-4" />
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <Button className="w-full">
              <Zap className="h-4 w-4 mr-2" />
              {t('applySettingsToModel') || 'Apply Settings to Model'}
            </Button>
            
            <p className="text-xs text-muted-foreground text-center">
              {t('advancedSettingsNote') || 'These settings will apply to your next generation. Different models support different settings.'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}