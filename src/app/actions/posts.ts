'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { revalidatePath } from 'next/cache'

export async function createPost(data: any) {
  try {
    const payload = await getPayload({ config: configPromise })

    const slug =
      data.slug ||
      data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')

    const doc = await payload.create({
      collection: 'posts',
      data: {
        ...data,
        slug,
      },
    })

    revalidatePath('/dashboard/posts')
    revalidatePath('/posts')

    return { success: true, doc }
  } catch (error) {
    console.error('Failed to create post:', error)
    throw new Error('Failed to create post')
  }
}

export async function updatePost(id: string, data: any) {
  try {
    const payload = await getPayload({ config: configPromise })

    const doc = await payload.update({
      collection: 'posts',
      id,
      data,
    })

    revalidatePath('/dashboard/posts')
    revalidatePath(`/dashboard/posts/${id}`)
    revalidatePath('/posts')

    return { success: true, doc }
  } catch (error) {
    console.error('Failed to update post:', error)
    throw new Error('Failed to update post')
  }
}

export async function deletePost(id: string) {
  try {
    const payload = await getPayload({ config: configPromise })

    await payload.delete({
      collection: 'posts',
      id,
    })

    revalidatePath('/dashboard/posts')
    revalidatePath('/posts')

    return { success: true }
  } catch (error) {
    console.error('Failed to delete post:', error)
    throw new Error('Failed to delete post')
  }
}
