import React from 'react'
import Link from 'next/link'
import { LogOut, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/common/Logo'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'

interface MinimalDashboardProps {
  children: React.ReactNode
  title?: string
  actions?: React.ReactNode
}

/**
 * Dashboard Template — styled to match the Portfolio header.
 */
export const MinimalDashboardTemplate: React.FC<MinimalDashboardProps> = async ({
  children,
  actions,
}) => {
  const payload = await getPayload({ config: configPromise })
  const [branding, profile] = await Promise.all([
    payload.findGlobal({ slug: 'branding', depth: 2 }) as any,
    payload.findGlobal({ slug: 'profile' }) as any,
  ])

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Header — matches PortfolioHeader style */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-snappy-border">
        <div className="max-w-screen-xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          {/* Logo — same as landing */}
          <Logo size="sm" variant="both" branding={branding} profile={profile} />

          {/* Right side: badge, actions, theme toggle, logout */}
          <div className="flex items-center gap-3">
            {/* Dashboard badge */}
            <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20">
              Dashboard
            </span>

            {actions && <div className="flex items-center">{actions}</div>}

            <ThemeToggle variant="minimal" />

            <Button
              variant="ghost"
              size="sm"
              asChild
              className="hidden sm:inline-flex gap-2 text-snappy-fg/60 hover:text-snappy-fg"
            >
              <Link href="/" target="_blank">
                <ExternalLink className="w-3.5 h-3.5" />
                View Live
              </Link>
            </Button>

            <div className="h-4 w-px bg-snappy-border" />

            <Button variant="outline" size="sm" asChild>
              <Link href="/logout" className="flex items-center gap-2">
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 py-12 px-4 bg-background">
        <div className="max-w-4xl mx-auto">{children}</div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-snappy-border">
        <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
          <p className="text-xs text-snappy-fg/30">
            © {new Date().getFullYear()} {(profile as any)?.fullName || 'Portfolio'}
          </p>
          <Link href="/" className="text-xs text-snappy-fg/30 hover:text-primary transition-colors">
            View Site →
          </Link>
        </div>
      </footer>
    </div>
  )
}
