import type { GlobalConfig } from 'payload'
import { isAdminOrEditor } from '../access'

export const LeadMagnets: GlobalConfig = {
  slug: 'lead-magnets',
  access: {
    read: (args) => {
      if (process.env.REQUIRE_LOGIN === 'no') return true
      return isAdminOrEditor(args)
    },
    update: isAdminOrEditor,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'source',
      type: 'text',
      admin: {
        description: 'Which form or page generated this lead?',
      },
    },
  ],
}
