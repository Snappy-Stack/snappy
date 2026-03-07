/**
 * SNAPPY LOREM IPSUM SEEDER
 *
 * Seeds the sandbox database with
 * Bailroad Antrod's fictional portfolio.
 *
 * DO NOT RUN AGAINST PRODUCTION DB.
 * BAILROAD SHALL ANTROD.
 * THERE IS NO MERCY IN PRODUCTION.
 */

import { getPayload } from 'payload'
import path from 'path'
import fs from 'fs'
import { fileURLToPath, pathToFileURL } from 'url'
import { config as dotenvConfig } from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const lexicalContent = (text: string) => ({
  root: {
    type: 'root',
    format: '' as const,
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: [
      {
        type: 'paragraph',
        format: '' as const,
        indent: 0,
        version: 1,
        direction: 'ltr' as const,
        children: [
          {
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text,
            type: 'text',
            version: 1,
          },
        ],
      },
    ],
  },
})

export async function seed() {
  console.log('🚀 Starting SNAPPY Lorem Ipsum Seeding...')

  try {
    // Load .env from project root
    dotenvConfig({ path: path.resolve(process.cwd(), '.env') })

    const configPath = path.resolve(process.cwd(), 'src/payload.config.ts')
    const configURL = pathToFileURL(configPath).toString()

    console.log(`Loading config...`)
    const { default: configPromise } = await import(configURL)
    const config = await configPromise

    const payload = await getPayload({ config })

    console.log('🧹 Cleaning existing data...')
    await payload.delete({ collection: 'projects', where: { id: { exists: true } } })
    await payload.delete({ collection: 'media', where: { id: { exists: true } } })

    console.log('👤 Setting up Super Admin...')
    const adminUser = await payload.find({
      collection: 'users',
      where: { email: { equals: 'wicky@wicky.id' } },
    })

    let userId: string | number
    if (adminUser.totalDocs === 0) {
      const user = await payload.create({
        collection: 'users',
        data: {
          email: 'wicky@wicky.id',
          password: 'password123',
          roles: ['super-admin'],
        },
      })
      userId = user.id
    } else {
      userId = adminUser.docs[0].id
    }

    console.log('🖼️ Uploading placeholder assets...')
    const assetsDir = path.join(__dirname, '../assets/seed')
    const profileImgPath = path.join(assetsDir, 'profile.png')
    const projectImgPath = path.join(assetsDir, 'project.png')

    const profileImg = await payload.create({
      collection: 'media',
      data: { alt: 'Bailroad Antrod Profile' },
      file: {
        data: fs.readFileSync(profileImgPath),
        name: 'profile.png',
        mimetype: 'image/png',
        size: fs.statSync(profileImgPath).size,
      },
    })

    const projectImg = await payload.create({
      collection: 'media',
      data: { alt: 'Project Preview' },
      file: {
        data: fs.readFileSync(projectImgPath),
        name: 'project.png',
        mimetype: 'image/png',
        size: fs.statSync(projectImgPath).size,
      },
    })

    const profileId = typeof profileImg === 'object' ? profileImg.id : profileImg
    const projectId = typeof projectImg === 'object' ? projectImg.id : projectImg

    console.log('🧬 Initializing Profile (Bailroad Antrod)...')
    await payload.updateGlobal({
      slug: 'profile',
      data: {
        fullName: 'Bailroad Antrod',
        bioShort:
          'Corrupted Demigod Developer. Converting divine entropy into stable codebases since the collapse of the Seventh Realm.',
        location: 'The Void / Bandung',
        profileImage: profileId,
        resume: projectId, // Placeholder resume
        disciplines: [
          { name: 'Entropy Manipulation' },
          { name: 'Full-Stack Transmutation' },
          { name: 'Void Engineering' },
        ],
        contactEmail: 'antrod@wicky.id',
        socialLinks: [
          { platform: 'twitter', url: 'https://twitter.com/wickyid' },
          { platform: 'github', url: 'https://github.com/wickyid' },
        ],
      },
    })

    console.log('🎨 Configuring Branding...')
    await payload.updateGlobal({
      slug: 'branding',
      data: {
        logo: profileId,
        logoDark: profileId,
        favicon: profileId,
        faviconDark: profileId,
        primaryColor: '#000000',
        secondaryColor: '#00FF41',
      },
    })

    console.log('📂 Creating Projects...')
    const projectLabels = ['Project Aethelgard', 'Entropy Engine', 'Void UI System']
    for (let i = 0; i < projectLabels.length; i++) {
      await payload.create({
        collection: 'projects',
        data: {
          title: projectLabels[i],
          slug: projectLabels[i].toLowerCase().replace(/\s+/g, '-'),
          category: 'Experimental Tech',
          year: 2026,
          descriptionShort: `A demonstration of high-dimensional engineering within ${projectLabels[i]}.`,
          descriptionLong: lexicalContent(`Detailed analysis of ${projectLabels[i]}.`),
          featuredImage: projectId,
          isFeatured: true,
          order: i,
        },
      })
    }

    console.log('📝 Setting up Posts...')
    await payload.updateGlobal({
      slug: 'posts',
      data: {
        title: 'The Prophecy of Stable Code',
        excerpt: 'Why the collapse of the Seventh Realm was ultimately a unit testing failure.',
        content: lexicalContent('In the early cycles of reality...'),
        featuredImage: projectId,
        author: userId,
      },
    })

    console.log('⚓ Initializing Navigation...')
    await payload.updateGlobal({
      slug: 'navigation',
      data: {
        headerLinks: [
          { label: 'Work', url: '/work' },
          { label: 'Process', url: '/process' },
          { label: 'Contact', url: '/contact' },
        ],
        footerLinks: [
          { label: 'Wicky.ID', url: 'https://wicky.id' },
          { label: 'Source', url: 'https://github.com/wickyid' },
        ],
      },
    })

    console.log('🔍 Initializing SEO baseline...')
    await payload.updateGlobal({
      slug: 'seo',
      data: {
        defaultMetaTitle: 'Bailroad Antrod | Corrupted Demigod Developer',
        defaultMetaDescription: 'Official portfolio of Bailroad Antrod.',
        ogImage: profileId,
      },
    })

    console.log('✅ SEEDING COMPLETE. BAILROAD SHALL ANTROD.')
  } catch (err) {
    console.error('❌ Seeding failed:', err)
    throw err
  }
}
