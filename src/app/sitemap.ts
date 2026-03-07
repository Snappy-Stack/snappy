import { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config: configPromise })
  const baseUrl = process.env.PUBLIC_FRONTEND_URL || 'http://localhost:3000'

  const sitemap: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ]

  const staticRoutes = ['/about', '/work', '/process', '/love'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  sitemap.push(...staticRoutes)

  try {
    // Fetch all published Projects
    const projects = await payload.find({
      collection: 'projects' as any,
      depth: 0,
      limit: 1000,
    })

    projects.docs.forEach((project: any) => {
      if (project.slug) {
        sitemap.push({
          url: `${baseUrl}/work/${project.slug}`,
          lastModified: project.updatedAt ? new Date(project.updatedAt) : new Date(),
          changeFrequency: 'monthly',
          priority: 0.7,
        })
      }
    })
  } catch (error) {
    // Fails silently
  }

  try {
    // Fetch all published Posts
    const posts = await payload.find({
      collection: 'posts' as any,
      depth: 0,
      limit: 1000,
    })

    posts.docs.forEach((post: any) => {
      if (post.slug) {
        sitemap.push({
          url: `${baseUrl}/posts/${post.slug}`,
          lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
          changeFrequency: 'monthly',
          priority: 0.6,
        })
      }
    })
  } catch (error) {
    // Fails silently
  }

  return sitemap
}
