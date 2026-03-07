'use client'

import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'
import Image from 'next/image'
import Link from 'next/link'
import { getMediaUrl } from '@/lib/utils'
import { ArrowUpRight } from 'lucide-react'

interface Props {
  initialProjects: any[]
}

export const ProjectsShowcase: React.FC<Props> = ({ initialProjects }) => {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      // Setup base scroll trigger animation for the projects grid
      gsap.from('.project-row', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  if (!initialProjects || initialProjects.length === 0) {
    return null
  }

  return (
    <section ref={sectionRef} className="w-full min-h-full bg-background flex flex-col">
      {/* ── HEADER ── */}
      <div className="px-8 pt-16 pb-8 border-b border-snappy-border flex flex-col md:flex-row justify-between items-end gap-6 bg-background/50 backdrop-blur-sm sticky top-0 z-20">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="w-8 h-px bg-primary/40" />
            <p className="text-[10px] uppercase tracking-[0.6em] font-black text-primary/60">
              Project Matrix
            </p>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tighter leading-none">
            Selected Work
          </h1>
        </div>

        <div className="flex items-center gap-12">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] uppercase tracking-widest font-black text-primary/40">
              Total Volume
            </span>
            <span className="text-xl font-serif italic text-foreground tracking-widest">
              {String(initialProjects.length).padStart(3, '0')}
            </span>
          </div>
          <Link
            href="/archive"
            className="w-12 h-12 rounded-full border border-snappy-border flex items-center justify-center group hover:border-primary transition-colors"
          >
            <ArrowUpRight className="w-5 h-5 group-hover:text-primary transition-colors" />
          </Link>
        </div>
      </div>

      {/* ── MATRIX COLUMN HEADERS ── */}
      <div className="grid grid-cols-12 gap-0 border-b border-snappy-border bg-snappy-muted/50 text-[10px] uppercase tracking-[0.2em] font-black text-primary/40 px-8 py-4">
        <div className="col-span-1 hidden lg:block">Idx</div>
        <div className="col-span-12 lg:col-span-4">Project Entity</div>
        <div className="col-span-3 hidden lg:block">System / Category</div>
        <div className="col-span-2 hidden lg:block">Year</div>
        <div className="col-span-2 hidden lg:block text-right">Action</div>
      </div>

      {/* ── PROJECT ROWS ── */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide bg-background">
        {initialProjects.map((project, i) => (
          <Link
            key={project.id}
            href={`/work/${project.slug}`}
            className="project-row grid grid-cols-12 gap-0 border-b border-snappy-border group hover:bg-primary/5 transition-all duration-500 relative px-8 py-10 lg:py-12 items-center"
          >
            {/* Index Pillar */}
            <div className="col-span-1 hidden lg:block font-serif italic text-primary/30 group-hover:text-primary transition-colors">
              {String(i + 1).padStart(2, '0')}
            </div>

            {/* Entity Block */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
              <div className="relative aspect-[16/9] w-full max-w-sm rounded-tr-[3rem] overflow-hidden border border-snappy-border group-hover:border-primary/50 grayscale transition-all duration-700">
                {project.featuredImage ? (
                  <Image
                    src={getMediaUrl(project.featuredImage)}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-snappy-muted">
                    <span className="text-[10px] font-black tracking-widest text-primary/20">
                      NO_DATA
                    </span>
                  </div>
                )}
              </div>
              <h2 className="text-3xl lg:text-4xl font-serif font-bold tracking-tight text-foreground group-hover:translate-x-2 transition-transform duration-500">
                {project.title}
              </h2>
            </div>

            {/* Category Pillar */}
            <div className="col-span-3 hidden lg:flex flex-col gap-2">
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-primary/5 border border-primary/10 rounded-sm text-[9px] font-black uppercase tracking-widest text-primary">
                  {project.category || 'Digital Experience'}
                </span>
              </div>
            </div>

            {/* Year Pillar */}
            <div className="col-span-2 hidden lg:block font-serif text-lg tracking-widest text-foreground/40 group-hover:text-foreground transition-colors">
              {project.year || '2024'}
            </div>

            {/* Action Pillar */}
            <div className="col-span-2 hidden lg:flex justify-end">
              <div className="flex flex-col items-end gap-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 transition-transform">
                  Detailed Report
                </span>
                <div className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Hover Decorator */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-500" />
          </Link>
        ))}

        {/* Footer Filler */}
        <div className="h-24 bg-snappy-muted/20 border-b border-snappy-border flex items-center justify-center">
          <p className="text-[9px] uppercase tracking-[0.8em] font-black text-primary/10">
            End of Record Matrix
          </p>
        </div>
      </div>
    </section>
  )
}
