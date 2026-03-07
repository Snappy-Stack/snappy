import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const token =
    request.cookies.get('payload-token')?.value || request.cookies.get('payload-users-token')?.value
  const stealthAccess = request.cookies.get('snappy-stealth-access')?.value

  // Auth Protection Logic
  const protectedRoutes = ['/admin', '/dashboard']
  const isProtected = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Stealth Access Enforcement
  if (request.nextUrl.pathname.startsWith('/login') && request.method === 'GET') {
    if (!stealthAccess) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Optional: Mask /verify if no token is present
  if (
    request.nextUrl.pathname.startsWith('/verify') &&
    !request.nextUrl.searchParams.get('token')
  ) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  const { pathname, searchParams } = new URL(request.url)

  // Device Override Preview Mode
  const deviceOverride = searchParams.get('device')
  if (deviceOverride) {
    const response = NextResponse.next()
    response.cookies.set('snappy-device-override', deviceOverride, {
      maxAge: 60 * 60, // 1 hour
      path: '/',
    })
    return response
  }

  // Skip proxy for API, Admin, and Static assets
  const response = NextResponse.next()

  // Security Headers
  // https://nextjs.org/docs/app/building-your-application/configuring/security-headers
  const securityHeaders = {
    'X-DNS-Prefetch-Control': 'on',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'X-XSS-Protection': '1; mode=block',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'origin-when-cross-origin',
  }

  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // Add a custom header to indicate SNAPPY engine
  response.headers.set('X-Powered-By', 'SNAPPY Stack')

  return response
}

// See"Matching Paths"below to learn more
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api|sitemap.xml|robots.txt).*)'],
}
