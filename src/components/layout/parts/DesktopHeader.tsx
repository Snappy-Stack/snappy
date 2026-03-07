import React from 'react'
import Link from 'next/link'
import { Search, Bell, Globe, ChevronDown, Menu, UserCircle } from 'lucide-react'
import { Logo } from '../../common/Logo'
import { ThemeToggle } from '../../common/ThemeToggle'
import { Button, Input } from '../../ui'
import { UserMenu } from '../../common/UserMenu'
import { getPayload } from '@/lib/payload'
import { cookies } from 'next/headers'

/**
 * Enhanced Desktop Header ("Full Stuff")
 * Flagship header supporting mega-menus, search, and deep navigation.
 */
export const DesktopHeader = async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value

  let user = null
  let profile = null
  let branding = null

  try {
    const payload = await getPayload()

    // Auth check
    if (token) {
      const { user: authUser } = await payload.auth({
        headers: new Headers({
          Authorization: `JWT ${token}`,
        }),
      })
      user = authUser
    }

    // Fetch site data
    profile = (await payload.findGlobal({ slug: 'profile' })) as any
    branding = (await payload.findGlobal({ slug: 'branding', depth: 2 })) as any
  } catch (err) {
    console.warn('Could not fetch data for header', err)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-snappy-border bg-snappy-card/80 backdrop-blur-md">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between gap-8">
        {/* Branding & Primary Nav */}
        <div className="flex items-center gap-10">
          <Logo variant="both" size="md" branding={branding} profile={profile} />

          <nav className="hidden lg:flex items-center gap-1">
            <NavItem label="Solutions" hasDropdown />
            <NavItem label="Infrastructure" hasDropdown />
            <NavItem label="Pricing" />
            <Link
              href="/dashboard"
              className="px-4 py-2 text-sm font-bold text-snappy-fg/60 hover:text-snappy-fg transition-colors"
            >
              Console
            </Link>
          </nav>
        </div>
        {/* Search Bar -"Support Shit"*/}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              <Search className="h-4 w-4 text-snappy-fg/40 group-focus-within:text-secondary transition-colors" />
            </div>
            <Input
              placeholder="Search components, docs, projects..."
              className="pl-11 pr-14 rounded-2xl h-10 border-none bg-background focus-visible:ring-secondary/20"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center gap-1 pointer-events-none">
              <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-snappy-border bg-snappy-card px-1.5 font-mono text-[10px] font-medium text-snappy-fg/40 opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          </div>
        </div>
        {/* Utility & Profile */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <ThemeToggle variant="minimal" />
            <Button variant="ghost" size="icon" className="rounded-full">
              <Globe className="w-5 h-5 text-snappy-fg/60" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="w-5 h-5 text-snappy-fg/60" />
            </Button>
          </div>

          <div className="h-8 w-px bg-snappy-border mx-2 hidden sm:block" />

          {user ? (
            <div className="flex items-center gap-3">
              <UserMenu user={user} profileImage={profile?.profileImage} />
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden sm:block text-sm font-bold text-snappy-fg hover:underline"
              >
                Sign In
              </Link>
              <Link href="/login">
                <Button className="rounded-2xl px-6 text-xs shadow-none">GET STARTED</Button>
              </Link>
            </>
          )}

          <Button variant="ghost" size="icon" className="lg:hidden rounded-full">
            <Menu className="w-6 h-6 text-snappy-fg/60" />
          </Button>
        </div>
      </div>
    </header>
  )
}

const NavItem: React.FC<{ label: string; hasDropdown?: boolean }> = ({ label, hasDropdown }) => (
  <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-snappy-fg/60 hover:text-snappy-fg transition-colors group">
    {label}
    {hasDropdown && (
      <ChevronDown className="w-3.5 h-3.5 text-snappy-fg/40 group-hover:text-snappy-fg transition-colors" />
    )}
  </button>
)
