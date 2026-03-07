import type { GlobalConfig } from 'payload'
import { isAdminOrEditor } from '../access'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  access: {
    read: () => true, // Publicly readable for the frontend to render the header/footer
    // Editors CAN update navigation links
    update: isAdminOrEditor,
  },
  fields: [
    {
      name: 'headerLinks',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'footerLinks',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
