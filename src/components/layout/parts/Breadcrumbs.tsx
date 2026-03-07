'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'

/**
 * Dynamic Breadcrumbs component that generates navigation from the URL path.
 */
export const Breadcrumbs: React.FC = () => {
 const pathname = usePathname()

 const segments = pathname.split('/').filter(Boolean)

 if (pathname === '/') return null

 return (
 <nav className="flex items-center space-x-2 text-xs font-medium text-foreground0">
 <Link href="/"className="hover:text-foreground transition-colors">
 <Home className="w-3.5 h-3.5"/>
 </Link>

 {segments.map((segment, index) => {
 const href = `/${segments.slice(0, index + 1).join('/')}`
 const isLast = index === segments.length - 1
 const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')

 return (
 <React.Fragment key={href}>
 <ChevronRight className="w-3.5 h-3.5 text-foreground/60"/>
 {isLast ? (
 <span className="text-foreground font-bold truncate max-w-[120px]">
 {label}
 </span>
 ) : (
 <Link
 href={href}
 className="hover:text-foreground transition-colors truncate max-w-[100px]"
 >
 {label}
 </Link>
 )}
 </React.Fragment>
 )
 })}
 </nav>
 )
}
