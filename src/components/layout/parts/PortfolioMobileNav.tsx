'use client'
import React, { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import gsap from 'gsap'
import { ThemeToggle } from '../../common/ThemeToggle'

const navItems = [
  {
    label: 'About',
    href: '/about',
    icon: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
  {
    label: 'Love',
    href: '/love',
    icon: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    label: 'Process',
    href: '/process',
    icon: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 20V10" />
        <path d="M18 20V4" />
        <path d="M6 20v-4" />
      </svg>
    ),
  },
  {
    label: 'Work',
    href: '/work',
    icon: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: 'Home',
    href: '/',
    icon: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9.5L12 3l9 6.5V21H3V9.5z" />
      </svg>
    ),
  },
]

const FAB_SIZE = 52
const ITEM_SIZE = 44
const ITEM_GAP = 10

export const PortfolioMobileNav: React.FC = () => {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const fabRef = useRef<HTMLButtonElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    itemRefs.current.forEach((el) => {
      if (el) gsap.set(el, { opacity: 0, y: 12, pointerEvents: 'none' })
    })
    if (overlayRef.current) gsap.set(overlayRef.current, { opacity: 0, pointerEvents: 'none' })
  }, [])

  const openMenu = () => {
    setOpen(true)
    if (overlayRef.current)
      gsap.to(overlayRef.current, { opacity: 1, pointerEvents: 'auto', duration: 0.2 })
    if (fabRef.current)
      gsap.to(fabRef.current, { rotate: 45, duration: 0.3, ease: 'back.out(1.5)' })
    itemRefs.current.forEach((el, i) => {
      if (!el) return
      gsap.to(el, {
        opacity: 1,
        y: 0,
        pointerEvents: 'auto',
        duration: 0.35,
        ease: 'back.out(1.4)',
        delay: i * 0.05,
      })
    })
  }

  const closeMenu = () => {
    setOpen(false)
    if (overlayRef.current)
      gsap.to(overlayRef.current, { opacity: 0, pointerEvents: 'none', duration: 0.2 })
    if (fabRef.current) gsap.to(fabRef.current, { rotate: 0, duration: 0.25, ease: 'power3.out' })
    itemRefs.current.forEach((el, i) => {
      if (!el) return
      gsap.to(el, {
        opacity: 0,
        y: 12,
        pointerEvents: 'none',
        duration: 0.2,
        ease: 'power2.in',
        delay: i * 0.03,
      })
    })
  }

  const toggle = () => (open ? closeMenu() : openMenu())

  useEffect(() => {
    closeMenu()
  }, [pathname])

  const RIGHT = 20
  const FAB_BOTTOM = 32

  return (
    <div className="md:hidden">
      <div
        ref={overlayRef}
        onClick={closeMenu}
        className="fixed inset-0 z-40 bg-background/50 backdrop-blur-sm"
      />

      {navItems.map((item, i) => {
        const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
        const itemBottom = FAB_BOTTOM + FAB_SIZE + ITEM_GAP + i * (ITEM_SIZE + ITEM_GAP)

        return (
          <div
            key={item.href}
            ref={(el) => {
              itemRefs.current[i] = el
            }}
            className="fixed z-50 flex items-center gap-3"
            style={{ bottom: itemBottom, right: RIGHT }}
          >
            <span
              className="text-[9px] font-bold uppercase tracking-[0.15em] font-sans
                         bg-foreground text-background px-2.5 py-1 rounded-full whitespace-nowrap
                         shadow-lg"
            >
              {item.label}
            </span>

            <Link
              href={item.href}
              onClick={closeMenu}
              className={`flex items-center justify-center rounded-full flex-shrink-0 transition-all ${isActive ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/40 ring-2 ring-primary/40' : 'bg-foreground text-background shadow-md'}`}
              style={{
                width: ITEM_SIZE,
                height: ITEM_SIZE,
              }}
            >
              {item.icon}
            </Link>
          </div>
        )
      })}

      {/* Theme Toggle - Floating above or near FAB */}
      <div
        className="fixed z-50 flex items-center justify-center rounded-full bg-foreground text-background shadow-lg border border-border"
        style={{
          width: ITEM_SIZE,
          height: ITEM_SIZE,
          bottom: FAB_BOTTOM,
          right: RIGHT + FAB_SIZE + ITEM_GAP,
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'all 0.3s ease',
          transform: open ? 'scale(1)' : 'scale(0.8)',
        }}
      >
        <ThemeToggle variant="minimal" className="bg-transparent border-none shadow-none" />
      </div>

      <button
        ref={fabRef}
        onClick={toggle}
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        className="fixed z-50 flex items-center justify-center rounded-full
                   bg-foreground text-background shadow-2xl border border-border
                   active:bg-primary active:text-primary-foreground transition-colors"
        style={{ width: FAB_SIZE, height: FAB_SIZE, bottom: FAB_BOTTOM, right: RIGHT }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
    </div>
  )
}
