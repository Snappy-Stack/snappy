import Link from 'next/link'
import { AdaptiveHub } from '@/components/layout/AdaptiveHub'
import { Button } from '@/components/ui'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: "The page you are looking for doesn't exist or has been moved.",
}

export default function NotFound() {
  return (
    <AdaptiveHub type="portfolio">
      <main className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-32 text-center">
        <div className="max-w-md w-full p-8">
          <div className="text-sm font-semibold tracking-wider text-primary uppercase mb-2">
            404 Error
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-6 transition-all">
            Page not found
          </h1>
          <p className="text-foreground/80 text-base mb-10 leading-relaxed max-w-sm mx-auto">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved
            or deleted.
          </p>
          <Link href="/">
            <Button variant="primary" size="lg" className="rounded-full">
              Return Home
            </Button>
          </Link>
        </div>
      </main>
    </AdaptiveHub>
  )
}
