import { Metadata } from 'next'
import React from 'react'
import { getProfile, getSEO } from '@/lib/queries'
import { ProfileHero } from '@/components/portfolio/ProfileHero'
import { AdaptiveHub } from '@/components/layout/AdaptiveHub'

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO()

  return {
    title: (seo as any)?.defaultMetaTitle || 'Home',
    description: (seo as any)?.defaultMetaDescription || 'The premium industrial portfolio.',
  }
}

export default async function HomePage() {
  // Fetch the new Profile global safely
  let profile = null
  try {
    profile = await getProfile()
  } catch (error) {
    console.warn('Collections not yet initialized in database', error)
  }

  return (
    <AdaptiveHub type="portfolio">
      <section className="flex-1 flex flex-col justify-center">
        <ProfileHero initialProfile={profile} />
      </section>
    </AdaptiveHub>
  )
}
