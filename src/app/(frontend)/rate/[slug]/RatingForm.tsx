'use client'

import React, { useState } from 'react'
import { Star, Send, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { submitReview } from '@/app/actions/reviews'
import { uploadMedia } from '@/app/actions/media'
import { toast } from 'sonner'
import { cn, getMediaUrl } from '@/lib/utils'
import Image from 'next/image'
import { Upload, X, Loader2 } from 'lucide-react'

export const RatingForm = ({ slug, clientName }: { slug: string; clientName: string }) => {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [comment, setComment] = useState('')
  const [avatarId, setAvatarId] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [pin, setPin] = useState('')
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingAvatar(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('alt', `Avatar for ${clientName}`)

    try {
      const result = await uploadMedia(formData)
      if (result.success && result.doc) {
        setAvatarId(String(result.doc.id))
        setAvatarUrl(getMediaUrl(result.doc))
        toast.success('Photo uploaded!')
      } else {
        toast.error('Failed to upload photo')
      }
    } catch (error) {
      console.error(error)
      toast.error('Error uploading photo')
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      toast.error('Please select a star rating.')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await submitReview(slug, rating, comment, avatarId || undefined, pin)
      if (result.success) {
        setIsSubmitted(true)
        toast.success('Review submitted successfully!')
      } else {
        toast.error(result.error || 'Failed to submit review.')
      }
    } catch (error) {
      console.error(error)
      toast.error('An unexpected error occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center text-center p-8 rounded-[2rem] bg-snappy-card border border-snappy-border shadow-2xl animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center border border-success/20 mb-6 overflow-hidden relative">
          {avatarUrl ? (
            <Image src={avatarUrl} alt={clientName} fill className="object-cover" />
          ) : (
            <CheckCircle2 className="w-10 h-10 text-success" />
          )}
        </div>
        <h2 className="text-2xl font-bold text-snappy-fg mb-3 font-heading">Feedback Sent!</h2>
        <p className="text-snappy-muted font-medium max-w-xs mx-auto text-sm leading-relaxed">
          Thanks again, {clientName}! Your feedback has been sent to the team for review.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-8 md:p-10 rounded-[2.5rem] bg-snappy-card border border-snappy-border shadow-2xl space-y-8"
    >
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Avatar Upload */}
        <div className="flex flex-col items-center gap-4 shrink-0">
          <label className="text-xs font-bold uppercase tracking-[0.2em] text-snappy-fg/40 block text-center">
            Your Photo
          </label>
          <div className="relative group">
            <div className="w-24 h-24 rounded-[2rem] bg-background border-2 border-dashed border-snappy-border flex items-center justify-center overflow-hidden transition-all hover:border-primary/50">
              {isUploadingAvatar ? (
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              ) : avatarUrl ? (
                <Image src={avatarUrl} alt="Preview" fill className="object-cover" />
              ) : (
                <Upload className="w-6 h-6 text-snappy-fg/20 group-hover:text-primary/50" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
                disabled={isUploadingAvatar || isSubmitting}
              />
            </div>
            {avatarUrl && (
              <button
                type="button"
                onClick={() => {
                  setAvatarId(null)
                  setAvatarUrl(null)
                }}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <p className="text-[10px] text-snappy-fg/30 font-bold uppercase text-center max-w-[100px]">
            {avatarUrl ? 'Click to change' : 'Tap to upload'}
          </p>
        </div>

        <div className="flex-1 space-y-8">
          <div className="space-y-6">
            <label className="text-xs font-bold uppercase tracking-[0.2em] text-snappy-fg/40 block">
              Select your rating
            </label>
            <div className="flex items-center gap-3 sm:gap-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(star)}
                  className="relative group transition-all duration-300"
                >
                  <Star
                    className={cn(
                      'w-8 h-8 sm:w-10 sm:h-10 transition-all duration-300',
                      (hover || rating) >= star
                        ? 'text-primary fill-primary scale-110 drop-shadow-lg'
                        : 'text-snappy-fg/10 group-hover:text-snappy-fg/20',
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label
              htmlFor="comment"
              className="text-xs font-bold uppercase tracking-[0.2em] text-snappy-fg/40 block ml-2"
            >
              Your Feedback
            </label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you like? What could be improved?"
              className="min-h-[7.5rem] p-6 rounded-[1.5rem] bg-background border-2 border-snappy-border focus:border-primary/50 text-base leading-relaxed resize-none transition-all placeholder:text-snappy-fg/20"
            />
          </div>

          <div className="space-y-4">
            <label
              htmlFor="pin"
              className="text-xs font-bold uppercase tracking-[0.2em] text-snappy-fg/40 block ml-2"
            >
              Verification PIN
            </label>
            <input
              id="pin"
              type="text"
              required
              value={pin}
              autoComplete="off"
              onChange={(e) => setPin(e.target.value)}
              placeholder="xxxx"
              className="w-full h-14 p-6 rounded-[1.5rem] bg-background border-2 border-snappy-border focus:border-primary/50 text-xl font-mono tracking-[0.5em] text-center transition-all placeholder:text-snappy-fg/20 uppercase"
            />
            <p className="text-[10px] text-center text-snappy-fg/30 font-bold uppercase tracking-widest">
              Enter the unique 4-digit code provided by our team
            </p>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || rating === 0}
        className="w-full h-16 rounded-[1.5rem] text-lg font-black tracking-wide bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 transition-all disabled:opacity-30 disabled:scale-100 active:scale-95 group"
      >
        {isSubmitting ? (
          <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <div className="flex items-center gap-3">
            Submit Feedback
            <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </div>
        )}
      </Button>

      <p className="text-center text-[10px] text-snappy-fg/30 font-bold uppercase tracking-widest">
        Secure Feedback Portal &bull; All data is encrypted
      </p>
    </form>
  )
}
