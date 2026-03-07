import React from 'react'
import { getDeviceType } from '@/lib/device'
import {
  LandingTemplate,
  MobileLandingTemplate,
  DashboardTemplate,
  MobileTemplate,
  MobilePWATemplate,
  DesktopPortfolioTemplate,
  MobilePortfolioTemplate,
  CheckoutTemplate,
  MobileCheckoutTemplate,
  AuthTemplate,
  ShellProps,
} from './templates'
import { DebugLabel } from './DebugLabel'

interface AdaptiveHubProps extends ShellProps {
  type: 'landing' | 'dashboard' | 'content' | 'portfolio' | 'checkout' | 'auth'
}

/**
 * The Brain of the Layout System.
 * Detects device type and injects the corresponding decoupled shell.
 * Includes a DebugLabel in development to catch/reset overrides.
 */
export async function AdaptiveHub({ type, children, ...props }: AdaptiveHubProps) {
  const { type: device, ua } = await getDeviceType()

  // Ensure childrenArray only contains React elements, filtering out strings/whitespace
  const childrenArray = React.Children.toArray(children).filter(
    (child) => typeof child === 'object' && child !== null,
  )

  // If exactly 2 children are passed, assume [DesktopComponent, MobileComponent] convention
  const isBifurcated = childrenArray.length === 2
  const desktopContent = isBifurcated ? childrenArray[0] : children
  const mobileContent = isBifurcated ? childrenArray[1] : children

  const content = (() => {
    // 1. Auth Shell (Isolated)
    if (type === 'auth') {
      return <AuthTemplate {...props}>{desktopContent}</AuthTemplate>
    }

    // 2. Checkout Shell (Isolated)
    if (type === 'checkout') {
      return device === 'desktop' ? (
        <CheckoutTemplate {...props}>{desktopContent}</CheckoutTemplate>
      ) : (
        <MobileCheckoutTemplate {...props}>{mobileContent}</MobileCheckoutTemplate>
      )
    }

    // 3. Portfolio Shell (Isolated)
    if (type === 'portfolio') {
      return device === 'desktop' ? (
        <DesktopPortfolioTemplate {...props}>{desktopContent}</DesktopPortfolioTemplate>
      ) : (
        <MobilePortfolioTemplate {...props}>{mobileContent}</MobilePortfolioTemplate>
      )
    }

    // 4. Default Business Logic (Landing / Dashboard / Content)
    if (type === 'dashboard') {
      if (device === 'pwa') return <MobilePWATemplate {...props}>{mobileContent}</MobilePWATemplate>
      return device === 'desktop' ? (
        <DashboardTemplate {...props}>{desktopContent}</DashboardTemplate>
      ) : (
        <MobileTemplate {...props}>{mobileContent}</MobileTemplate>
      )
    }

    // Fallback to Landing
    if (device === 'pwa') return <MobilePWATemplate {...props}>{mobileContent}</MobilePWATemplate>
    return device === 'desktop' ? (
      <LandingTemplate {...props}>{desktopContent}</LandingTemplate>
    ) : (
      <MobileLandingTemplate {...props}>{mobileContent}</MobileLandingTemplate>
    )
  })()

  return (
    <>
      <DebugLabel device={device} type={type} ua={ua} />
      {content}
    </>
  )
}
