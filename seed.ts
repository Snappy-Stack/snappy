import 'dotenv/config'
import { getPayload } from 'payload'
import config from './src/payload.config'

async function seed() {
  console.log('Starting SNAPPY Database Seed Process...')

  const payload = await getPayload({
    config: await config,
  })

  // Seed Landing Pages
  console.log('Creating mock Landing Pages...')
  const existingPages = await payload.findGlobal({ slug: 'landing-pages' })
  // Globals don't have totalDocs, we just check if data is populated. We'll check title.
  if (!existingPages.title) {
    await payload.updateGlobal({
      slug: 'landing-pages',
      data: {
        title: 'Homepage',
        hero: {
          headline: 'Build stunning interfaces faster',
          subheadline: 'The ultimate template for freelance developers and agencies.',
          ctaText: 'Get Started',
        },
        features: [
          { title: 'Ark UI Frontend', description: 'Blazing fast island architecture' },
          { title: 'Payload CMS', description: 'Next.js typed headless backend' },
        ],
        cta: { heading: 'Ready to level up?', buttonText: 'Deploy Now' },
      },
    })
  }

  // Seed Test Users
  console.log('Creating test user accounts...')
  const adminEmail = 'admin@snappy.io'
  const userEmail = 'user@snappy.io'
  const password = 'snappy123'

  const existingAdmin = await payload.find({
    collection: 'users',
    where: { email: { equals: adminEmail } },
  })

  if (existingAdmin.totalDocs === 0) {
    await payload.create({
      collection: 'users',
      data: {
        email: adminEmail,
        password: password,
        roles: ['super-admin'],
      },
    })
    console.log(`- Created Admin: ${adminEmail}`)
  }

  const existingUser = await payload.find({
    collection: 'users',
    where: { email: { equals: userEmail } },
  })

  if (existingUser.totalDocs === 0) {
    await payload.create({
      collection: 'users',
      data: {
        email: userEmail,
        password: password,
        roles: ['editor'],
      },
    })
    console.log(`- Created Editor: ${userEmail}`)
  }

  // Seed Blog Posts
  console.log('Generating sample Blog Posts...')
  const adminId =
    existingAdmin.docs[0]?.id ||
    (
      await payload.find({
        collection: 'users',
        where: { email: { equals: adminEmail } },
      })
    ).docs[0]?.id

  const existingPosts = await payload.find({ collection: 'posts' })
  if (existingPosts.totalDocs === 0) {
    await payload.create({
      collection: 'posts',
      data: {
        title: 'The Future of Web Development with SNAPPY',
        excerpt:
          'Explore how combining Cloudflare, Next.js, and Ark UI creates the ultimate developer experience.',
        content: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1,
            children: [
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1,
                children: [
                  {
                    mode: 'normal',
                    text: 'The SNAPPY stack is more than just a template; it is a philosophy of speed and efficiency. By leveraging the best of the headless and serverless worlds, we can build applications that scale infinitely with zero boilerplate.',
                    type: 'text',
                    style: '',
                    detail: 0,
                    format: 0,
                    version: 1,
                  },
                ],
                direction: 'ltr',
              },
            ],
            direction: 'ltr',
          },
        },
        author: adminId as any,
      } as any,
    })
    console.log(`- Created sample Post`)
  }

  console.log(
    '✅ Seeding complete! The Admin Dashboard and Blog will now display this active data.',
  )
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
