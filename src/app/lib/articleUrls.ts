import type { Article } from '../data/articles';

export function getArticlePath(article: Pick<Article, 'id' | 'slug'>) {
  const segment = article.slug || article.id;
  return `/article/${encodeURIComponent(segment)}/`;
}
