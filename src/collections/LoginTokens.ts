import type { CollectionConfig } from 'payload'

export const LoginTokens: CollectionConfig = {
  slug: 'login-tokens',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'token', 'expiresAt', 'used'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'token',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'expiresAt',
      type: 'date',
      required: true,
    },
    {
      name: 'used',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}
