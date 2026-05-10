import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const sanityConfig = {
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'a5gektp6',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion: import.meta.env.VITE_SANITY_API_VERSION || '2025-08-15',
  useCdn: false,
};

export const sanityClient = createClient(sanityConfig);

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: unknown) {
  return builder.image(source);
}
