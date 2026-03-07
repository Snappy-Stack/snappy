import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { s3Storage } from '@payloadcms/storage-s3'

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

export default buildConfig({
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
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
      ssl: {
        rejectUnauthorized: false,
      },
    },
  }),
  sharp,
  plugins: [
    s3Storage({
      collections: {
        media: {
          prefix: 'media',
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
})
