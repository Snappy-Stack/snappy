import React from 'react'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { RatingForm } from './RatingForm'
import { Star } from 'lucide-react'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'reviews',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  const reviewRequest = docs?.[0]

  return {
    title: reviewRequest ? `Rate your experience: ${reviewRequest.clientName}` : 'Client Feedback',
    description: reviewRequest
      ? `Share your feedback on the ${reviewRequest.projectName} project collaboration.`
      : 'Provide feedback on our recent project collaboration.',
  }
}

// Forces dynamic rendering for real-time review status
export const dynamic = 'force-dynamic'

export default async function RatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'reviews',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  // If the slug doesn't exist, throw a 404
  if (!docs || docs.length === 0) {
    notFound()
  }

  const reviewRequest = docs[0]

  // If the review is already published, show a thank you message instead of the form
  if (reviewRequest.status === 'published') {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-background relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg aspect-square bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-md w-full relative z-10 flex flex-col items-center text-center gap-6 p-8 border border-snappy-border rounded-xl bg-snappy-card shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 mb-2">
            <Star className="w-8 h-8 text-primary fill-primary" />
          </div>
          <h1 className="text-3xl font-bold font-heading text-snappy-fg tracking-tight">
            Thank You!
          </h1>
          <p className="text-snappy-muted font-medium text-sm leading-relaxed">
            Your feedback for <strong>{reviewRequest.projectName}</strong> has already been received
            and published. We deeply appreciate your partnership!
          </p>
        </div>
      </main>
    )
  }

  // It's a draft (pending submission), render the active form
  return (
    <main className="min-h-screen py-20 px-6 flex items-center justify-center bg-background relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl aspect-square bg-primary/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-xl w-full relative z-10">
        <header className="mb-12 text-center">
          <p className="text-sm font-bold text-primary tracking-widest uppercase mb-4">
            Client Feedback
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-snappy-fg tracking-tight leading-tight">
            Hi {reviewRequest.clientName},
          </h1>
          <p className="mt-4 text-snappy-muted text-base sm:text-lg max-w-md mx-auto leading-relaxed font-medium">
            How was your experience working together on <strong>{reviewRequest.projectName}</strong>
            ?
          </p>
        </header>

        <RatingForm slug={slug} clientName={reviewRequest.clientName} />
      </div>
    </main>
  )
}
