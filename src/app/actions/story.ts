'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { revalidatePath } from 'next/cache'

export async function updateStory(data: any) {
  try {
    const payload = await getPayload({ config: configPromise })

    const doc = await payload.updateGlobal({
      slug: 'about-story',
      data,
    })

    revalidatePath('/dashboard')
    revalidatePath('/about')

    return { success: true, doc }
  } catch (error) {
    console.error('Failed to update story:', error)
    throw new Error('Failed to update story')
  }
}
