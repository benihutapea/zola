import { Metadata } from 'next'
import { CreateTemplateForm } from '@/app/components/templates/create-template-form'
import { APP_NAME } from '@/lib/config'

export const metadata: Metadata = {
  title: `Create Template | ${APP_NAME}`,
  description: 'Create a new reusable prompt template'
}

export default function CreateTemplatePage() {
  return (
    <div className="container max-w-4xl py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Create Template</h1>
        <p className="text-muted-foreground mt-1">
          Design a reusable prompt template for your conversations
        </p>
      </div>
      
      <CreateTemplateForm />
    </div>
  )
}