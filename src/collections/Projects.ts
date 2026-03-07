import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: {
    singular: 'Project',
    plural: 'Projects',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Portfolio',
    defaultColumns: ['title', 'category', 'year', 'updatedAt'],
  },
  access: {
    read: () => true, // Public access
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Project Title',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL slug (e.g., "my-awesome-project")',
      },
    },
    {
      name: 'category',
      type: 'text',
      label: 'Category',
      admin: {
        placeholder: 'e.g. Branding, UI/UX, Print',
      },
    },
    {
      name: 'year',
      type: 'number',
      label: 'Year Completed',
    },
    {
      name: 'descriptionShort',
      type: 'textarea',
      label: 'Short Description',
      admin: {
        description: 'Displayed on the project card/carousel.',
      },
    },
    {
      name: 'descriptionLong',
      type: 'richText',
      label: 'Full Case Study',
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Featured Image',
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Image Gallery',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      label: 'Feature on Homepage?',
      defaultValue: false,
    },
    {
      name: 'order',
      type: 'number',
      label: 'Display Order',
      defaultValue: 0,
      admin: {
        description: 'Lower numbers appear first.',
      },
    },
    {
      name: 'externalLink',
      type: 'text',
      label: 'External Link',
      admin: {
        placeholder: 'e.g. https://awwwards.com/my-project',
      },
    },
  ],
}
