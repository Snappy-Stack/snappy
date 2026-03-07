import React from 'react'
import { ShellProps } from './types'
import { BottomNav } from '../parts/BottomNav'
import { Credit } from '../parts/Credit'

/**
 * Premium PWA Template.
 * Eliminates all browser-like headers for a pure"Installed App"feel.
 * Focuses on safe-area handling and immersive full-screen content.
 */
export const MobilePWATemplate: React.FC<ShellProps> = ({ children }) => {
 return (
 <div className="min-h-screen flex flex-col overflow-hidden">
 {/* Immersive Status Bar Area */}
 <div className="h-safe-area-inset-top bg-background"/>

 <main className="flex-1 overflow-y-auto scrolling-touch px-4 pt-4 pb-24">{children}</main>

 {/* Floating App-style Navigation */}
 <div className="fixed bottom-6 left-6 right-6 z-50 flex flex-col items-center gap-4">
 <Credit />
 <div className="w-full bg-snappy-card/90 backdrop-blur-xl border border-snappy-border rounded-2xl shadow-2xl overflow-hidden">
 <BottomNav />
 </div>
 </div>

 <div className="h-safe-area-inset-bottom bg-background"/>
 </div>
 )
}
