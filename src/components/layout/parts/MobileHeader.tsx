import React from 'react'
import { Logo } from '../../common/Logo'
import { cookies } from 'next/headers'
import { getPayload } from '@/lib/payload'
import { UserMenu } from '../../common/UserMenu'

export const MobileHeader = async ({
  title,
  actions,
}: {
  title?: string
  actions?: React.ReactNode
}) => {
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
    console.warn('Could not fetch data for mobile header', err)
  }

  return (
    <header className="sticky top-0 z-40 bg-snappy-card/80 backdrop-blur-md border-b border-snappy-border">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Logo variant="both" size="sm" branding={branding} profile={profile} />
          {title && (
            <span className="text-sm font-semibold tracking-tight text-snappy-fg">{title}</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {user ? <UserMenu user={user} profileImage={profile?.profileImage} /> : actions}
        </div>
      </div>
    </header>
  )
}
