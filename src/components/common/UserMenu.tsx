'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { UserCircle, LayoutDashboard, LogOut, ChevronDown } from 'lucide-react'
import { logout } from '@/app/(frontend)/login/actions'
import { Button } from '@/components/ui'

import { getMediaUrl } from '@/lib/utils'

interface UserMenuProps {
  user: any
  profileImage?: any
}

export const UserMenu: React.FC<UserMenuProps> = ({ user, profileImage }) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close the menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await logout()
  }

  const role = user.roles?.[0] || 'User'

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:bg-snappy-border/30 p-1.5 pr-3 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden">
          {profileImage ? (
            <img
              src={getMediaUrl(profileImage) || ''}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <UserCircle className="w-5 h-5 text-primary" />
          )}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-xs font-bold text-foreground leading-tight">
            {user.email?.split('@')[0]}
          </p>
          <p className="text-[10px] font-medium text-foreground/50 capitalize">
            {role.replace('-', ' ')}
          </p>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-snappy-fg/40 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl bg-snappy-card border border-snappy-border shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
          <div className="px-4 py-3 border-b border-snappy-border/50 bg-background/50">
            <p className="text-sm font-medium text-foreground truncate">{user.email}</p>
            <p className="text-xs text-foreground/50 truncate">Role: {role}</p>
          </div>
          <div className="p-2 space-y-1">
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-snappy-border/30 rounded-lg transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-primary" />
              Console Dashboard
            </Link>
          </div>
          <div className="p-2 border-t border-snappy-border/50">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-tertiary hover:bg-tertiary/10 rounded-lg transition-colors text-left"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
