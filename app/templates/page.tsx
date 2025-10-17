import { Metadata } from 'next'
import { TemplateList } from '@/app/components/templates/template-list'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { APP_NAME } from '@/lib/config'

export const metadata: Metadata = {
  title: `Templates | ${APP_NAME}`,
  description: 'Create and manage reusable prompt templates'
}

export default function TemplatesPage() {
  return (
    <div className="container max-w-6xl py-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Prompt Templates</h1>
          <p className="text-muted-foreground mt-1">
            Create, manage and use reusable prompt templates
          </p>
        </div>
        <Button asChild>
          <Link href="/templates/create">
            <Plus className="mr-2 h-4 w-4" />
            New Template
          </Link>
        </Button>
      </div>
      
      {/* Client component that lists templates */}
      <TemplateList />
    </div>
  )
}