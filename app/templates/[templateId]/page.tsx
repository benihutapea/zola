import { Metadata } from 'next'
import { TemplateDetail } from '@/app/components/templates/template-detail'
import { APP_NAME } from '@/lib/config'

export const metadata: Metadata = {
  title: `Template | ${APP_NAME}`,
  description: 'View and edit prompt template'
}

interface TemplatePageProps {
  params: {
    templateId: string
  }
}

export default function TemplatePage({ params }: TemplatePageProps) {
  const { templateId } = params
  
  return (
    <div className="container max-w-4xl py-6 space-y-8">
      <TemplateDetail templateId={templateId} />
    </div>
  )
}