'use client'

import React, { useState, useTransition } from 'react'
import { RatingStars } from '../common/RatingStars'
import { submitReview } from '@/app/actions/reviews'
import { CheckCircle2, Loader2 } from 'lucide-react'

export const RatingForm = ({ slug, clientName }: { slug: string; clientName: string }) => {
  const [rating, setRating] = useState<number>(0)
  const [comment, setComment] = useState('')
  const [isPending, startTransition] = useTransition()
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      setError('Please select a star rating first.')
      return
    }

    setError(null)

    startTransition(async () => {
      const result = await submitReview(slug, rating, comment)
      if (result.success) {
        setSubmitted(true)
      } else {
        setError(result.error || 'Something went wrong.')
      }
    })
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-snappy-card border border-snappy-border rounded-2xl animate-in fade-in zoom-in duration-500">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-2xl font-bold text-snappy-fg mb-2 font-heading">Feedback Received!</h3>
        <p className="text-sm font-medium text-snappy-muted">
          Thank you so much, {clientName}. Your review means the world to us.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-8 bg-snappy-card/50 backdrop-blur-xl border border-snappy-border p-6 md:p-10 rounded-2xl md:rounded-[32px] shadow-2xl relative"
    >
      <div className="flex flex-col items-center gap-4">
        <label className="text-sm font-bold text-snappy-muted uppercase tracking-widest text-center">
          Rate the Partnership
        </label>
        <RatingStars value={rating} onChange={setRating} />
      </div>

      <div className="flex flex-col gap-3 mt-4">
        <label
          htmlFor="comment"
          className="text-sm font-bold text-snappy-muted uppercase tracking-widest px-2"
        >
          Any additional comments? (Optional)
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Tell us what you loved..."
          rows={4}
          className="w-full bg-background border border-snappy-border rounded-xl p-4 text-snappy-fg placeholder:text-snappy-fg/30 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none text-sm font-medium"
        />
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm font-medium text-center">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending || rating === 0}
        className="mt-4 w-full h-14 bg-primary text-snappy-bg rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 relative overflow-hidden group"
      >
        {isPending ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <span className="relative z-10 flex items-center gap-2 group-disabled:opacity-50">
            Submit Feedback
          </span>
        )}
      </button>
    </form>
  )
}
