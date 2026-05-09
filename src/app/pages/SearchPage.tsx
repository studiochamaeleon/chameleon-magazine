import { useSearchParams, Link } from 'react-router';
import { Search, ArrowLeft } from 'lucide-react';
import { useArticles } from '../context/ArticleContext';
import { ArticleCard } from '../components/ArticleCard';

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const { searchArticles } = useArticles();
  const query = searchParams.get('q') ?? '';
  const results = query ? searchArticles(query) : [];

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
      <div className="border-b-2 border-black pb-4 mb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-gray-500 hover:text-black transition-colors mb-4"
          style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem' }}
        >
          <ArrowLeft size={14} />
          홈
        </Link>
        <div className="flex items-center gap-3">
          <Search size={20} />
          <h1
            className="text-black"
            style={{ fontFamily: 'var(--font-headline)', fontSize: 'clamp(1.25rem, 3vw, 2rem)', fontWeight: 800 }}
          >
            "{query}" 검색 결과
          </h1>
        </div>
        <p className="text-gray-500 mt-2" style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem' }}>
          {results.length}개의 기사를 찾았습니다
        </p>
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {results.map((article) => (
            <ArticleCard key={article.id} article={article} variant="standard" />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Search size={40} className="text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400" style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem' }}>
            검색 결과가 없습니다.
          </p>
          <p className="text-gray-300 mt-2" style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem' }}>
            다른 검색어를 시도해보세요.
          </p>
        </div>
      )}
    </div>
  );
}
