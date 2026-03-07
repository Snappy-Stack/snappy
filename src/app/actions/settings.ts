'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function updateSiteSettings(data: any) {
  const payload = await getPayload({ config: configPromise })

  try {
    if (data.profile) {
      await payload.updateGlobal({
        slug: 'profile',
        data: data.profile,
      })
    }

    if (data.branding) {
      await payload.updateGlobal({
        slug: 'branding',
        data: data.branding,
      })
    }

    if (data.seo) {
      await payload.updateGlobal({
        slug: 'seo',
        data: data.seo,
      })
    }

    return { success: true }
  } catch (error) {
    console.error('Failed to update site settings:', error)
    throw new Error('Failed to update site settings')
  }
}

export async function getSiteSettings() {
  const payload = await getPayload({ config: configPromise })

  const profile = await payload.findGlobal({ slug: 'profile' })
  const branding = await payload.findGlobal({ slug: 'branding' })
  const seo = await payload.findGlobal({ slug: 'seo' })

  return { profile, branding, seo }
}
