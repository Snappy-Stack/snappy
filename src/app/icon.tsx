import { ImageResponse } from 'next/og'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'

// Image metadata
export const alt = 'SNAPPY Icon'
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default async function Icon() {
  const payload = await getPayload({ config: configPromise })
  const profile = (await payload.findGlobal({ slug: 'profile' })) as any
  const siteIcon = profile?.siteIcon

  if (siteIcon?.url) {
    // If we have a custom icon in CMS, we return it
    const response = await fetch(siteIcon.url)
    return response
  }

  // Fallback: Generate a simple high-fidelity icon using ImageResponse
  return new ImageResponse(
    <div
      style={{
        fontSize: 24,
        background: 'linear-gradient(to bottom right, #2563eb, #4f46e5)',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        borderRadius: '20%',
        fontWeight: 900,
      }}
    >
      S
    </div>,
    {
      ...size,
    },
  )
}
