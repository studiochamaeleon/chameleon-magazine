import { useState } from 'react';
import { Link } from 'react-router';
import { useArticles } from '../context/ArticleContext';
import { CategoryLabel, EditorPickLabel } from '../components/CategoryLabel';
import { ArticleCard } from '../components/ArticleCard';
import { CATEGORY_CONFIGS, ALL_CATEGORIES } from '../data/categories';

const INITIAL_COUNT = 3;
const LOAD_MORE = 6;

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
}

/* ── More Button ── */
function MoreButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex items-center justify-center mt-8 mb-2">
      <button
        onClick={onClick}
        className="group px-10 py-3 border border-black bg-white hover:bg-black transition-colors duration-200 flex items-center justify-center"
        style={{ borderRadius: 0, minWidth: 120 }}
      >
        <span
          className="text-black group-hover:text-white transition-colors"
          style={{
            fontFamily: 'var(--font-headline)',
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            lineHeight: 1,
          }}
        >
          MORE
        </span>
      </button>
    </div>
  );
}

/* ── Section Header ── */
function SectionHeader({
  label,
  color,
  textColor,
  to,
}: {
  label: string;
  color?: string;
  textColor?: string;
  to: string;
}) {
  const bg = color ?? '#000000';
  const fg = textColor ?? '#ffffff';

  return (
    <div className="flex items-center mb-5 pb-2.5 border-b-2 border-black">
      <Link
        to={to}
        className="hover:opacity-70 transition-opacity"
        style={{ textDecoration: 'none' }}
      >
        <span
          className="inline-block font-bold tracking-widest leading-none px-3 py-1 text-xs"
          style={{
            backgroundColor: bg,
            color: fg,
            fontFamily: 'var(--font-body)',
          }}
        >
          {label.toUpperCase()}
        </span>
      </Link>
    </div>
  );
}

