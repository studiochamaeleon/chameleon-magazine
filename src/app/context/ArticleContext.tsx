import React, { createContext, useContext, useEffect, useState } from 'react';
import { Article } from '../data/articles';
import { fetchPublishedArticles } from '../lib/sanityQueries';

interface ArticleContextValue {
  articles: Article[];          // published only (독자용)
  allArticles: Article[];       // 전체 (어드민용)
  loading: boolean;
  error: string | null;
  getArticleById: (id: string) => Article | undefined;
  getArticleBySlug: (slug: string) => Article | undefined;
  searchArticles: (query: string) => Article[];
}

const ArticleContext = createContext<ArticleContextValue | null>(null);

export function ArticleProvider({ children }: { children: React.ReactNode }) {
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadArticles() {
      try {
        setLoading(true);
        setError(null);
        const sanityArticles = await fetchPublishedArticles();
        if (!ignore) {
          setAllArticles(sanityArticles);
        }
      } catch (err) {
        if (!ignore) {
          setAllArticles([]);
          setError(err instanceof Error ? err.message : 'Sanity에서 기사를 불러오지 못했습니다.');
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadArticles();

    return () => {
      ignore = true;
    };
  }, []);

  // 독자에게 노출되는 기사 — published 상태만
  const articles = allArticles.filter((a) => !a.status || a.status === 'published');

  const getArticleById = (id: string) => allArticles.find((a) => a.id === id || a.slug === id);
  const getArticleBySlug = (slug: string) => allArticles.find((a) => a.slug === slug || a.id === slug);

  const searchArticles = (query: string) => {
    const q = query.toLowerCase();
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q)) ||
        a.author.toLowerCase().includes(q)
    );
  };

  return (
    <ArticleContext.Provider
      value={{
        articles,
        allArticles,
        loading,
        error,
        getArticleById,
        getArticleBySlug,
        searchArticles,
      }}
    >
      {children}
    </ArticleContext.Provider>
  );
}

export function useArticles() {
  const ctx = useContext(ArticleContext);
  if (!ctx) throw new Error('useArticles must be used within ArticleProvider');
  return ctx;
}
