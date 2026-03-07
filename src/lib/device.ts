import { headers, cookies } from 'next/headers'

export type DeviceType = 'desktop' | 'mobile' | 'tablet' | 'pwa'

export async function getDeviceType(): Promise<{ type: DeviceType; ua: string }> {
  const cookieStore = await cookies()
  const headerList = await headers()
  const userAgent = headerList.get('user-agent') || ''

  const override = cookieStore.get('snappy-device-override')?.value

  if (
    override === 'pwa' ||
    override === 'mobile' ||
    override === 'desktop' ||
    override === 'tablet'
  ) {
    return { type: override as DeviceType, ua: 'OVERRIDE' }
  }

  const isMobileHeader = headerList.get('sec-ch-ua-mobile') === '?1'

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)

  const isTablet =
    /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/i.test(
      userAgent,
    )

  // Check if it's a PWA (standalone mode)
  // In v1, we use Sec-CH-UA-Mobile as a strong signal for PWA-like intent on mobile devices
  const isPWA = isMobile && headerList.get('sec-ch-ua-mobile') === '?1'

  if (isMobile) {
    return { type: isPWA ? 'pwa' : 'mobile', ua: userAgent }
  }

  if (isTablet) {
    return { type: 'tablet', ua: userAgent }
  }

  return { type: 'desktop', ua: userAgent }
}
