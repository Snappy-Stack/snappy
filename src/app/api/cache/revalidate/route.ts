/**
 * Cache Revalidation Endpoint
 *
 * Purge specific cache tags on-demand. Call this from Payload webhooks,
 * Vercel deployment hooks, or manually to bust the edge cache.
 *
 * Usage:
 *   POST /api/cache/revalidate
 *   Body: { "tag": "projects", "secret": "REVALIDATE_SECRET" }
 *
 * Valid tags: projects | profile | seo | branding | reviews | process | about-story
 */

import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

const VALID_TAGS = ['projects', 'profile', 'seo', 'branding', 'reviews', 'process', 'about-story']

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { tag, secret } = body

    // Auth check
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Validate tag
    if (!tag || !VALID_TAGS.includes(tag)) {
      return NextResponse.json(
        { error: `Invalid tag. Must be one of: ${VALID_TAGS.join(', ')}` },
        { status: 400 },
      )
    }

    revalidateTag(tag, {})
    return NextResponse.json({ revalidated: true, tag, timestamp: Date.now() })
  } catch (_err) {
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 })
  }
}
