import type { GlobalConfig } from 'payload'
import { isAdminOrEditor } from '../access'

export const AboutStory: GlobalConfig = {
  slug: 'about-story',
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  fields: [
    {
      name: 'chapters',
      type: 'array',
      fields: [
        {
          name: 'year',
          type: 'text',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'headline',
          type: 'text',
          required: true,
        },
        {
          name: 'body',
          type: 'textarea',
          required: true,
        },
        {
          name: 'dark',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Use dark background for this chapter (e.g. for the "Now" finale)',
          },
        },
        {
          name: 'layoutStyle',
          type: 'select',
          defaultValue: 'focused',
          options: [
            { label: 'Focused (Center)', value: 'focused' },
            { label: 'Side-by-Side', value: 'side' },
            { label: 'Cinematic (Wide)', value: 'cinematic' },
          ],
        },
        {
          name: 'milestoneIcon',
          type: 'text',
          admin: {
            description: 'Lucide icon name (e.g., Sparkles, Trophy, Rocket)',
          },
        },
      ],
    },
  ],
}
