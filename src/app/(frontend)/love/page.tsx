import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { AdaptiveHub } from '@/components/layout/AdaptiveHub'
import { WallOfLove } from '@/components/portfolio/WallOfLove'
import { MobileWallOfLove } from '@/components/portfolio/MobileWallOfLove'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload({ config: configPromise })
  const seo = await payload.findGlobal({ slug: 'seo' })

  return {
    title: 'Love',
    description:
      (seo as any)?.loveMetaDescription || 'What clients and partners say about our collaboration.',
  }
}

export default async function LovePage() {
  const payload = await getPayload({ config: configPromise })

  const { docs: reviews } = (await payload.find({
    collection: 'reviews',
    where: {
      status: {
        equals: 'published',
      },
    },
    sort: '-createdAt',
    limit: 100,
    depth: 1,
  })) as any

  return (
    <AdaptiveHub type="portfolio">
      <WallOfLove reviews={reviews} />
      <MobileWallOfLove reviews={reviews} />
    </AdaptiveHub>
  )
}
