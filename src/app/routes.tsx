import { createBrowserRouter } from 'react-router';
import { Root } from './pages/Root';
import { Home } from './pages/Home';
import { CategoryPage } from './pages/CategoryPage';
import { ArticleDetail } from './pages/ArticleDetail';
import { SearchPage } from './pages/SearchPage';
import { AdminRoot } from './pages/admin/AdminRoot';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminEditor } from './pages/admin/AdminEditor';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: 'category/:category', Component: CategoryPage },
      { path: 'article/:id', Component: ArticleDetail },
      { path: 'search', Component: SearchPage },
      {
        path: '*',
        Component: () => {
          return (
            <div className="max-w-xl mx-auto px-4 py-20 text-center">
              <div
                className="text-black mb-4"
                style={{ fontFamily: 'var(--font-headline)', fontSize: '4rem', fontWeight: 800 }}
              >
                404
              </div>
              <p className="text-gray-500 mb-6" style={{ fontFamily: 'var(--font-body)' }}>
                페이지를 찾을 수 없습니다.
              </p>
              <a
                href="/"
                className="inline-block px-6 py-2.5 bg-black text-white hover:bg-gray-800 transition-colors"
                style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', borderRadius: 2 }}
              >
                홈으로
              </a>
            </div>
          );
        },
      },
    ],
  },
  // ── Admin (별도 레이아웃, 공개 헤더 없음) ──
  {
    path: '/admin',
    Component: AdminRoot,
    children: [
      { index: true, Component: AdminDashboard },
      { path: 'editor', Component: AdminEditor },
      { path: 'editor/:id', Component: AdminEditor },
    ],
  },
]);