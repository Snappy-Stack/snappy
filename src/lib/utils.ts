import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getMediaUrl(media: any) {
  if (!media) return null
  if (typeof media === 'string') {
    if (media.startsWith('http') || media.startsWith('/')) return media
    return null // It's likely an ID, not a URL
  }
  if (media.url && media.url.startsWith('http')) return media.url

  // If we have a filename but URL is relative or missing
  if (media.filename) {
    const endpoint = process.env.S3_ENDPOINT || ''
    const bucket = process.env.S3_BUCKET || ''
    
    if (endpoint.includes('r2.cloudflarestorage.com')) {
      return `https://pub-86641b997c0c451da7a398047315.r2.dev/${media.filename}`
    }
    return `/${media.filename}`
  }

  return media.url || null
}
