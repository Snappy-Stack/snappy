import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
  },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  upload: {
    // Disable local storage since S3 is handling the files
    disableLocalStorage: true,
  },
  hooks: {
    beforeChange: [
      ({ data, req }) => {
        // If a file was uploaded and a category is set, prepend the category to the filename
        // The S3 plugin uses the filename to determine the final path within the bucket
        // (bucket + plugin_prefix + filename)
        if (data.filename && data.category) {
          const folderPrefix = `${data.category}/`
          if (!data.filename.startsWith(folderPrefix)) {
            data.filename = `${folderPrefix}${data.filename}`
          }
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Brand / Identity', value: 'brand' },
        { label: 'Logo Assets', value: 'logo' },
        { label: 'Favicons / Icons', value: 'favicon' },
        { label: 'Project Assets', value: 'project' },
        { label: 'Blog Content', value: 'post' },
        { label: 'Other', value: 'other' },
      ],
      defaultValue: 'other',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tags',
      type: 'text',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
