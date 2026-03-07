import React from 'react'
import { Logo } from './common/Logo'
import { Credit } from './layout/parts/Credit'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'

export const Footer: React.FC = async () => {
  const payload = await getPayload({ config: configPromise })
  const profile = (await payload.findGlobal({ slug: 'profile' })) as any

  return (
    <footer className="w-full border-t border-snappy-border bg-snappy-card">
      <div className="container mx-auto px-4 py-12 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Logo size="md" className="mb-4" />
            <p className="max-w-xs text-sm text-snappy-fg/60 leading-relaxed">
              The premium Next.js 15 + Payload CMS v3 starter template. Built for speed, security,
              and developer happiness.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-2 text-sm text-snappy-fg/50">
              <li>Features</li>
              <li>Integrations</li>
              <li>Pricing</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
              Resources
            </h4>
            <ul className="space-y-2 text-sm text-snappy-fg/50">
              <li>Documentation</li>
              <li>API Reference</li>
              <li>Community</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-snappy-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-snappy-fg/40">
          <div className="flex flex-col gap-4 items-center md:items-start">
            <p>
              © {new Date().getFullYear()} {profile?.fullName || 'Portfolio'}.
            </p>
            <Credit />
          </div>
          <div className="flex gap-6">
            <span className="hover:text-snappy-fg cursor-pointer transition-colors">
              Privacy Policy
            </span>
            <span className="hover:text-snappy-fg cursor-pointer transition-colors">
              Terms of Service
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
