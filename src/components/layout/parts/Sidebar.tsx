import React from 'react'
import Link from 'next/link'
import { LayoutDashboard, Settings, FolderGit2, FileText } from 'lucide-react'
import { Logo } from '../../common/Logo'
import { ThemeToggle } from '../../common/ThemeToggle'
import { getMediaUrl } from '@/lib/utils'
import Image from 'next/image'
import { Credit } from './Credit'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'

export const Sidebar = async () => {
  const payload = await getPayload({ config: configPromise })
  const branding = (await payload.findGlobal({ slug: 'branding', depth: 2 })) as any
  const profile = (await payload.findGlobal({ slug: 'profile' })) as any

  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Site Settings', href: '/dashboard/settings', icon: Settings },
    { label: 'Projects', href: '/dashboard/projects', icon: FolderGit2 },
    { label: 'Blog Posts', href: '/dashboard/posts', icon: FileText },
  ]

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 flex-col bg-snappy-card border-r border-snappy-border">
      <div className="flex h-20 items-center px-6 border-b border-snappy-border justify-between">
        <Logo size="md" branding={branding} profile={profile} />
        <div className="w-10 h-10 rounded-xl bg-background border border-snappy-border overflow-hidden relative shadow-sm">
          {profile?.profileImage ? (
            <Image
              src={getMediaUrl(profile.profileImage) || ''}
              alt={profile.fullName || 'User'}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs font-black text-primary/40 bg-primary/5">
              {profile?.fullName?.charAt(0) || 'U'}
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-snappy-fg/60 rounded-xl hover:bg-background hover:text-snappy-fg transition-all group"
          >
            <item.icon className="h-4 w-4 text-snappy-fg/40 group-hover:text-snappy-fg transition-colors" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 space-y-4 border-t border-snappy-border">
        <ThemeToggle variant="labeled" />
        <div className="pt-2">
          <Credit />
        </div>
      </div>
    </aside>
  )
}
