import { sanityConfig, urlFor } from './sanityClient';
import type { Article } from '../data/articles';
import type { Category, Subcategory } from '../data/categories';

interface SanityArticle {
  _id: string;
  title?: string;
  slug?: { current?: string };
  excerpt?: string;
  category?: Category;
  subcategory?: Subcategory | null;
  tags?: string[];
  isEditorsPick?: boolean;
  publishedAt?: string;
  author?: string;
  coverImage?: unknown;
  coverImageCaption?: string;
  coverImageCredit?: string;
  body?: unknown[];
  relatedArticles?: { _id: string }[];
}

const articleProjection = `{
  _id,
  title,
  slug,
  excerpt,
  category,
  subcategory,
  tags,
  isEditorsPick,
  publishedAt,
  author,
  coverImage,
  coverImageCaption,
  coverImageCredit,
  body,
  relatedArticles[]->{ _id }
}`;

const publishedArticlesQuery = `*[
  _type == "article" &&
  defined(slug.current) &&
  defined(publishedAt) &&
  !(_id in path("drafts.**"))
] | order(publishedAt desc) ${articleProjection}`;

function toArticle(doc: SanityArticle): Article {
  return {
    id: doc._id,
    title: doc.title ?? 'Untitled',
    slug: doc.slug?.current ?? doc._id,
    excerpt: doc.excerpt ?? '',
    category: doc.category ?? 'news',
    subcategory: doc.subcategory ?? null,
    tags: doc.tags ?? [],
    isEditorsPick: doc.isEditorsPick ?? false,
    date: doc.publishedAt ?? new Date().toISOString(),
    author: doc.author ?? 'CHAMELEON Editorial',
    coverImage: doc.coverImage ? urlFor(doc.coverImage).width(1600).height(900).fit('crop').auto('format').url() : '',
    coverImageCaption: doc.coverImageCaption ?? '',
    coverImageCredit: doc.coverImageCredit ?? '',
    body: '',
    bodyBlocks: doc.body ?? [],
    relatedArticles: doc.relatedArticles?.map((article) => article._id) ?? [],
    status: 'published',
  };
}

export async function fetchPublishedArticles(): Promise<Article[]> {
  const endpoint = `https://${sanityConfig.projectId}.api.sanity.io/v${sanityConfig.apiVersion}/data/query/${sanityConfig.dataset}`;
  const response = await fetch(`${endpoint}?${new URLSearchParams({ query: publishedArticlesQuery })}`);

  if (!response.ok) {
    throw new Error(`Sanity query failed: ${response.status}`);
  }

  const payload = await response.json() as { result?: SanityArticle[] };
  const docs = payload.result ?? [];
  return docs.map(toArticle);
}
