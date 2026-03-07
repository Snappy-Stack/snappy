import React from 'react'
import { Logo } from './common/Logo'

export const Header: React.FC = () => {
 return (
 <header className="sticky top-0 z-50 w-full border-b border-snappy-border bg-white/80 backdrop-blur-md">
 <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
 <Logo size="md"/>
 <nav className="hidden md:flex items-center gap-6">
 <a
 href="/admin"
 className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
 >
 Admin
 </a>
 <a
 href="https://payloadcms.com/docs"
 target="_blank"
 rel="noopener noreferrer"
 className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
 >
 Docs
 </a>
 <button className="rounded-full bg-background px-4 py-1.5 text-sm font-medium text-foreground hover:bg-background transition-colors">
 Sign In
 </button>
 </nav>
 </div>
 </header>
 )
}
