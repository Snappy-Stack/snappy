'use client'
import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import Link from 'next/link'
import Image from 'next/image'
import { getMediaUrl } from '@/lib/utils'

interface Props {
  serverUrl: string
  initialProjects: any[]
}

export const MobileProjects: React.FC<Props> = ({ serverUrl, initialProjects }) => {
  const projects = initialProjects || []
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  const stageRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
  const touchStartY = useRef(0)

  const navigate = (next: number) => {
    if (next === current || animating || next < 0 || next >= projects.length) return
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

  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const block = (e: TouchEvent) => e.preventDefault()
    el.addEventListener('touchmove', block, { passive: false })
    return () => el.removeEventListener('touchmove', block)
  }, [])

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    const dy = touchStartY.current - e.changedTouches[0].clientY
    if (Math.abs(dy) < 40) return
    navigate(dy > 0 ? current + 1 : current - 1)
  }

  if (projects.length === 0)
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-4 bg-background">
        <p className="font-serif text-2xl text-snappy-muted italic italic">
          The Gallery is Quiet...
        </p>
        <p className="text-[10px] uppercase tracking-widest text-snappy-muted font-sans cursor-default">
          New work arriving soon
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
            backgroundSize: '30px 30px',
          }}
        />
      </div>

      {/* Page Header */}
      <div className="absolute top-20 left-6 z-20 pointer-events-none">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-6 h-px bg-primary/40" />
          <p className="text-[9px] uppercase tracking-[0.4em] font-black text-primary/60">
            Project Matrix
          </p>
        </div>
        <h1 className="font-serif text-4xl font-bold text-foreground tracking-tighter">Selected</h1>
      </div>

      {/* Projects */}
      {projects.map((project, i) => {
        const imageUrl = project.featuredImage ? getMediaUrl(project.featuredImage) : null

        return (
          <div
            key={project.id}
            ref={(el) => {
              slideRefs.current[i] = el
            }}
            className="absolute inset-0 flex flex-col justify-end"
            style={{
              display: i === current ? 'flex' : 'none',
              opacity: i === current ? 1 : 0,
            }}
          >
            {/* Visual */}
            {imageUrl && (
              <div className="absolute inset-x-6 top-36 aspect-[4/5] rounded-tr-[3rem] overflow-hidden border border-snappy-border shadow-2xl">
                <Image
                  src={imageUrl}
                  alt={project.title}
                  fill
                  priority={i === 0 || i === 1}
                  sizes="100vw"
                  className="object-cover grayscale active:grayscale-0 transition-all duration-700"
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

            {/* Content Area */}
            <div className="relative z-10 px-6 pb-32 space-y-5">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black italic text-primary/30">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="w-1 h-1 rounded-full bg-primary/20" />
                <p className="text-[9px] uppercase tracking-[0.2em] font-black text-primary/60">
                  {project.category}
                </p>
              </div>

              <h2
                className="font-serif font-bold text-foreground leading-[1.05] tracking-tight"
                style={{ fontSize: 'clamp(2.5rem, 12vw, 4rem)' }}
              >
                {project.title}
              </h2>

              <Link
                href={`/work/${project.slug}`}
                className="inline-flex items-center justify-between w-full border border-snappy-border bg-snappy-muted/20 px-6 py-5 rounded-bl-2xl rounded-tr-2xl text-[10px] font-black uppercase tracking-[0.2em] text-primary active:bg-primary active:text-primary-foreground transition-all duration-300"
              >
                Inspect Case Study
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        )
      })}

      {/* Counter + Nav */}
      <div className="absolute bottom-8 left-6 right-6 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-baseline gap-2 pointer-events-auto bg-background/80 backdrop-blur-md px-4 py-2 border border-snappy-border rounded-full">
          <span className="font-serif text-3xl font-black text-foreground tabular-nums">
            {String(current + 1).padStart(2, '0')}
          </span>
          <span className="text-[10px] font-black text-primary/20 uppercase tracking-widest">
            Volume {String(projects.length).padStart(2, '0')}
          </span>
        </div>

        <div className="flex gap-4 pointer-events-auto">
          <button
            onClick={() => navigate(current - 1)}
            disabled={current === 0 || animating}
            className="w-14 h-14 rounded-full border border-snappy-border bg-background/50 backdrop-blur-md flex items-center justify-center text-foreground disabled:opacity-10 active:bg-primary active:text-primary-foreground transition-all shadow-lg"
          >
            <span className="rotate-180">↓</span>
          </button>
          <button
            onClick={() => navigate(current + 1)}
            disabled={current === projects.length - 1 || animating}
            className="w-14 h-14 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-md flex items-center justify-center text-primary disabled:opacity-10 active:bg-primary active:text-primary-foreground transition-all shadow-lg"
          >
            ↓
          </button>
        </div>
      </div>
    </div>
  )
}
