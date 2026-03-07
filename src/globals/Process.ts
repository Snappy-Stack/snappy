import type { GlobalConfig } from 'payload'

export const Process: GlobalConfig = {
  slug: 'process',
  label: 'Working Process',
  access: {
    read: () => true, // Public access
  },
  admin: {
    group: 'Portfolio',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'My Approach',
      label: 'Section Title',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtitle / Introduction',
    },
    {
      name: 'steps',
      type: 'array',
      label: 'Process Steps',
      minRows: 1,
      fields: [
        {
          name: 'stepName',
          type: 'text',
          required: true,
          label: 'Step Name (e.g. Discovery, Design)',
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          label: 'Description of the step',
        },
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          label: 'Icon (Optional)',
        },
      ],
    },
  ],
}
