import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import {
  Bold, Italic, Heading1, Heading2, ImagePlus, Youtube,
  Eye, Edit3, ArrowLeft, Save, Type, Globe, FileText, Clock, X,
  Undo2, Redo2, AlignLeft, AlignCenter, AlignRight
} from 'lucide-react';
import { format, addMinutes, parseISO, isAfter } from 'date-fns';
import { useArticles } from '../../context/ArticleContext';
import { Article } from '../../data/articles';
import { Category, Subcategory, CATEGORY_CONFIGS, ALL_CATEGORIES } from '../../data/categories';
import { CategoryLabel } from '../../components/CategoryLabel';

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

/** datetime-local input의 min값: 현재 시각 + 5분 */
function getMinDatetime(): string {
  return format(addMinutes(new Date(), 5), "yyyy-MM-dd'T'HH:mm");
}

/** 예약 시각을 읽기 좋은 한국어 형식으로 표시 */
function formatScheduledAt(iso: string): string {
  try {
    return format(parseISO(iso), 'yyyy년 M월 d일 HH:mm');
  } catch {
    return iso;
  }
}

export function AdminEditor() {
  const { id } = useParams<{ id?: string }>();
  const { getArticleById, addArticle, updateArticle } = useArticles();
  const navigate = useNavigate();
  const bodyRef = useRef<HTMLDivElement>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showScheduler, setShowScheduler] = useState(false);
  const [scheduledAt, setScheduledAt] = useState('');

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
      // 기존 예약 시각 복원
      if (existingArticle.status === 'scheduled' && existingArticle.scheduledAt) {
        setScheduledAt(format(parseISO(existingArticle.scheduledAt), "yyyy-MM-dd'T'HH:mm"));
        setShowScheduler(true);
      }
    }
  }, [existingArticle?.id]);

  const currentCatConfig = CATEGORY_CONFIGS[form.category];

  const exec = (command: string, value?: string) => {
    bodyRef.current?.focus();
    document.execCommand(command, false, value);
  };

  /** 현재 정렬 상태 확인 */
  const [activeAlign, setActiveAlign] = useState<'justifyLeft' | 'justifyCenter' | 'justifyRight'>('justifyLeft');

  const handleAlign = (cmd: 'justifyLeft' | 'justifyCenter' | 'justifyRight') => {
    exec(cmd);
    setActiveAlign(cmd);
  };

  /** 본문 키보드 단축키 핸들러 */
  const handleBodyKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const isMac = navigator.platform.toUpperCase().includes('MAC');
    const ctrl = isMac ? e.metaKey : e.ctrlKey;
    if (!ctrl) return;

    if (e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      document.execCommand('undo', false);
    } else if ((e.key === 'z' && e.shiftKey) || e.key === 'y') {
      e.preventDefault();
      document.execCommand('redo', false);
    }
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

  const buildArticle = (status: 'published' | 'draft' | 'scheduled', schedAt?: string): Article => {
    const rawBody = bodyRef.current?.innerHTML ?? '';
    const processedBody = processYouTubeUrlsInText(rawBody);
    // 날짜: 오늘 기준 date-fns로 포맷
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    return {
      id: existingArticle?.id ?? generateId(),
      title: form.title || '제목 없음',
      slug: existingArticle?.slug ?? generateSlug(form.title || 'untitled'),
      excerpt: form.excerpt,
      category: form.category,
      subcategory: (form.subcategory as Subcategory) || null,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      isEditorsPick: form.isEditorsPick,
      date: existingArticle?.date ?? todayStr,
      author: form.author || 'CHAMELEON Editorial',
      coverImage: form.coverImage,
      body: processedBody,
      relatedArticles: existingArticle?.relatedArticles ?? [],
      status,
      scheduledAt: status === 'scheduled' ? schedAt : undefined,
    };
  };

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 2500);
  };

  const handleSaveDraft = () => {
    const article = buildArticle('draft');
    if (existingArticle) {
      updateArticle(article);
    } else {
      addArticle(article);
    }
    showFeedback('임시저장되었습니다.');
    navigate(`/admin/editor/${article.id}`);
  };

  const handlePublish = () => {
    const article = buildArticle('published');
    if (existingArticle) {
      updateArticle(article);
    } else {
      addArticle(article);
    }
    showFeedback('발행되었습니다!');
    setTimeout(() => navigate('/admin'), 1200);
  };

  const handleSchedule = () => {
    if (!scheduledAt) {
      alert('예약발행 시각을 선택해주세요.');
      return;
    }
    const schedIso = new Date(scheduledAt).toISOString();
    if (!isAfter(new Date(schedIso), new Date())) {
      alert('예약 시각은 현재 시각 이후여야 합니다.');
      return;
    }
    const article = buildArticle('scheduled', schedIso);
    if (existingArticle) {
      updateArticle(article);
    } else {
      addArticle(article);
    }
    showFeedback(`예약발행 설정 완료 — ${formatScheduledAt(schedIso)}`);
    setTimeout(() => navigate('/admin'), 1500);
  };

  const getBodyHtml = () => bodyRef.current?.innerHTML ?? '';

  const inputStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body)',
    fontSize: '0.875rem',
    borderRadius: 2,
  };

  const isPublished = !existingArticle?.status || existingArticle?.status === 'published';
  const isScheduled = existingArticle?.status === 'scheduled';

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 border-b-2 border-black pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin"
            className="p-1.5 hover:bg-gray-100 transition-colors"
            style={{ borderRadius: 2 }}
            aria-label="대시보드로"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1
              className="text-black"
              style={{ fontFamily: 'var(--font-headline)', fontSize: '1.1rem', fontWeight: 800 }}
            >
              {existingArticle ? '기사 편집' : '새 기사 작성'}
            </h1>
            {existingArticle && (
              <div className="flex items-center gap-1 mt-0.5">
                {isPublished
                  ? <span className="flex items-center gap-1 text-green-600" style={{ fontSize: '0.72rem' }}><Globe size={11} /> 발행됨</span>
                  : isScheduled
                  ? <span className="flex items-center gap-1 text-blue-600" style={{ fontSize: '0.72rem' }}>
                      <Clock size={11} /> 예약발행 — {existingArticle.scheduledAt ? formatScheduledAt(existingArticle.scheduledAt) : ''}
                    </span>
                  : <span className="flex items-center gap-1 text-amber-600" style={{ fontSize: '0.72rem' }}><FileText size={11} /> 임시저장</span>
                }
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          {feedback && (
            <span
              className="px-3 py-1.5 bg-gray-100 text-gray-700"
              style={{ ...inputStyle, fontSize: '0.8rem', borderRadius: 2 }}
            >
              {feedback}
            </span>
          )}

          <button
            onClick={() => setPreviewMode((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-600 hover:border-black hover:text-black transition-colors"
            style={inputStyle}
          >
            {previewMode ? <Edit3 size={14} /> : <Eye size={14} />}
            {previewMode ? '편집' : '미리보기'}
          </button>

          <button
            onClick={handleSaveDraft}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-black text-black hover:bg-gray-100 transition-colors"
            style={{ ...inputStyle, fontWeight: 700 }}
          >
            <Save size={14} />
            임시저장
          </button>

          <button
            onClick={handlePublish}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-black text-white hover:bg-gray-800 transition-colors"
            style={{ ...inputStyle, fontWeight: 700 }}
          >
            <Globe size={14} />
            {isPublished && existingArticle ? '업데이트 발행' : '발행하기'}
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
            {form.author} · {format(new Date(), 'yyyy년 M월 d일')}
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
              style={inputStyle}
            />
          </div>

          {/* Category / Subcategory / Author */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 text-gray-600" style={{ ...inputStyle, fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.08em' }}>
                카테고리 *
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value as Category, subcategory: '' }))}
                className="w-full border border-gray-200 focus:border-black focus:outline-none p-2"
                style={inputStyle}
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
                style={inputStyle}
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
                style={inputStyle}
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
                placeholder="케이팝, 컴백, 2026"
                className="w-full border border-gray-200 focus:border-black focus:outline-none p-2"
                style={inputStyle}
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
                style={inputStyle}
              />
              <label
                className="px-3 py-2 border border-gray-300 text-gray-600 hover:border-black hover:text-black cursor-pointer transition-colors flex items-center gap-1.5"
                style={inputStyle}
              >
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
            <div className="flex flex-wrap items-center gap-1 border border-b-0 border-gray-200 p-2 bg-gray-50">
              {/* Undo / Redo */}
              <button type="button" onClick={() => exec('undo')} className="p-1.5 hover:bg-gray-200 rounded focus:outline-none" title="실행 취소 (⌘Z)">
                <Undo2 size={15} />
              </button>
              <button type="button" onClick={() => exec('redo')} className="p-1.5 hover:bg-gray-200 rounded focus:outline-none" title="다시 실행 (⌘⇧Z)">
                <Redo2 size={15} />
              </button>
              <div className="w-px h-5 bg-gray-300 mx-1" />
              {/* Bold / Italic */}
              <button type="button" onClick={() => exec('bold')} className="p-1.5 hover:bg-gray-200 rounded focus:outline-none" title="굵게 (⌘B)">
                <Bold size={15} />
              </button>
              <button type="button" onClick={() => exec('italic')} className="p-1.5 hover:bg-gray-200 rounded focus:outline-none" title="기울임 (⌘I)">
                <Italic size={15} />
              </button>
              <div className="w-px h-5 bg-gray-300 mx-1" />
              {/* Headings */}
              <button type="button" onClick={() => exec('formatBlock', 'H2')} className="p-1.5 hover:bg-gray-200 rounded focus:outline-none" title="소제목 (H2)">
                <Heading1 size={15} />
              </button>
              <button type="button" onClick={() => exec('formatBlock', 'H3')} className="p-1.5 hover:bg-gray-200 rounded focus:outline-none" title="소소제목 (H3)">
                <Heading2 size={15} />
              </button>
              <button type="button" onClick={() => exec('formatBlock', 'P')} className="p-1.5 hover:bg-gray-200 rounded focus:outline-none" title="본문 단락">
                <Type size={15} />
              </button>
              <div className="w-px h-5 bg-gray-300 mx-1" />
              {/* Alignment */}
              {(
                [
                  { cmd: 'justifyLeft',   Icon: AlignLeft,   label: '왼쪽 정렬' },
                  { cmd: 'justifyCenter', Icon: AlignCenter, label: '가운데 정렬' },
                  { cmd: 'justifyRight',  Icon: AlignRight,  label: '오른쪽 정렬' },
                ] as const
              ).map(({ cmd, Icon, label }) => (
                <button
                  key={cmd}
                  type="button"
                  onClick={() => handleAlign(cmd)}
                  className={`p-1.5 rounded focus:outline-none transition-colors ${
                    activeAlign === cmd ? 'bg-gray-800 text-white' : 'hover:bg-gray-200'
                  }`}
                  title={label}
                >
                  <Icon size={15} />
                </button>
              ))}
              <div className="w-px h-5 bg-gray-300 mx-1" />
              {/* Media */}
              <label className="p-1.5 hover:bg-gray-200 rounded cursor-pointer focus:outline-none" title="이미지 삽입">
                <ImagePlus size={15} />
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
              <button type="button" onClick={handleYouTubeInsert} className="p-1.5 hover:bg-gray-200 rounded focus:outline-none" title="YouTube 삽입">
                <Youtube size={15} />
              </button>
            </div>
            <div
              ref={bodyRef}
              contentEditable
              suppressContentEditableWarning
              onPaste={handlePaste}
              onKeyDown={handleBodyKeyDown}
              className="border border-gray-200 p-4 min-h-64 focus:border-black focus:outline-none article-body"
              style={{ fontFamily: 'var(--font-body)', fontSize: '0.925rem', lineHeight: 1.8, borderRadius: '0 0 2px 2px' }}
              data-placeholder="본문을 입력하세요..."
            />
            <p className="text-gray-400 mt-1.5" style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem' }}>
              💡 이미지 클립보드 붙여넣기 지원 · YouTube URL 자동 임베드 · ⌘Z 실행취소 / ⌘⇧Z 다시실행
            </p>
          </div>

          {/* ── 예약발행 패널 ── */}
          <div className="border border-gray-200" style={{ borderRadius: 2 }}>
            <button
              type="button"
              onClick={() => setShowScheduler((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <span className="flex items-center gap-2 text-gray-700" style={{ ...inputStyle, fontWeight: 700 }}>
                <Clock size={15} />
                예약발행 설정
                {existingArticle?.status === 'scheduled' && existingArticle.scheduledAt && (
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600" style={{ fontSize: '0.7rem', fontWeight: 700, borderRadius: 2 }}>
                    {formatScheduledAt(existingArticle.scheduledAt)} 예약됨
                  </span>
                )}
              </span>
              <span className="text-gray-400" style={{ fontSize: '0.85rem' }}>
                {showScheduler ? '▲' : '▼'}
              </span>
            </button>

            {showScheduler && (
              <div className="px-4 pb-4 border-t border-gray-100 pt-4">
                <p className="text-gray-500 mb-3" style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem' }}>
                  지정한 날짜·시각에 자동으로 발행됩니다. 현재 시각 기준 5분 이후부터 설정 가능합니다.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="datetime-local"
                      value={scheduledAt}
                      min={getMinDatetime()}
                      onChange={(e) => setScheduledAt(e.target.value)}
                      className="flex-1 border border-gray-200 focus:border-black focus:outline-none p-2"
                      style={{ ...inputStyle, colorScheme: 'light' }}
                    />
                    {scheduledAt && (
                      <button
                        type="button"
                        onClick={() => setScheduledAt('')}
                        className="p-1 text-gray-400 hover:text-black transition-colors"
                        title="초기화"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  <button
                    onClick={handleSchedule}
                    disabled={!scheduledAt}
                    className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.875rem', borderRadius: 2, whiteSpace: 'nowrap' }}
                  >
                    <Clock size={14} />
                    예약발행
                  </button>
                </div>
                {scheduledAt && (
                  <p className="mt-2 text-blue-600" style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem' }}>
                    📅 {formatScheduledAt(new Date(scheduledAt).toISOString())} 에 발행됩니다
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Bottom Action Bar */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handlePublish}
              className="flex items-center gap-2 px-6 py-2.5 bg-black text-white hover:bg-gray-800 transition-colors"
              style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.875rem', borderRadius: 2 }}
            >
              <Globe size={15} />
              {isPublished && existingArticle ? '업데이트 발행' : '즉시 발행'}
            </button>
            <button
              onClick={handleSaveDraft}
              className="flex items-center gap-2 px-6 py-2.5 border border-black text-black hover:bg-gray-100 transition-colors"
              style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.875rem', borderRadius: 2 }}
            >
              <Save size={15} />
              임시저장
            </button>
            <Link
              to="/admin"
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