import React from 'react'
import { ShellProps } from './types'
import { PortfolioHeader } from '../parts/PortfolioHeader'
import { PortfolioFooter } from '../parts/PortfolioFooter'

/**
 * Premium Scroll-Locked Portfolio Template for Desktop.
 * Inspired by Vallencya_porto.
 * Uses h-screen overflow-hidden to create a cinematic, focused experience.
 */
export const DesktopPortfolioTemplate: React.FC<ShellProps> = ({ children }) => {
  return (
    <div className="h-screen flex flex-col overflow-hidden antialiased">
      <PortfolioHeader />

      <main className="flex-1 relative overflow-hidden antialiased">
        <div className="w-full h-full flex flex-col">{children}</div>
      </main>

      <PortfolioFooter />
    </div>
  )
}
