import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'

import { schemaTypes, deskStructure } from './packages/schemas'

export default defineConfig({
  name: 'default',
  title: 'Suptia',

  projectId: 'fny3jdcg',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: deskStructure,
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})