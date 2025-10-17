import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { Search, BookMarked, Filter, Check } from 'lucide-react'

// Example style categories and items
const STYLE_CATEGORIES = [
  { id: 'photography', name: 'Photography' },
  { id: 'illustration', name: 'Illustration' },
  { id: 'digital-art', name: 'Digital Art' },
  { id: '3d-render', name: '3D Rendering' },
  { id: 'painting', name: 'Painting Styles' },
  { id: 'film', name: 'Film & Cinema' },
  { id: 'graphic', name: 'Graphic Design' },
  { id: 'abstract', name: 'Abstract' },
]

// Style presets with example prompts and images
const STYLE_PRESETS = [
  {
    id: 'cinematic-lighting',
    name: 'Cinematic Lighting',
    category: 'photography',
    thumbnail: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=500&auto=format',
    promptEnhancer: 'cinematic lighting, dramatic shadows, high contrast, professional color grading, shallow depth of field',
    description: 'Professional film-like lighting with dramatic shadows and contrast',
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    category: 'photography',
    thumbnail: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&auto=format',
    promptEnhancer: 'golden hour lighting, warm sunset glow, rich orange and yellow tones, soft diffused light, natural warmth',
    description: 'Warm golden sunlight typical of the hour before sunset',
  },
  {
    id: 'studio-portrait',
    name: 'Studio Portrait',
    category: 'photography',
    thumbnail: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format',
    promptEnhancer: 'studio portrait lighting, professional headshot, soft box lighting, clean background, professional photoshoot',
    description: 'Professional studio portrait setup with controlled lighting',
  },
  {
    id: 'watercolor',
    name: 'Watercolor',
    category: 'painting',
    thumbnail: 'https://images.unsplash.com/photo-1579541591970-e5c7ef121ab7?w=500&auto=format',
    promptEnhancer: 'watercolor painting style, wet on wet technique, flowing pigments, organic texture, traditional watercolor illustration',
    description: 'Traditional watercolor painting effect with translucent washes',
  },
  {
    id: 'oil-painting',
    name: 'Oil Painting',
    category: 'painting',
    thumbnail: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&auto=format',
    promptEnhancer: 'oil painting style, visible brushstrokes, rich impasto texture, traditional canvas, classic painting technique',
    description: 'Classic oil painting with rich textures and brushstrokes',
  },
  {
    id: 'manga-anime',
    name: 'Manga/Anime',
    category: 'illustration',
    thumbnail: 'https://images.unsplash.com/photo-1591815302525-756a9bcc3425?w=500&auto=format',
    promptEnhancer: 'anime illustration style, manga artwork, clean lineart, cell shading, Japanese animation style, vibrant colors',
    description: 'Japanese manga and anime illustration style',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    category: 'digital-art',
    thumbnail: 'https://images.unsplash.com/photo-1542311655-ab43e38c45e3?w=500&auto=format',
    promptEnhancer: 'cyberpunk aesthetic, neon lighting, high tech low life, futuristic urban setting, digital dystopia, bright contrasting colors',
    description: 'Futuristic cyberpunk style with neon and tech elements',
  },
  {
    id: 'isometric',
    name: 'Isometric',
    category: '3d-render',
    thumbnail: 'https://images.unsplash.com/photo-1569098644584-210bcd375b59?w=500&auto=format',
    promptEnhancer: 'isometric 3D rendering, technical illustration, perfect 45-degree angles, miniature-like, clean geometric design',
    description: '3D isometric perspective commonly used in technical illustrations',
  },
  {
    id: 'film-noir',
    name: 'Film Noir',
    category: 'film',
    thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500&auto=format',
    promptEnhancer: 'film noir style, high contrast black and white, dramatic shadows, venetian blinds lighting, moody atmosphere, 1940s aesthetic',
    description: 'Classic film noir style with dramatic shadows and contrast',
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    category: 'graphic',
    thumbnail: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=500&auto=format',
    promptEnhancer: 'minimalist design, simple clean lines, negative space, limited color palette, modern design principles',
    description: 'Clean minimalist style with simplified elements',
  },
  {
    id: 'abstract-expressionism',
    name: 'Abstract Expressionism',
    category: 'abstract',
    thumbnail: 'https://images.unsplash.com/photo-1573221566340-81bdde00e00b?w=500&auto=format',
    promptEnhancer: 'abstract expressionist style, dynamic paint splatters, spontaneous brushwork, emotional color use, non-representational',
    description: 'Emotional and spontaneous abstract painting style',
  },
  {
    id: 'neon-glow',
    name: 'Neon Glow',
    category: 'digital-art',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format',
    promptEnhancer: 'neon glow effect, vibrant light tubes, bright colors against dark background, electric lighting effect, synthwave aesthetic',
    description: 'Electric neon lighting effects on dark backgrounds',
  },
]

export const StyleLibrary = () => {
  const t = useTranslations()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  
  // Filter styles based on search and category
  const filteredStyles = STYLE_PRESETS.filter(style => {
    const matchesSearch = style.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          style.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || style.category === selectedCategory
    return matchesSearch && matchesCategory
  })
  
  // Toggle style selection
  const toggleStyle = (styleId: string) => {
    if (selectedStyles.includes(styleId)) {
      setSelectedStyles(selectedStyles.filter(id => id !== styleId))
    } else {
      setSelectedStyles([...selectedStyles, styleId])
    }
  }
  
  // Get combined prompt enhancer from selected styles
  const getCombinedPrompt = () => {
    return selectedStyles
      .map(id => STYLE_PRESETS.find(style => style.id === id)?.promptEnhancer)
      .filter(Boolean)
      .join(', ')
  }
  
  // Copy combined prompt to clipboard
  const copyToClipboard = () => {
    const prompt = getCombinedPrompt()
    navigator.clipboard.writeText(prompt)
    // Could add a toast notification here
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t('styleLibrary') || 'Style Library'}</h2>
        <Badge variant="outline" className="px-3">
          {selectedStyles.length} {t('selected') || 'selected'}
        </Badge>
      </div>
      
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('searchStyles') || 'Search styles...'}
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon" title={t('filter') || 'Filter'}>
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      
      <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="flex w-full overflow-x-auto pb-1">
          <TabsTrigger value="all">{t('allStyles') || 'All'}</TabsTrigger>
          {STYLE_CATEGORIES.map(category => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredStyles.map(style => (
            <Card
              key={style.id}
              className={`overflow-hidden transition-all cursor-pointer border-2 ${
                selectedStyles.includes(style.id) 
                  ? 'border-primary shadow-md' 
                  : 'border-transparent hover:border-primary/50'
              }`}
              onClick={() => toggleStyle(style.id)}
            >
              <div className="relative aspect-square">
                <img
                  src={style.thumbnail}
                  alt={style.name}
                  className="w-full h-full object-cover"
                />
                {selectedStyles.includes(style.id) && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-medium text-sm">{style.name}</h3>
                <p className="text-xs text-muted-foreground truncate">{style.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </Tabs>
      
      {selectedStyles.length > 0 && (
        <div className="bg-muted/50 border rounded-lg p-4 mt-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">{t('combinedStylePrompt') || 'Combined Style Prompt'}</h3>
            <Button variant="ghost" size="sm" onClick={copyToClipboard}>
              {t('copyToClipboard') || 'Copy'}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            {getCombinedPrompt()}
          </p>
        </div>
      )}
    </div>
  )
}