import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { MediaCreationHub } from '@/app/components/media-creation-hub'

export const metadata: Metadata = {
  title: 'Creative Studio',
  description: 'Create stunning images and videos with AI'
}

export default async function StudioPage() {
  const supabase = await createClient()
  const t = await getTranslations()
  
  if (supabase) {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      redirect('/auth/login')
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="p-6 mb-6">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          {t('creativeStudio')}
        </h1>
        <p className="text-muted-foreground">
          {t('creativeStudioDescription')}
        </p>
      </Card>
      
      <MediaCreationHub />
    </div>
  )
}