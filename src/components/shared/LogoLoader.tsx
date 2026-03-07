import React from 'react'
import { Logo } from '@/components/common/Logo'
import { getBranding, getProfile } from '@/lib/queries'

/**
 * Server component — fetches branding/profile from cache (same as PortfolioHeader)
 * and passes them directly to Logo. No client-side fetch, no "SNAPPY" flash.
 */
export async function LogoLoader() {
  const [branding, profile] = await Promise.all([getBranding(), getProfile()])

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background gap-8">
      {/* Ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-64 h-64 rounded-full bg-primary/10 blur-[80px] animate-pulse" />
      </div>

      {/* Logo — same props as PortfolioHeader, data injected server-side */}
      <div className="relative z-10 animate-in fade-in zoom-in-95 duration-700">
        <Logo size="xl" variant="both" branding={branding} profile={profile} />
      </div>

      {/* Shimmer progress bar */}
      <div className="relative z-10 w-32 h-px bg-snappy-border overflow-hidden rounded-full">
        <div
          className="absolute inset-0 h-full bg-primary rounded-full"
          style={{ animation: 'shimmer 1.5s ease-in-out infinite' }}
        />
      </div>

      {/* Credit */}
      <p className="relative z-10 text-[10px] font-black uppercase tracking-[0.4em] text-snappy-muted/50 animate-pulse">
        Built on SNAPPY
      </p>
    </div>
  )
}
