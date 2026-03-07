import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { AdaptiveHub } from '@/components/layout/AdaptiveHub'

const ProcessShowcase = dynamic(() =>
  import('@/components/portfolio/ProcessShowcase').then((m) => m.ProcessShowcase),
)
const MobileProcess = dynamic(() =>
  import('@/components/portfolio/MobileProcess').then((m) => m.MobileProcess),
)

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload({ config: configPromise })
  const seo = await payload.findGlobal({ slug: 'seo' })

  return {
    title: 'Process',
    description: (seo as any)?.processMetaDescription || 'Engineering Core and workflow showcase.',
  }
}

export default async function ProcessPage() {
  const payload = await getPayload({ config: configPromise })
  const processData = await payload.findGlobal({ slug: 'process' })

  const slides =
    (processData as any)?.steps?.map((step: any, i: number) => ({
      id: `step-${i}`,
      title: step.stepName,
      project: (processData as any)?.title || 'Process',
      slug: 'process',
      date: `Step ${i + 1}`,
      excerpt: step.description,
      featuredImage: step.icon,
      gallery: [],
    })) || []

  return (
    <AdaptiveHub type="portfolio">
      <ProcessShowcase serverUrl="" initialSlides={slides} />
      <MobileProcess serverUrl="" initialSlides={slides} />
    </AdaptiveHub>
  )
}
