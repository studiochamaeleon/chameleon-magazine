import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router';
import { useArticles } from '../context/ArticleContext';
import { ArticleCard } from '../components/ArticleCard';
import { CategoryLabel, EditorPickLabel } from '../components/CategoryLabel';
import { CATEGORY_CONFIGS, Subcategory, Category } from '../data/categories';

const INITIAL_BATCH = 9;
const LOAD_MORE_BATCH = 6;

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
}

/* ── Editors Pick Page ── */
function EditorsPick() {
  const { articles } = useArticles();
  const [visible, setVisible] = useState(INITIAL_BATCH);
  const picks = articles.filter((a) => a.isEditorsPick);
  const shown = picks.slice(0, visible);
  const hasMore = visible < picks.length;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6">
      {/* Header */}
      <div className="border-b-2 border-black pt-8 pb-5 mb-8">
        <p className="text-gray-400 mb-1" style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', letterSpacing: '0.12em' }}>
          CURATION
        </p>
        <h1
          className="text-black"
          style={{ fontFamily: 'var(--font-headline)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, letterSpacing: '-0.01em' }}
        >
          EDITOR'S PICK
        </h1>
        <p className="text-gray-500 mt-1.5" style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem' }}>
          에디터가 선택한 이 매거진의 대표 기사들
        </p>
      </div>

      {picks.length === 0 ? (
        <div className="text-center py-24 text-gray-400" style={{ fontFamily: 'var(--font-body)' }}>
          아직 에디터 픽 기사가 없습니다.
        </div>
      ) : (
        <>
          {/* Hero + Side Stack */}
          <HeroSection articles={shown} />

          {/* Grid (articles 3+) */}
          {shown.length > 3 && (
            <>
              <div className="border-t border-black pt-8 mt-4 mb-6">
                <span
                  className="text-black"
                  style={{ fontFamily: 'var(--font-headline)', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.14em' }}
                >
                  MORE STORIES
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 mb-10">
                {shown.slice(3).map((article) => (
                  <ArticleCard key={article.id} article={article} variant="standard" />
                ))}
              </div>
            </>
          )}

          {/* Load More */}
          {hasMore && (
            <LoadMoreButton onClick={() => setVisible((v) => v + LOAD_MORE_BATCH)} />
          )}
          {!hasMore && picks.length > 0 && (
            <EndMessage count={picks.length} />
          )}
        </>
      )}
    </div>
  );
}

/* ── Hero + Side Stack shared component ── */
function HeroSection({ articles }: { articles: ReturnType<typeof useArticles>['articles'] }) {
  const hero = articles[0];
  const sideArticles = articles.slice(1, 4);
  if (!hero) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-black pb-8 mb-4">
      {/* Hero Article */}
      <Link
        to={`/article/${hero.id}`}
        className="md:col-span-2 block group md:pr-8 md:border-r border-black pb-8 md:pb-0"
      >
        {hero.coverImage && (
          <div className="overflow-hidden w-full" style={{ aspectRatio: '16/9' }}>
            <img
              src={hero.coverImage}
              alt={hero.title}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
            />
          </div>
        )}
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2">
            {hero.isEditorsPick && <EditorPickLabel size="md" />}
            <CategoryLabel
              category={hero.category}
              subcategory={hero.subcategory ?? undefined}
              size="md"
            />
          </div>
          <h2
            className="text-black group-hover:text-gray-500 transition-colors leading-tight"
            style={{
              fontFamily: 'var(--font-headline)',
              fontSize: 'clamp(1.4rem, 3vw, 2rem)',
              fontWeight: 900,
            }}
          >
            {hero.title}
          </h2>
          <p className="text-gray-600 mt-2 line-clamp-2" style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem' }}>
            {hero.excerpt}
          </p>
          <p className="text-gray-400 mt-2" style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', letterSpacing: '0.04em' }}>
            {hero.author} · {formatDate(hero.date)}
          </p>
        </div>
      </Link>

      {/* Side Stack */}
      <div className="md:pl-8 pt-6 md:pt-0 border-t md:border-t-0 border-gray-100">
        <div className="divide-y divide-gray-100">
          {sideArticles.map((article) => (
            <Link
              key={article.id}
              to={`/article/${article.id}`}
              className="group flex gap-3 items-start py-4 first:pt-0"
            >
              <div className="flex-1 min-w-0">
                <div className="mb-1">
                  <CategoryLabel
                    category={article.category}
                    subcategory={article.subcategory ?? undefined}
                    size="sm"
                  />
                </div>
                <h3
                  className="text-black group-hover:text-gray-500 transition-colors leading-snug line-clamp-2"
                  style={{ fontFamily: 'var(--font-headline)', fontSize: '0.9rem', fontWeight: 700 }}
                >
                  {article.title}
                </h3>
                <p className="text-gray-400 mt-0.5" style={{ fontSize: '0.68rem' }}>
                  {formatDate(article.date)}
                </p>
              </div>
              {article.coverImage && (
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-[68px] h-[68px] object-cover flex-shrink-0"
                  style={{ borderRadius: 1 }}
                />
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Load More Button ── */
function LoadMoreButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex justify-center pt-4 pb-16">
      <button
        onClick={onClick}
        className="group flex items-center gap-3 px-8 py-3 border border-black hover:bg-black transition-colors duration-200"
        style={{ borderRadius: 2 }}
      >
        <span
          className="text-black group-hover:text-white transition-colors"
          style={{ fontFamily: 'var(--font-headline)', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.12em' }}
        >
          기사 더 보기
        </span>
        <span className="text-gray-400 group-hover:text-white transition-colors" style={{ fontSize: '0.9rem' }}>↓</span>
      </button>
    </div>
  );
}

/* ── End Message ── */
function EndMessage({ count }: { count: number }) {
  return (
    <div className="flex flex-col items-center gap-2 pt-4 pb-16">
      <div className="w-12 h-px bg-black" />
      <p className="text-gray-400 mt-2" style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem' }}>
        총 {count}개의 기사를 모두 읽었습니다.
      </p>
    </div>
  );
}

/* ── Main Category Page ── */
export function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { articles } = useArticles();
  const [visible, setVisible] = useState(INITIAL_BATCH);

  const activeSub = searchParams.get('sub') as Subcategory | null;

  // Reset visible count when filter changes
  useEffect(() => {
    setVisible(INITIAL_BATCH);
  }, [activeSub, category]);

  if (category === 'editors-pick') {
    return <EditorsPick />;
  }

  const catConfig = category ? CATEGORY_CONFIGS[category as Category] : null;
  if (!catConfig) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-400" style={{ fontFamily: 'var(--font-body)' }}>존재하지 않는 카테고리입니다.</p>
        <Link to="/" className="mt-4 inline-block text-black" style={{ textDecoration: 'underline' }}>홈으로</Link>
      </div>
    );
  }

  const allFiltered = articles.filter((a) => {
    if (a.category !== catConfig.id) return false;
    if (activeSub && a.subcategory !== activeSub) return false;
    return true;
  });

  const shown = allFiltered.slice(0, visible);
  const hasMore = visible < allFiltered.length;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6">

      {/* ── Category Header ── */}
      <div
        className="pt-8 pb-5 mb-0"
        style={{ borderTop: `5px solid ${catConfig.color}` }}
      >
        <p
          className="text-gray-400 mb-1"
          style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', letterSpacing: '0.14em' }}
        >
          CATEGORY
        </p>
        <h1
          className="text-black"
          style={{
            fontFamily: 'var(--font-headline)',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 900,
            letterSpacing: '-0.01em',
          }}
        >
          {catConfig.label.toUpperCase()}
        </h1>
      </div>

      {/* ── Subcategory Filter Tabs ── */}
      <div className="flex flex-wrap gap-2 py-4 border-b-2 border-black mb-8">
        <button
          onClick={() => setSearchParams({})}
          className="px-4 py-1.5 border focus:outline-none transition-colors"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.78rem',
            fontWeight: activeSub === null ? 700 : 400,
            backgroundColor: activeSub === null ? '#000000' : 'transparent',
            color: activeSub === null ? '#ffffff' : '#000000',
            borderColor: activeSub === null ? '#000000' : '#d1d5db',
            borderRadius: 2,
          }}
        >
          전체
        </button>
        {catConfig.subcategories.map((sub) => (
          <button
            key={sub.id}
            onClick={() => setSearchParams({ sub: sub.id })}
            className="px-4 py-1.5 border focus:outline-none transition-colors"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.78rem',
              fontWeight: activeSub === sub.id ? 700 : 400,
              backgroundColor: activeSub === sub.id ? sub.color : 'transparent',
              color: activeSub === sub.id ? sub.textColor : '#000000',
              borderColor: activeSub === sub.id ? sub.color : '#d1d5db',
              borderRadius: 2,
            }}
          >
            {sub.label}
          </button>
        ))}

        {/* Article count — right-aligned */}
        <span
          className="ml-auto self-center text-gray-400"
          style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem' }}
        >
          {allFiltered.length}개의 기사
        </span>
      </div>

      {/* ── Articles ── */}
      {allFiltered.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-gray-400" style={{ fontFamily: 'var(--font-body)' }}>
            {activeSub ? '이 소분류에 아직 기사가 없습니다.' : '이 카테고리에 아직 기사가 없습니다.'}
          </p>
        </div>
      ) : (
        <>
          {/* Hero + Side Stack */}
          <HeroSection articles={shown} />

          {/* Latest Section Label */}
          {shown.length > 3 && (
            <div className="border-t border-black pt-8 mt-4 mb-6">
              <span
                className="text-black"
                style={{ fontFamily: 'var(--font-headline)', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.14em' }}
              >
                LATEST IN {catConfig.label.toUpperCase()}
              </span>
            </div>
          )}

          {/* Articles Grid */}
          {shown.length > 3 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 mb-10">
              {shown.slice(3).map((article) => (
                <ArticleCard key={article.id} article={article} variant="standard" />
              ))}
            </div>
          )}

          {/* Load More / End */}
          {hasMore ? (
            <LoadMoreButton onClick={() => setVisible((v) => v + LOAD_MORE_BATCH)} />
          ) : (
            <EndMessage count={allFiltered.length} />
          )}
        </>
      )}
    </div>
  );
}
