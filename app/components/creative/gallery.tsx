import React, { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { motion } from 'framer-motion'
import { Image as ImageIcon, Video as VideoIcon, Calendar, Star, Download, Search } from 'lucide-react'
import Image from 'next/image'

type MediaItem = {
  id: string
  type: 'image' | 'video'
  title: string
  src: string
  date: string
  favorite: boolean
  prompt?: string
}

export const Gallery = () => {
  const t = useTranslations()
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [filter, setFilter] = useState<'all' | 'images' | 'videos'>('all')
  const [sort, setSort] = useState<'newest' | 'oldest' | 'favorites'>('newest')
  const [search, setSearch] = useState('')
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)

  // Simulate loading gallery items
  useEffect(() => {
    // In a real app, this would fetch from an API/database
    const demoItems: MediaItem[] = [
      {
        id: '1',
        type: 'image',
        title: 'Mountain Landscape',
        src: 'https://source.unsplash.com/random/800x600/?mountain',
        date: '2025-10-15',
        favorite: true,
        prompt: 'A beautiful mountain landscape with snow-capped peaks and a clear sky'
      },
      {
        id: '2',
        type: 'image',
        title: 'Portrait',
        src: 'https://source.unsplash.com/random/800x600/?portrait',
        date: '2025-10-14',
        favorite: false,
        prompt: 'Professional portrait of a woman in business attire'
      },
      {
        id: '3',
        type: 'video',
        title: 'Ocean Waves',
        src: 'https://static.videezy.com/system/resources/previews/000/042/532/original/ocean-waves-slow-motion.mp4',
        date: '2025-10-12',
        favorite: true,
        prompt: 'Slow motion video of ocean waves crashing on beach'
      },
      {
        id: '4',
        type: 'image',
        title: 'Abstract Art',
        src: 'https://source.unsplash.com/random/800x600/?abstract',
        date: '2025-10-10',
        favorite: false,
        prompt: 'Abstract digital art with vibrant colors'
      },
      {
        id: '5',
        type: 'video',
        title: 'Drone City',
        src: 'https://static.videezy.com/system/resources/previews/000/021/425/original/NYC_001.mp4',
        date: '2025-10-05',
        favorite: false,
        prompt: 'Aerial drone footage of a city skyline at sunset'
      },
      {
        id: '6',
        type: 'image',
        title: 'Food Photography',
        src: 'https://source.unsplash.com/random/800x600/?food',
        date: '2025-10-01',
        favorite: true,
        prompt: 'Professional food photography of gourmet cuisine'
      }
    ]
    
    setMediaItems(demoItems)
  }, [])
  
  // Filter and sort media items
  const filteredMedia = useCallback(() => {
    return mediaItems
      .filter(item => {
        // Type filter
        if (filter !== 'all' && item.type !== filter.slice(0, -1)) return false
        
        // Search filter
        if (search && !item.title.toLowerCase().includes(search.toLowerCase()) && 
            !item.prompt?.toLowerCase().includes(search.toLowerCase())) return false
        
        return true
      })
      .sort((a, b) => {
        // Sort
        if (sort === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime()
        if (sort === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime()
        if (sort === 'favorites') return b.favorite === a.favorite ? 0 : b.favorite ? 1 : -1
        return 0
      })
  }, [mediaItems, filter, sort, search])

  // Toggle favorite status
  const toggleFavorite = (id: string) => {
    setMediaItems(prev => prev.map(item => 
      item.id === id ? { ...item, favorite: !item.favorite } : item
    ))
  }

  // Handle media download
  const handleDownload = (item: MediaItem) => {
    const link = document.createElement('a')
    link.href = item.src
    link.download = `${item.title}-${Date.now()}.${item.type === 'image' ? 'jpg' : 'mp4'}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-2xl font-bold">{t('mediaGallery')}</h2>
        
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('searchMedia')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <Select value={filter} onValueChange={(value) => setFilter(value as 'all' | 'images' | 'videos')}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder={t('filter')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allMedia')}</SelectItem>
              <SelectItem value="images">{t('images')}</SelectItem>
              <SelectItem value="videos">{t('videos')}</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sort} onValueChange={(value) => setSort(value as 'newest' | 'oldest' | 'favorites')}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder={t('sort')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">{t('newest')}</SelectItem>
              <SelectItem value="oldest">{t('oldest')}</SelectItem>
              <SelectItem value="favorites">{t('favorites')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredMedia().length > 0 ? (
          filteredMedia().map(item => (
            <Card
              key={item.id}
              className="overflow-hidden group cursor-pointer"
              onClick={() => setSelectedMedia(item)}
            >
              <div className="aspect-square relative">
                {item.type === 'image' ? (
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    objectFit="cover"
                    className="transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <video
                      src={item.src}
                      className="h-full w-full object-cover"
                      muted
                      onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
                      onMouseOut={(e) => (e.target as HTMLVideoElement).pause()}
                    >
                      {t('videoNotSupported')}
                    </video>
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}
                
                <div className="absolute top-2 left-2">
                  {item.type === 'image' ? (
                    <span className="bg-black/50 text-white text-xs px-2 py-1 rounded-md flex items-center">
                      <ImageIcon className="h-3 w-3 mr-1" />
                      {t('image')}
                    </span>
                  ) : (
                    <span className="bg-black/50 text-white text-xs px-2 py-1 rounded-md flex items-center">
                      <VideoIcon className="h-3 w-3 mr-1" />
                      {t('video')}
                    </span>
                  )}
                </div>
                
                <div className="absolute top-2 right-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 rounded-full ${item.favorite ? 'text-yellow-500' : 'text-white/70'}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(item.id)
                    }}
                  >
                    <Star className="h-4 w-4 fill-current" />
                  </Button>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                  <h3 className="font-medium text-white">{item.title}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-white/80 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 rounded-full text-white/80"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDownload(item)
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Search className="h-12 w-12 mb-4" />
            <p className="text-lg font-medium">{t('noMediaFound')}</p>
            <p>{t('tryDifferentFilters')}</p>
          </div>
        )}
      </div>
      
      {selectedMedia && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-bold text-xl">{selectedMedia.title}</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedMedia(null)}
              >
                <span className="sr-only">{t('close')}</span>
                <span aria-hidden="true">&times;</span>
              </Button>
            </div>
            
            <div className="flex-1 overflow-auto p-4">
              <div className="aspect-video relative bg-black rounded-md overflow-hidden mb-4">
                {selectedMedia.type === 'image' ? (
                  <div className="w-full h-full relative">
                    <Image
                      src={selectedMedia.src}
                      alt={selectedMedia.title}
                      fill
                      objectFit="contain"
                    />
                  </div>
                ) : (
                  <video
                    src={selectedMedia.src}
                    controls
                    className="w-full h-full"
                    autoPlay
                  >
                    {t('videoNotSupported')}
                  </video>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">{t('promptUsed')}</h4>
                  <p>{selectedMedia.prompt || t('noPromptRecorded')}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      variant={selectedMedia.favorite ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleFavorite(selectedMedia.id)}
                    >
                      <Star className={`h-4 w-4 mr-2 ${selectedMedia.favorite ? 'fill-current' : ''}`} />
                      {selectedMedia.favorite ? t('favorited') : t('addToFavorites')}
                    </Button>
                    
                    <span className="text-sm text-muted-foreground">
                      {new Date(selectedMedia.date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <Button onClick={() => handleDownload(selectedMedia)}>
                    <Download className="h-4 w-4 mr-2" />
                    {t('download')}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}