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
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const bucket = process.env.NEXT_PUBLIC_S3_BUCKET || process.env.S3_BUCKET
    if (!supabaseUrl || !bucket) return null
    return `${supabaseUrl}/storage/v1/object/public/${bucket.replace(/\s+/g, '%20')}/media/${media.filename}`
  }

  return media.url || null
}
