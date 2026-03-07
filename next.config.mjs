import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_SUPABASE_URL
          ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
          : 'REDACTED.supabase.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: process.env.S3_ENDPOINT
          ? new URL(process.env.S3_ENDPOINT).hostname
          : 'REDACTED.storage.supabase.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: `${process.env.S3_BUCKET?.replace(/\s+/g, '%20')}.REDACTED.storage.supabase.co`,
        pathname: '/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })

