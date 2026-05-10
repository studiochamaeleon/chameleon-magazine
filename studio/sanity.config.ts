import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemaTypes';
import { ArticlePreview } from './components/ArticlePreview';

export default defineConfig({
  name: 'chameleon-magazine',
  title: 'CHAMELEON MAGAZINE',
  projectId: 'a5gektp6',
  dataset: 'production',
  plugins: [
    structureTool({
      defaultDocumentNode: (S, { schemaType }) => {
        if (schemaType === 'article') {
          return S.document().views([
            S.view.form(),
            S.view.component(ArticlePreview).title('Preview'),
          ]);
        }

        return S.document();
      },
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
});
