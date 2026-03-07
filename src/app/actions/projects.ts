'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { revalidatePath } from 'next/cache'

export async function createProject(data: any) {
  try {
    const payload = await getPayload({ config: configPromise })

    // Automatically generate a slug if none exists
    const slug =
      data.slug ||
      data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')

    const doc = await payload.create({
      collection: 'projects',
      data: {
        ...data,
        slug,
      },
    })

    revalidatePath('/dashboard/projects')
    revalidatePath('/work') // Assuming this is frontend route

    return { success: true, doc }
  } catch (error) {
    console.error('Failed to create project:', error)
    throw new Error('Failed to create project')
  }
}

export async function updateProject(id: string, data: any) {
  try {
    const payload = await getPayload({ config: configPromise })

    const doc = await payload.update({
      collection: 'projects',
      id,
      data,
    })

    revalidatePath('/dashboard/projects')
    revalidatePath(`/dashboard/projects/${id}`)
    revalidatePath('/work')

    return { success: true, doc }
  } catch (error) {
    console.error('Failed to update project:', error)
    throw new Error('Failed to update project')
  }
}

export async function deleteProject(id: string) {
  try {
    const payload = await getPayload({ config: configPromise })

    await payload.delete({
      collection: 'projects',
      id,
    })

    revalidatePath('/dashboard/projects')
    revalidatePath('/work')

    return { success: true }
  } catch (error) {
    console.error('Failed to delete project:', error)
    throw new Error('Failed to delete project')
  }
}
