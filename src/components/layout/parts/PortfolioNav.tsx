'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Work', href: '/work' },
  { label: 'Process', href: '/process' },
  { label: 'Love', href: '/love' },
  { label: 'About', href: '/about' },
]

export const PortfolioNav: React.FC<{ className?: string }> = ({ className }) => {
  const pathname = usePathname()

  return (
    <nav className={className} aria-label="Main navigation">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'text-[11px] uppercase tracking-[0.15em] font-semibold transition-colors',
            pathname === item.href || pathname.startsWith(item.href + '/')
              ? 'text-primary'
              : 'text-snappy-muted hover:text-foreground',
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
