import React from 'react'
import { Metadata } from 'next'
import './globals.css'
import { validateEnv } from '@/lib/env'
import { ThemeProvider } from '@/providers/ThemeProvider'

// Validate environment variables on startup
validateEnv()

import { getBranding, getProfile, getSEO } from '@/lib/queries'
import { getMediaUrl } from '@/lib/utils'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const [branding, profile, seo] = await Promise.all([getBranding(), getProfile(), getSEO()])

    const faviconUrl = getMediaUrl((branding as any)?.favicon) || '/favicon.png'
    const siteTitle = (seo as any)?.defaultMetaTitle || 'The SNAPPY Stack'
    const siteDescription =
      (seo as any)?.defaultMetaDescription || (profile as any)?.bioShort || 'Full-stack developer.'

    return {
      title: {
        default: profile?.fullName ? `${profile.fullName} — ${siteTitle}` : siteTitle,
        template: `%s — ${siteTitle}`,
      },
      description: siteDescription,
      metadataBase: new URL(process.env.PUBLIC_FRONTEND_URL || 'http://localhost:3000'),
      alternates: {
        canonical: '/',
      },
      openGraph: {
        title: profile?.fullName ? `${profile.fullName} — ${siteTitle}` : siteTitle,
        description: siteDescription,
        url: process.env.PUBLIC_FRONTEND_URL || 'http://localhost:3000',
        siteName: siteTitle,
        locale: 'en_US',
        type: 'website',
        images: (seo as any)?.ogImage?.url ? [{ url: (seo as any).ogImage.url }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: profile?.fullName ? `${profile.fullName} — ${siteTitle}` : siteTitle,
        description: siteDescription,
        images: (seo as any)?.ogImage?.url ? [(seo as any).ogImage.url] : [],
      },
      robots: {
        index: !(seo as any)?.robotsNoIndex,
        follow: !(seo as any)?.robotsNoIndex,
      },
      manifest: '/manifest.json',
      icons: {
        icon: faviconUrl,
        shortcut: faviconUrl,
        apple: faviconUrl,
      },
      appleWebApp: {
        capable: true,
        statusBarStyle: 'black-translucent',
        title: siteTitle,
      },
    }
  } catch (error) {
    console.error('Metadata generation failed:', error)
    return {
      title: 'The SNAPPY Stack',
      description: 'Full-stack developer portfolio.',
    }
  }
}

import { Viewport } from 'next'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#030408',
}

import { ModalProvider } from '@/providers/ModalProvider'
import { ShortcutProvider } from '@/providers/ShortcutProvider'
import { JsonLd } from '@/components/shared/JsonLd'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [profile, seo] = await Promise.all([getProfile(), getSEO()])

  const siteTitle = (seo as any)?.defaultMetaTitle || 'The SNAPPY Stack'
  const siteDescription =
    (seo as any)?.defaultMetaDescription ||
    (profile as any)?.bioShort ||
    'Full-stack developer portfolio.'
  const baseUrl = process.env.PUBLIC_FRONTEND_URL || 'http://localhost:3000'

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile?.fullName || 'Creative Professional',
    description: siteDescription,
    url: baseUrl,
    jobTitle: (profile as any)?.disciplines?.[0]?.name || 'Full-stack Developer',
    sameAs: [
      (profile as any)?.githubUrl,
      (profile as any)?.twitterUrl,
      (profile as any)?.linkedinUrl,
      (profile as any)?.dribbbleUrl,
    ].filter(Boolean),
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteTitle,
    url: baseUrl,
    description: siteDescription,
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <JsonLd data={personSchema} />
        <JsonLd data={websiteSchema} />
      </head>
      <body suppressHydrationWarning className="antialiased">
        <ThemeProvider>
          <ShortcutProvider>
            <ModalProvider components={{} as any}>{children}</ModalProvider>
          </ShortcutProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
