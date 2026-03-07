import React from 'react'
import { Logo } from '../../common/Logo'
import { ThemeToggle } from '../../common/ThemeToggle'
import { PortfolioNav } from './PortfolioNav'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'

export const PortfolioHeader: React.FC = async () => {
  const payload = await getPayload({ config: configPromise })
  const branding = (await payload.findGlobal({ slug: 'branding', depth: 2 })) as any
  const profile = (await payload.findGlobal({ slug: 'profile' })) as any

  return (
    <header
      id="site-header"
      className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-snappy-border"
    >
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        {/* Branding */}
        <Logo size="sm" variant="both" branding={branding} profile={profile} />

        {/* Desktop Navigation */}
        <PortfolioNav className="hidden md:flex items-center gap-8" />

        {/* CTA & Utilities */}
        <div className="hidden md:flex items-center gap-6">
          <ThemeToggle variant="minimal" />
          <a
            href="mailto:wicky@wicky.id"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-foreground text-background text-[11px] font-semibold uppercase tracking-[0.1em] hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Start a Project
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  )
}
