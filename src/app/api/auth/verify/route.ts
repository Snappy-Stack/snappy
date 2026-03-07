import { getPayload } from '@/lib/payload'
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')

  const baseUrl = new URL(req.url).origin
  const errorRedirect = `${baseUrl}/login?error=invalid`

  if (!token) return NextResponse.redirect(errorRedirect)

  try {
    const payload = await getPayload()

    // 1. Find the token
    const tokenDocs = await payload.find({
      collection: 'login-tokens' as any,
      where: {
        and: [
          { token: { equals: token } },
          { used: { equals: false } },
          { expiresAt: { greater_than: new Date().toISOString() } },
        ],
      },
    })

    if (tokenDocs.totalDocs === 0) {
      console.warn('[AUTH] Invalid or expired token attempted.')
      return NextResponse.redirect(`${baseUrl}/login?error=expired`)
    }

    const tokenDoc = tokenDocs.docs[0]
    const email = tokenDoc.email

    // 2. Mark token as used
    await payload.update({
      collection: 'login-tokens' as any,
      id: tokenDoc.id,
      data: { used: true },
    })

    // 3. Find the user to get their ID and roles
    const users = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
    })

    if (users.totalDocs === 0) {
      console.error('[AUTH] Verified email has no corresponding user:', email)
      return NextResponse.redirect(errorRedirect)
    }

    const user = users.docs[0]
    const secret = process.env.PAYLOAD_SECRET || ''

    // 4. Manually sign a Payload-compatible JWT
    // IMPORTANT: Roles are required for access control checks like isAdminOrEditor
    const jwtPayload = {
      email: user.email,
      id: String(user.id),
      collection: 'users',
      roles: user.roles || ['editor'], // Fallback to editor if roles missing
    }

    console.log('[AUTH] Generating fresh JWT with roles:', jwtPayload.roles)

    const payloadToken = jwt.sign(jwtPayload, secret, { expiresIn: '30d' })

    // 5. Create response and set both cookie names for maximum compatibility
    const response = NextResponse.redirect(`${baseUrl}/dashboard`)

    const cookieOptions = {
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 60 * 60 * 24 * 30, // 30 days
    }

    // Set both to ensure all Payload versions/configs find the token
    response.cookies.set('payload-token', payloadToken, cookieOptions)
    response.cookies.set('payload-users-token', payloadToken, cookieOptions)

    console.log(`[AUTH] Login successful for: ${email}. Token version: 3.0 (with roles)`)
    return response
  } catch (error: any) {
    console.error('[AUTH] Magic Link verification failure:', error)
    return NextResponse.redirect(`${baseUrl}/login?error=server`)
  }
}
