'use client'

import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'
import type { Profile } from '@/payload-types'
import Image from 'next/image'
import { getMediaUrl } from '@/lib/utils'

interface Props {
  initialProfile: Profile | null
}

export const ProfileHero: React.FC<Props> = ({ initialProfile }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      // Setup initial states
      gsap.set('.hero-content > *', { y: 30, opacity: 0 })
      gsap.set('.hero-image', { scale: 0.9, opacity: 0 })

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.to('.hero-image', {
        scale: 1,
        opacity: 1,
        duration: 1.2,
      }).to(
        '.hero-content > *',
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
        },
        '-=0.8',
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  if (!initialProfile) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-snappy-fg/50">Setup your profile in Payload to see the hero section.</p>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 flex items-center justify-center p-6 sm:p-12 relative w-full max-w-7xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center w-full">
        {/* Left: Text Content */}
        <div className="hero-content flex flex-col items-center md:items-start text-center md:text-left space-y-6 md:space-y-8 order-2 md:order-1">
          <div className="space-y-3">
            <h2 className="text-sm font-bold tracking-widest text-primary uppercase">
              {initialProfile.location || 'Location Not Set'}
            </h2>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
              Hi, I'm <br />
              {initialProfile.fullName}
            </h1>
          </div>

          <p className="max-w-xl text-lg sm:text-xl text-foreground/60 leading-relaxed font-medium">
            {initialProfile.bioShort}
          </p>

          {initialProfile.disciplines && initialProfile.disciplines.length > 0 && (
            <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-4">
              {initialProfile.disciplines.map((discipline, i) => (
                <div
                  key={i}
                  className="px-4 py-2 rounded-full border border-snappy-border bg-snappy-card text-xs font-semibold tracking-wide text-foreground"
                >
                  {discipline.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Image */}
        <div className="order-1 md:order-2 flex justify-center md:justify-end">
          <div className="hero-image relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[30rem] lg:h-[30rem]">
            {initialProfile.profileImage ? (
              <div className="w-full h-full rounded-[2.5rem] overflow-hidden bg-snappy-muted border-4 border-background shadow-2xl">
                {typeof initialProfile.profileImage === 'object' &&
                initialProfile.profileImage?.url ? (
                  <Image
                    src={getMediaUrl(initialProfile.profileImage)}
                    alt={initialProfile.profileImage.alt || initialProfile.fullName || 'Profile'}
                    priority
                    fill
                    className="object-cover"
                  />
                ) : null}
              </div>
            ) : (
              <div className="w-full h-full rounded-[2.5rem] bg-snappy-muted border border-snappy-border flex items-center justify-center shadow-xl">
                <span className="text-sm text-snappy-fg/40">No Input Image</span>
              </div>
            )}

            {/* Decorative Element */}
            <div className="absolute -inset-4 border border-snappy-border/30 rounded-[3rem] -z-10" />
            <div className="absolute top-12 -right-6 w-12 h-12 bg-primary rounded-full blur-2xl opacity-20" />
          </div>
        </div>
      </div>
    </div>
  )
}
