import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { getProjects, getSEO } from '@/lib/queries'
import { AdaptiveHub } from '@/components/layout/AdaptiveHub'

const ProjectsShowcase = dynamic(() =>
  import('@/components/portfolio/ProjectsShowcase').then((m) => m.ProjectsShowcase),
)
const MobileProjects = dynamic(() =>
  import('@/components/portfolio/MobileProjects').then((m) => m.MobileProjects),
)

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO()

  return {
    title: 'Work',
    description:
      (seo as any)?.workMetaDescription ||
      'A curated selection of digital experiences and experiments.',
  }
}

export default async function WorkPage() {
  const projectDocs = await getProjects()

  // Normalize data for the UI
  const projects = (projectDocs || []).map((p: any) => ({
    id: p.id,
    title: p.title,
    category: p.category || 'Digital Experience',
    slug: p.slug,
    featuredImage: p.featuredImage,
    accentColor: p.accentColor || 'var(--primary)',
  }))

  return (
    <AdaptiveHub type="portfolio">
      <ProjectsShowcase initialProjects={projects} />
      <MobileProjects serverUrl="" initialProjects={projects} />
    </AdaptiveHub>
  )
}
