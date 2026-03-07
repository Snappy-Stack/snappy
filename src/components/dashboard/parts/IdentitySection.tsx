import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Settings, User, Palette, ChevronRight, Search } from 'lucide-react'
import { getMediaUrl } from '@/lib/utils'
import Image from 'next/image'

interface IdentitySectionProps {
  profile: any
  onOpenProfile: () => void
  onOpenBranding: () => void
  onOpenSEO: () => void
}

export const IdentitySection: React.FC<IdentitySectionProps> = ({
  profile,
  onOpenProfile,
  onOpenBranding,
  onOpenSEO,
}) => {
  const items = [
    {
      icon: User,
      label: 'Profile Info',
      sub: profile?.fullName || 'No name set',
      onClick: onOpenProfile,
    },
    {
      icon: Palette,
      label: 'Visual Branding',
      sub: 'Colors & Logo',
      onClick: onOpenBranding,
    },
    {
      icon: Search,
      label: 'SEO & Meta',
      sub: 'Title, description & analytics',
      onClick: onOpenSEO,
    },
  ]

  return (
    <Card className="bg-snappy-card border-snappy-border overflow-hidden hover:border-primary/30 transition-colors">
      <CardHeader className="pb-4 border-b border-snappy-border mb-4">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg">Site Identity</CardTitle>
        </div>
        <CardDescription>Update your profile and branding</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map(({ icon: Icon, label, sub, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-background border border-snappy-border hover:bg-snappy-card hover:border-primary/20 transition-all group text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors overflow-hidden relative">
                {label === 'Profile Info' && profile?.profileImage ? (
                  <Image
                    src={getMediaUrl(profile.profileImage) || ''}
                    alt={profile.fullName || 'User'}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <Icon className="w-5 h-5 text-primary" />
                )}
              </div>
              <div>
                <div className="text-sm font-semibold">{label}</div>
                <div className="text-xs text-snappy-fg/50">{sub}</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-snappy-fg/30 group-hover:text-primary transition-colors" />
          </button>
        ))}
      </CardContent>
    </Card>
  )
}
