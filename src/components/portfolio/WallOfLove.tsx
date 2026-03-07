'use client'

import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'
import Image from 'next/image'
import { Star, User, Quote } from 'lucide-react'
import { cn, getMediaUrl } from '@/lib/utils'

interface Props {
  reviews: any[]
}

export const WallOfLove: React.FC<Props> = ({ reviews }) => {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      gsap.from('.review-card', {
        y: 60,
        opacity: 0,
        rotate: -2,
        duration: 1,
        stagger: 0.15,
        ease: 'power4.out',
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  if (!reviews || reviews.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-20">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 rounded-[3rem] bg-snappy-muted flex items-center justify-center mx-auto border border-primary/10 shadow-inner">
            <Quote className="w-10 h-10 text-primary opacity-20" />
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.8em] text-primary/40">
              Buffer Empty
            </p>
            <p className="text-foreground/60 font-serif italic text-lg">
              No transmission received yet.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section
      ref={sectionRef}
      className="w-full min-h-full py-16 px-8 max-w-screen-2xl mx-auto overflow-y-auto scrollbar-hide flex flex-col gap-16"
    >
      {/* ── HEADER BLOCK ── */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-snappy-border pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-px bg-primary/40" />
            <p className="text-[10px] uppercase tracking-[0.6em] font-black text-primary/60">
              Testimonial Engine
            </p>
          </div>
          <h1 className="text-6xl md:text-8xl font-serif font-bold tracking-tighter leading-none">
            Wall of Love
          </h1>
        </div>

        <div className="hidden lg:flex items-center gap-8">
          <div className="px-6 py-3 border border-snappy-border rounded-sm bg-snappy-muted/30 flex flex-col gap-1">
            <span className="text-[9px] uppercase tracking-widest font-black text-primary/40">
              Satisfied Clients
            </span>
            <span className="text-2xl font-serif italic text-foreground tracking-widest leading-none">
              {String(reviews.length).padStart(3, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* ── GRID SYSTEM ── */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-10 space-y-10 pb-32">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="review-card break-inside-avoid group relative p-10 bg-background border border-snappy-border transition-all duration-700 hover:border-primary/40 flex flex-col gap-8 shadow-snappy-card hover:shadow-snappy-card-hover rounded-bl-[4rem] rounded-tr-[4rem] overflow-hidden"
          >
            {/* Blueprint Grid Lines */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)`,
                  backgroundSize: '20px 20px',
                }}
              />
            </div>

            {/* Stars & Icon */}
            <div className="flex justify-between items-start z-10">
              <div className="flex items-center gap-1.5 ">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'w-3.5 h-3.5 transition-all duration-500',
                      i < (review.rating || 0)
                        ? 'text-primary fill-primary scale-110'
                        : 'text-primary/10',
                    )}
                  />
                ))}
              </div>
              <Quote className="w-8 h-8 text-primary/10 group-hover:text-primary/20 transition-colors" />
            </div>

            {/* Comment */}
            <div className="relative z-10 flex flex-col gap-4">
              <p className="text-xl lg:text-2xl font-serif font-medium leading-tight text-foreground/90 italic tracking-tight">
                "{review.comment}"
              </p>
              <div className="w-12 h-0.5 bg-primary/20 origin-left group-hover:scale-x-150 transition-transform duration-700" />
            </div>

            {/* Reviewer Info */}
            <div className="flex items-center gap-5 pt-8 border-t border-snappy-border z-10">
              <div className="relative w-14 h-14 rounded-[2rem] overflow-hidden bg-snappy-muted border border-snappy-border shrink-0 shadow-lg group-hover:border-primary/40 transition-colors duration-700 grayscale group-hover:grayscale-0">
                {review.avatar ? (
                  <Image
                    src={getMediaUrl(review.avatar)}
                    alt={review.clientName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/5">
                    <User className="w-6 h-6 text-primary/20" />
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="font-serif font-bold text-xl text-foreground leading-none tracking-tight">
                  {review.clientName}
                </h4>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary/40" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">
                    {review.projectName || 'Product Client'}
                  </p>
                </div>
              </div>
            </div>

            {/* Technical Detail Flag */}
            <div className="absolute top-0 right-0 px-6 py-2 bg-primary/5 border-l border-b border-primary/10 rounded-bl-2xl">
              <span className="text-[8px] font-black uppercase tracking-[0.4em] text-primary/30">
                Verified Record
              </span>
            </div>
          </div>
        ))}

        {/* Footer Filler */}
        <div className="h-40 flex items-center justify-center opacity-10 border-t border-dashed border-primary/20">
          <p className="text-[10px] font-black uppercase tracking-[1em] text-primary">
            Transmission Terminal
          </p>
        </div>
      </div>
    </section>
  )
}
