import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ImageIcon, Video, Music, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export const CreativeNavLink = () => {
  return (
    <Link href="/creative" passHref>
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start gap-2 px-2 hover:bg-muted/50"
      >
        <Sparkles className="h-4 w-4" />
        <span>Creative Studio</span>
      </Button>
    </Link>
  );
};

export const CreativeFeaturePromo = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-indigo-100 dark:border-indigo-900/50">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-medium text-sm">AI Creative Studio</h3>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Create images, videos, and audio with our advanced AI creative tools
          </p>
          
          <div className="flex gap-2">
            <div className="flex-1 bg-white/80 dark:bg-gray-900/50 rounded-md p-2 flex flex-col items-center">
              <ImageIcon className="h-4 w-4 mb-1 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs">Images</span>
            </div>
            <div className="flex-1 bg-white/80 dark:bg-gray-900/50 rounded-md p-2 flex flex-col items-center">
              <Video className="h-4 w-4 mb-1 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs">Videos</span>
            </div>
            <div className="flex-1 bg-white/80 dark:bg-gray-900/50 rounded-md p-2 flex flex-col items-center">
              <Music className="h-4 w-4 mb-1 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs">Audio</span>
            </div>
          </div>
          
          <Link href="/creative" passHref>
            <Button size="sm" className="w-full" variant="outline">
              Open Creative Studio
            </Button>
          </Link>
        </div>
      </Card>
    </motion.div>
  );
};