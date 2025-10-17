import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CreativeFeatures } from '@/app/components/creative-features'

export const metadata: Metadata = {
  title: 'Welcome to Zulu Chat',
  description: 'Your AI assistant for chat, creative content generation, and more'
}

export default function HomePage() {
  return (
    <main className="flex-1">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Create Amazing Content with AI
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Generate stunning images, create engaging videos, and have insightful conversations
              with our advanced AI platform.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/studio">
                <Button size="lg">
                  Try Creative Studio
                </Button>
              </Link>
              <Link href="/c/new">
                <Button variant="outline" size="lg">
                  Start Chatting
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <CreativeFeatures />
      
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              Bring Your Ideas to Life
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              From concept to creation, transform your ideas into visual stories with our AI-powered tools.
            </p>
            <Link href="/studio">
              <Button variant="default" size="lg">
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}