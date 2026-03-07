import type { GlobalConfig } from 'payload'
import { isAdminOrEditor } from '../access'

export const LegalPages: GlobalConfig = {
  slug: 'legal-pages',
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
      name: 'lastUpdated',
      type: 'date',
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
  ],
}
