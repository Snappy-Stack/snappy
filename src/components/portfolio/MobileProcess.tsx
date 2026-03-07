'use client'
import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowDown } from 'lucide-react'
import { getMediaUrl } from '@/lib/utils'

interface Props {
  serverUrl: string
  initialSlides: any[]
}

export const MobileProcess: React.FC<Props> = ({ serverUrl, initialSlides }) => {
  const slides = initialSlides || []
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  const stageRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
  const touchStartY = useRef(0)
  const touchStartX = useRef(0)

  const navigate = (next: number) => {
    if (next === current || animating || next < 0 || next >= slides.length) return
    setAnimating(true)

    const outEl = slideRefs.current[current]
    const inEl = slideRefs.current[next]
    if (!outEl || !inEl) return

    const dir = next > current ? 1 : -1

    gsap.set(inEl, { display: 'flex', opacity: 0, y: dir * 60, scale: 0.97 })

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(outEl, { display: 'none' })
        setCurrent(next)
        setAnimating(false)
      },
    })

    tl.to(outEl, { opacity: 0, y: -dir * 40, scale: 0.97, duration: 0.3, ease: 'power2.in' })
    tl.to(inEl, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'power3.out' }, '-=0.1')
  }

  // Block native page scroll
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const block = (e: TouchEvent) => e.preventDefault()
    el.addEventListener('touchmove', block, { passive: false })
    return () => el.removeEventListener('touchmove', block)
  }, [])

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
    touchStartX.current = e.touches[0].clientX
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    const dy = touchStartY.current - e.changedTouches[0].clientY
    const dx = Math.abs(touchStartX.current - e.changedTouches[0].clientX)
    if (Math.abs(dy) < 40 || dx > Math.abs(dy) * 0.8) return
    navigate(dy > 0 ? current + 1 : current - 1)
  }

  if (slides.length === 0)
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-4 bg-background">
        <p className="font-serif text-2xl text-snappy-muted italic">Curating the Vault...</p>
        <p className="text-[10px] uppercase tracking-widest text-snappy-muted font-sans cursor-default">
          Process updates coming soon
        </p>
      </div>
    )

  return (
    <div
      ref={stageRef}
      className="flex-1 relative overflow-hidden pt-16 bg-background"
      style={{ touchAction: 'none' }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Blueprint Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Page label */}
      <div className="absolute top-20 left-6 z-20 pointer-events-none">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-6 h-px bg-primary/40" />
          <p className="text-[9px] uppercase tracking-[0.4em] font-black text-primary/60">
            Behind the Work
          </p>
        </div>
        <h1 className="font-serif text-4xl font-bold text-foreground tracking-tighter">Process</h1>
      </div>

      {/* Slides */}
      {slides.map((slide, i) => {
        const imageUrl = slide.featuredImage ? getMediaUrl(slide.featuredImage) : null

        return (
          <div
            key={slide.id}
            ref={(el) => {
              slideRefs.current[i] = el
            }}
            className="absolute inset-0 flex flex-col justify-end"
            style={{
              display: i === current ? 'flex' : 'none',
              opacity: i === current ? 1 : 0,
            }}
          >
            {/* Featured image */}
            {imageUrl && (
              <div className="absolute inset-x-0 top-36 h-[40%] overflow-hidden relative">
                <Image
                  src={imageUrl}
                  alt={slide.title}
                  fill
                  priority={i === 0 || i === 1}
                  sizes="100vw"
                  className="object-contain px-12"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to bottom, transparent 60%, hsl(var(--background)) 100%)',
                  }}
                />
              </div>
            )}

            {/* Content — bottom */}
            <div className="relative z-10 px-6 pb-32 space-y-6">
              {/* Project + date metadata */}
              <div className="flex items-center gap-4">
                <div className="px-3 py-1 bg-primary/5 border border-primary/10 rounded-sm">
                  <span className="text-[9px] uppercase tracking-[0.25em] font-black text-primary">
                    {slide.project}
                  </span>
                </div>
                <span className="text-[9px] uppercase tracking-widest font-black text-primary/30">
                  {slide.date}
                </span>
              </div>

              {/* Title */}
              <h2
                className="font-serif font-bold text-foreground leading-[1.05] tracking-tight"
                style={{ fontSize: 'clamp(2.2rem, 10vw, 3.5rem)' }}
              >
                {slide.title}
              </h2>

              {/* Excerpt */}
              <p className="text-base text-foreground/70 leading-relaxed font-serif italic border-l-2 border-primary/20 pl-4">
                {slide.excerpt}
              </p>

              <Link
                href={`/process/${slide.slug}`}
                className="inline-flex items-center justify-between w-full border border-snappy-border bg-snappy-muted/20 px-6 py-5 rounded-bl-3xl rounded-tr-3xl text-[10px] font-black uppercase tracking-[0.2em] text-primary active:bg-primary active:text-primary-foreground transition-all duration-300"
              >
                Full Documentation
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )
      })}

      {/* Progress dots — right edge */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20 pointer-events-none">
        {slides.map((_, i) => (
          <div key={i} className="flex items-center justify-center w-6 h-6">
            <span
              className="rounded-full transition-all duration-500 shadow-sm"
              style={{
                width: i === current ? 4 : 2,
                height: i === current ? 24 : 8,
                backgroundColor:
                  i === current ? 'hsl(var(--primary))' : 'hsl(var(--primary) / 0.1)',
              }}
            />
          </div>
        ))}
      </div>

      {/* Counter + nav */}
      <div className="absolute bottom-8 left-6 right-6 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-baseline gap-2 pointer-events-auto bg-background/80 backdrop-blur-md px-4 py-2 border border-snappy-border rounded-full">
          <span className="font-serif text-3xl font-black text-foreground tabular-nums leading-none">
            {String(current + 1).padStart(2, '0')}
          </span>
          <span className="text-[10px] font-black text-primary/20 uppercase tracking-widest">
            Phase {String(slides.length).padStart(2, '0')}
          </span>
        </div>

        <div className="flex gap-4 pointer-events-auto">
          <button
            onClick={() => navigate(current - 1)}
            disabled={current === 0 || animating}
            className="w-14 h-14 rounded-full border border-snappy-border bg-background/50 backdrop-blur-md flex items-center justify-center text-foreground disabled:opacity-10 active:bg-primary active:text-primary-foreground transition-all shadow-lg"
          >
            <ArrowRight className="-rotate-90 w-5 h-5" />
          </button>
          <button
            onClick={() => navigate(current + 1)}
            disabled={current === slides.length - 1 || animating}
            className="w-14 h-14 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-md flex items-center justify-center text-primary disabled:opacity-10 active:bg-primary active:text-primary-foreground transition-all shadow-lg"
          >
            <ArrowRight className="rotate-90 w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
