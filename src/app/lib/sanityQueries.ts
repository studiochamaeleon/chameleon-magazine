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
  isHomepageHero?: boolean;
  publishedAt?: string;
  author?: string;
  coverType?: 'image' | 'youtube' | 'instagram' | 'embed';
  coverImage?: unknown;
  coverImageCaption?: string;
  coverImageCredit?: string;
  coverYouTubeUrl?: string;
  coverYouTubeCaption?: string;
  coverEmbedUrl?: string;
  coverEmbedTitle?: string;
  coverEmbedCaption?: string;
  coverEmbedHeight?: number;
  body?: unknown[];
  relatedArticles?: { _id: string }[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  seoImage?: unknown;
  canonicalUrl?: string;
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
  isHomepageHero,
  publishedAt,
  author,
  coverType,
  coverImage,
  coverImageCaption,
  coverImageCredit,
  coverYouTubeUrl,
  coverYouTubeCaption,
  coverEmbedUrl,
  coverEmbedTitle,
  coverEmbedCaption,
  coverEmbedHeight,
  body,
  relatedArticles[]->{ _id },
  seoTitle,
  seoDescription,
  seoKeywords,
  seoImage,
  canonicalUrl
}`;

const publishedArticlesQuery = `*[
  _type == "article" &&
  defined(slug.current) &&
  defined(publishedAt) &&
  dateTime(publishedAt) <= dateTime(now()) &&
  !(_id in path("drafts.**"))
] | order(publishedAt desc) ${articleProjection}`;

function getYouTubeId(url?: string) {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.slice(1) || null;
    }
    if (parsed.pathname.includes('/shorts/')) {
      return parsed.pathname.split('/shorts/')[1]?.split('/')[0] ?? null;
    }
    if (parsed.pathname.includes('/embed/')) {
      return parsed.pathname.split('/embed/')[1]?.split('/')[0] ?? null;
    }
    return parsed.searchParams.get('v');
  } catch {
    return null;
  }
}

function getYouTubeThumbnail(url?: string) {
  const videoId = getYouTubeId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';
}

function toArticle(doc: SanityArticle): Article {
  const coverType = doc.coverType ?? 'image';
  const imageCover = doc.coverImage ? urlFor(doc.coverImage).width(1600).auto('format').url() : '';
  const youtubeCover = getYouTubeThumbnail(doc.coverYouTubeUrl);
  const seoImage = doc.seoImage ? urlFor(doc.seoImage).width(1200).height(630).fit('crop').auto('format').url() : '';

  return {
    id: doc._id,
    title: doc.title ?? 'Untitled',
    slug: doc.slug?.current ?? doc._id,
    excerpt: doc.excerpt ?? '',
    category: doc.category ?? 'news',
    subcategory: doc.subcategory ?? null,
    tags: doc.tags ?? [],
    isEditorsPick: doc.isEditorsPick ?? false,
    isHomepageHero: doc.isHomepageHero ?? false,
    date: doc.publishedAt ?? new Date().toISOString(),
    author: doc.author ?? 'CHAMELEON Editorial',
    coverType,
    coverImage: coverType === 'youtube' ? youtubeCover : imageCover,
    coverImageCaption: doc.coverImageCaption ?? '',
    coverImageCredit: doc.coverImageCredit ?? '',
    coverYouTubeUrl: doc.coverYouTubeUrl ?? '',
    coverYouTubeCaption: doc.coverYouTubeCaption ?? '',
    coverEmbedUrl: doc.coverEmbedUrl ?? '',
    coverEmbedTitle: doc.coverEmbedTitle ?? '',
    coverEmbedCaption: doc.coverEmbedCaption ?? '',
    coverEmbedHeight: doc.coverEmbedHeight,
    body: '',
    bodyBlocks: doc.body ?? [],
    relatedArticles: doc.relatedArticles?.map((article) => article._id) ?? [],
    seoTitle: doc.seoTitle ?? '',
    seoDescription: doc.seoDescription ?? '',
    seoKeywords: doc.seoKeywords ?? [],
    seoImage,
    canonicalUrl: doc.canonicalUrl ?? '',
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
