import { PortableText } from '@portabletext/react';
import { createImageUrlBuilder } from '@sanity/image-url';
import type { SanityDocument } from 'sanity';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';

const imageBuilder = createImageUrlBuilder({
  projectId: 'a5gektp6',
  dataset: 'production',
});

const categories = {
  news: { label: 'NEWS', color: '#c00707' },
  listen: { label: 'LISTEN', color: '#ffda13' },
  visual: { label: 'VISUAL', color: '#b0fffa' },
  culture: { label: 'CULTURE', color: '#cb6ce6' },
} as const;

type ArticleDocument = SanityDocument & {
  title?: string;
  excerpt?: string;
  category?: keyof typeof categories;
  subcategory?: string;
  tags?: string[];
  isEditorsPick?: boolean;
  publishedAt?: string;
  author?: string;
  coverType?: 'image' | 'youtube' | 'instagram' | 'embed';
  coverImage?: unknown;
  coverImageCaption?: string;
  coverImageCredit?: string;
  coverYouTubeUrl?: string;
  coverYouTubeCaption?: string;
  coverEmbedUrl?: string;
  coverEmbedTitle?: string;
  coverEmbedCaption?: string;
  coverEmbedHeight?: number;
  body?: unknown[];
};

type PreviewProps = {
  document: {
    displayed: Partial<ArticleDocument>;
  };
};

function formatDate(dateStr?: string) {
  if (!dateStr) return '발행일 미정';

  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getImageUrl(source?: unknown) {
  if (!source) return '';

  try {
    return imageBuilder.image(source).width(1400).height(788).fit('crop').auto('format').url();
  } catch {
    return '';
  }
}

function getYouTubeEmbedUrl(url?: string) {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    const videoId = parsed.hostname.includes('youtu.be')
      ? parsed.pathname.slice(1)
      : parsed.pathname.includes('/shorts/')
        ? parsed.pathname.split('/shorts/')[1]?.split('/')[0]
        : parsed.pathname.includes('/embed/')
          ? parsed.pathname.split('/embed/')[1]?.split('/')[0]
          : parsed.searchParams.get('v');

    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch {
    return null;
  }
}

function getInstagramEmbedUrl(url?: string) {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes('instagram.com')) return null;

    const path = parsed.pathname.replace(/\/$/, '');
    if (!path) return null;

    return `https://www.instagram.com${path}/embed`;
  } catch {
    return null;
  }
}

function getSpotifyEmbedUrl(url?: string) {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes('open.spotify.com')) return null;

    const parts = parsed.pathname.split('/').filter(Boolean);
    const normalizedParts = parts[0]?.startsWith('intl-') ? parts.slice(1) : parts;
    const [type, id] = normalizedParts;

    if (!type || !id) return null;

    return `https://open.spotify.com/embed/${type}/${id}`;
  } catch {
    return null;
  }
}

function getExternalEmbedUrl(url?: string, provider?: string) {
  if (!url) return null;

  if (provider === 'instagram') return getInstagramEmbedUrl(url);
  if (provider === 'spotify') return getSpotifyEmbedUrl(url);

  return getSpotifyEmbedUrl(url) ?? getInstagramEmbedUrl(url) ?? url;
}

