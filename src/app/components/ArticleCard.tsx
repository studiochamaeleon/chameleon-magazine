import { Link } from 'react-router';
import { Article } from '../data/articles';
import { CategoryLabel, EditorPickLabel } from './CategoryLabel';

interface ArticleCardProps {
  article: Article;
  variant?: 'featured' | 'standard' | 'compact' | 'list';
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function ArticleCard({ article, variant = 'standard' }: ArticleCardProps) {
  if (variant === 'list') {
    return (
      <Link to={`/article/${article.id}`} className="block group">
        <article className="py-3 border-b border-gray-200 flex gap-3 items-start hover:bg-gray-50 transition-colors px-1">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {article.isEditorsPick && <EditorPickLabel />}
              <CategoryLabel
                category={article.category}
                subcategory={article.subcategory ?? undefined}
              />
            </div>
            <h3
              className="leading-snug line-clamp-2 text-black group-hover:text-gray-500 transition-colors"
              style={{ fontFamily: 'var(--font-headline)', fontSize: '0.95rem', fontWeight: 700 }}
            >
              {article.title}
            </h3>
            <p className="text-gray-500 mt-0.5" style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem' }}>
              {formatDate(article.date)}
            </p>
          </div>
          {article.coverImage && (
            <div className="w-16 h-16 bg-gray-50 flex-shrink-0 overflow-hidden" style={{ borderRadius: 2 }}>
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </article>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link to={`/article/${article.id}`} className="block group">
        <article className="overflow-hidden">
          {article.coverImage && (
            <div className="overflow-hidden bg-gray-50" style={{ aspectRatio: '16/9' }}>
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
          <div className="pt-2">
            <div className="flex items-center gap-2 mb-1.5">
              {article.isEditorsPick && <EditorPickLabel />}
              <CategoryLabel
                category={article.category}
                subcategory={article.subcategory ?? undefined}
              />
            </div>
            <h3
              className="leading-tight line-clamp-2 text-black group-hover:text-gray-500 transition-colors"
              style={{ fontFamily: 'var(--font-headline)', fontSize: '1rem', fontWeight: 700 }}
            >
              {article.title}
            </h3>
            <p className="text-gray-500 mt-1.5 line-clamp-2" style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem' }}>
              {article.excerpt}
            </p>
            <p className="text-gray-400 mt-1.5" style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem' }}>
              {formatDate(article.date)}
            </p>
          </div>
        </article>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link to={`/article/${article.id}`} className="block group h-full">
        <article className="h-full flex flex-col">
          {article.coverImage && (
            <div className="overflow-hidden flex-shrink-0 bg-gray-50" style={{ aspectRatio: '4/3' }}>
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}
          <div className="pt-4 flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              {article.isEditorsPick && <EditorPickLabel size="md" />}
              <CategoryLabel
                category={article.category}
                subcategory={article.subcategory ?? undefined}
                size="md"
              />
            </div>
            <h2
              className="leading-tight text-black group-hover:text-gray-500 transition-colors flex-1"
              style={{ fontFamily: 'var(--font-headline)', fontSize: '1.5rem', fontWeight: 800 }}
            >
              {article.title}
            </h2>
            <p className="text-gray-600 mt-2 line-clamp-2" style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem' }}>
              {article.excerpt}
            </p>
            <p className="text-gray-400 mt-2" style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem' }}>
              {article.author} · {formatDate(article.date)}
            </p>
          </div>
        </article>
      </Link>
    );
  }

  // standard
  return (
    <Link to={`/article/${article.id}`} className="block group">
      <article className="overflow-hidden">
        {article.coverImage && (
          <div className="overflow-hidden bg-gray-50" style={{ aspectRatio: '16/9' }}>
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="pt-3">
          <div className="flex items-center gap-2 mb-1.5">
            {article.isEditorsPick && <EditorPickLabel />}
            <CategoryLabel
              category={article.category}
              subcategory={article.subcategory ?? undefined}
            />
          </div>
          <h3
            className="leading-tight line-clamp-3 text-black group-hover:text-gray-500 transition-colors"
            style={{ fontFamily: 'var(--font-headline)', fontSize: '1.125rem', fontWeight: 700 }}
          >
            {article.title}
          </h3>
          <p className="text-gray-600 mt-1.5 line-clamp-2" style={{ fontFamily: 'var(--font-body)', fontSize: '0.825rem' }}>
            {article.excerpt}
          </p>
          <p className="text-gray-400 mt-1.5" style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem' }}>
            {article.author} · {formatDate(article.date)}
          </p>
        </div>
      </article>
    </Link>
  );
}
