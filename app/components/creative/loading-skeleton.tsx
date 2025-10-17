import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const CreativeLoadingSkeleton = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-center">
        <Skeleton className="h-10 w-64" />
      </div>
      
      <div className="flex justify-center">
        <div className="space-x-1 flex">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <Skeleton className="h-8 w-40 mb-6" />
          
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-md" />
              ))}
            </div>
            
            <Skeleton className="h-24 w-full" />
            
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </div>
            
            <Skeleton className="h-10 w-full" />
          </div>
        </Card>
        
        <Card className="p-6">
          <Skeleton className="h-8 w-32 mb-6" />
          
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full h-64 flex flex-col items-center justify-center space-y-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};