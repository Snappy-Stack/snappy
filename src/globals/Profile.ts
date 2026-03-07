import type { GlobalConfig } from 'payload'

export const Profile: GlobalConfig = {
  slug: 'profile',
  label: 'Profile',
  access: {
    read: () => true, // Anyone can read the profile
  },
  admin: {
    group: 'Portfolio',
  },
  fields: [
    {
      name: 'fullName',
      type: 'text',
      required: true,
      label: 'Full Name',
    },
    {
      name: 'bioShort',
      type: 'textarea',
      required: true,
      label: 'Short Biography',
      admin: {
        description: 'A brief 1-2 sentence introduction for the hero section.',
      },
    },
    {
      name: 'location',
      type: 'text',
      label: 'Location',
      admin: {
        placeholder: 'e.g. Bandung, Indonesia',
      },
    },
    {
      name: 'profileImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Profile Image',
    },
    {
      name: 'resume',
      type: 'upload',
      relationTo: 'media',
      label: 'Curriculum Vitae (PDF)',
    },
    {
      name: 'disciplines',
      type: 'array',
      label: 'Disciplines / Focus Areas',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'contactEmail',
      type: 'text',
      label: 'Contact Email',
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Social Links',
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'Twitter / X', value: 'twitter' },
            { label: 'GitHub', value: 'github' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'Dribbble', value: 'dribbble' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'Website / Other', value: 'website' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          label: 'URL',
        },
      ],
    },
  ],
}
