import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const marketingFeatures = [
  {
    icon: 'ImageIcon',
    title: 'Image Generation',
    description: 'Create stunning images with detailed prompts using multiple AI models',
    href: '/studio'
  },
  {
    icon: 'EditIcon',
    title: 'Image Editing',
    description: 'Edit, inpaint, and outpaint existing images with precise control',
    href: '/studio'
  },
  {
    icon: 'VideoIcon',
    title: 'Video Generation',
    description: 'Generate high-quality videos with text prompts or image sequences',
    href: '/studio'
  },
  {
    icon: 'LayoutIcon',
    title: 'Media Gallery',
    description: 'Organize, search, and manage all your AI-generated content in one place',
    href: '/studio'
  }
]

export function CreativeFeatures() {
  return (
    <section className="container py-12 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Creative Studio</h2>
        <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Generate, edit, and transform media with state-of-the-art AI tools
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {marketingFeatures.map((feature) => {
          const Icon = Icons[feature.icon as keyof typeof Icons] || Icons.ImageIcon
          
          return (
            <Card key={feature.title} className="flex flex-col h-full">
              <CardHeader>
                <div className="p-2 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto pt-4">
                <Link href={feature.href} className="w-full">
                  <Button variant="outline" className="w-full">
                    Try it now
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </section>
  )
}