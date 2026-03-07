import React from 'react'
import { Sidebar } from '../parts/Sidebar'
import { ShellProps } from './types'
import { DesktopHeader } from '../parts/DesktopHeader'
import { Breadcrumbs } from '../parts/Breadcrumbs'

/**
 * Premium Desktop Dashboard Template.
 * Features a persistent sidebar and sticky header with breadcrumbs.
 */
export const DashboardTemplate: React.FC<ShellProps> = ({ children, title, actions }) => {
 return (
 <div className="flex flex-col lg:flex-row min-h-screen relative">
 <Sidebar />
 <div className="flex-1 flex flex-col lg:pl-64 min-h-screen">
 <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-snappy-border">
 <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
 <div className="flex flex-col gap-1">
 <Breadcrumbs />
 {title && <h1 className="text-lg font-semibold text-foreground">{title}</h1>}
 </div>
 <div className="flex items-center gap-4">{actions}</div>
 </div>
 </header>

 <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 bg-background">
 <div className="max-w-7xl mx-auto">{children}</div>
 </main>
 </div>
 </div>
 )
}
