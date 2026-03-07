'use client'

import React, { useState } from 'react'
import { updateSiteSettings } from '@/app/actions/settings'
import { toast } from 'sonner'
import { MediaUploader } from '../MediaUploader'
import { cn } from '@/lib/utils'
import {
  Sun,
  Moon,
  Sparkles,
  Image as ImageIcon,
  LayoutTemplate,
  Type,
  CheckCircle2,
} from 'lucide-react'

export const BrandingForm = ({
  data: initialData,
  profile,
  onSuccess,
}: {
  data: any
  profile: any
  onSuccess: () => void
}) => {
  const [data, setData] = useState(initialData)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'light' | 'dark'>('light') // For Logo theme toggle
  const [typeTab, setTypeTab] = useState<'assets' | 'identity'>('assets') // High-level tabs

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const result = await updateSiteSettings({
        branding: data,
      })

      if (result.success) {
        toast.success('Branding updated!')
        onSuccess()
      }
    } catch (error) {
      console.error(error)
      toast.error('Failed to update branding')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form id="branding-form" onSubmit={handleSubmit} className="space-y-10 py-4 max-w-5xl mx-auto">
      {/* High-level Type Tabs */}
      <div className="flex justify-center mb-8">
        <div className="p-1 bg-snappy-card border border-snappy-border rounded-2xl flex items-center gap-1 shadow-md">
          <button
            type="button"
            onClick={() => setTypeTab('assets')}
            className={cn(
              'px-6 py-2.5 rounded-xl flex items-center gap-2.5 transition-all duration-300 font-bold uppercase tracking-wider text-[11px]',
              typeTab === 'assets'
                ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                : 'text-snappy-fg/40 hover:text-snappy-fg hover:bg-snappy-card',
            )}
          >
            <LayoutTemplate className="w-3.5 h-3.5" />
            Logo Assets
          </button>
          <button
            type="button"
            onClick={() => setTypeTab('identity')}
            className={cn(
              'px-6 py-2.5 rounded-xl flex items-center gap-2.5 transition-all duration-300 font-bold uppercase tracking-wider text-[11px]',
              typeTab === 'identity'
                ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                : 'text-snappy-fg/40 hover:text-snappy-fg hover:bg-snappy-card',
            )}
          >
            <Type className="w-3.5 h-3.5" />
            Brand Identity
          </button>
        </div>
      </div>

      {typeTab === 'assets' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {/* Logo Mode Toggle (Unified vs Theme-specific) */}
          <div className="p-4 rounded-3xl bg-snappy-card/20 border border-snappy-border/50 flex items-center justify-between group hover:border-primary/30 transition-all">
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  'w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500',
                  data.useUnifiedLogo
                    ? 'bg-primary/20 border-primary/30 text-primary shadow-lg shadow-primary/20'
                    : 'bg-snappy-fg/5 border-snappy-border text-snappy-fg/40',
                )}
              >
                <Sparkles className={cn('w-5 h-5', data.useUnifiedLogo ? 'animate-pulse' : '')} />
              </div>
              <div className="text-left">
                <p className="font-black text-xs uppercase tracking-widest text-snappy-fg/80">
                  Use Unified Logo
                </p>
                <p className="text-[10px] text-snappy-fg/40 font-bold uppercase mt-0.5">
                  Single asset for both light and dark modes
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setData({ ...data, useUnifiedLogo: !data.useUnifiedLogo })}
              className={cn(
                'relative w-14 h-8 rounded-full transition-all duration-500 p-1',
                data.useUnifiedLogo ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-snappy-fg/10',
              )}
            >
              <div
                className={cn(
                  'w-6 h-6 rounded-full bg-white shadow-md transition-all duration-500 transform',
                  data.useUnifiedLogo ? 'translate-x-6' : 'translate-x-0',
                )}
              />
            </button>
          </div>

          {!data.useUnifiedLogo && (
            <div className="flex justify-center">
              <div className="p-1 bg-snappy-card/50 border border-snappy-border rounded-[1.5rem] flex items-center gap-1 shadow-inner backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => setActiveTab('light')}
                  className={cn(
                    'px-6 py-2.5 rounded-[1.2rem] flex items-center gap-2.5 transition-all duration-300 font-bold uppercase tracking-widest text-[9px]',
                    activeTab === 'light'
                      ? 'bg-white/10 dark:bg-white/5 border border-white/20 text-snappy-fg shadow-lg'
                      : 'text-snappy-fg/40 hover:text-snappy-fg',
                  )}
                >
                  <Sun className="w-3 h-3" />
                  Light Theme
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('dark')}
                  className={cn(
                    'px-6 py-2.5 rounded-[1.2rem] flex items-center gap-2.5 transition-all duration-300 font-bold uppercase tracking-widest text-[9px]',
                    activeTab === 'dark'
                      ? 'bg-white/10 dark:bg-white/5 border border-white/20 text-snappy-fg shadow-lg'
                      : 'text-snappy-fg/40 hover:text-snappy-fg',
                  )}
                >
                  <Moon className="w-3 h-3" />
                  Dark Theme
                </button>
              </div>
            </div>
          )}

          <div className="relative">
            {/* Light Mode Section / Unified Section */}
            {(activeTab === 'light' || data.useUnifiedLogo) && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6 p-8 rounded-[2.5rem] bg-snappy-card/30 border-2 border-snappy-border hover:border-primary/20 transition-all group shadow-xl">
                <div className="flex items-center gap-3 pb-4 border-b border-snappy-border/50">
                  <div className="p-2.5 bg-warning/20 rounded-2xl text-warning">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-xs uppercase tracking-[0.2em] text-snappy-fg/80">
                      Primary Brand Assets
                    </h4>
                    <p className="text-[10px] text-snappy-fg/40 font-bold uppercase mt-0.5">
                      {data.useUnifiedLogo
                        ? 'Used consistently across both themes'
                        : 'For clear/white backgrounds'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                  <MediaUploader
                    label="Primary Logo"
                    currentValue={data.logo}
                    category="logo"
                    onUpload={(media) => setData({ ...data, logo: media })}
                  />
                  <MediaUploader
                    label="Favicon / Icon"
                    currentValue={data.favicon}
                    aspectRatio="square"
                    category="favicon"
                    onUpload={(media) => setData({ ...data, favicon: media })}
                  />
                </div>
              </div>
            )}

            {/* Dark Mode Section */}
            {activeTab === 'dark' && !data.useUnifiedLogo && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6 p-8 rounded-[2.5rem] bg-snappy-card/30 border-2 border-snappy-border hover:border-primary/20 transition-all group shadow-xl">
                <div className="flex items-center gap-3 pb-4 border-b border-snappy-border/50">
                  <div className="p-2.5 bg-primary/20 rounded-2xl text-primary">
                    <Moon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-xs uppercase tracking-[0.2em] text-snappy-fg/80">
                      Dark Theme Assets
                    </h4>
                    <p className="text-[10px] text-snappy-fg/40 font-bold uppercase mt-0.5">
                      For dark/gradient backgrounds
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                  <MediaUploader
                    label="Theme Logo"
                    currentValue={data.logoDark}
                    category="logo"
                    onUpload={(media) => setData({ ...data, logoDark: media })}
                  />
                  <MediaUploader
                    label="Theme Icon"
                    currentValue={data.faviconDark}
                    aspectRatio="square"
                    category="favicon"
                    onUpload={(media) => setData({ ...data, faviconDark: media })}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {typeTab === 'identity' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="p-8 rounded-[2.5rem] bg-snappy-card/30 border-2 border-snappy-border hover:border-primary/20 transition-all group shadow-xl">
            <div className="flex items-center gap-3 pb-6 border-b border-snappy-border/50 mb-8">
              <div className="p-2.5 bg-primary/20 rounded-2xl text-primary">
                <Type className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-xs uppercase tracking-[0.2em] text-snappy-fg/80">
                  Brand Typography
                </h4>
                <p className="text-[10px] text-snappy-fg/40 font-bold uppercase mt-0.5">
                  Fallback text when no logo image is provided
                </p>
              </div>
            </div>

            <div className="space-y-4 max-w-xl">
              <label className="text-xs font-black uppercase tracking-widest text-snappy-fg/60 px-1">
                Logo Text
              </label>
              <div className="relative group/input">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within/input:text-primary transition-colors">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={data.logoText || ''}
                  onChange={(e) => setData({ ...data, logoText: e.target.value })}
                  placeholder={profile.fullName || 'SNAPPY'}
                  className="w-full h-14 pl-12 pr-4 bg-background border border-snappy-border rounded-2xl focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-bold text-sm tracking-tight"
                />
              </div>
              <p className="text-[10px] text-snappy-fg/30 font-bold italic px-1">
                If left empty, the site will use your full name instead.
              </p>
            </div>
          </div>
        </div>
      )}
    </form>
  )
}
