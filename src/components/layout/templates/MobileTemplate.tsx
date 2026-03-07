import React from 'react'
import { ShellProps } from './types'
import { BottomNav } from '../parts/BottomNav'
import { MobileHeader } from '../parts/MobileHeader'
import { MobileFooter } from '../parts/MobileFooter'

/**
 * Premium Mobile Dashboard Template.
 * Optimized for thumb-centric navigation and bottom-tabs.
 */
export const MobileTemplate: React.FC<ShellProps> = ({ children, title, actions }) => {
 return (
 <div className="min-h-screen flex flex-col pb-20">
 <MobileHeader title={title} actions={actions} />

 <main className="flex-1 px-4 py-6">
 {children}
 <div className="mt-12 opacity-50">
 <MobileFooter />
 </div>
 </main>

 <BottomNav />
 </div>
 )
}
