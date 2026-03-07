import React from 'react'
import { ShellProps } from './types'
import { DesktopHeader } from '../parts/DesktopHeader'
import { DesktopFooter } from '../parts/DesktopFooter'

/**
 * Standard Desktop Landing Page Template.
 * High-impact marketing layout with flagship Header and Footer.
 */
export const LandingTemplate: React.FC<ShellProps> = ({ children }) => {
 return (
 <div className="min-h-screen flex flex-col">
 <DesktopHeader />
 <main className="flex-1">{children}</main>
 <DesktopFooter />
 </div>
 )
}
