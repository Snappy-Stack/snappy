import React from 'react'
import Link from 'next/link'
import {
  Github,
  Twitter,
  Linkedin,
  Mail,
  MapPin,
  Youtube,
  Globe,
  Dribbble,
  Instagram,
  Facebook,
} from 'lucide-react'
import { Credit } from './Credit'
import { Logo } from '../../common/Logo'
import { ThemeToggle } from '../../common/ThemeToggle'
import { Button, Input } from '../../ui'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'

/**
 * Enhanced Desktop Footer ("Full Stuff")
 * Flagship footer supporting multi-column navigation, map placeholders, and rich widgets.
 */
export const DesktopFooter = async () => {
  const payload = await getPayload({ config: configPromise })
  const profile = (await payload.findGlobal({ slug: 'profile' })) as any
  const branding = (await payload.findGlobal({ slug: 'branding', depth: 2 })) as any

  return (
    <footer className="w-full bg-background border-t border-snappy-border pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 pb-20">
          {/* Brand Identity & Newsletter */}
          <div className="lg:col-span-4 space-y-8">
            <Logo variant="both" size="ml" branding={branding} profile={profile} />
            <p className="text-snappy-fg/60 leading-relaxed max-w-sm">
              Helping you share your story through code and design. Built for speed and reliability.
            </p>
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-snappy-fg">
                Updates
              </h4>
              <div className="flex gap-2 max-w-md">
                <Input
                  type="email"
                  placeholder="Drop your email..."
                  className="rounded-xl flex-1"
                />
                <Button size="sm" className="rounded-xl px-6">
                  JOIN LIST
                </Button>
              </div>
            </div>
            <div className="flex gap-4 flex-wrap">
              {(profile?.socialLinks || []).map((link: any) => {
                let Icon = Globe
                switch (link.platform) {
                  case 'twitter':
                    Icon = Twitter
                    break
                  case 'github':
                    Icon = Github
                    break
                  case 'linkedin':
                    Icon = Linkedin
                    break
                  case 'youtube':
                    Icon = Youtube
                    break
                  case 'dribbble':
                    Icon = Dribbble
                    break
                  case 'instagram':
                    Icon = Instagram
                    break
                  case 'facebook':
                    Icon = Facebook
                    break
                }
                return (
                  <Link
                    key={link.id || link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SocialIcon icon={Icon} />
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Sitemaps */}
          <div className="lg:col-span-12 lg:grid-cols-5 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <FooterCol title="Platform">
              <li>Deploy</li>
              <li>Edge CMS</li>
              <li>Authentication</li>
              <li>Realtime</li>
            </FooterCol>
            <FooterCol title="Developers">
              <li>Documentation</li>
              <li>API Explorer</li>
              <li>SDKs</li>
              <li>Open Source</li>
            </FooterCol>
            <FooterCol title="Company">
              <li>Showcase</li>
              <li>About</li>
              <li>Premium Support</li>
              <li>Contact</li>
            </FooterCol>
          </div>

          {/* Map & Office Widget -"Support Map etc"*/}
          <div className="lg:col-span-12 space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-snappy-fg">
              Global Node
            </h4>
            <div className="relative aspect-video rounded-3xl overflow-hidden border border-snappy-border group cursor-pointer">
              {/* This represents the"Map"support requested */}
              <div className="absolute inset-0 bg-snappy-card flex flex-col items-center justify-center gap-3">
                <div className="w-full h-full bg-[radial-gradient(var(--snappy-accent)_1px,transparent_1px)] [background-size:20px_20px] opacity-20"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                  <div className="relative">
                    <MapPin className="w-10 h-10 text-tertiary animate-bounce" />
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-black/20 rounded-full blur-[2px]" />
                  </div>
                  <p className="text-[10px] font-bold mt-2 uppercase tracking-tighter text-snappy-fg">
                    {profile?.location || 'Global'}
                  </p>
                </div>
              </div>
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="px-3 py-1.5 bg-snappy-card/90 backdrop-blur-md rounded-xl inline-flex items-center gap-2 text-[10px] font-bold shadow-xl">
                  <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse" />
                  SYSTEMS ONLINE
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-snappy-fg/40 mt-0.5" />
                <span className="text-xs font-semibold text-snappy-fg">
                  {profile?.contactEmail}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Globe className="w-4 h-4 text-snappy-fg/40 mt-0.5" />
                <span className="text-xs font-semibold text-snappy-fg">Global Distribution</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-snappy-border flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-3 items-center md:items-start text-center md:text-left">
            <p className="text-xs font-semibold text-snappy-fg/60">
              © {new Date().getFullYear()} {profile?.fullName || 'Portfolio'}. All rights reserved.
            </p>
            <Credit />
          </div>

          <nav className="flex items-center gap-8 text-xs font-bold text-snappy-fg/60 uppercase tracking-widest">
            <Link href="#" className="hover:text-snappy-fg transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-snappy-fg transition-colors">
              Terms
            </Link>
            <Link href="#" className="hover:text-snappy-fg transition-colors">
              Status
            </Link>
            <div className="flex items-center gap-2 px-3 py-1 bg-snappy-card rounded-full border border-snappy-border">
              <ThemeToggle variant="minimal" className="w-5 h-5 bg-transparent border-none p-0" />
              <div className="w-px h-3 bg-snappy-border mx-1" />
              <div className="w-2 h-2 rounded-full bg-secondary shadow-lg shadow-secondary/50" />
              <span className="text-[9px]">Stable Build</span>
            </div>
          </nav>
        </div>
      </div>
    </footer>
  )
}

const FooterCol: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="space-y-6">
    <h4 className="text-sm font-bold uppercase tracking-widest text-snappy-fg">{title}</h4>
    <ul className="space-y-4 text-sm font-medium text-snappy-fg/60">{children}</ul>
  </div>
)

const SocialIcon: React.FC<{ icon: any }> = ({ icon: Icon }) => (
  <button className="p-3 bg-snappy-card border border-snappy-border rounded-xl text-snappy-fg/40 hover:text-snappy-fg hover:shadow-lg transition-all transform hover:-translate-y-1">
    <Icon className="w-4 h-4" />
  </button>
)
