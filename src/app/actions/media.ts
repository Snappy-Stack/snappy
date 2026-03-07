'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { revalidatePath } from 'next/cache'

export async function uploadMedia(formData: FormData) {
  try {
    const payload = await getPayload({ config: configPromise })

    const file = formData.get('file') as File
    const alt = (formData.get('alt') as string) || 'Uploaded media'
    const category = ((formData.get('category') as string) || 'other') as
      | 'brand'
      | 'logo'
      | 'favicon'
      | 'project'
      | 'post'
      | 'other'

    if (!file) {
      throw new Error('No file provided')
    }

    // Convert File to Buffer for Payload
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const doc = await payload.create({
      collection: 'media',
      data: {
        alt,
        category,
      },
      file: {
        data: buffer,
        name: file.name,
        mimetype: file.type,
        size: file.size,
      },
    })

    return { success: true, doc }
  } catch (error) {
    console.error('Media upload failed:', error)
    return { success: false, error: 'Upload failed' }
  }
}

export async function deleteMediaBulk(ids: (string | number)[]) {
  try {
    const payload = await getPayload({ config: configPromise })
    await Promise.all(
      ids.map((id) =>
        payload.delete({
          collection: 'media',
          id,
        }),
      ),
    )
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Bulk media deletion failed:', error)
    return { success: false, error: 'Bulk deletion failed' }
  }
}

export async function updateMediaMetadata(
  id: string,
  data: {
    alt?: string
    category?: 'brand' | 'logo' | 'favicon' | 'project' | 'post' | 'other'
    tags?: string[]
  },
) {
  const payload = await getPayload({ config: configPromise })

  try {
    const updated = await payload.update({
      collection: 'media',
      id,
      data,
    })

    revalidatePath('/dashboard')
    return { success: true, doc: updated }
  } catch (error) {
    console.error('Update media error:', error)
    return { success: false, error: 'Failed to update media' }
  }
}

export async function getMediaList() {
  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'media',
      sort: '-createdAt',
      limit: 100,
    })
    return { success: true, docs: result.docs }
  } catch (error) {
    console.error('Failed to fetch media list:', error)
    return { success: false, error: 'Fetch failed' }
  }
}
