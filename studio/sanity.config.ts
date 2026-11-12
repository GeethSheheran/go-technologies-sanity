import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemaTypes'
import catalog from '../src/sanity/catalog.json'

export default defineConfig({
  name: 'default',
  title: 'Go Technologies',
  projectId: 'pk1w379x',
  dataset: 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Website Content')
          .items(
            catalog.map((entry) =>
              S.listItem()
                .id(entry.id)
                .title(entry.title)
                .child(S.document().schemaType(entry.type).documentId(entry.id).title(entry.title)),
            ),
          ),
    }),
  ],
  schema: {types: schemaTypes, templates: []},
  document: {
    actions: (actions) =>
      actions.filter(
        (action) => !['delete', 'duplicate', 'unpublish'].includes(action.action || ''),
      ),
  },
})
