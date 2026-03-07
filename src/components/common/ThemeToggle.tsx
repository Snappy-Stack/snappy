'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  variant?: 'minimal' | 'labeled'
  className?: string
}

/**
 * Cinematic Theme Toggle Component.
 * Implements a "View Transition" effect that radiates from the click point.
 * Follows the "Safe to Wow" premium aesthetic of the SNAPPY Stack.
 */
export function ThemeToggle({ variant = 'minimal', className }: ThemeToggleProps) {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = (event: React.MouseEvent) => {
    // Crucial: Prevent any form submission or parent event bubbling
    event.preventDefault()
    event.stopPropagation()

    const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark'

    // @ts-ignore
    if (!document.startViewTransition) {
      setTheme(nextTheme)
      return
    }

    const { clientX: x, clientY: y } = event
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    )

    // @ts-ignore
    const transition = document.startViewTransition(() => {
      setTheme(nextTheme)
    })

    transition.ready.then(() => {
      // The NEW state expands OVER the old state
      document.documentElement.animate(
        {
          clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`],
        },
        {
          duration: 500,
          easing: 'ease-in-out',
          pseudoElement: '::view-transition-new(root)',
        },
      )
    })
  }

  if (!mounted) {
    return (
      <div
        className={cn('w-9 h-9 rounded-xl bg-snappy-card border border-snappy-border', className)}
      />
    )
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        'relative inline-flex items-center justify-center transition-all duration-300',
        'hover:scale-110 active:scale-95 outline-none',
        variant === 'minimal'
          ? 'w-9 h-9 rounded-xl bg-snappy-card border border-snappy-border hover:border-snappy-border-strong'
          : 'w-full px-3 py-2 rounded-xl text-sm font-medium gap-3 text-snappy-fg/60 hover:bg-snappy-card hover:text-snappy-fg',
        className,
      )}
      aria-label="Toggle Theme"
    >
      <div className="relative w-4 h-4 overflow-hidden">
        <Sun
          className={cn(
            'absolute inset-0 w-4 h-4 transition-transform duration-500',
            isDark ? 'translate-y-6' : 'translate-y-0',
          )}
        />
        <Moon
          className={cn(
            'absolute inset-0 w-4 h-4 transition-transform duration-500 text-secondary',
            isDark ? 'translate-y-0' : '-translate-y-6',
          )}
        />
      </div>

      {variant === 'labeled' && (
        <span className="flex-1 text-left">{isDark ? 'Light' : 'Dark'}</span>
      )}
    </button>
  )
}
