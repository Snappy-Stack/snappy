'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export const ShortcutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      // Ctrl + Shift + W
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'w') {
        event.preventDefault()

        // Set short-lived stealth access cookie (15 minutes)
        // This is used by the middleware to allow access to /login
        document.cookie = 'snappy-stealth-access=true; path=/; max-age=900; SameSite=Lax'
        console.log('[SHORTCUT] Cookies after setting stealth:', document.cookie)

        // Check if user is already authenticated
        try {
          console.log('[SHORTCUT] Fetching /v1/users/me...')
          const res = await fetch('/v1/users/me')
          console.log('[SHORTCUT] Fetch status:', res.status)

          if (res.ok) {
            console.log('[SHORTCUT] Active session found. To dashboard...')
            router.push('/dashboard')
          } else {
            console.log('[SHORTCUT] No session. To login...')
            router.push('/login')
          }
        } catch (e) {
          console.error('[SHORTCUT] Fetch error:', e)
          router.push('/login')
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [router])

  return <>{children}</>
}
