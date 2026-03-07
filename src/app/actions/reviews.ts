'use server'

import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { revalidatePath } from 'next/cache'

export async function submitReview(
  slug: string,
  rating: number,
  comment: string,
  avatarId?: string | number,
  pin?: string,
) {
  if (!slug || !rating || rating < 1 || rating > 5 || !pin) {
    return { success: false, error: 'Invalid review data provided.' }
  }

  try {
    const payload = await getPayload({ config: configPromise })

    // Find the review instance by slug
    const { docs } = await payload.find({
      collection: 'reviews',
      where: {
        slug: {
          equals: slug,
        },
      },
      depth: 0,
      limit: 1,
    })

    if (!docs || docs.length === 0) {
      return { success: false, error: 'Review request not found.' }
    }

    const review = docs[0]

    // Verify PIN
    if (review.pin !== pin) {
      return { success: false, error: 'Incorrect verification PIN.' }
    }

    // We do not allow overriding an already published review
    if (review.status === 'published') {
      return { success: false, error: 'This review has already been published.' }
    }

    // Update the review securely behind the scenes without user auth
    await payload.update({
      collection: 'reviews',
      id: review.id,
      data: {
        rating,
        comment,
        avatar: (avatarId as any) || undefined,
      },
      overrideAccess: true, // Crucial: bypasses Payload's access control to let the public submit
    })

    // Revalidate the frontend dynamic route to pull the new data layout instantly
    revalidatePath(`/rate/${slug}`)

    return { success: true }
  } catch (error) {
    console.error('Error submitting review:', error)
    return { success: false, error: 'An unexpected error occurred.' }
  }
}

export async function deleteReview(id: string | number) {
  if (!id) return { success: false, error: 'ID is required' }

  try {
    const payload = await getPayload({ config: configPromise })
    await payload.delete({
      collection: 'reviews',
      id: id as string,
    })
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Error deleting review:', error)
    return { success: false, error: 'Failed to delete review' }
  }
}

export async function createReview(data: any) {
  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.create({
      collection: 'reviews',
      data: {
        ...data,
        status: data.status || 'draft',
      },
    })
    revalidatePath('/dashboard')
    return { success: true, data: result }
  } catch (error) {
    console.error('Error creating review:', error)
    return { success: false, error: 'Failed to create review' }
  }
}

export async function updateReview(id: string, data: any) {
  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.update({
      collection: 'reviews',
      id,
      data,
    })
    revalidatePath('/dashboard')
    return { success: true, data: result }
  } catch (error) {
    console.error('Error updating review:', error)
    return { success: false, error: 'Failed to update review' }
  }
}
