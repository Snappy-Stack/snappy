import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.PUBLIC_FRONTEND_URL || 'http://localhost:3000'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/admin/*', '/api/', '/dashboard/', '/dashboard/*'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
