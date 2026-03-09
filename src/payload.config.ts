import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { s3Storage } from '@payloadcms/storage-s3'
import { withSnappy, createSnappyD1Proxy } from '@snappy-stack/core'

import { LoginTokens } from './collections/LoginTokens'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { LiveLogs } from './collections/LiveLogs'
import { Projects } from './collections/Projects'
import { Posts } from './collections/Posts'
import { Reviews } from './collections/Reviews'

import { LandingPages } from './globals/LandingPages'
import { LegalPages } from './globals/LegalPages'
import { LeadMagnets } from './globals/LeadMagnets'

import { SEO } from './globals/SEO'
import { Navigation } from './globals/Navigation'
import { Branding } from './globals/Branding'
import { Profile } from './globals/Profile'
import { Process } from './globals/Process'
import { AboutStory } from './globals/AboutStory'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default withSnappy(() => buildConfig({
  routes: {
    api: '/v1',
  },
  cors: [
    'http://localhost:4321',
    'http://localhost:4322',
    'http://localhost:3000',
    process.env.PUBLIC_FRONTEND_URL || '',
  ],
  csrf: [
    'http://localhost:4321',
    'http://localhost:4322',
    'http://localhost:3000',
    process.env.PUBLIC_FRONTEND_URL || '',
  ],
  admin: {
    disable: true,
  },
  collections: [LoginTokens, Users, Media, LiveLogs, Projects, Posts, Reviews],
  globals: [
    SEO,
    Navigation,
    Branding,
    LandingPages,
    LegalPages,
    LeadMagnets,
    Profile,
    Process,
    AboutStory,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: 'http://remote-proxy',
    },
    drizzleConfig: {
      connection: {
        type: 'sqlite',
        callback: createSnappyD1Proxy(
          process.env.SNAPPY_LICENSE_TOKEN || '',
          process.env.SNAPPY_API_URL || 'https://snappycore.wicky.id'
        )
      }
    }
  } as any),
  sharp,
  plugins: [
    s3Storage({
      collections: {
        media: {
          prefix: `${process.env.SNAPPY_R2_PREFIX || 'global'}/media`,
        },
      },
      bucket: process.env.NEXT_PUBLIC_S3_BUCKET || process.env.S3_BUCKET || '',
      config: {
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        forcePathStyle: true,
      },
    }),
  ],
}))
