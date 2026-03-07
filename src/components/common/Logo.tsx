'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn, getMediaUrl } from '@/lib/utils'

export type LogoSize = 'xxs' | 'xs' | 's' | 'sm' | 'm' | 'md' | 'ml' | 'lg' | 'xl' | 'xxl'

interface LogoProps {
  variant?: 'text' | 'image' | 'both'
  size?: LogoSize
  href?: string
  className?: string
  textClassName?: string
  showStack?: boolean
  branding?: any
  profile?: any
}

export const Logo = ({
  variant = 'both',
  size = 'md',
  href = '/',
  className,
  textClassName,
  branding: initialBranding,
  profile: initialProfile,
}: LogoProps) => {
  const [branding, setBranding] = useState(initialBranding)
  const [profile, setProfile] = useState(initialProfile)

  useEffect(() => {
    // If data wasn't passed via props (e.g. in a client component where it's hard to get server data),
    // fetch it from the API.
    if (!initialBranding || !initialProfile) {
      const fetchData = async () => {
        try {
          const [brandRes, profRes] = await Promise.all([
            fetch('/v1/globals/branding').then((res) => res.json()),
            fetch('/v1/globals/profile').then((res) => res.json()),
          ])
          if (!initialBranding) setBranding(brandRes)
          if (!initialProfile) setProfile(profRes)
        } catch (err) {
          console.error('Failed to fetch logo data', err)
        }
      }
      fetchData()
    }
  }, [initialBranding, initialProfile])

  useEffect(() => {
    if (initialBranding) setBranding(initialBranding)
    if (initialProfile) setProfile(initialProfile)
  }, [initialBranding, initialProfile])
  const sizeMap: Record<LogoSize, string> = {
    xxs: 'text-[10px]',
    xs: 'text-xs',
    s: 'text-sm',
    sm: 'text-base',
    m: 'text-lg',
    md: 'text-xl',
    ml: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-5xl',
    xxl: 'text-7xl',
  }

  // Height-only size map — width is auto to preserve aspect ratio
  const imgSizeMap: Record<LogoSize, number> = {
    xxs: 16,
    xs: 20,
    s: 24,
    sm: 28,
    m: 32,
    md: 40,
    ml: 48,
    lg: 64,
    xl: 96,
    xxl: 128,
  }

  const useUnified = branding?.useUnifiedLogo ?? false
  const logoLight = branding?.logo
  const explicitLogoDark = branding?.logoDark

  // We have a separate dark logo ONLY if we aren't unified, we have an explicit dark logo,
  // and the explicit dark logo resolves to a different URL than the light logo.
  const hasSeparateDarkLogo =
    !useUnified && explicitLogoDark && getMediaUrl(explicitLogoDark) !== getMediaUrl(logoLight)

  // Determine what to show for dark mode.
  const logoDark = hasSeparateDarkLogo ? explicitLogoDark : logoLight

  // Check if we have a valid image URL or filename
  const hasImage = !!(getMediaUrl(logoLight) || getMediaUrl(logoDark))
  const brandName =
    branding?.logoText || (profile?.fullName ? `${profile.fullName.split(' ')[0][0]}.` : 'SNAPPY')

  const content = (
    <div className={cn('flex items-center gap-3 group cursor-pointer', className)}>
      {variant !== 'text' && hasImage ? (
        <div className="relative shrink-0 transition-transform duration-500 group-hover:scale-110">
          {/* Light Mode Logo — fixed height, auto width to preserve aspect ratio */}
          {logoLight && (
            <img
              src={getMediaUrl(logoLight) || ''}
              alt={(logoLight as any).alt || 'Logo'}
              style={{
                width: 'auto',
                height: `${imgSizeMap[size]}px`,
                maxWidth: '200px', // lint-ignore-scale
              }}
              className={cn('object-contain', hasSeparateDarkLogo && 'dark:hidden')}
            />
          )}

          {/* Dark Mode Logo - Only rendered if a separate logo exists */}
          {hasSeparateDarkLogo && (
            <img
              src={getMediaUrl(logoDark) || ''}
              alt={(logoDark as any).alt || 'Logo Dark'}
              style={{
                width: 'auto',
                height: `${imgSizeMap[size]}px`,
                maxWidth: '200px', // lint-ignore-scale
              }}
              className={cn('object-contain hidden dark:block')}
            />
          )}
        </div>
      ) : (
        <div className="flex flex-col leading-none">
          <span
            className={cn(
              'font-black tracking-tighter leading-none',
              sizeMap[size],
              'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400',
              'transition-transform duration-500 group-hover:scale-105',
              textClassName,
            )}
          >
            {brandName}
          </span>
        </div>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="block no-underline">
        {content}
      </Link>
    )
  }

  return content
}
