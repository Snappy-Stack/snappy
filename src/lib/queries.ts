/**
 * Central Cached Query Layer
 *
 * All Payload data queries go through `unstable_cache`, which stores results
 * in Vercel's Data Cache (Edge). This means:
 *   - Request 1: Hits Payload/Cloudflare → stored at edge
 *   - Request 2+: Served from edge in <50ms (no DB round-trip)
 *   - After TTL: Revalidated in background (stale-while-revalidate)
 *
 * To bust a cache manually: call `revalidateTag('tag-name')` from a Route Handler.
 */

import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

// ─────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────

async function getPayloadClient() {
  return getPayload({ config: configPromise })
}

// ─────────────────────────────────────────────────────────────────
// GLOBALS — long TTL (1 hour), rarely change
// ─────────────────────────────────────────────────────────────────

export const getProfile = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    return payload.findGlobal({ slug: 'profile', depth: 1 })
  },
  ['profile'],
  { revalidate: 3600, tags: ['profile'] },
)

export const getSEO = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    return payload.findGlobal({ slug: 'seo' })
  },
  ['seo'],
  { revalidate: 3600, tags: ['seo'] },
)

export const getBranding = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    return payload.findGlobal({ slug: 'branding', depth: 2 })
  },
  ['branding'],
  { revalidate: 3600, tags: ['branding'] },
)

export const getAboutStory = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    return payload.findGlobal({ slug: 'about-story' })
  },
  ['about-story'],
  { revalidate: 3600, tags: ['about-story'] },
)

export const getProcessData = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    return payload.findGlobal({ slug: 'process' })
  },
  ['process'],
  { revalidate: 3600, tags: ['process'] },
)

// ─────────────────────────────────────────────────────────────────
// COLLECTIONS — medium TTL (5 min), updated more frequently
// ─────────────────────────────────────────────────────────────────

export const getProjects = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'projects',
      sort: 'order',
      depth: 1,
    })
    return result.docs
  },
  ['projects'],
  { revalidate: 300, tags: ['projects'] },
)

export const getProjectBySlug = unstable_cache(
  async (slug: string) => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'projects',
      where: {
        slug: { equals: slug },
        status: { equals: 'published' },
      },
      depth: 2,
    })
    return result.docs[0] ?? null
  },
  ['project-by-slug'],
  { revalidate: 300, tags: ['projects'] },
)

export const getReviews = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'reviews',
      where: { status: { equals: 'published' } },
      sort: '-createdAt',
      limit: 100,
      depth: 1,
    })
    return result.docs
  },
  ['reviews'],
  { revalidate: 300, tags: ['reviews'] },
)

export const getPosts = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'posts',
      where: { status: { equals: 'published' } },
      sort: '-createdAt',
      depth: 1,
    })
    return result.docs
  },
  ['posts'],
  { revalidate: 300, tags: ['posts'] },
)

export const getAverageRating = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'reviews',
      where: { status: { equals: 'published' } },
      select: { rating: true },
      limit: 1000,
      depth: 0,
    })

    const validRatings = result.docs.filter((d) => typeof d.rating === 'number')
    const total = validRatings.length
    const average =
      total > 0 ? validRatings.reduce((acc, curr) => acc + (curr.rating || 0), 0) / total : 0

    return { average: average.toFixed(1), total }
  },
  ['average-rating'],
  { revalidate: 300, tags: ['reviews'] },
)
