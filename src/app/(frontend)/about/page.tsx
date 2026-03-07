import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { getProfile, getSEO, getAboutStory } from '@/lib/queries'
import { AdaptiveHub } from '@/components/layout/AdaptiveHub'

const AboutStory = dynamic(() =>
  import('@/components/portfolio/AboutStory').then((m) => m.AboutStory),
)
const MobileAboutStory = dynamic(() =>
  import('@/components/portfolio/MobileAboutStory').then((m) => m.MobileAboutStory),
)

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO()

  return {
    title: 'About',
    description:
      (seo as any)?.aboutMetaDescription || 'The story and timeline of a creative professional.',
  }
}

export default async function AboutPage() {
  const [profileData, storyData] = await Promise.all([getProfile(), getAboutStory()])

  const introSlide = {
    id: 'intro',
    type: 'profile',
    year: null,
    label: null,
    headline: profileData?.fullName ? `${profileData.fullName}.` : 'Creative.',
    body:
      profileData?.bioShort ||
      'A professional dedicated to crafting excellent digital experiences and solving problems.',
    disciplines: profileData?.disciplines?.map((d: any) => d.name) || [
      'Design',
      'Development',
      'Strategy',
    ],
    profileImage: profileData?.profileImage,
    dark: false,
  }

  const chapterSlides =
    (storyData as any)?.chapters?.map((ch: any, i: number) => ({
      id: `ch-${i}`,
      type: 'chapter',
      year: ch.year,
      label: ch.label,
      headline: ch.headline,
      body: ch.body,
      dark: ch.dark,
      layoutStyle: ch.layoutStyle,
      milestoneIcon: ch.milestoneIcon,
    })) || []

  const slides = [introSlide, ...chapterSlides]

  return (
    <AdaptiveHub type="portfolio">
      <AboutStory serverUrl="" initialSlides={slides} />
      <MobileAboutStory serverUrl="" initialSlides={slides} />
    </AdaptiveHub>
  )
}
