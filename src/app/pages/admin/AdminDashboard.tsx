import { useState } from 'react';
import { Link } from 'react-router';
import { PenLine, Trash2, Edit2, Globe, FileText, Eye, EyeOff, Search, Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useArticles } from '../../context/ArticleContext';
import { ALL_CATEGORIES, CATEGORY_CONFIGS } from '../../data/categories';

function formatDate(dateStr: string) {
  try {
    return format(parseISO(dateStr), 'yyyy. M. d');
  } catch {
    return dateStr;
  }
}

function formatScheduledAt(iso: string) {
  try {
    return format(parseISO(iso), 'M/d HH:mm');
  } catch {
    return iso;
  }
}

export function AdminDashboard() {
  const { allArticles, deleteArticle, publishArticle, unpublishArticle } = useArticles();
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft' | 'scheduled'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const published = allArticles.filter((a) => !a.status || a.status === 'published');
  const drafts = allArticles.filter((a) => a.status === 'draft');
  const scheduled = allArticles.filter((a) => a.status === 'scheduled');

  const filtered = allArticles.filter((a) => {
    const statusMatch =
      filterStatus === 'all' ||
      (filterStatus === 'published' && (!a.status || a.status === 'published')) ||
      (filterStatus === 'draft' && a.status === 'draft') ||
      (filterStatus === 'scheduled' && a.status === 'scheduled');
    const categoryMatch = filterCategory === 'all' || a.category === filterCategory;
    const searchMatch =
      !searchQuery ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.author.toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && categoryMatch && searchMatch;
  });

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      deleteArticle(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
    }
  };

  const inputStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body)',
    fontSize: '0.8rem',
    borderRadius: 2,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-black"
            style={{ fontFamily: 'var(--font-headline)', fontSize: '1.4rem', fontWeight: 800 }}
          >
            기사 관리
          </h1>
          <p className="text-gray-500 mt-0.5" style={{ fontSize: '0.8rem' }}>
            발행 및 임시저장 기사를 관리합니다
          </p>
        </div>
        <Link
          to="/admin/editor"
          className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
          style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 700, borderRadius: 2 }}
        >
          <PenLine size={15} />
          새 기사 작성
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="border border-black p-4 bg-white">
          <div
            className="text-black"
            style={{ fontFamily: 'var(--font-headline)', fontSize: '2rem', fontWeight: 800, lineHeight: 1 }}
          >
            {allArticles.length}
          </div>
          <div className="text-gray-500 mt-1" style={{ ...inputStyle }}>전체 기사</div>
        </div>
        <div className="border border-black p-4 bg-white">
          <div
            className="text-black"
            style={{ fontFamily: 'var(--font-headline)', fontSize: '2rem', fontWeight: 800, lineHeight: 1 }}
          >
            {published.length}
          </div>
          <div className="mt-1 flex items-center gap-1.5" style={{ ...inputStyle, color: '#16a34a' }}>
            <Globe size={13} />
            발행됨
          </div>
        </div>
        <div className="border border-black p-4 bg-white">
          <div
            className="text-black"
            style={{ fontFamily: 'var(--font-headline)', fontSize: '2rem', fontWeight: 800, lineHeight: 1 }}
          >
            {scheduled.length}
          </div>
          <div className="mt-1 flex items-center gap-1.5" style={{ ...inputStyle, color: '#2563eb' }}>
            <Clock size={13} />
            예약발행
          </div>
        </div>
        <div className="border border-black p-4 bg-white">
          <div
            className="text-black"
            style={{ fontFamily: 'var(--font-headline)', fontSize: '2rem', fontWeight: 800, lineHeight: 1 }}
          >
            {drafts.length}
          </div>
          <div className="mt-1 flex items-center gap-1.5" style={{ ...inputStyle, color: '#d97706' }}>
            <FileText size={13} />
            임시저장
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {/* Search */}
        <div className="flex items-center gap-2 border border-gray-200 bg-white px-3 py-1.5 flex-1 min-w-40 max-w-xs">
          <Search size={14} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="제목, 작성자 검색..."
            className="w-full focus:outline-none bg-transparent"
            style={inputStyle}
          />
        </div>

        {/* Status filter */}
        <div className="flex border border-gray-200 bg-white overflow-hidden" style={{ borderRadius: 2 }}>
          {(['all', 'published', 'scheduled', 'draft'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 transition-colors ${filterStatus === s ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              style={inputStyle}
            >
              {s === 'all' ? '전체' : s === 'published' ? '발행됨' : s === 'scheduled' ? '예약' : '임시저장'}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border border-gray-200 bg-white px-3 py-1.5 focus:outline-none focus:border-black"
          style={{ ...inputStyle, borderRadius: 2 }}
        >
          <option value="all">전체 카테고리</option>
          {ALL_CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.label}</option>
          ))}
        </select>
      </div>

      {/* Article Table */}
      <div className="bg-white border border-gray-200 overflow-hidden" style={{ borderRadius: 2 }}>
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400" style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem' }}>
            {allArticles.length === 0 ? '아직 작성된 기사가 없습니다.' : '검색 결과가 없습니다.'}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-3 text-gray-500" style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em' }}>
                  제목
                </th>
                <th className="text-left px-4 py-3 text-gray-500 hidden md:table-cell" style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em' }}>
                  카테고리
                </th>
                <th className="text-left px-4 py-3 text-gray-500 hidden sm:table-cell" style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em' }}>
                  작성자
                </th>
                <th className="text-left px-4 py-3 text-gray-500" style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em' }}>
                  상태
                </th>
                <th className="text-left px-4 py-3 text-gray-500 hidden lg:table-cell" style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em' }}>
                  날짜
                </th>
                <th className="px-4 py-3 text-right text-gray-500" style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em' }}>
                  액션
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((article, idx) => {
                const isPublishedArticle = !article.status || article.status === 'published';
                const isScheduledArticle = article.status === 'scheduled';
                const catConfig = CATEGORY_CONFIGS[article.category];
                return (
                  <tr
                    key={article.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${idx === filtered.length - 1 ? 'border-b-0' : ''}`}
                  >
                    {/* Title */}
                    <td className="px-4 py-3">
                      <div
                        className="text-black leading-snug"
                        style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, maxWidth: 320 }}
                      >
                        {article.isEditorsPick && (
                          <span
                            className="inline-block mr-1.5 px-1 py-0 bg-black text-white align-middle"
                            style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.08em', verticalAlign: 'middle' }}
                          >
                            EP
                          </span>
                        )}
                        <span className="line-clamp-2">{article.title}</span>
                      </div>
                    </td>
                    {/* Category */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span
                        className="inline-block px-2 py-0.5"
                        style={{
                          backgroundColor: catConfig?.color ?? '#000',
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          letterSpacing: '0.05em',
                          borderRadius: 2,
                          color: catConfig?.textColor ?? '#fff',
                        }}
                      >
                        {catConfig?.label ?? article.category}
                      </span>
                    </td>
                    {/* Author */}
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-gray-500" style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem' }}>
                        {article.author}
                      </span>
                    </td>
                    {/* Status */}
                    <td className="px-4 py-3">
                      {isScheduledArticle ? (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700"
                          style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', fontWeight: 700, borderRadius: 2 }}
                        >
                          <Clock size={10} />
                          {article.scheduledAt ? formatScheduledAt(article.scheduledAt) : '예약됨'}
                        </span>
                      ) : isPublishedArticle ? (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700"
                          style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', fontWeight: 700, borderRadius: 2 }}
                        >
                          <Globe size={10} />
                          발행됨
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700"
                          style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', fontWeight: 700, borderRadius: 2 }}
                        >
                          <FileText size={10} />
                          임시저장
                        </span>
                      )}
                    </td>
                    {/* Date */}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-gray-400" style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem' }}>
                        {formatDate(article.date)}
                      </span>
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {/* Publish / Unpublish (예약 포함) */}
                        <button
                          onClick={() => isPublishedArticle ? unpublishArticle(article.id) : publishArticle(article.id)}
                          className={`p-1.5 transition-colors ${
                            isPublishedArticle
                              ? 'text-gray-400 hover:text-amber-600 hover:bg-amber-50'
                              : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                          }`}
                          style={{ borderRadius: 2 }}
                          title={isPublishedArticle ? '발행 취소 (임시저장으로)' : isScheduledArticle ? '즉시 발행' : '발행하기'}
                        >
                          {isPublishedArticle ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                        {/* Edit */}
                        <Link
                          to={`/admin/editor/${article.id}`}
                          className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 transition-colors"
                          style={{ borderRadius: 2 }}
                          title="편집"
                        >
                          <Edit2 size={15} />
                        </Link>
                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(article.id)}
                          className={`p-1.5 transition-colors ${
                            deleteConfirm === article.id
                              ? 'bg-red-500 text-white'
                              : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                          }`}
                          style={{ borderRadius: 2 }}
                          title={deleteConfirm === article.id ? '한 번 더 클릭하면 삭제됩니다' : '삭제'}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {filtered.length > 0 && (
        <p className="mt-3 text-gray-400 text-right" style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem' }}>
          총 {filtered.length}개 기사
          {deleteConfirm && ' · 삭제 버튼을 한 번 더 클릭하면 삭제됩니다'}
        </p>
      )}
    </div>
  );
}
