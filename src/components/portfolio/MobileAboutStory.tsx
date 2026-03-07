'use client'
import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import Image from 'next/image'
import { cn, getMediaUrl } from '@/lib/utils'

import {
  User,
  MapPin,
  Briefcase,
  Code2,
  Terminal,
  Cpu,
  Layers,
  Globe,
  ChevronRight,
  Sparkles,
  Zap,
  Shield,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  ChevronUp,
  ArrowDown,
} from 'lucide-react'

// Helper to render Lucide icons by name
const LucideIcon = ({ name, className }: { name: string; className?: string }) => {
  const icons: Record<string, React.FC<any>> = {
    User,
    MapPin,
    Briefcase,
    Code2,
    Terminal,
    Cpu,
    Layers,
    Globe,
    ChevronRight,
    Sparkles,
    Zap,
    Shield,
    Search,
    CheckCircle2,
    Clock,
    ArrowRight,
    ChevronUp,
    ArrowDown,
  }
  const IconComponent = icons[name]
  if (!IconComponent) return null
  return <IconComponent className={className} />
}

interface Slide {
  id: string | number
  type: 'profile' | 'chapter'
  year: string | null
  label: string | null
  headline: string
  body: string
  disciplines?: string[]
  profileImage?: any
  dark?: boolean
  layoutStyle?: 'focused' | 'side' | 'cinematic'
  milestoneIcon?: string
}

interface Props {
  serverUrl: string
  initialSlides: any[]
}

export const MobileAboutStory: React.FC<Props> = ({ serverUrl, initialSlides }) => {
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

    gsap.set(inEl, { display: 'flex', opacity: 0, y: dir * 40 })

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(outEl, { display: 'none' })
        setCurrent(next)
        setAnimating(false)
      },
    })

    tl.to(outEl, { opacity: 0, y: -dir * 30, duration: 0.3, ease: 'power2.in' })
    tl.to(inEl, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, '-=0.1')
  }

  // Block native page scroll — must be non-passive to call preventDefault
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const block = (e: TouchEvent) => e.preventDefault()
    el.addEventListener('touchmove', block, { passive: false })
    return () => el.removeEventListener('touchmove', block)
  }, [])

  // Touch swipe detection
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

  if (slides.length === 0) return null

  return (
    <div
      ref={stageRef}
      className="flex-1 relative overflow-hidden pt-16 transition-colors duration-500"
      style={{
        touchAction: 'none',
        backgroundColor: slides[current]?.dark
          ? 'hsl(var(--foreground))'
          : 'hsl(var(--background))',
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Slides */}
      {slides.map((slide, i) => {
        const textMainClass = slide.dark ? 'text-background' : 'text-foreground'
        const textMutedClass = slide.dark ? 'text-background/70' : 'text-foreground/70'
        const borderClass = slide.dark ? 'border-background/20' : 'border-snappy-border'

        return (
          <div
            key={slide.id}
            ref={(el) => {
              slideRefs.current[i] = el
            }}
            className="absolute inset-0 flex flex-col justify-end px-6 pb-28"
            style={{
              opacity: i === current ? 1 : 0,
              display: i === current ? 'flex' : 'none',
            }}
          >
            {/* ── TECHNICAL BACKGROUND ── */}
            <div className="absolute inset-0 pointer-events-none opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)`,
                  backgroundSize: '30px 30px',
                }}
              />
            </div>

            {/* ── ASYMMETRIC CONTENT ── */}
            <div className="relative w-full h-full flex flex-col justify-center px-8">
              {slide.type === 'profile' ? (
                <div className="space-y-10">
                  <div className="space-y-4">
                    <p className="text-[10px] uppercase tracking-[0.4em] font-black text-primary/60 flex items-center gap-3">
                      <span className="w-8 h-0.5 bg-primary/30" />
                      Industrial Lead
                    </p>
                    <h1
                      className={cn(
                        'font-serif font-bold leading-[0.85] tracking-tight text-6xl xs:text-7xl break-words',
                        textMainClass,
                        i === current
                          ? 'translate-y-0 opacity-100'
                          : 'translate-y-12 opacity-0 transition-all duration-700',
                      )}
                    >
                      {slide.headline}
                    </h1>
                  </div>

                  <div className="flex gap-6 items-end">
                    {slide.profileImage && typeof slide.profileImage === 'object' && (
                      <div className="w-24 h-32 flex-shrink-0 bg-snappy-muted rounded-tr-[3rem] overflow-hidden border border-primary/20 grayscale">
                        <Image
                          src={getMediaUrl(slide.profileImage)}
                          alt={slide.headline}
                          fill
                          priority
                          className="object-cover"
                        />
                      </div>
                    )}
                    <p
                      className={cn('text-sm font-medium leading-[1.6] opacity-80', textMutedClass)}
                    >
                      {slide.body}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[9px] uppercase tracking-[0.3em] font-black text-primary/40">
                      Competencies
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {slide.disciplines?.map((d: any, di: number) => (
                        <div
                          key={di}
                          className="px-3 py-1.5 bg-primary/5 border border-primary/10 rounded-lg text-[9px] font-black uppercase tracking-widest"
                        >
                          {d}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8 flex flex-col items-start">
                  <div className="relative">
                    <span
                      className="font-serif font-black text-primary leading-none block"
                      style={{ fontSize: 'clamp(7rem, 35vw, 12rem)' }}
                    >
                      {slide.year}
                    </span>
                    {slide.milestoneIcon && (
                      <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/10">
                        <LucideIcon name={slide.milestoneIcon} className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h2
                      className={cn(
                        'font-serif font-bold leading-[1] tracking-tight text-4xl xs:text-5xl',
                        textMainClass,
                        i === current
                          ? 'translate-x-0 opacity-100'
                          : 'translate-x-12 opacity-0 transition-all duration-700 delay-100',
                      )}
                    >
                      {slide.headline}
                    </h2>
                    <p
                      className={cn(
                        'text-base font-medium leading-relaxed opacity-70',
                        textMutedClass,
                      )}
                    >
                      {slide.body}
                    </p>
                  </div>

                  {slide.dark && (
                    <a
                      href="mailto:contact@domain.com"
                      className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-sm text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 active:scale-95 transition-all"
                    >
                      Process Lead
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        )
      })}

      {/* ── INDUSTRIAL CONTROLS ── */}
      <div className="absolute bottom-6 left-8 right-8 flex items-center justify-between z-20 pointer-events-none">
        <div className="flex items-baseline gap-2">
          <span
            className={cn(
              'font-serif text-3xl font-black',
              slides[current]?.dark ? 'text-background' : 'text-foreground',
            )}
          >
            {String(current + 1).padStart(2, '0')}
          </span>
          <div className="w-8 h-px bg-primary/20 mb-2" />
          <span
            className={cn(
              'text-[10px] font-black opacity-30',
              slides[current]?.dark ? 'text-background' : 'text-foreground',
            )}
          >
            {String(slides.length).padStart(2, '0')}
          </span>
        </div>

        <div className="flex gap-4 pointer-events-auto">
          <button
            onClick={() => navigate(current - 1)}
            disabled={current === 0 || animating}
            className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center text-primary disabled:opacity-10 active:scale-90 transition-all"
          >
            <ChevronUp className="-rotate-90 w-5 h-5" />
          </button>
          <button
            onClick={() => navigate(current + 1)}
            disabled={current === slides.length - 1 || animating}
            className="w-12 h-12 rounded-full border border-primary/20 bg-primary/5 flex items-center justify-center text-primary disabled:opacity-10 active:scale-90 transition-all"
          >
            <ChevronUp className="rotate-90 w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
