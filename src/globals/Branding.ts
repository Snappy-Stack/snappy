import type { GlobalConfig } from 'payload'
import { isAdminOrEditor } from '../access'

export const Branding: GlobalConfig = {
  slug: 'branding',
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  fields: [
    {
      name: 'logo',
      label: 'Logo (Light Mode)',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'logoDark',
      label: 'Logo (Dark Mode)',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'favicon',
      label: 'Favicon (Light Mode)',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'faviconDark',
      label: 'Favicon (Dark Mode)',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'useUnifiedLogo',
      label: 'Use Unified Logo (single asset for light & dark)',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'logoText',
      label: 'Logo Text (overrides profile name)',
      type: 'text',
      admin: {
        description: 'If set, this text is used as the logo text when no image is available.',
      },
    },
  ],
}
