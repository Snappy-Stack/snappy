'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { updateSiteSettings } from '@/app/actions/settings'
import { toast } from 'sonner'
import { MediaUploader } from '../MediaUploader'
import {
  Plus,
  Trash2,
  Twitter,
  Github,
  Linkedin,
  Dribbble,
  Instagram,
  Youtube,
  Facebook,
  Globe,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export const ProfileForm = ({
  data: initialData,
  onSuccess,
}: {
  data: any
  onSuccess: () => void
}) => {
  const [data, setData] = useState(initialData)
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const result = await updateSiteSettings({
        profile: data,
      })

      if (result.success) {
        toast.success('Profile updated!')
        onSuccess()
      }
    } catch (error) {
      console.error(error)
      toast.error('Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form id="profile-form" onSubmit={handleSubmit} className="space-y-6 py-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={data.fullName || ''}
              onChange={(e) => setData({ ...data, fullName: e.target.value })}
              placeholder="e.g. John Doe"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bioShort">Bio / Tagline</Label>
            <Textarea
              id="bioShort"
              value={data.bioShort || ''}
              onChange={(e) => setData({ ...data, bioShort: e.target.value })}
              placeholder="A short sentence about you..."
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={data.location || ''}
                onChange={(e) => setData({ ...data, location: e.target.value })}
                placeholder="e.g. New York, NY"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Public Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={data.contactEmail || ''}
                onChange={(e) => setData({ ...data, contactEmail: e.target.value })}
                placeholder="hello@example.com"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-snappy-border/30">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-snappy-fg/40">
                Social Links
              </h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 rounded-lg text-xs gap-1 font-bold border-snappy-border bg-snappy-card/50 hover:bg-snappy-card"
                onClick={() => {
                  const currentLinks = data.socialLinks || []
                  setData({
                    ...data,
                    socialLinks: [...currentLinks, { platform: 'twitter', url: '' }],
                  })
                }}
              >
                <Plus className="w-3 h-3" /> Add Link
              </Button>
            </div>

            <div className="space-y-3">
              {(data.socialLinks || []).map((link: any, index: number) => (
                <div key={link.id || index} className="flex gap-2 items-start">
                  <div className="w-32">
                    <SocialIconPicker
                      value={link.platform}
                      onChange={(newPlatform) => {
                        const newLinks = [...data.socialLinks]
                        newLinks[index].platform = newPlatform
                        setData({ ...data, socialLinks: newLinks })
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      value={link.url}
                      onChange={(e) => {
                        const newLinks = [...data.socialLinks]
                        newLinks[index].url = e.target.value
                        setData({ ...data, socialLinks: newLinks })
                      }}
                      placeholder="https://..."
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 text-snappy-fg/40 hover:text-snappy-fg hover:bg-snappy-card flex-shrink-0 transition-colors"
                    onClick={() => {
                      const newLinks = data.socialLinks.filter((_: any, i: number) => i !== index)
                      setData({ ...data, socialLinks: newLinks })
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {(!data.socialLinks || data.socialLinks.length === 0) && (
                <div className="p-4 rounded-xl border border-dashed border-snappy-border/50 bg-snappy-card/10 text-center">
                  <p className="text-xs text-snappy-fg/40 font-medium">
                    No social links added yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <MediaUploader
            label="Profile Picture"
            currentValue={data.profileImage}
            aspectRatio="square"
            onUpload={(media) => setData({ ...data, profileImage: media })}
          />
          <MediaUploader
            label="Resume / CV (PDF)"
            currentValue={data.resume}
            category="other"
            onUpload={(media) => setData({ ...data, resume: media })}
          />
        </div>
      </div>
    </form>
  )
}

const PLATFORMS = [
  { value: 'twitter', label: 'Twitter / X', icon: Twitter },
  { value: 'github', label: 'GitHub', icon: Github },
  { value: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { value: 'dribbble', label: 'Dribbble', icon: Dribbble },
  { value: 'instagram', label: 'Instagram', icon: Instagram },
  { value: 'youtube', label: 'YouTube', icon: Youtube },
  { value: 'facebook', label: 'Facebook', icon: Facebook },
  { value: 'website', label: 'Website / Other', icon: Globe },
]

const SocialIconPicker = ({
  value,
  onChange,
}: {
  value: string
  onChange: (val: string) => void
}) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selected = PLATFORMS.find((p) => p.value === value) || PLATFORMS[0]
  const Icon = selected.icon

  return (
    <div className="relative w-full" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-10 px-3 flex items-center justify-between rounded-xl bg-snappy-card/20 border border-snappy-border hover:border-primary/50 transition-colors text-xs font-bold text-snappy-fg focus:outline-none"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-snappy-fg/60" />
          <span className="truncate">{selected.label}</span>
        </div>
        <ChevronDown
          className={`w-3 h-3 text-snappy-fg/40 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-48 left-0 bg-background border border-snappy-border rounded-xl shadow-2xl overflow-hidden py-1">
          {PLATFORMS.map((platform) => {
            const PIcon = platform.icon
            return (
              <button
                key={platform.value}
                type="button"
                onClick={() => {
                  onChange(platform.value)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-bold transition-all ${
                  value === platform.value
                    ? 'bg-primary/20 text-primary'
                    : 'text-snappy-fg/60 hover:bg-snappy-card/50 hover:text-snappy-fg'
                }`}
              >
                <PIcon className="w-4 h-4" />
                {platform.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
