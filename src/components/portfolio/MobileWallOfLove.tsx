'use client'

import React, { useRef, useState } from 'react'
import { Star, User, Quote, ChevronUp } from 'lucide-react'
import Image from 'next/image'
import { cn, getMediaUrl } from '@/lib/utils'

interface Props {
  reviews: any[]
}

export const MobileWallOfLove: React.FC<Props> = ({ reviews }) => {
  const [current, setCurrent] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  if (!reviews || reviews.length === 0) return null

  const next = () => setCurrent((prev) => (prev + 1) % reviews.length)
  const prev = () => setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length)

  const activeReview = reviews[current]

  return (
    <div className="flex-1 relative overflow-hidden bg-background flex flex-col p-8 pt-20 pb-32">
      {/* ── BACKGROUND ACCENTS ── */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
          }}
        />
      </div>

      {/* ── HEADER ── */}
      <div className="relative z-10 space-y-2 mb-12">
        <div className="flex items-center gap-2">
          <span className="w-6 h-0.5 bg-primary/40" />
          <p className="text-[9px] uppercase tracking-[0.4em] font-black text-primary/60">
            Testimonial Engine
          </p>
        </div>
        <h1 className="text-5xl font-serif font-bold tracking-tight text-foreground">Love</h1>
      </div>

      {/* ── ACTIVE CARD ── */}
      <div className="flex-1 flex flex-col justify-center relative z-10">
        <div
          key={activeReview.id}
          className="relative p-8 bg-background border border-snappy-border rounded-bl-[3rem] rounded-tr-[3rem] shadow-2xl flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700"
        >
          <Quote className="w-10 h-10 text-primary/10 absolute top-6 right-6" />

          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'w-3 h-3',
                  i < (activeReview.rating || 0) ? 'text-primary fill-primary' : 'text-primary/10',
                )}
              />
            ))}
          </div>

          <p className="text-xl font-serif italic font-medium leading-[1.4] text-foreground/90">
            "{activeReview.comment}"
          </p>

          <div className="flex items-center gap-4 pt-6 border-t border-snappy-border/50">
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-snappy-muted border border-snappy-border grayscale">
              {activeReview.avatar ? (
                <Image
                  src={getMediaUrl(activeReview.avatar)}
                  alt={activeReview.clientName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-5 h-5 text-primary/20" />
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <h4 className="font-serif font-bold text-lg text-foreground leading-none">
                {activeReview.clientName}
              </h4>
              <p className="text-[9px] font-black uppercase tracking-widest text-primary/60 mt-1">
                {activeReview.projectName || 'Product Client'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── INDUSTRIAL CONTROLS ── */}
      <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between z-20">
        <div className="flex items-baseline gap-2">
          <span className="font-serif text-3xl font-black text-foreground">
            {String(current + 1).padStart(2, '0')}
          </span>
          <div className="w-8 h-px bg-primary/20 mb-2" />
          <span className="text-[10px] font-black text-foreground/30">
            {String(reviews.length).padStart(2, '0')}
          </span>
        </div>

        <div className="flex gap-4">
          <button
            onClick={prev}
            className="w-12 h-12 rounded-full border border-snappy-border flex items-center justify-center text-primary active:scale-95 active:bg-primary/5 transition-all"
          >
            <ChevronUp className="-rotate-90 w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="w-12 h-12 rounded-full border border-primary/20 bg-primary/5 flex items-center justify-center text-primary active:scale-95 active:bg-primary/10 transition-all"
          >
            <ChevronUp className="rotate-90 w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
