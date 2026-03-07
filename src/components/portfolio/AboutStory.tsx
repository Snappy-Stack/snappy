'use client'
import React, { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'
import { Observer } from 'gsap/Observer'
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

export const AboutStory: React.FC<Props> = ({ serverUrl, initialSlides }) => {
  const slides = initialSlides || []
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  const stageRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])

  const navigate = (next: number) => {
    if (next === current || animating || next < 0 || next >= slides.length) return
    setAnimating(true)

    const outSlide = slideRefs.current[current]
    const inSlide = slideRefs.current[next]

    if (!outSlide || !inSlide) {
      setAnimating(false)
      return
    }

    const dir = next > current ? 1 : -1

    const tl = gsap.timeline({
      onComplete: () => {
        setCurrent(next)
        setAnimating(false)
      },
    })

    // Reset incoming slide
    gsap.set(inSlide, { opacity: 0, y: dir * 24, pointerEvents: 'none', display: 'flex' })

    // Outgoing animation
    tl.to(outSlide, {
      opacity: 0,
      y: -dir * 20,
      duration: 0.35,
      ease: 'power2.in',
      onComplete: () => {
        gsap.set(outSlide, { display: 'none' })
      },
    })

    // Incoming animation
    tl.to(
      inSlide,
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power2.out',
        onStart: () => {
          gsap.set(inSlide, { pointerEvents: 'auto' })
        },
      },
      '-=0.1',
    )
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(Observer)
    }
    if (slides.length > 0) {
      const obs = Observer.create({
        target: window,
        type: 'wheel,touch,pointer',
        wheelSpeed: -1,
        onDown: () => navigate(current - 1),
        onUp: () => navigate(current + 1),
        tolerance: 10,
        preventDefault: true,
      })

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') navigate(current + 1)
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') navigate(current - 1)
      }

      window.addEventListener('keydown', handleKeyDown)
      return () => {
        obs.kill()
        window.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [current, slides, animating])

  if (slides.length === 0) return null

  return (
    <div
      ref={stageRef}
      id="about-stage"
      className="flex-1 min-h-0 relative overflow-hidden bg-background"
    >
      {/* Slides */}
      {slides.map((slide, i) => {
        const bgClass = slide.dark ? 'bg-foreground' : 'bg-background'
        const textMainClass = slide.dark ? 'text-background' : 'text-foreground'
        const textMutedClass = slide.dark ? 'text-background/70' : 'text-foreground/70'

        return (
          <div
            key={slide.id}
            ref={(el) => {
              slideRefs.current[i] = el
            }}
            className={cn(
              'about-slide absolute inset-x-0 top-16 bottom-16 flex items-center justify-center px-16 xl:px-24 transition-colors duration-500 overflow-hidden',
              bgClass,
            )}
            style={{
              opacity: i === current ? 1 : 0,
              pointerEvents: i === current ? 'auto' : 'none',
              display: i === current ? 'flex' : 'none',
            }}
          >
            {/* ── TECHNICAL GRID OVERLAY ── */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `linear-gradient(to right, hsl(var(--primary)/0.1) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--primary)/0.1) 1px, transparent 1px)`,
                  backgroundSize: '40px 40px',
                }}
              />
            </div>

            {/* ── GRID CANVAS (12-Column) ── */}
            <div className="relative w-full h-full max-w-screen-2xl mx-auto grid grid-cols-12 gap-8 items-center px-12 xl:px-20 overflow-hidden">
              {slide.type === 'profile' ? (
                /* PROFILE */
                <>
                  <div className="col-span-12 lg:col-span-6 relative z-10 flex flex-col justify-center">
                    <div
                      className={cn(
                        'relative aspect-[4/5] w-full max-w-sm bg-snappy-muted rounded-bl-[10rem] rounded-tr-[5rem] overflow-hidden border-2 border-primary/20 shadow-2xl transition-all duration-1000',
                        i === current ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0',
                      )}
                    >
                      {slide.profileImage && typeof slide.profileImage === 'object' && (
                        <Image
                          src={getMediaUrl(slide.profileImage)}
                          alt={slide.headline}
                          fill
                          priority
                          className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                        />
                      )}
                    </div>
                  </div>

                  <div className="col-span-12 lg:col-span-6 flex flex-col space-y-10 z-20">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.6em] font-black text-primary/60">
                        <span className="w-12 h-px bg-primary/30" />
                        Industrial Lead
                      </div>
                      <h1
                        className={cn(
                          'font-serif font-bold leading-[0.85] tracking-tighter break-words',
                          textMainClass,
                          i === current
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-20 opacity-0 transition-all duration-1000 delay-100',
                        )}
                        style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)' }}
                      >
                        {slide.headline}
                      </h1>
                      <div className="pt-8 max-w-xl">
                        <p
                          className={cn(
                            'text-lg lg:text-xl font-medium leading-relaxed opacity-80',
                            textMainClass,
                          )}
                        >
                          {slide.body}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <p className="text-[9px] uppercase tracking-[0.4em] font-black text-primary/40">
                        Core Specializations
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {slide.disciplines?.map((d: any, di: number) => (
                          <div
                            key={di}
                            className="px-4 py-2 bg-primary/5 border border-primary/10 rounded-sm"
                          >
                            <span
                              className={cn(
                                'text-[10px] font-black uppercase tracking-widest',
                                textMainClass,
                              )}
                            >
                              {d}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* CHAPTERS */
                <>
                  {slide.layoutStyle === 'focused' ? (
                    <div className="col-span-12 flex flex-col items-center justify-center text-center space-y-12 py-12">
                      <div
                        className={cn(
                          'space-y-6 transition-all duration-1000',
                          i === current ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0',
                        )}
                      >
                        <div className="relative inline-block mx-auto">
                          <span className="font-serif font-black text-primary text-[8rem] lg:text-[12rem] leading-none select-none">
                            {slide.year}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-6 max-w-4xl mx-auto flex flex-col items-center">
                        <h2
                          className={cn(
                            'font-serif font-bold leading-[0.9] tracking-tighter text-5xl lg:text-[7rem]',
                            textMainClass,
                            i === current
                              ? 'translate-y-0 opacity-100'
                              : 'translate-y-20 opacity-0 transition-all duration-1000 delay-200',
                          )}
                        >
                          {slide.headline}
                        </h2>
                        <p
                          className={cn(
                            'text-lg lg:text-xl font-medium leading-relaxed max-w-2xl opacity-70',
                            textMutedClass,
                            i === current
                              ? 'translate-y-0 opacity-100'
                              : 'translate-y-20 opacity-0 transition-all duration-1000 delay-300',
                          )}
                        >
                          {slide.body}
                        </p>
                      </div>
                    </div>
                  ) : slide.layoutStyle === 'cinematic' ? (
                    <div className="col-span-12 flex flex-col justify-end space-y-16 pb-24">
                      <div
                        className={cn(
                          'flex items-end gap-12 border-b border-primary/10 pb-8 transition-all duration-1000',
                          i === current ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0',
                        )}
                      >
                        <span className="font-serif font-black text-primary text-[10rem] lg:text-[16rem] leading-none select-none -mb-8">
                          {slide.year}
                        </span>
                      </div>

                      <div className="grid grid-cols-12 gap-12">
                        <div className="col-span-12 lg:col-span-8">
                          <h2
                            className={cn(
                              'font-serif font-bold leading-[0.85] tracking-tighter text-6xl lg:text-[9rem]',
                              textMainClass,
                              i === current
                                ? 'translate-y-0 opacity-100'
                                : 'translate-y-20 opacity-0 transition-all duration-1000 delay-200',
                            )}
                          >
                            {slide.headline}
                          </h2>
                        </div>
                        <div className="col-span-12 lg:col-span-4 flex items-end">
                          <p
                            className={cn(
                              'text-xl font-medium leading-relaxed opacity-70',
                              textMutedClass,
                              i === current
                                ? 'translate-y-0 opacity-100'
                                : 'translate-y-20 opacity-0 transition-all duration-1000 delay-300',
                            )}
                          >
                            {slide.body}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="col-span-12 lg:col-span-4 h-full flex flex-col justify-center border-r border-primary/10 pr-12">
                        <div
                          className={cn(
                            'space-y-8 transition-all duration-1000',
                            i === current
                              ? 'translate-y-0 opacity-100'
                              : 'translate-y-20 opacity-0',
                          )}
                        >
                          <div className="relative inline-block">
                            <span className="font-serif font-black text-primary text-[10rem] lg:text-[14rem] leading-none select-none">
                              {slide.year}
                            </span>
                          </div>
                          <div className="space-y-2">
                            <div className="w-16 h-1.5 bg-primary/40 rounded-full" />
                            <p className="text-[11px] uppercase tracking-[0.8em] font-black opacity-30">
                              {slide.label || 'Project Phase'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-12 lg:col-span-7 lg:col-start-6 flex flex-col justify-center space-y-12 py-12">
                        <div className="space-y-8">
                          <h2
                            className={cn(
                              'font-serif font-bold leading-[0.9] tracking-tighter text-6xl lg:text-[8rem] max-w-4xl',
                              textMainClass,
                              i === current
                                ? 'translate-x-0 opacity-100'
                                : 'translate-x-20 opacity-0 transition-all duration-1000 delay-200',
                            )}
                          >
                            {slide.headline}
                          </h2>
                          <p
                            className={cn(
                              'text-xl lg:text-2xl font-medium leading-relaxed max-w-2xl opacity-70',
                              textMutedClass,
                              i === current
                                ? 'translate-x-0 opacity-100'
                                : 'translate-x-20 opacity-0 transition-all duration-1000 delay-300',
                            )}
                          >
                            {slide.body}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )
      })}

      <div className="absolute bottom-4 left-6 right-6 h-12 p-0 pointer-events-none z-50 flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-[9px] uppercase tracking-[0.4em] font-black text-primary/40">
            Sector Progress
          </p>
          <div className="flex gap-1 h-1">
            {slides.map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  'transition-all duration-700 h-full',
                  idx === current
                    ? 'w-12 bg-primary'
                    : idx < current
                      ? 'w-4 bg-primary/40'
                      : 'w-4 bg-primary/10',
                )}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] font-black">
          <span className="text-primary/40">Sec. {String(current + 1).padStart(2, '0')}</span>
          <span className="w-8 h-px bg-primary/20" />
          <span className="text-primary">Sec. {String(slides.length).padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  )
}