export function Home() {
  const { articles, loading, error } = useArticles();

  const [editorsVisible, setEditorsVisible] = useState(INITIAL_COUNT);
  const [newsVisible, setNewsVisible] = useState(INITIAL_COUNT);
  const [listenVisible, setListenVisible] = useState(INITIAL_COUNT);
  const [visualVisible, setVisualVisible] = useState(INITIAL_COUNT);
  const [cultureVisible, setCultureVisible] = useState(INITIAL_COUNT);

  const featured = articles.find((a) => a.isEditorsPick) ?? articles[0];
  const heroSideArticles = articles.filter((a) => a.id !== featured?.id).slice(0, 5);

  const allEditorsPicks = articles.filter((a) => a.isEditorsPick);
  const allNews = articles.filter((a) => a.category === 'news');
  const allListen = articles.filter((a) => a.category === 'listen');
  const allVisual = articles.filter((a) => a.category === 'visual');
  const allCulture = articles.filter((a) => a.category === 'culture');

  const editorsPicks = allEditorsPicks.slice(0, editorsVisible);
  const newsArticles = allNews.slice(0, newsVisible);
  const listenArticles = allListen.slice(0, listenVisible);
  const visualArticles = allVisual.slice(0, visualVisible);
  const cultureArticles = allCulture.slice(0, cultureVisible);

  const newsCfg = CATEGORY_CONFIGS['news'];
  const listenCfg = CATEGORY_CONFIGS['listen'];
  const visualCfg = CATEGORY_CONFIGS['visual'];
  const cultureCfg = CATEGORY_CONFIGS['culture'];

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center px-6 text-center">
        <p
          className="text-black"
          style={{ fontFamily: 'var(--font-headline)', fontSize: '1rem', fontWeight: 800, letterSpacing: '0.08em' }}
        >
          LOADING CHAMELEON MAGAZINE
        </p>
      </div>
    );
  }

  if (error || articles.length === 0) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center px-6 text-center">
        <div>
          <p
            className="text-black"
            style={{ fontFamily: 'var(--font-headline)', fontSize: '1rem', fontWeight: 900, letterSpacing: '0.08em' }}
          >
            SANITY ARTICLES NOT LOADED
          </p>
          <p className="mt-3 text-sm text-gray-500" style={{ fontFamily: 'var(--font-body)' }}>
            {error ?? 'Sanity에 발행된 기사가 없거나 공개 데이터셋에서 조회되지 않습니다.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>

      {/* ── BREAKING TICKER ── */}
      <div className="border-b border-black bg-black overflow-hidden">
        <div className="flex items-stretch">
          <div
            className="flex-shrink-0 flex items-center px-4 bg-white border-r border-black z-10"
            style={{
              fontFamily: 'var(--font-headline)',
              fontSize: '0.6rem',
              fontWeight: 900,
              letterSpacing: '0.2em',
              minWidth: 80,
            }}
          >
            LATEST
          </div>
          <div className="overflow-hidden flex-1 py-2">
            <div
              className="flex gap-0 whitespace-nowrap"
              style={{ animation: 'ticker 40s linear infinite' }}
            >
              {[...articles.slice(0, 8), ...articles.slice(0, 8)].map((a, i) => (
                <Link
                  key={`${a.id}-${i}`}
                  to={`/article/${a.id}`}
                  className="inline-flex items-center gap-3 text-white hover:text-gray-300 transition-colors px-6"
                  style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem' }}
                >
                  <span className="w-1 h-1 bg-gray-500 rounded-full flex-shrink-0" />
                  {a.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* ── HERO ZONE ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-black pt-6 pb-0">

          {/* Main Hero — 2 cols */}
          {featured && (
            <Link
              to={`/article/${featured.id}`}
              className="md:col-span-2 block group md:pr-7 md:border-r border-black pb-7"
            >
              {featured.coverImage && (
                <div className="overflow-hidden w-full" style={{ aspectRatio: '3/2' }}>
                  <img
                    src={featured.coverImage}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                  />
                </div>
              )}
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  {featured.isEditorsPick && <EditorPickLabel size="md" />}
                  <CategoryLabel
                    category={featured.category}
                    subcategory={featured.subcategory ?? undefined}
                    size="md"
                  />
                </div>
                <h1
                  className="text-black group-hover:text-gray-500 transition-colors leading-tight"
                  style={{
                    fontFamily: 'var(--font-headline)',
                    fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
                    fontWeight: 900,
                  }}
                >
                  {featured.title}
                </h1>
                <p
                  className="text-gray-600 mt-2 line-clamp-2"
                  style={{ fontSize: '0.9rem', lineHeight: 1.6 }}
                >
                  {featured.excerpt}
                </p>
                <p className="text-gray-400 mt-2.5" style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}>
                  {featured.author} · {formatDate(featured.date)}
                </p>
              </div>
            </Link>
          )}

          {/* Right Sidebar Stack */}
          <div className="md:pl-7 pb-7 pt-0 md:pt-0 border-t md:border-t-0 border-black">
            <div
              className="text-black mb-3 pt-5 md:pt-0 pb-2.5 border-b border-black"
              style={{
                fontFamily: 'var(--font-headline)',
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '0.14em',
              }}
            >
              MORE STORIES
            </div>
            <div className="divide-y divide-gray-100">
              {heroSideArticles.map((article) => (
                <Link
                  key={article.id}
                  to={`/article/${article.id}`}
                  className="group flex gap-3 items-start py-3.5 first:pt-3"
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
                      className="w-[72px] h-[72px] object-cover flex-shrink-0"
                      style={{ borderRadius: 1 }}
                    />
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── EDITOR'S PICK STRIP ── */}
        {allEditorsPicks.length > 0 && (
          <section className="pt-10 pb-10 border-b border-black">
            <SectionHeader label="EDITOR'S PICK" to="/category/editors-pick" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
              {editorsPicks.map((article) => (
                <ArticleCard key={article.id} article={article} variant="standard" />
              ))}
            </div>
            {editorsVisible < allEditorsPicks.length && (
              <MoreButton onClick={() => setEditorsVisible((v) => v + LOAD_MORE)} />
            )}
          </section>
        )}

        {/* ── NEWS ── */}
        {allNews.length > 0 && (
          <section className="pt-10 pb-10 border-b border-black">
            <SectionHeader label="NEWS" color={newsCfg.color} textColor={newsCfg.textColor} to="/category/news" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
              {newsArticles.map((article) => (
                <ArticleCard key={article.id} article={article} variant="standard" />
              ))}
            </div>
            {newsVisible < allNews.length && (
              <MoreButton onClick={() => setNewsVisible((v) => v + LOAD_MORE)} />
            )}
          </section>
        )}

        {/* ── LISTEN ── */}
        {allListen.length > 0 && (
          <section className="pt-10 pb-10 border-b border-black">
            <SectionHeader label="LISTEN" color={listenCfg.color} textColor={listenCfg.textColor} to="/category/listen" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
              {listenArticles.map((article) => (
                <ArticleCard key={article.id} article={article} variant="standard" />
              ))}
            </div>
            {listenVisible < allListen.length && (
              <MoreButton onClick={() => setListenVisible((v) => v + LOAD_MORE)} />
            )}
          </section>
        )}

        {/* ── VISUAL + CULTURE side-by-side ── */}
        {(allVisual.length > 0 || allCulture.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 pt-10 pb-10">
            {/* Visual */}
            {allVisual.length > 0 && (
              <section className="md:pr-8 md:border-r border-black pb-10 md:pb-0">
                <SectionHeader label="VISUAL" color={visualCfg.color} textColor={visualCfg.textColor} to="/category/visual" />
                <div className="space-y-6">
                  {visualArticles.map((article, i) => (
                    i === 0 ? (
                      <ArticleCard key={article.id} article={article} variant="standard" />
                    ) : (
                      <ArticleCard key={article.id} article={article} variant="list" />
                    )
                  ))}
                </div>
                {visualVisible < allVisual.length && (
                  <MoreButton onClick={() => setVisualVisible((v) => v + LOAD_MORE)} />
                )}
              </section>
            )}

            {/* Culture */}
            {allCulture.length > 0 && (
              <section className="md:pl-8 border-t md:border-t-0 border-black pt-10 md:pt-0">
                <SectionHeader label="CULTURE" color={cultureCfg.color} textColor={cultureCfg.textColor} to="/category/culture" />
                <div className="space-y-6">
                  {cultureArticles.map((article, i) => (
                    i === 0 ? (
                      <ArticleCard key={article.id} article={article} variant="standard" />
                    ) : (
                      <ArticleCard key={article.id} article={article} variant="list" />
                    )
                  ))}
                </div>
                {cultureVisible < allCulture.length && (
                  <MoreButton onClick={() => setCultureVisible((v) => v + LOAD_MORE)} />
                )}
              </section>
            )}
          </div>
        )}

        {/* ── CATEGORY QUICK LINKS ── */}
        <div className="border-t border-black pt-8 pb-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {ALL_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                className="group flex items-center justify-between p-4 border border-black hover:bg-black transition-colors duration-200"
                style={{ borderRadius: 2 }}
              >
                <div>
                  <div
                    className="group-hover:text-white transition-colors"
                    style={{
                      fontFamily: 'var(--font-headline)',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      letterSpacing: '0.08em',
                      color: cat.color,
                    }}
                  >
                    {cat.label.toUpperCase()}
                  </div>
                  <div
                    className="text-gray-400 group-hover:text-gray-300 transition-colors mt-0.5"
                    style={{ fontSize: '0.68rem' }}
                  >
                    {cat.subcategories.map((s) => s.label).join(' · ')}
                  </div>
                </div>
                <span
                  className="text-gray-300 group-hover:text-white transition-colors"
                  style={{ fontSize: '1rem' }}
                >
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
