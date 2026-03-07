import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrEditor, isAdminFieldLevel } from '../access'

export type UserRole = 'super-admin' | 'editor' | 'viewer'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  access: {
    // Only super-admins can create and delete users
    create: isAdmin,
    delete: isAdmin,
    // Admins and editors can read lists of users
    read: (args) => {
      if (process.env.REQUIRE_LOGIN === 'no') return true
      return isAdminOrEditor(args)
    },
    // Users can update themselves, but only admins can update arbitrary users (handled natively via id checks or we can rely on isAdmin)
    // For simplicity, we restrict total update to admins right now
    update: isAdmin,
  },
  auth: {
    tokenExpiration: 315360000, // ~10 years in seconds
    cookies: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
    },
  },
  fields: [
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      saveToJWT: true,
      defaultValue: ['editor'],
      required: true,
      access: {
        // Only super-admins can create or change a user's role
        create: isAdminFieldLevel,
        update: isAdminFieldLevel,
      },
      options: [
        {
          label: 'Super Admin',
          value: 'super-admin',
        },
        {
          label: 'Editor',
          value: 'editor',
        },
        {
          label: 'Viewer',
          value: 'viewer',
        },
      ],
    },
  ],
}
