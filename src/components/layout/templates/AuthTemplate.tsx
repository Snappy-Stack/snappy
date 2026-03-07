import React from 'react'
import { Logo } from '../../common/Logo'
import { ShellProps } from './types'
import { Credit } from '../parts/Credit'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'

/**
 * Redefined AuthTemplate
 * Strict Snappy Standards: Logo on top, No complex nav, Credit below.
 * Branding: Uses the non-bullshit Unified Logo component (Text-based).
 */
export const AuthTemplate: React.FC<ShellProps> = async ({ children }) => {
  const payload = await getPayload({ config: configPromise })
  const branding = (await payload.findGlobal({ slug: 'branding', depth: 2 })) as any
  const profile = (await payload.findGlobal({ slug: 'profile' })) as any

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements - Clean & Subtle */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full translate-x-1/4 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-secondary/5 blur-[120px] rounded-full -translate-x-1/4 translate-y-1/4" />
      </div>

      <div className="w-full flex flex-col items-center relative z-10 max-w-md">
        <div className="mb-12">
          <Logo size="lg" branding={branding} profile={profile} />
        </div>

        <div className="w-full flex flex-col items-center">{children}</div>

        {/* Minimal Footer Credit */}
        <div className="mt-12 text-center space-y-4">
          <div className="scale-90 opacity-60 hover:opacity-100 transition-opacity">
            <Credit />
          </div>
          <p className="text-[9px] text-snappy-fg/30 font-bold uppercase tracking-[0.3em] leading-relaxed">
            &copy; {new Date().getFullYear()} SNAPPY STACK CORE
          </p>
        </div>
      </div>
    </main>
  )
}
