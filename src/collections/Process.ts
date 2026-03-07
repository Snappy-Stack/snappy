import type { CollectionConfig } from 'payload'

export const Process: CollectionConfig = {
  slug: 'process',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'project', 'status', 'date'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ data }) => {
            if (data?.title) {
              return data.title
                .toLowerCase()
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, '')
            }
            return data?.slug
          },
        ],
      },
    },
    {
      name: 'project',
      type: 'text',
      admin: {
        description: 'Name of the project this process belongs to',
      },
    },
    {
      name: 'date',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      maxLength: 160,
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'gallery',
      type: 'array',
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
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
        name: 'content',
        type: 'richText',
        admin: {
            description: 'Full documentation of the process'
        }
    }
  ],
}
