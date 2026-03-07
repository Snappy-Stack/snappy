import { getMediaUrl } from '@/lib/utils'
import Image from 'next/image'

interface HubHeroProps {
  profile: any
}

export const HubHero: React.FC<HubHeroProps> = ({ profile }) => {
  return (
    <div className="flex items-center gap-6">
      <div className="w-20 h-20 rounded-[2rem] bg-snappy-card border border-snappy-border flex items-center justify-center overflow-hidden relative shadow-xl shadow-primary/5">
        {profile?.profileImage ? (
          <Image
            src={getMediaUrl(profile.profileImage) || ''}
            alt={profile.fullName || 'User'}
            fill
            className="object-cover"
          />
        ) : (
          <div className="text-2xl font-black text-primary/40">
            {profile?.fullName?.charAt(0) || 'U'}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-foreground tracking-tight">
          Hi, {profile?.fullName?.split(' ')[0] || 'there'}!
        </h1>
        <p className="text-snappy-fg/50 font-medium">
          Manage your portfolio&apos;s identity and content from one place.
        </p>
      </div>
    </div>
  )
}
