'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

/**
 * Premium Theme Provider for the SNAPPY Stack.
 * Handles dark/light/system modes with attribute-based switching for Tailwind v4.
 * Enables zero-flicker hydration.
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider attribute="class" enableSystem disableTransitionOnChange={true} {...props}>
      {children}
    </NextThemesProvider>
  )
}
