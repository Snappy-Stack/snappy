import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

async function seed() {
  console.log('🚀 Starting SNAPPY Portfolio Personalization Seed...')

  const payload = await getPayload({
    config,
  })

  // 1. Seed Profile Table (Global)
  console.log('📝 Seeding Profile...')
  try {
    await payload.updateGlobal({
      slug: 'profile',
      data: {
        fullName: 'Bagas Fajar Wicaksono',
        bioShort:
          "I'm a full-stack developer from Malang, born in '99. I build everything from the ground up—no templates, no shortcuts. Just raw code and custom assets.",
        location: 'Malang, Indonesia',
        disciplines: [
          { name: 'Full-Stack Development' },
          { name: 'Real-Time Systems' },
          { name: 'Custom UI/UX' },
          { name: 'Security-Minded Engineering' },
        ],
        contactEmail: 'wicky@wicky.id',
        siteLogo: null, // User will upload in dashboard
        siteIcon: null, // User will upload in dashboard
        brandingVariants: [],
        socialLinks: [
          { platform: 'GitHub', url: 'https://github.com/WickyID' },
          { platform: 'LinkedIn', url: 'https://linkedin.com/in/bagas fajar wicaksono' },
          { platform: 'Portfolio', url: 'https://wicky.id' },
        ],
      } as any,
    })
    console.log('  - Updated Profile')
  } catch (err) {
    console.error('  - Failed to seed Profile:', err)
  }

  // 2. Seed About Story (Global)
  console.log('📖 Seeding About Story...')
  try {
    await payload.updateGlobal({
      slug: 'about-story',
      data: {
        chapters: [
          {
            year: '1999',
            label: 'THE ORIGIN',
            headline: 'Born in Malang',
            body: 'Started with a curiosity for how things work. Breaking things apart was the first step to building them better.',
            dark: false,
          },
          {
            year: '2016-2022',
            label: 'Wicky.ID LEGACY',
            headline: 'Building a Web Entity',
            body: 'Ran Wicky.ID, a web service serving real users. Encountered real scaling challenges—database bottlenecks and WebSocket connection storms. Learned the reality of production systems.',
            dark: true,
          },
          {
            year: '2024',
            label: 'WickyOS',
            headline: 'Retro-Modern Fusion',
            body: 'Current focus: WickyOS. Merging Mac OS 9 aesthetics with cutting-edge tech like Next.js 15, Svelte 5, and Go microservices. Shipping clean, production-grade code without shortcuts.',
            dark: true,
          },
        ],
      },
    })
    console.log('  - Updated About Story')
  } catch (err) {
    console.error('  - Failed to seed About Story:', err)
  }

  // 3. Seed Working Process (Global)
  console.log('⚙️ Seeding Working Process...')
  try {
    await payload.updateGlobal({
      slug: 'process',
      data: {
        title: 'My Engineering Core',
        subtitle:
          'No WordPress, no page builders. I treat every project as a unique piece of engineering.',
        steps: [
          {
            stepName: 'Discovery & Break-Down',
            description:
              'Understanding the system requirements and breaking down the problem into manageable microservices or modules.',
          },
          {
            stepName: 'From-Scratch Architecture',
            description:
              'Setting up the monorepo, defining the schema, and building custom components. Quality is non-negotiable.',
          },
          {
            stepName: 'Production-Grade Delivery',
            description:
              'Optimizing queries, implementing caching (Redis), and ensuring the system handles concurrent traffic gracefully.',
          },
        ],
      },
    })
    console.log('  - Updated Process')
  } catch (err) {
    console.error('  - Failed to seed Process:', err)
  }

  // 4. Seed Projects (Collection)
  console.log('🎨 Seeding Projects...')
  const projects = [
    {
      title: '@wicky-ui',
      slug: 'wicky-ui',
      category: 'UI/UX & Engineering',
      year: 2023,
      descriptionShort:
        'A custom component library built from scratch (no shadcn, no MUI). Focused on performance and internal consistency.',
      isFeatured: true,
      order: 1,
    },
    {
      title: '@wicky-api',
      slug: 'wicky-api',
      category: 'Backend Architecture',
      year: 2024,
      descriptionShort:
        'Go microservices handling 1000+ concurrent requests for the Wicky.ID ecosystem.',
      isFeatured: true,
      order: 2,
    },
    {
      title: 'WickyOS',
      slug: 'wickyos',
      category: 'Experimental Web',
      year: 2024,
      descriptionShort: 'A Mac OS 9 inspired retro operating system built with modern web tech.',
      isFeatured: true,
      order: 3,
    },
  ]

  for (const p of projects) {
    try {
      const existing = await payload.find({
        collection: 'projects',
        where: { slug: { equals: p.slug } },
      })

      if (existing.totalDocs === 0) {
        await payload.create({
          collection: 'projects',
          data: p as any,
        })
        console.log(`  - Created Project: ${p.title}`)
      } else {
        console.log(`  - Project already exists, skipping: ${p.title}`)
      }
    } catch (err) {
      console.error(`  - Failed to seed Project ${p.title}:`, err)
    }
  }

  // 5. Seed Posts (Global)
  console.log('✍️ Seeding Posts...')
  try {
    // Get an admin user ID for the author field
    const admins = await payload.find({
      collection: 'users',
      where: { roles: { contains: 'super-admin' } },
      limit: 1,
    })
    const adminId = admins.docs[0]?.id

    const existingPosts = await payload.find({ collection: 'posts' })
    if (existingPosts.totalDocs === 0) {
      await payload.create({
        collection: 'posts',
        data: {
          title: 'Why I Build From Scratch',
          excerpt:
            'The philosophy of engineering vs. assembling. Why I avoid WordPress and page builders.',
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
      console.log('  - Created initial Post')
    }
  } catch (err) {
    console.error('  - Failed to seed Posts:', err)
  }

  console.log('✅ Portfolio successfully personalized for Bagas Fajar Wicaksono!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Personalization seed failed:', err)
  process.exit(1)
})
