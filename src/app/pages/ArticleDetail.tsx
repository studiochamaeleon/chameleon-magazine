import { useParams, Link } from 'react-router';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { useArticles } from '../context/ArticleContext';
import { ArticleCard } from '../components/ArticleCard';
import { CategoryLabel, EditorPickLabel } from '../components/CategoryLabel';
import { CATEGORY_CONFIGS, Category } from '../data/categories';
import ChameleonIcon from '../../imports/______2.svg';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const { getArticleById, articles } = useArticles();

  const article = id ? getArticleById(id) : undefined;

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-400 mb-4" style={{ fontFamily: 'var(--font-body)' }}>기사를 찾을 수 없습니다.</p>
        <Link to="/" className="text-black underline" style={{ fontFamily: 'var(--font-body)' }}>
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  const catConfig = CATEGORY_CONFIGS[article.category as Category];
  const accentColor = catConfig?.color ?? '#000000';

  const relatedArticles = (article.relatedArticles ?? [])
    .map((rid) => getArticleById(rid))
    .filter(Boolean)
    .slice(0, 3) as typeof articles;

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-8">
      {/* Back */}
      <Link
        to={catConfig ? `/category/${article.category}` : '/'}
        className="inline-flex items-center gap-1.5 text-gray-500 hover:text-black transition-colors mb-6"
        style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem' }}
      >
        <ArrowLeft size={14} />
        <span>{catConfig?.label ?? '홈'}</span>
      </Link>

      {/* Category Color Bar */}
      <div className="h-1 mb-6" style={{ backgroundColor: accentColor }} />

      {/* Labels */}
      <div className="flex items-center gap-2 mb-4">
        {article.isEditorsPick && <EditorPickLabel size="md" />}
        <CategoryLabel
          category={article.category as Category}
          subcategory={article.subcategory ?? undefined}
          size="md"
        />
      </div>

      {/* Title */}
      <h1
        className="text-black leading-tight mb-4"
        style={{ fontFamily: 'var(--font-headline)', fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', fontWeight: 800 }}
      >
        {article.title}
      </h1>

      {/* Excerpt */}
      <p
        className="text-gray-600 mb-4 leading-relaxed"
        style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem' }}
      >
        {article.excerpt}
      </p>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-4 text-gray-500 mb-6 pb-4 border-b border-gray-200"
        style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem' }}>
        <span className="flex items-center gap-1.5">
          <img src={ChameleonIcon} alt="author" style={{ width: 13, height: 13 }} />
          {article.author}
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar size={13} />
          {formatDate(article.date)}
        </span>
        {article.tags.length > 0 && (
          <span className="flex items-center gap-1.5 flex-wrap">
            <Tag size={13} />
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-gray-100 text-gray-600"
                style={{ fontSize: '0.72rem', borderRadius: 2 }}
              >
                #{tag}
              </span>
            ))}
          </span>
        )}
      </div>

      {/* Cover Image */}
      {article.coverImage && (
        <div className="overflow-hidden mb-8" style={{ aspectRatio: '16/9' }}>
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Body */}
      <div
        className="article-body text-black"
        dangerouslySetInnerHTML={{ __html: article.body }}
        style={{ fontFamily: 'var(--font-body)' }}
      />

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="mt-12">
          <div className="border-b-2 border-black pb-2 mb-6">
            <h2
              className="text-black"
              style={{ fontFamily: 'var(--font-headline)', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.12em' }}
            >
              RELATED ARTICLES
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedArticles.map((related) => (
              <ArticleCard key={related.id} article={related} variant="compact" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}