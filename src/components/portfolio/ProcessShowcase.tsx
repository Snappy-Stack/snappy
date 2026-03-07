'use client'
import React, { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'
import { Observer } from 'gsap/Observer'
import Image from 'next/image'
import Link from 'next/link'
import { getMediaUrl } from '@/lib/utils'

// GSAP registration handled in effect

interface Slide {
  id: string | number
  title: string
  project: string
  slug: string
  date: string
  excerpt: string
  featuredImage: any
  gallery: { image: any; caption: string }[]
}

interface Props {
  serverUrl: string
  initialSlides: any[]
}

export const ProcessShowcase: React.FC<Props> = ({ serverUrl, initialSlides }) => {
  const slides = initialSlides || []
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  const slideRefs = useRef<(HTMLDivElement | null)[]>([])

  const navigate = (index: number, direction: number) => {
    if (animating || index === current || index < 0 || index >= slides.length) return
    setAnimating(true)

    const outSlide = slideRefs.current[current]
    const inSlide = slideRefs.current[index]

    if (!outSlide || !inSlide) return

    const tl = gsap.timeline({
      onComplete: () => {
        setAnimating(false)
        setCurrent(index)
      },
    })

    // Outgoing slide
    tl.to(outSlide, {
      opacity: 0,
      y: direction * -50,
      scale: 0.95,
      duration: 0.6,
      ease: 'power3.inOut',
      onStart: () => {
        gsap.set(outSlide, { pointerEvents: 'none' })
      },
    })

    // Incoming slide
    tl.fromTo(
      inSlide,
      {
        opacity: 0,
        y: direction * 50,
        scale: 1.05,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power4.out',
        onStart: () => {
          gsap.set(inSlide, { pointerEvents: 'auto', display: 'flex' })
        },
      },
      '-=0.4',
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
        onDown: () => navigate(current - 1, -1),
        onUp: () => navigate(current + 1, 1),
        tolerance: 10,
        preventDefault: true,
      })

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') navigate(current - 1, -1)
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') navigate(current + 1, 1)
      }

      window.addEventListener('keydown', handleKeyDown)
      return () => {
        obs.kill()
        window.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [current, slides, animating])

  if (slides.length === 0)
    return (
      <div className="flex-1 relative flex items-center justify-center bg-background pointer-events-none">
        <div className="text-center space-y-4">
          <p className="font-serif text-3xl text-snappy-muted italic cursor-default">
            Curating the Vault...
          </p>
          <p className="text-xs uppercase tracking-widest text-snappy-muted cursor-default">
            Check back shortly for process updates
          </p>
        </div>
      </div>
    )

  return (
    <main
      id="process-stage"
      className="flex-1 relative overflow-hidden bg-background touch-none pt-[80px]"
    >
      <div id="slides-container" className="absolute inset-x-0 top-[80px] bottom-16">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            ref={(el) => {
              slideRefs.current[i] = el
            }}
            className="process-slide absolute inset-0 flex items-center justify-center px-12 md:px-20 lg:px-32 opacity-0 pointer-events-none will-change-[transform,opacity]"
            style={{
              opacity: i === current ? 1 : 0,
              pointerEvents: i === current ? 'auto' : 'none',
              display: i === current ? 'flex' : 'none',
            }}
          >
            <div className="w-full max-w-screen-xl grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
              {/* Left: Main Visual + Gallery Peek */}
              <div className="lg:col-span-7 relative group">
                <div className="aspect-[16/10] bg-snappy-muted rounded-sm overflow-hidden shadow-sm relative border border-snappy-border">
                  {slide.featuredImage && (
                    <Image
                      src={getMediaUrl(slide.featuredImage)}
                      alt={slide.title}
                      fill
                      priority={i === 0 || i === 1}
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover"
                    />
                  )}
                </div>

                {/* Floating Gallery Peek */}
                {slide.gallery && slide.gallery.length > 0 && (
                  <div className="absolute -bottom-10 -right-6 flex gap-3 pointer-events-none">
                    {slide.gallery.slice(0, 2).map((item: any, gi: number) => (
                      <div
                        key={gi}
                        className={`w-24 h-24 md:w-32 md:h-32 bg-snappy-muted rounded-sm overflow-hidden shadow-lg border-2 border-background transform relative ${gi === 0 ? 'rotate-[-6deg]' : 'rotate-[4deg] translate-y-4'}`}
                      >
                        <Image
                          src={getMediaUrl(item.image)}
                          alt="Gallery detail"
                          fill
                          sizes="(max-width: 768px) 96px, 128px"
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Info */}
              <div className="lg:col-span-5 space-y-8">
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary">
                    Project / {slide.project}
                  </p>
                  <h2 className="font-serif text-5xl md:text-6xl xl:text-7xl font-bold text-foreground leading-[1.1] tracking-tight">
                    {slide.title}
                  </h2>
                </div>

                <p className="text-base text-foreground/70 leading-relaxed max-w-md">
                  {slide.excerpt}
                </p>

                <div className="flex items-center gap-6 pt-2">
                  <div className="space-y-1">
                    <p className="text-[8px] uppercase tracking-widest text-snappy-muted font-bold">
                      Timeline
                    </p>
                    <p className="text-xs font-bold text-foreground">{slide.date}</p>
                  </div>
                  <div className="h-8 w-px bg-snappy-border"></div>
                  <Link
                    href={`/process/${slide.slug}`}
                    className="group flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold text-foreground"
                  >
                    Full Documentation{' '}
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* HUD */}
      <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end pointer-events-none z-30">
        <div className="flex items-baseline gap-2 pointer-events-auto cursor-default">
          <span className="font-serif text-4xl font-bold text-foreground">
            {(current + 1).toString().padStart(2, '0')}
          </span>
          <span className="text-snappy-muted font-bold">/</span>
          <span className="text-sm font-bold text-snappy-muted">
            {slides.length.toString().padStart(2, '0')}
          </span>
        </div>

        <div className="flex flex-col items-end gap-6 pointer-events-auto">
          <div className="flex gap-4">
            <button
              onClick={() => navigate(current - 1, -1)}
              disabled={current === 0}
              className="w-12 h-12 rounded-full border border-snappy-border flex items-center justify-center text-foreground hover:bg-foreground hover:text-background transition-all disabled:opacity-30"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 12H5M12 19l-7-7 7-7"></path>
              </svg>
            </button>
            <button
              onClick={() => navigate(current + 1, 1)}
              disabled={current === slides.length - 1}
              className="w-12 h-12 rounded-full border border-snappy-border flex items-center justify-center text-foreground hover:bg-foreground hover:text-background transition-all disabled:opacity-30"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
          <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-snappy-muted cursor-default">
            Scroll or use arrows to navigate
          </p>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 h-40 w-1 flex flex-col gap-2 px-4 pointer-events-none z-30">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`w-1 flex-1 bg-snappy-border transition-all duration-300 rounded-full ${i === current ? 'bg-primary h-6' : 'h-1'}`}
            style={i === current ? { height: '1.5rem' } : {}}
          />
        ))}
      </div>
    </main>
  )
}
