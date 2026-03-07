import type { GlobalConfig } from 'payload'
import { isAdminOrEditor } from '../access'

export const LandingPages: GlobalConfig = {
  slug: 'landing-pages',
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero Section',
          fields: [
            {
              name: 'hero',
              type: 'group',
              fields: [
                { name: 'headline', type: 'text', required: true },
                { name: 'subheadline', type: 'textarea' },
                { name: 'ctaText', type: 'text' },
                { name: 'ctaLink', type: 'text' },
                { name: 'heroImage', type: 'upload', relationTo: 'media' },
              ],
            },
          ],
        },
        {
          label: 'Feature Grid',
          fields: [
            {
              name: 'features',
              type: 'array',
              minRows: 1,
              maxRows: 6,
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'description', type: 'textarea' },
                { name: 'icon', type: 'text', admin: { description: 'Icon name or SVG string' } },
              ],
            },
          ],
        },
        {
          label: 'Testimonials',
          fields: [
            {
              name: 'testimonials',
              type: 'array',
              fields: [
                { name: 'quote', type: 'textarea', required: true },
                { name: 'author', type: 'text', required: true },
                { name: 'role', type: 'text' },
                { name: 'avatar', type: 'upload', relationTo: 'media' },
              ],
            },
          ],
        },
        {
          label: 'Call To Action',
          fields: [
            {
              name: 'cta',
              type: 'group',
              fields: [
                { name: 'heading', type: 'text' },
                { name: 'buttonText', type: 'text' },
                { name: 'buttonLink', type: 'text' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
