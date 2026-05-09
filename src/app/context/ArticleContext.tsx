import React, { createContext, useContext, useEffect, useState } from 'react';
import { Article, MOCK_ARTICLES } from '../data/articles';

const STORAGE_KEY = 'chameleon-magazine-articles';

interface ArticleContextValue {
  articles: Article[];          // published only (독자용)
  allArticles: Article[];       // 전체 (어드민용)
  addArticle: (article: Article) => void;
  updateArticle: (article: Article) => void;
  deleteArticle: (id: string) => void;
  publishArticle: (id: string) => void;
  unpublishArticle: (id: string) => void;
  scheduleArticle: (id: string, scheduledAt: string) => void;
  getArticleById: (id: string) => Article | undefined;
  getArticleBySlug: (slug: string) => Article | undefined;
  searchArticles: (query: string) => Article[];
}

const ArticleContext = createContext<ArticleContextValue | null>(null);

function loadFromStorage(): Article[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Article[];
      return parsed.map((a) => ({ ...a, status: a.status ?? 'published' }));
    }
  } catch {
    // ignore
  }
  return MOCK_ARTICLES.map((a) => ({ ...a, status: 'published' as const }));
}

function saveToStorage(articles: Article[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  } catch {
    // ignore
  }
}

/** scheduled 기사 중 현재 시각이 scheduledAt을 지난 것들을 published로 변환 */
function autoPublishScheduled(prev: Article[]): Article[] {
  const now = new Date();
  const hasExpired = prev.some(
    (a) => a.status === 'scheduled' && a.scheduledAt && new Date(a.scheduledAt) <= now
  );
  if (!hasExpired) return prev;
  return prev.map((a) => {
    if (a.status === 'scheduled' && a.scheduledAt && new Date(a.scheduledAt) <= now) {
      const { scheduledAt: _sa, ...rest } = a;
      return { ...rest, status: 'published' as const };
    }
    return a;
  });
}

export function ArticleProvider({ children }: { children: React.ReactNode }) {
  const [allArticles, setAllArticles] = useState<Article[]>(() => {
    const loaded = loadFromStorage();
    return autoPublishScheduled(loaded);
  });

  // 독자에게 노출되는 기사 — published 상태만
  const articles = allArticles.filter((a) => !a.status || a.status === 'published');

  // 1분마다 예약발행 기사 체크
  useEffect(() => {
    const interval = setInterval(() => {
      setAllArticles((prev) => {
        const next = autoPublishScheduled(prev);
        return next;
      });
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    saveToStorage(allArticles);
  }, [allArticles]);

  const addArticle = (article: Article) => {
    setAllArticles((prev) => [article, ...prev]);
  };

  const updateArticle = (updated: Article) => {
    setAllArticles((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  };

  const deleteArticle = (id: string) => {
    setAllArticles((prev) => prev.filter((a) => a.id !== id));
  };

  const publishArticle = (id: string) => {
    setAllArticles((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: 'published' as const, scheduledAt: undefined } : a
      )
    );
  };

  const unpublishArticle = (id: string) => {
    setAllArticles((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: 'draft' as const, scheduledAt: undefined } : a
      )
    );
  };

  const scheduleArticle = (id: string, scheduledAt: string) => {
    setAllArticles((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: 'scheduled' as const, scheduledAt } : a
      )
    );
  };

  const getArticleById = (id: string) => allArticles.find((a) => a.id === id);
  const getArticleBySlug = (slug: string) => allArticles.find((a) => a.slug === slug);

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
        addArticle,
        updateArticle,
        deleteArticle,
        publishArticle,
        unpublishArticle,
        scheduleArticle,
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
