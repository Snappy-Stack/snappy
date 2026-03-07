'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Unhandled App Error:', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-16 text-center">
      <div className="max-w-md w-full p-8 border border-snappy-border rounded-2xl bg-snappy-card shadow-sm">
        <div className="w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center mx-auto mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-tertiary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground mb-3">
          Something went wrong
        </h2>
        <p className="text-foreground/80 text-sm mb-6 leading-relaxed">
          An unexpected error occurred while loading this page. Our team has been notified.
        </p>

        {process.env.NODE_ENV === 'development' && (
          <div className="mb-8 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-left overflow-auto max-h-[300px]">
            <p className="font-mono text-xs text-destructive font-bold mb-2">[DEV_ONLY_ERROR]</p>
            <p className="font-mono text-[11px] text-destructive/80 whitespace-pre-wrap break-words">
              {error.message || 'Unknown Error'}
            </p>
            {error.stack && (
              <div className="mt-4 pt-4 border-t border-destructive/20">
                <pre className="font-mono text-[10px] text-destructive/60 whitespace-pre-wrap">
                  {error.stack}
                </pre>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => reset()} variant="primary">
            Try again
          </Button>
          <Link href="/">
            <Button variant="outline">Go back home</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
