import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { MinimalDashboardTemplate } from '@/components/layout/templates/MinimalDashboardTemplate'
import { ControlHub } from '@/components/dashboard/ControlHub'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard | SNAPPY',
  description: 'Manage your portfolio, content, and system settings.',
  robots: {
    index: false,
    follow: false,
  },
}

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const payload = await getPayload({ config: configPromise })

  const [profile, branding, seo, story, projects, posts, reviews] = await Promise.all([
    payload.findGlobal({ slug: 'profile' }),
    payload.findGlobal({ slug: 'branding' }),
    payload.findGlobal({ slug: 'seo' }),
    payload.findGlobal({ slug: 'about-story' }),
    payload.find({
      collection: 'projects',
      sort: '-createdAt',
      limit: 100,
    }),
    payload.find({
      collection: 'posts',
      sort: '-publishedAt',
      limit: 100,
    }),
    payload.find({
      collection: 'reviews',
      sort: '-createdAt',
      limit: 100,
    }),
  ])

  return (
    <MinimalDashboardTemplate>
      <ControlHub
        initialData={{
          profile,
          branding,
          seo,
          projects: projects.docs,
          posts: posts.docs,
          reviews: reviews.docs,
          story,
        }}
      />
    </MinimalDashboardTemplate>
  )
}