function ExternalEmbed({
  url,
  provider,
  title,
  caption,
  height,
}: {
  url?: string;
  provider?: string;
  title?: string;
  caption?: string;
  height?: number;
}) {
  const embedUrl = getExternalEmbedUrl(url, provider);
  if (!embedUrl) return null;

  const isInstagram = provider === 'instagram' || embedUrl.includes('instagram.com');
  const isSpotify = provider === 'spotify' || embedUrl.includes('open.spotify.com');
  const embedHeight = height ?? (isInstagram ? 680 : isSpotify ? 380 : 360);

  return (
    <figure style={{ margin: '32px 0' }}>
      <div style={{ width: '100%', overflow: 'hidden', background: '#000' }}>
        <iframe
          src={embedUrl}
          title={title || caption || 'Embedded content'}
          style={{ width: '100%', height: embedHeight, border: 0, display: 'block' }}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      </div>
      {caption && (
        <figcaption style={{ marginTop: 8, color: '#6b7280', fontSize: '0.78rem', lineHeight: 1.55 }}>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

const portableTextComponents = {
  types: {
    image: ({ value }: { value: { alt?: string; caption?: string } }) => {
      const src = getImageUrl(value);
      if (!src) return null;

      return (
        <figure style={{ margin: '32px 0' }}>
          <img src={src} alt={value.alt ?? ''} style={{ display: 'block', width: '100%' }} />
          {value.caption && (
            <figcaption style={{ marginTop: 8, color: '#6b7280', fontSize: '0.78rem', lineHeight: 1.55 }}>
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    youtube: ({ value }: { value: { url?: string; caption?: string } }) => {
      const embedUrl = getYouTubeEmbedUrl(value.url);
      if (!embedUrl) return null;

      return (
        <figure style={{ margin: '32px 0' }}>
          <div style={{ aspectRatio: '16 / 9', background: '#000', overflow: 'hidden' }}>
            <iframe
              src={embedUrl}
              title={value.caption ?? 'YouTube video'}
              style={{ width: '100%', height: '100%', border: 0 }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          {value.caption && (
            <figcaption style={{ marginTop: 8, color: '#6b7280', fontSize: '0.78rem', lineHeight: 1.55 }}>
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    embed: ({ value }: { value: { provider?: string; url?: string; title?: string; caption?: string; height?: number } }) => (
      <ExternalEmbed
        provider={value.provider}
        url={value.url}
        title={value.title}
        caption={value.caption}
        height={value.height}
      />
    ),
  },
  block: {
    h2: ({ children }: { children?: ReactNode }) => (
      <h2 style={{ margin: '40px 0 16px', fontSize: '1.55rem', lineHeight: 1.18, fontWeight: 900 }}>
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: ReactNode }) => (
      <h3 style={{ margin: '32px 0 12px', fontSize: '1.2rem', lineHeight: 1.25, fontWeight: 900 }}>
        {children}
      </h3>
    ),
    blockquote: ({ children }: { children?: ReactNode }) => (
      <blockquote style={{ margin: '24px 0', borderLeft: '4px solid #000', paddingLeft: 16, color: '#374151' }}>
        {children}
      </blockquote>
    ),
    normal: ({ children }: { children?: ReactNode }) => (
      <p style={{ margin: '0 0 20px', fontSize: '1rem', lineHeight: 1.78 }}>
        {children}
      </p>
    ),
  },
  marks: {
    link: ({ children, value }: { children?: ReactNode; value?: { href?: string } }) => (
      <a href={value?.href} target="_blank" rel="noreferrer" style={{ color: '#000', textDecoration: 'underline', textDecorationThickness: 2, textUnderlineOffset: 3 }}>
        {children}
      </a>
    ),
  },
};

export function ArticlePreview({ document }: PreviewProps) {
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  const article = document.displayed;
  const category = categories[article.category ?? 'news'] ?? categories.news;
  const coverImageUrl = getImageUrl(article.coverImage);
  const coverYouTubeEmbedUrl = getYouTubeEmbedUrl(article.coverYouTubeUrl);
  const coverEmbedProvider = article.coverType === 'instagram' ? 'instagram' : 'iframe';
  const frameWidth = viewport === 'mobile' ? 390 : 900;

  const body = useMemo(() => article.body ?? [], [article.body]);

  return (
    <div style={{ minHeight: '100%', background: '#f4f4f5', padding: 20, overflow: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
        <div>
          <strong style={{ display: 'block', color: '#111827', fontSize: 14 }}>Article Preview</strong>
          <span style={{ color: '#6b7280', fontSize: 12 }}>Draft 내용을 기준으로 데스크탑/모바일 줄바꿈을 확인합니다.</span>
        </div>
        <div style={{ display: 'flex', border: '1px solid #d4d4d8', background: '#fff' }}>
          {(['desktop', 'mobile'] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setViewport(item)}
              style={{
                border: 0,
                borderLeft: item === 'mobile' ? '1px solid #d4d4d8' : 0,
                background: viewport === item ? '#000' : '#fff',
                color: viewport === item ? '#fff' : '#111827',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 700,
                padding: '8px 12px',
                textTransform: 'uppercase',
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div style={{ margin: '0 auto', width: '100%', maxWidth: frameWidth, transition: 'max-width 160ms ease' }}>
        <article
          style={{
            background: '#fff',
            color: '#000',
            minHeight: 760,
            padding: viewport === 'mobile' ? '28px 18px 48px' : '40px 48px 64px',
            boxShadow: '0 16px 40px rgba(15, 23, 42, 0.08)',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          <div style={{ height: 4, background: category.color, marginBottom: 24 }} />

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            {article.isEditorsPick && (
              <span style={{ background: '#000', color: '#fff', fontSize: 12, fontWeight: 900, letterSpacing: '0.12em', padding: '7px 10px' }}>
                EDITOR'S PICK
              </span>
            )}
            <span style={{ background: category.color, color: category.color === '#ffda13' || category.color === '#b0fffa' ? '#000' : '#fff', fontSize: 12, fontWeight: 900, letterSpacing: '0.12em', padding: '7px 10px' }}>
              {category.label}
            </span>
            {article.subcategory && (
              <span style={{ border: '1px solid #d4d4d8', color: '#52525b', fontSize: 12, fontWeight: 800, letterSpacing: '0.08em', padding: '6px 9px', textTransform: 'uppercase' }}>
                {article.subcategory}
              </span>
            )}
          </div>

          <h1
            style={{
              margin: '0 0 16px',
              fontSize: viewport === 'mobile' ? '2rem' : '3rem',
              lineHeight: 1.08,
              fontWeight: 950,
              letterSpacing: 0,
            }}
          >
            {article.title || '제목을 입력하세요'}
          </h1>

          <p style={{ margin: '0 0 18px', color: '#4b5563', fontSize: viewport === 'mobile' ? '1rem' : '1.08rem', lineHeight: 1.7 }}>
            {article.excerpt || '요약문을 입력하면 여기에 표시됩니다.'}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 16px', color: '#6b7280', borderBottom: '1px solid #e5e7eb', paddingBottom: 16, marginBottom: 28, fontSize: 13 }}>
            <span>{article.author || 'CHAMELEON Editorial'}</span>
            <span>{formatDate(article.publishedAt)}</span>
            {article.tags?.map((tag) => (
              <span key={tag} style={{ background: '#f3f4f6', color: '#4b5563', padding: '2px 7px' }}>#{tag}</span>
            ))}
          </div>

          {article.coverType === 'youtube' && coverYouTubeEmbedUrl ? (
            <figure style={{ margin: '0 0 32px' }}>
              <div style={{ aspectRatio: '16 / 9', background: '#000', overflow: 'hidden' }}>
                <iframe
                  src={coverYouTubeEmbedUrl}
                  title={article.coverYouTubeCaption || article.title || 'YouTube cover'}
                  style={{ width: '100%', height: '100%', border: 0 }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              {article.coverYouTubeCaption && (
                <figcaption style={{ marginTop: 12, color: '#6b7280', fontSize: '0.82rem', lineHeight: 1.6 }}>
                  {article.coverYouTubeCaption}
                </figcaption>
              )}
            </figure>
          ) : ['instagram', 'embed'].includes(article.coverType ?? '') && article.coverEmbedUrl ? (
            <ExternalEmbed
              provider={coverEmbedProvider}
              url={article.coverEmbedUrl}
              title={article.coverEmbedTitle || article.title || 'Cover embed'}
              caption={article.coverEmbedCaption}
              height={article.coverEmbedHeight}
            />
          ) : coverImageUrl ? (
            <figure style={{ margin: '0 0 32px' }}>
              <div style={{ aspectRatio: '16 / 9', overflow: 'hidden' }}>
                <img src={coverImageUrl} alt={article.title ?? ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              {(article.coverImageCaption || article.coverImageCredit) && (
                <figcaption style={{ marginTop: 12, color: '#6b7280' }}>
                  {article.coverImageCaption && <p style={{ margin: 0, fontSize: '0.82rem', lineHeight: 1.6 }}>{article.coverImageCaption}</p>}
                  {article.coverImageCredit && <p style={{ margin: '4px 0 0', fontSize: '0.72rem', lineHeight: 1.5, letterSpacing: '0.16em', textTransform: 'uppercase' }}>{article.coverImageCredit}</p>}
                </figcaption>
              )}
            </figure>
          ) : null}

          <div>
            {body.length > 0 ? (
              <PortableText value={body} components={portableTextComponents} />
            ) : (
              <p style={{ color: '#9ca3af', fontSize: '0.95rem', lineHeight: 1.7 }}>본문을 입력하면 미리보기에 표시됩니다.</p>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
