import React from 'react'
import { Sidebar } from '../parts/Sidebar'
import { ShellProps } from './types'
import { DesktopHeader } from '../parts/DesktopHeader'

/**
 * Reading-optimized shell for Desktop (Docs/Blogs).
 * Features a sidebar for navigation and a centered, readable content area.
 */
export const ContentTemplate: React.FC<ShellProps> = ({ children, title }) => {
 return (
 <div className="min-h-screen flex flex-col">
 <DesktopHeader />
 <div className="max-w-7xl mx-auto flex">
 <aside className="hidden lg:block w-72 h-[calc(100vh-4rem)] sticky top-16 border-r border-snappy-border p-8 overflow-y-auto">
 {/* Table of Contents or Category Nav would go here */}
 <div className="space-y-4">
 <h3 className="text-xs font-bold text-foreground/60 uppercase tracking-widest">
 Navigation
 </h3>
 <Sidebar />
 </div>
 </aside>

 <main className="flex-1 px-6 py-12 lg:px-12 max-w-4xl">
 {title && (
 <h1 className="text-4xl font-extrabold text-foreground mb-8 tracking-tight">
 {title}
 </h1>
 )}
 <article className="prose prose-zinc dark:prose-invert max-w-none">{children}</article>
 </main>
 </div>
 </div>
 )
}
