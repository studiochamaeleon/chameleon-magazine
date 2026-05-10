import { useEffect, useState } from 'react';
import { PortableText } from '@portabletext/react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { useArticles } from '../context/ArticleContext';
import { ArticleCard } from '../components/ArticleCard';
import { CategoryLabel, EditorPickLabel } from '../components/CategoryLabel';
import { CATEGORY_CONFIGS, Category } from '../data/categories';
import { urlFor } from '../lib/sanityClient';
import ChameleonIcon from '../../imports/______2.svg';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
}

function getYouTubeEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);
    const videoId = parsed.hostname.includes('youtu.be')
      ? parsed.pathname.slice(1)
      : parsed.searchParams.get('v');
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch {
    return null;
  }
}

const portableTextComponents = {
  types: {
    image: ({ value }: { value: { alt?: string; caption?: string } }) => (
      <figure className="my-8">
        <img
          src={urlFor(value).width(1400).auto('format').url()}
          alt={value.alt ?? ''}
          className="w-full"
        />
        {value.caption && (
          <figcaption className="mt-2 text-gray-500" style={{ fontSize: '0.78rem' }}>
            {value.caption}
          </figcaption>
        )}
      </figure>
    ),
    youtube: ({ value }: { value: { url?: string; caption?: string } }) => {
      const embedUrl = value.url ? getYouTubeEmbedUrl(value.url) : null;
      if (!embedUrl) return null;

      return (
        <figure className="my-8">
          <div className="w-full overflow-hidden bg-black" style={{ aspectRatio: '16/9' }}>
            <iframe
              src={embedUrl}
              title={value.caption ?? 'YouTube video'}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          {value.caption && (
            <figcaption className="mt-2 text-gray-500" style={{ fontSize: '0.78rem' }}>
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  block: {
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="mt-10 mb-4 leading-tight" style={{ fontFamily: 'var(--font-headline)', fontSize: '1.55rem', fontWeight: 800 }}>
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="mt-8 mb-3 leading-tight" style={{ fontFamily: 'var(--font-headline)', fontSize: '1.2rem', fontWeight: 800 }}>
        {children}
      </h3>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="my-6 border-l-4 border-black pl-4 text-gray-700">
        {children}
      </blockquote>
    ),
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="mb-5 leading-relaxed" style={{ fontSize: '1rem' }}>
        {children}
      </p>
    ),
  },
  marks: {
    link: ({ children, value }: { children?: React.ReactNode; value?: { href?: string } }) => (
      <a href={value?.href} target="_blank" rel="noreferrer" className="underline decoration-2 underline-offset-2">
        {children}
      </a>
    ),
  },
};

export function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const { getArticleById, articles } = useArticles();
  const [scrollProgress, setScrollProgress] = useState(0);

  const article = id ? getArticleById(id) : undefined;

  useEffect(() => {
    let animationFrame = 0;

    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress = scrollable > 0 ? window.scrollY / scrollable : 0;
      setScrollProgress(Math.min(Math.max(nextProgress, 0), 1));
    };

    const handleScroll = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(() => {
        updateProgress();
        animationFrame = 0;
      });
    };

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    setScrollProgress(0);
    updateProgress();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, [id]);

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
    <>
      <div
        className="fixed left-0 right-0 top-0 z-50 h-1 pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="h-full origin-left transition-transform duration-100 ease-linear"
          style={{
            backgroundColor: accentColor,
            transform: `scaleX(${scrollProgress})`,
          }}
        />
      </div>

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
        <figure className="mb-8">
          <div className="overflow-hidden" style={{ aspectRatio: '16/9' }}>
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
          {(article.coverImageCaption || article.coverImageCredit) && (
            <figcaption
              className="mt-3 text-gray-500"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {article.coverImageCaption && (
                <p className="leading-relaxed" style={{ fontSize: '0.82rem' }}>
                  {article.coverImageCaption}
                </p>
              )}
              {article.coverImageCredit && (
                <p
                  className="mt-1 uppercase"
                  style={{
                    fontSize: '0.72rem',
                    letterSpacing: '0.16em',
                    lineHeight: 1.5,
                  }}
                >
                  {article.coverImageCredit}
                </p>
              )}
            </figcaption>
          )}
        </figure>
      )}

      {/* Body */}
      <div className="article-body text-black" style={{ fontFamily: 'var(--font-body)' }}>
        {article.bodyBlocks && article.bodyBlocks.length > 0 ? (
          <PortableText value={article.bodyBlocks as any} components={portableTextComponents} />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: article.body }} />
        )}
      </div>

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
    </>
  );
}
