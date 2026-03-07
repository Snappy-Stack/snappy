import type { CollectionConfig } from 'payload'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'clientName',
    defaultColumns: ['clientName', 'projectName', 'slug', 'status', 'rating'],
  },
  access: {
    // Anyone can read published reviews
    read: ({ req: { user } }) => {
      // If a user is logged in (admin), let them see all
      if (user) {
        return true
      }
      // Otherwise, only allow reading published reviews
      return {
        status: {
          equals: 'published',
        },
      }
    },
    // Only admins can create/update/delete via the Rest API directly
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      required: true,
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'The unique URL path for the client (e.g., camden-studio)',
      },
    },
    {
      name: 'rating',
      type: 'number',
      min: 1,
      max: 5,
      admin: {
        position: 'sidebar',
        description: 'The star rating (1-5) submitted by the client.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'clientName',
          type: 'text',
          required: true,
        },
        {
          name: 'projectName',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'pin',
      type: 'text',
      required: true,
      admin: {
        description: 'A secret 4-digit code the client must enter to submit their review.',
      },
    },
    {
      name: 'clientRole',
      type: 'text',
      admin: {
        description: 'Optional: E.g., CEO at Camden Studio',
      },
    },
    {
      name: 'comment',
      type: 'textarea',
      admin: {
        description: 'The feedback provided by the client.',
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      label: 'Reviewer Avatar',
      admin: {
        description: 'Profile picture of the person leaving the review.',
      },
    },
  ],
}
