import { CreativeMediaGenerators } from '@/app/components/creative';
import { CreativeLoadingSkeleton } from '@/app/components/creative/loading-skeleton';
import { Suspense } from 'react';

export const metadata = {
  title: 'AI Creative Studio - Zola',
  description: 'Generate images, videos, and audio with AI',
};

export default function CreativePage() {
  return (
    <main className="flex flex-col items-center justify-between min-h-screen py-8">
      <Suspense fallback={<CreativeLoadingSkeleton />}>
        <CreativeMediaGenerators />
      </Suspense>
    </main>
  );
}