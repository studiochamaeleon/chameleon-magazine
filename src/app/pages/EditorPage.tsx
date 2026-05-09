import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import {
  Bold, Italic, Heading1, Heading2, ImagePlus, Youtube, Eye, Edit3, ArrowLeft, Save, Type
} from 'lucide-react';
import { useArticles } from '../context/ArticleContext';
import { Article } from '../data/articles';
import { Category, Subcategory, CATEGORY_CONFIGS, ALL_CATEGORIES } from '../data/categories';
import { CategoryLabel } from '../components/CategoryLabel';

function generateId() {
  return 'art-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
}

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 80);
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function processYouTubeUrlsInText(html: string): string {
  const ytRegex =
    /(https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})[^\s<"]*)/g;
  return html.replace(ytRegex, (match) => {
    const videoId = extractYouTubeId(match);
    if (!videoId) return match;
    return `<div class="yt-embed" style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:16px 0;"><iframe src="https://www.youtube.com/embed/${videoId}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allowfullscreen loading="lazy" title="YouTube video"></iframe></div>`;
  });
}

export function EditorPage() {
  const { id } = useParams<{ id?: string }>();
  const { getArticleById, addArticle, updateArticle } = useArticles();
  const navigate = useNavigate();
  const bodyRef = useRef<HTMLDivElement>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [saved, setSaved] = useState(false);

  const existingArticle = id ? getArticleById(id) : undefined;

  const [form, setForm] = useState<{
    title: string;
    excerpt: string;
    category: Category;
    subcategory: Subcategory | '';
    tags: string;
    author: string;
    coverImage: string;
    isEditorsPick: boolean;
  }>({
    title: '',
    excerpt: '',
    category: 'news',
    subcategory: '',
    tags: '',
    author: 'CHAMELEON Editorial',
    coverImage: '',
    isEditorsPick: false,
  });

  useEffect(() => {
    if (existingArticle) {
      setForm({
        title: existingArticle.title,
        excerpt: existingArticle.excerpt,
        category: existingArticle.category,
        subcategory: existingArticle.subcategory ?? '',
        tags: existingArticle.tags.join(', '),
        author: existingArticle.author,
        coverImage: existingArticle.coverImage,
        isEditorsPick: existingArticle.isEditorsPick,
      });
      if (bodyRef.current) {
        bodyRef.current.innerHTML = existingArticle.body;
      }
    }
  }, [existingArticle?.id]);

  const currentCatConfig = CATEGORY_CONFIGS[form.category];

  // Toolbar commands
  const exec = (command: string, value?: string) => {
    bodyRef.current?.focus();
    document.execCommand(command, false, value);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const blob = item.getAsFile();
        if (!blob) continue;
        const reader = new FileReader();
        reader.onload = (ev) => {
          const dataUrl = ev.target?.result as string;
          bodyRef.current?.focus();
          document.execCommand(
            'insertHTML',
            false,
            `<img src="${dataUrl}" alt="이미지" style="max-width:100%;height:auto;display:block;margin:12px 0;" />`
          );
        };
        reader.readAsDataURL(blob);
        return;
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      bodyRef.current?.focus();
      document.execCommand(
        'insertHTML',
        false,
        `<img src="${dataUrl}" alt="이미지" style="max-width:100%;height:auto;display:block;margin:12px 0;" />`
      );
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm((prev) => ({ ...prev, coverImage: ev.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleYouTubeInsert = () => {
    const url = prompt('YouTube URL을 입력하세요:');
    if (!url) return;
    const videoId = extractYouTubeId(url);
    if (!videoId) {
      alert('올바른 YouTube URL이 아닙니다.');
      return;
    }
    const iframe = `<div class="yt-embed" style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:16px 0;"><iframe src="https://www.youtube.com/embed/${videoId}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allowfullscreen loading="lazy" title="YouTube video"></iframe></div>`;
    bodyRef.current?.focus();
    document.execCommand('insertHTML', false, iframe);
  };

  const handleSave = () => {
    const rawBody = bodyRef.current?.innerHTML ?? '';
    const processedBody = processYouTubeUrlsInText(rawBody);

    const article: Article = {
      id: existingArticle?.id ?? generateId(),
      title: form.title || '제목 없음',
      slug: existingArticle?.slug ?? generateSlug(form.title || 'untitled'),
      excerpt: form.excerpt,
      category: form.category,
      subcategory: (form.subcategory as Subcategory) || null,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      isEditorsPick: form.isEditorsPick,
      date: existingArticle?.date ?? new Date().toISOString().split('T')[0],
      author: form.author || 'CHAMELEON Editorial',
      coverImage: form.coverImage,
      body: processedBody,
      relatedArticles: existingArticle?.relatedArticles ?? [],
    };

    if (existingArticle) {
      updateArticle(article);
    } else {
      addArticle(article);
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    navigate(`/article/${article.id}`);
  };

  const getBodyHtml = () => {
    return bodyRef.current?.innerHTML ?? '';
  };

  const inputStyle = {
    fontFamily: 'var(--font-body)',
    fontSize: '0.875rem',
    borderRadius: 2,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 border-b-2 border-black pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="p-1.5 hover:bg-gray-100 transition-colors"
            style={{ borderRadius: 2 }}
            aria-label="홈으로"
          >
            <ArrowLeft size={18} />
          </Link>
          <h1
            className="text-black"
            style={{ fontFamily: 'var(--font-headline)', fontSize: '1.25rem', fontWeight: 800 }}
          >
            {existingArticle ? '기사 수정' : '새 기사 작성'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreviewMode((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-600 hover:border-black hover:text-black transition-colors"
            style={{ ...inputStyle, fontWeight: previewMode ? 700 : 400 }}
          >
            {previewMode ? <Edit3 size={14} /> : <Eye size={14} />}
            {previewMode ? '편집' : '미리보기'}
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-black text-white hover:bg-gray-800 transition-colors"
            style={{ ...inputStyle, fontWeight: 700 }}
          >
            <Save size={14} />
            {saved ? '저장됨!' : '저장'}
          </button>
        </div>
      </div>

      {previewMode ? (
        /* ── PREVIEW MODE ── */
        <div>
          <div className="h-1 mb-6" style={{ backgroundColor: currentCatConfig?.color ?? '#000' }} />
          <div className="flex items-center gap-2 mb-4">
            {form.isEditorsPick && (
              <span className="px-3 py-1 text-xs font-bold bg-black text-white" style={{ letterSpacing: '0.1em' }}>
                EDITOR'S PICK
              </span>
            )}
            <CategoryLabel
              category={form.category}
              subcategory={(form.subcategory as Subcategory) || undefined}
              size="md"
            />
          </div>
          <h1
            className="text-black leading-tight mb-4"
            style={{ fontFamily: 'var(--font-headline)', fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', fontWeight: 800 }}
          >
            {form.title || '제목'}
          </h1>
          <p className="text-gray-600 mb-4" style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem' }}>
            {form.excerpt}
          </p>
          <div className="text-gray-400 mb-6 pb-4 border-b border-gray-200" style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem' }}>
            {form.author} · {new Date().toLocaleDateString('ko-KR')}
          </div>
          {form.coverImage && (
            <div className="overflow-hidden mb-8" style={{ aspectRatio: '16/9' }}>
              <img src={form.coverImage} alt="커버 이미지" className="w-full h-full object-cover" />
            </div>
          )}
          <div
            className="article-body"
            dangerouslySetInnerHTML={{ __html: getBodyHtml() }}
            style={{ fontFamily: 'var(--font-body)' }}
          />
        </div>
      ) : (
        /* ── EDIT MODE ── */
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block mb-1 text-gray-600" style={{ ...inputStyle, fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.08em' }}>
              제목 *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="기사 제목을 입력하세요"
              className="w-full border-b-2 border-gray-300 focus:border-black focus:outline-none py-2 bg-transparent"
              style={{ fontFamily: 'var(--font-headline)', fontSize: '1.4rem', fontWeight: 700 }}
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block mb-1 text-gray-600" style={{ ...inputStyle, fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.08em' }}>
              요약 (부제)
            </label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))}
              placeholder="기사 요약 또는 부제를 입력하세요"
              rows={2}
              className="w-full border border-gray-200 focus:border-black focus:outline-none p-3 resize-none"
              style={{ ...inputStyle }}
            />
          </div>

          {/* Category / Subcategory / Author row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 text-gray-600" style={{ ...inputStyle, fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.08em' }}>
                카테고리 *
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value as Category, subcategory: '' }))}
                className="w-full border border-gray-200 focus:border-black focus:outline-none p-2"
                style={{ ...inputStyle }}
              >
                {ALL_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 text-gray-600" style={{ ...inputStyle, fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.08em' }}>
                소분류
              </label>
              <select
                value={form.subcategory}
                onChange={(e) => setForm((p) => ({ ...p, subcategory: e.target.value as Subcategory | '' }))}
                className="w-full border border-gray-200 focus:border-black focus:outline-none p-2"
                style={{ ...inputStyle }}
              >
                <option value="">없음</option>
                {currentCatConfig.subcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>{sub.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 text-gray-600" style={{ ...inputStyle, fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.08em' }}>
                작성자
              </label>
              <input
                type="text"
                value={form.author}
                onChange={(e) => setForm((p) => ({ ...p, author: e.target.value }))}
                className="w-full border border-gray-200 focus:border-black focus:outline-none p-2"
                style={{ ...inputStyle }}
              />
            </div>
          </div>

          {/* Tags + Editor's Pick */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-gray-600" style={{ ...inputStyle, fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.08em' }}>
                태그 (쉼표로 구분)
              </label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
                placeholder="케이팝, 컴백, 2025"
                className="w-full border border-gray-200 focus:border-black focus:outline-none p-2"
                style={{ ...inputStyle }}
              />
            </div>
            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 cursor-pointer p-2 border border-gray-200 hover:border-black transition-colors">
                <input
                  type="checkbox"
                  checked={form.isEditorsPick}
                  onChange={(e) => setForm((p) => ({ ...p, isEditorsPick: e.target.checked }))}
                  className="w-4 h-4"
                />
                <span style={{ ...inputStyle, fontWeight: 700 }}>Editor's Pick으로 지정</span>
              </label>
            </div>
          </div>

          {/* Cover Image */}
          <div>
            <label className="block mb-2 text-gray-600" style={{ ...inputStyle, fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.08em' }}>
              커버 이미지
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={form.coverImage}
                onChange={(e) => setForm((p) => ({ ...p, coverImage: e.target.value }))}
                placeholder="이미지 URL 또는 아래에서 파일 업로드"
                className="flex-1 border border-gray-200 focus:border-black focus:outline-none p-2"
                style={{ ...inputStyle }}
              />
              <label className="px-3 py-2 border border-gray-300 text-gray-600 hover:border-black hover:text-black cursor-pointer transition-colors flex items-center gap-1.5"
                style={{ ...inputStyle }}>
                <ImagePlus size={14} />
                파일 업로드
                <input type="file" accept="image/*" className="hidden" onChange={handleCoverImageUpload} />
              </label>
            </div>
            {form.coverImage && (
              <div className="mt-2 overflow-hidden" style={{ maxHeight: 160, borderRadius: 2 }}>
                <img src={form.coverImage} alt="커버 미리보기" className="w-full object-cover" style={{ maxHeight: 160 }} />
              </div>
            )}
          </div>

          {/* Body Editor */}
          <div>
            <label className="block mb-2 text-gray-600" style={{ ...inputStyle, fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.08em' }}>
              본문
            </label>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 border border-b-0 border-gray-200 p-2 bg-gray-50">
              <button
                type="button"
                onClick={() => exec('bold')}
                className="p-1.5 hover:bg-gray-200 rounded focus:outline-none"
                title="굵게"
              >
                <Bold size={15} />
              </button>
              <button
                type="button"
                onClick={() => exec('italic')}
                className="p-1.5 hover:bg-gray-200 rounded focus:outline-none"
                title="기울임"
              >
                <Italic size={15} />
              </button>
              <div className="w-px h-5 bg-gray-300 mx-1" />
              <button
                type="button"
                onClick={() => exec('formatBlock', 'H2')}
                className="p-1.5 hover:bg-gray-200 rounded focus:outline-none"
                title="소제목 (H2)"
              >
                <Heading1 size={15} />
              </button>
              <button
                type="button"
                onClick={() => exec('formatBlock', 'H3')}
                className="p-1.5 hover:bg-gray-200 rounded focus:outline-none"
                title="소소제목 (H3)"
              >
                <Heading2 size={15} />
              </button>
              <button
                type="button"
                onClick={() => exec('formatBlock', 'P')}
                className="p-1.5 hover:bg-gray-200 rounded focus:outline-none"
                title="본문 단락"
              >
                <Type size={15} />
              </button>
              <div className="w-px h-5 bg-gray-300 mx-1" />
              <label
                className="p-1.5 hover:bg-gray-200 rounded cursor-pointer focus:outline-none"
                title="이미지 삽입"
              >
                <ImagePlus size={15} />
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
              <button
                type="button"
                onClick={handleYouTubeInsert}
                className="p-1.5 hover:bg-gray-200 rounded focus:outline-none"
                title="YouTube 삽입"
              >
                <Youtube size={15} />
              </button>
            </div>

            {/* Editable Body */}
            <div
              ref={bodyRef}
              contentEditable
              suppressContentEditableWarning
              onPaste={handlePaste}
              className="border border-gray-200 p-4 min-h-64 focus:border-black focus:outline-none article-body"
              style={{ fontFamily: 'var(--font-body)', fontSize: '0.925rem', lineHeight: 1.8, borderRadius: '0 0 2px 2px' }}
              data-placeholder="본문을 입력하세요. 이미지는 클립보드에서 붙여넣기 (Ctrl+V)하거나 툴바에서 업로드할 수 있습니다. YouTube URL은 툴바에서 삽입하거나 텍스트에 포함하면 저장 시 자동으로 변환됩니다."
            />
            <p className="text-gray-400 mt-1.5" style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem' }}>
              💡 이미지 클립보드 붙여넣기 지원 · YouTube URL 자동 임베드 · localStorage에 저장됩니다
            </p>
          </div>

          {/* Save Button */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2.5 bg-black text-white hover:bg-gray-800 transition-colors"
              style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.875rem', borderRadius: 2 }}
            >
              <Save size={15} />
              {saved ? '저장됨!' : existingArticle ? '수정 완료' : '기사 발행'}
            </button>
            <Link
              to="/"
              className="flex items-center px-6 py-2.5 border border-gray-300 text-gray-600 hover:border-black hover:text-black transition-colors"
              style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', borderRadius: 2 }}
            >
              취소
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
