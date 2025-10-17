import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Copy } from 'lucide-react';

interface ImageResultProps {
  imageUrl: string;
  alt?: string;
  onDownload?: () => void;
  onCopy?: () => void;
}

export const ImageResult: React.FC<ImageResultProps> = ({
  imageUrl,
  alt = 'Generated image',
  onDownload,
  onCopy,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="overflow-hidden">
        <div className="relative aspect-square w-full">
          <Image
            src={imageUrl}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        
        <div className="p-3 flex justify-between bg-muted/20">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onDownload} 
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only sm:ml-1">Download</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onCopy} 
            className="flex items-center gap-1"
          >
            <Copy className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only sm:ml-1">Copy URL</span>
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

interface VideoResultProps {
  videoUrl: string;
  onDownload?: () => void;
  onCopy?: () => void;
}

export const VideoResult: React.FC<VideoResultProps> = ({
  videoUrl,
  onDownload,
  onCopy,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="overflow-hidden">
        <div className="relative aspect-video w-full">
          <video 
            src={videoUrl} 
            controls 
            className="w-full h-full"
          />
        </div>
        
        <div className="p-3 flex justify-between bg-muted/20">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onDownload} 
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only sm:ml-1">Download</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onCopy} 
            className="flex items-center gap-1"
          >
            <Copy className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only sm:ml-1">Copy URL</span>
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

interface AudioResultProps {
  audioUrl: string;
  onDownload?: () => void;
  onCopy?: () => void;
}

export const AudioResult: React.FC<AudioResultProps> = ({
  audioUrl,
  onDownload,
  onCopy,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="overflow-hidden">
        <div className="p-4">
          <audio controls className="w-full">
            <source src={audioUrl} />
            Your browser does not support the audio element.
          </audio>
        </div>
        
        <div className="p-3 flex justify-between bg-muted/20">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onDownload} 
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only sm:ml-1">Download</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onCopy} 
            className="flex items-center gap-1"
          >
            <Copy className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only sm:ml-1">Copy URL</span>
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};