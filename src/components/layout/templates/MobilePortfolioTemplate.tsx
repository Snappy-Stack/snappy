import React from 'react'
import { ShellProps } from './types'
import { PortfolioMobileNav } from '../parts/PortfolioMobileNav'

/**
 * Minimalist Full-Screen Portfolio Template for Mobile.
 * Keeps the focused island feel but optimizes for vertical mobile space.
 */
export const MobilePortfolioTemplate: React.FC<ShellProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased relative">
      <main className="flex-1 flex flex-col justify-center overflow-hidden relative">
        {children}
      </main>

      <PortfolioMobileNav />
    </div>
  )
}
