import type { GlobalConfig } from 'payload'

export const SEO: GlobalConfig = {
  slug: 'seo',
  access: {
    read: () => true, // Publicly readable for rendering
    // Editors CANNOT update SEO. System breaking changes requires Super Admin.
    update: ({ req: { user } }) => Boolean((user as any)?.roles?.includes('super-admin')),
  },
  fields: [
    {
      name: 'defaultMetaTitle',
      type: 'text',
      required: true,
      defaultValue: 'The SNAPPY Stack',
    },
    {
      name: 'defaultMetaDescription',
      type: 'textarea',
    },
    {
      name: 'aboutMetaDescription',
      type: 'textarea',
      admin: {
        description: 'SEO Description for the About page.',
      },
    },
    {
      name: 'workMetaDescription',
      type: 'textarea',
      admin: {
        description: 'SEO Description for the Works/Projects page.',
      },
    },
    {
      name: 'processMetaDescription',
      type: 'textarea',
      admin: {
        description: 'SEO Description for the Process page.',
      },
    },
    {
      name: 'loveMetaDescription',
      type: 'textarea',
      admin: {
        description: 'SEO Description for the Wall of Love page.',
      },
    },
    {
      name: 'ogImage',

      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'googleAnalyticsId',
      type: 'text',
      admin: {
        description: 'E.g., G-XXXXXXXXXX. Leave blank to disable tracking.',
      },
    },
    {
      name: 'robotsNoIndex',
      label: 'Block search engines (noindex)',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Enable to prevent search engines from indexing your site.',
      },
    },
  ],
}
