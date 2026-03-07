'use server'

import { getPayload } from '@/lib/payload'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

/**
 * Standard Email/Password Login
 */
export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const payload = await getPayload()
  try {
    const result = await payload.login({
      collection: 'users',
      data: { email, password },
    })

    console.log('[DEBUG AUTH] Login result from Payload:', !!result.token)

    if (result.token) {
      const cookieStore = await cookies()
      cookieStore.set('payload-token', result.token, {
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      })
      console.log('[DEBUG AUTH] Cookie set: payload-token')
    } else {
      console.log('[DEBUG AUTH] No token returned from Payload login!')
    }
  } catch (err) {
    console.error('[DEBUG AUTH] Login threw error:', err)
    throw new Error('Invalid credentials')
  }

  redirect('/')
}

/**
 * Request Magic Link
 * Triggers Payload's forgotPassword flow (which acts as a magic link generator)
 */
export async function requestMagicLink(formData: FormData) {
  const email = formData.get('email') as string
  const payload = await getPayload()

  try {
    await payload.forgotPassword({
      collection: 'users',
      data: { email },
    })
    return { success: true }
  } catch (err) {
    // We don't want to leak if an email exists or not
    return { success: true }
  }
}

/**
 * Logout User
 */
export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('payload-token')
  redirect('/login')
}
