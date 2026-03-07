import React from 'react'
import { Credit } from './Credit'
import { Logo } from '../../common/Logo'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { getMediaUrl } from '@/lib/utils'
import { Download } from 'lucide-react'

export const PortfolioFooter: React.FC = async () => {
  const payload = await getPayload({ config: configPromise })
  const profile = (await payload.findGlobal({ slug: 'profile', depth: 2 })) as any
  const branding = (await payload.findGlobal({ slug: 'branding', depth: 2 })) as any

  const baseLinks = [
    { label: 'Email', url: profile?.contactEmail ? `mailto:${profile.contactEmail}` : null },
  ]

  const dynamicLinks = (profile?.socialLinks || []).map((link: any) => ({
    label: link.platform.charAt(0).toUpperCase() + link.platform.slice(1),
    url: link.url,
  }))

  const socialLinks = [...baseLinks, ...dynamicLinks].filter((link) => link.url)

  const resumeUrl = profile?.resume ? getMediaUrl(profile.resume) : null

  return (
    <footer className="shrink-0 border-t border-snappy-border bg-background py-2 sm:py-0">
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 min-h-16 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Copyright */}
        <div className="w-full sm:w-1/3 text-center sm:text-left order-3 sm:order-1">
          <p className="text-[9px] text-snappy-fg/40 uppercase tracking-widest font-bold">
            © {new Date().getFullYear()} {profile?.fullName || 'Template'}
          </p>
        </div>

        {/* Center: Logo & Links */}
        <div className="w-full sm:w-1/3 flex flex-col items-center justify-center gap-2 order-1 sm:order-2">
          {branding?.logo || branding?.logoText ? (
            <div className="scale-75 origin-center">
              <Logo size="sm" variant="both" branding={branding} profile={profile} />
            </div>
          ) : null}

          <nav
            className="flex items-center gap-3 flex-wrap justify-center mt-0"
            aria-label="Footer links"
          >
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target={link.label === 'Email' ? undefined : '_blank'}
                rel={link.label === 'Email' ? undefined : 'noopener noreferrer'}
                className="text-[10px] sm:text-[11px] font-bold text-snappy-fg/60 hover:text-primary transition-colors tracking-widest uppercase"
              >
                {link.label}
              </a>
            ))}
            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] sm:text-[11px] font-bold text-primary hover:text-primary/70 transition-colors tracking-widest uppercase flex items-center gap-1"
              >
                <Download className="w-3 h-3" />
                Resume
              </a>
            )}
          </nav>
        </div>

        {/* Right: Credit */}
        <div className="w-full sm:w-1/3 flex justify-center sm:justify-end order-2 sm:order-3">
          <Credit />
        </div>
      </div>
    </footer>
  )
}
