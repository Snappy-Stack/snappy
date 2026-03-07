import React from 'react'
import { ShellProps } from './types'
import { MobileHeader } from '../parts/MobileHeader'
import { MobileFooter } from '../parts/MobileFooter'

/**
 * Premium Mobile Landing Template.
 * Focused one-column marketing layout for mobile devices.
 */
export const MobileLandingTemplate: React.FC<ShellProps> = ({ children, title }) => {
 return (
 <div className="min-h-screen flex flex-col pb-20">
 <MobileHeader
 title={title}
 actions={
 <button className="px-3 py-1 bg-background dark:bg-white text-white text-[10px] font-bold rounded-full uppercase tracking-tighter">
 GET STARTED
 </button>
 }
 />
 <main className="flex-1 pt-4">
 {children}
 <MobileFooter />
 </main>
 </div>
 )
}
