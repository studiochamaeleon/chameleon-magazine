import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createImageUrlBuilder } from '@sanity/image-url';

const SITE_URL = 'https://magazine.chameleonstudio.xyz';
const distDir = 'dist';
const projectId = process.env.VITE_SANITY_PROJECT_ID || 'a5gektp6';
const dataset = process.env.VITE_SANITY_DATASET || 'production';
const apiVersion = process.env.VITE_SANITY_API_VERSION || '2025-08-15';
const defaultImage = `${SITE_URL}/og-image.png`;
const siteName = '까멜리온 매거진 | CHAMELEON MAGAZINE';
const siteDescription = '까멜리온 매거진은 음악 뉴스, 신곡 소식, 뮤직비디오, 라이브 영상, 아티스트 문화와 음악 트렌드를 다루는 음악 중심 문화 콘텐츠 매거진입니다.';
const siteKeywords = [
  '까멜리온 매거진',
  'CHAMELEON MAGAZINE',
  'Chameleon Magazine',
  '음악 매거진',
  '음악 뉴스',
  '신곡 소식',
  '뮤직비디오',
  '라이브 영상',
  '아티스트 문화',
  '음악 트렌드',
];
const builder = createImageUrlBuilder({ projectId, dataset });
const rootFallbackPattern = /<!-- SEO_FALLBACK_START -->[\s\S]*?<!-- SEO_FALLBACK_END -->/;

const pageSeo = {
  about: {
    title: 'About | 까멜리온 매거진',
    description: '까멜리온 매거진은 2026년에 창간한 음악 중심 문화 콘텐츠 매거진입니다. 음악을 중심으로 시대의 분위기와 사람들의 취향을 기록합니다.',
    path: '/about/',
    keywords: ['까멜리온 매거진 소개', 'CHAMELEON MAGAZINE About', '음악 문화 매거진'],
    fallbackTitle: 'About CHAMELEON MAGAZINE',
    fallbackBody: '까멜리온 매거진은 2026년에 창간한 음악 중심 문화 콘텐츠 매거진입니다. 음악 뉴스, 신곡 소식, 아티스트 문화와 트렌드를 기록합니다.',
  },
  'category/editors-pick': {
    title: "Editor's Pick | 까멜리온 매거진",
    description: '까멜리온 매거진 에디터가 고른 음악 뉴스, 아티스트 이야기, 트렌드 분석과 문화 콘텐츠를 모아봅니다.',
    path: '/category/editors-pick/',
    keywords: ['에디터스 픽', '음악 추천 기사', '음악 문화 콘텐츠'],
    fallbackTitle: "Editor's Pick",
    fallbackBody: '까멜리온 매거진 에디터가 지금 가장 주목하는 음악과 문화 콘텐츠를 선별합니다.',
  },
  'category/news': {
    title: 'Music News | 까멜리온 매거진',
    description: '신곡 소식, 컴백, 차트, 위클리 뉴스까지 음악계의 주요 흐름을 전하는 까멜리온 매거진 뉴스.',
    path: '/category/news/',
    keywords: ['음악 뉴스', '신곡 소식', '컴백', '위클리 뉴스'],
    fallbackTitle: 'Music News',
    fallbackBody: '신곡 소식, 컴백, 차트, 위클리 뉴스까지 음악계의 주요 흐름을 전합니다.',
  },
  'category/listen': {
    title: 'Listen | 까멜리온 매거진',
    description: '앨범 리뷰, 플레이리스트, 사운드와 장르 이야기를 다루는 까멜리온 매거진 Listen 섹션.',
    path: '/category/listen/',
    keywords: ['앨범 리뷰', '플레이리스트', '음악 추천', '사운드'],
    fallbackTitle: 'Listen',
    fallbackBody: '앨범 리뷰, 플레이리스트, 사운드와 장르 이야기를 다룹니다.',
  },
  'category/visual': {
    title: 'Visual | 까멜리온 매거진',
    description: '뮤직비디오, 라이브 영상, 공연 장면과 음악의 시각적 순간을 기록하는 까멜리온 매거진 Visual 섹션.',
    path: '/category/visual/',
    keywords: ['뮤직비디오', '라이브 영상', '공연', '음악 비주얼'],
    fallbackTitle: 'Visual',
    fallbackBody: '뮤직비디오, 라이브 영상, 공연 장면과 음악의 시각적 순간을 기록합니다.',
  },
  'category/culture': {
    title: 'Culture | 까멜리온 매거진',
    description: '아티스트 패션, 프로덕트, 트렌드 리포트, 인터넷 컬처까지 음악을 둘러싼 문화를 다룹니다.',
    path: '/category/culture/',
    keywords: ['아티스트 패션', '음악 트렌드', '트렌드 리포트', '인터넷 컬처'],
    fallbackTitle: 'Culture',
    fallbackBody: '아티스트 패션, 프로덕트, 트렌드 리포트, 인터넷 컬처까지 음악을 둘러싼 문화를 다룹니다.',
  },
};

function normalizeRoutePath(pathname) {
  const cleanPath = pathname.replace(/^\/+|\/+$/g, '');

  if (!cleanPath) {
    return null;
  }

  if (cleanPath.includes('..')) {
    throw new Error(`Unsafe route path in sitemap: ${pathname}`);
  }

  return cleanPath;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function escapeText(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function safeJson(value) {
  return JSON.stringify(value, null, 2).replaceAll('</script', '<\\/script');
}

function getYouTubeId(url) {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.slice(1) || null;
    }
    if (parsed.pathname.includes('/shorts/')) {
      return parsed.pathname.split('/shorts/')[1]?.split('/')[0] ?? null;
    }
    if (parsed.pathname.includes('/embed/')) {
      return parsed.pathname.split('/embed/')[1]?.split('/')[0] ?? null;
    }
    return parsed.searchParams.get('v');
  } catch {
    return null;
  }
}

function getImageUrl(source) {
  if (!source) return '';

  try {
    return builder.image(source).width(1200).height(630).fit('crop').auto('format').url();
  } catch {
    return '';
  }
}

function getArticleImage(article) {
  const seoImage = getImageUrl(article.seoImage);
  const coverImage = getImageUrl(article.coverImage);
  const youtubeId = getYouTubeId(article.coverYouTubeUrl);
  const youtubeImage = youtubeId ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : '';

  return seoImage || coverImage || youtubeImage || defaultImage;
}

function replaceOrInsertMeta(html, selector, tag) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`<meta\\s+${escapedSelector}[^>]*>`, 'i');

  if (pattern.test(html)) {
    return html.replace(pattern, tag);
  }

  return html.replace('</head>', `      ${tag}\n    </head>`);
}

function replaceOrInsertLink(html, rel, tag) {
  const pattern = new RegExp(`<link\\s+rel=["']${rel}["'][^>]*>`, 'i');

  if (pattern.test(html)) {
    return html.replace(pattern, tag);
  }

  return html.replace('</head>', `      ${tag}\n    </head>`);
}

function replaceRootFallback(html, title, body, links = []) {
  const navLinks = links.length > 0
    ? `<nav>${links.map((link) => `<a href="${escapeHtml(link.href)}">${escapeText(link.label)}</a>`).join(' · ')}</nav>`
    : '';
  const fallback = `<!-- SEO_FALLBACK_START --><main style="max-width: 760px; padding: 40px 24px; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', sans-serif;"><h1>${escapeText(title)}</h1><p>${escapeText(body)}</p>${navLinks}</main><!-- SEO_FALLBACK_END -->`;

  if (rootFallbackPattern.test(html)) {
    return html.replace(rootFallbackPattern, fallback);
  }

  return html.replace('<div id="root"></div>', `<div id="root">${fallback}</div>`);
}

function applyBasePageSeo(indexHtml, page) {
  const url = `${SITE_URL}${page.path}`;
  const keywords = [...siteKeywords, ...(page.keywords ?? [])].filter(Boolean);

  let html = indexHtml
    .replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(page.title)}</title>`);

  html = replaceOrInsertMeta(html, 'name="description"', `<meta name="description" content="${escapeHtml(page.description)}" />`);
  html = replaceOrInsertMeta(html, 'name="keywords"', `<meta name="keywords" content="${escapeHtml(keywords.join(', '))}" />`);
  html = replaceOrInsertMeta(html, 'property="og:type"', '<meta property="og:type" content="website" />');
  html = replaceOrInsertMeta(html, 'property="og:title"', `<meta property="og:title" content="${escapeHtml(page.title)}" />`);
  html = replaceOrInsertMeta(html, 'property="og:description"', `<meta property="og:description" content="${escapeHtml(page.description)}" />`);
  html = replaceOrInsertMeta(html, 'property="og:url"', `<meta property="og:url" content="${escapeHtml(url)}" />`);
  html = replaceOrInsertMeta(html, 'property="og:image"', `<meta property="og:image" content="${defaultImage}" />`);
  html = replaceOrInsertMeta(html, 'property="og:image:secure_url"', `<meta property="og:image:secure_url" content="${defaultImage}" />`);
  html = replaceOrInsertMeta(html, 'name="twitter:title"', `<meta name="twitter:title" content="${escapeHtml(page.title)}" />`);
  html = replaceOrInsertMeta(html, 'name="twitter:description"', `<meta name="twitter:description" content="${escapeHtml(page.description)}" />`);
  html = replaceOrInsertMeta(html, 'name="twitter:image"', `<meta name="twitter:image" content="${defaultImage}" />`);
  html = replaceOrInsertLink(html, 'canonical', `<link rel="canonical" href="${escapeHtml(url)}" />`);
  html = replaceRootFallback(html, page.fallbackTitle ?? page.title, page.fallbackBody ?? page.description, [
    { href: '/', label: 'Home' },
    { href: '/about/', label: 'About' },
    { href: '/category/news/', label: 'News' },
    { href: '/category/listen/', label: 'Listen' },
    { href: '/category/visual/', label: 'Visual' },
    { href: '/category/culture/', label: 'Culture' },
  ]);

  html = html.replace(
    '</head>',
    `      <script type="application/ld+json">
${safeJson({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: page.title,
  description: page.description,
  url,
  isPartOf: {
    '@type': 'WebSite',
    name: siteName,
    url: SITE_URL,
  },
  inLanguage: 'ko-KR',
})}
      </script>
    </head>`
  );

  return html;
}

function applyArticleSeo(indexHtml, article) {
  const slug = article.slug?.current || article._id;
  const title = article.seoTitle || `${article.title} | 까멜리온 매거진`;
  const description = article.seoDescription || article.excerpt || '까멜리온 매거진의 음악 중심 문화 콘텐츠 기사입니다.';
  const url = article.canonicalUrl || `${SITE_URL}/article/${encodeURIComponent(slug)}/`;
  const image = getArticleImage(article);
  const keywords = [
    ...(article.seoKeywords ?? []),
    ...(article.tags ?? []),
    '까멜리온 매거진',
    'CHAMELEON MAGAZINE',
    '음악 매거진',
  ].filter(Boolean);
  const publishedAt = article.publishedAt || new Date().toISOString();
  const modifiedAt = article._updatedAt || publishedAt;

  let html = indexHtml
    .replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);

  html = replaceOrInsertMeta(html, 'name="description"', `<meta name="description" content="${escapeHtml(description)}" />`);
  html = replaceOrInsertMeta(html, 'name="keywords"', `<meta name="keywords" content="${escapeHtml(keywords.join(', '))}" />`);
  html = replaceOrInsertMeta(html, 'property="og:type"', '<meta property="og:type" content="article" />');
  html = replaceOrInsertMeta(html, 'property="og:title"', `<meta property="og:title" content="${escapeHtml(title)}" />`);
  html = replaceOrInsertMeta(html, 'property="og:description"', `<meta property="og:description" content="${escapeHtml(description)}" />`);
  html = replaceOrInsertMeta(html, 'property="og:url"', `<meta property="og:url" content="${escapeHtml(url)}" />`);
  html = replaceOrInsertMeta(html, 'property="og:image"', `<meta property="og:image" content="${escapeHtml(image)}" />`);
  html = replaceOrInsertMeta(html, 'property="og:image:secure_url"', `<meta property="og:image:secure_url" content="${escapeHtml(image)}" />`);
  html = replaceOrInsertMeta(html, 'property="og:image:alt"', `<meta property="og:image:alt" content="${escapeHtml(article.title)}" />`);
  html = replaceOrInsertMeta(html, 'name="twitter:title"', `<meta name="twitter:title" content="${escapeHtml(title)}" />`);
  html = replaceOrInsertMeta(html, 'name="twitter:description"', `<meta name="twitter:description" content="${escapeHtml(description)}" />`);
  html = replaceOrInsertMeta(html, 'name="twitter:image"', `<meta name="twitter:image" content="${escapeHtml(image)}" />`);

  html = replaceOrInsertLink(html, 'canonical', `<link rel="canonical" href="${escapeHtml(url)}" />`);
  html = replaceRootFallback(html, article.title, description, [
    { href: '/', label: 'Home' },
    { href: `/category/${article.category || 'news'}/`, label: article.category || 'News' },
  ]);

  html = html.replace(
    '</head>',
    `      <meta property="article:published_time" content="${escapeHtml(publishedAt)}" />
      <meta property="article:modified_time" content="${escapeHtml(modifiedAt)}" />
      <meta property="article:author" content="${escapeHtml(article.author || 'CHAMELEON Editorial')}" />
      <script type="application/ld+json">
${safeJson({
  '@context': 'https://schema.org',
  '@type': 'NewsArticle',
  headline: article.title,
  description,
  image: [image],
  datePublished: publishedAt,
  dateModified: modifiedAt,
  author: {
    '@type': 'Person',
    name: article.author || 'CHAMELEON Editorial',
  },
  publisher: {
    '@type': 'Organization',
    name: '까멜리온 매거진 | CHAMELEON MAGAZINE',
    logo: {
      '@type': 'ImageObject',
      url: defaultImage,
    },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': url,
  },
  url,
  keywords,
})}
      </script>
    </head>`
  );

  return html;
}

async function fetchPublishedArticles() {
  const query = `*[
    _type == "article" &&
    defined(slug.current) &&
    defined(publishedAt) &&
    !(_id in path("drafts.**"))
  ] | order(publishedAt desc) {
    _id,
    _updatedAt,
    title,
    slug,
    excerpt,
    category,
    tags,
    publishedAt,
    author,
    coverType,
    coverImage,
    coverYouTubeUrl,
    seoTitle,
    seoDescription,
    seoKeywords,
    seoImage,
    canonicalUrl
  }`;

  const endpoint = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`;
  const response = await fetch(`${endpoint}?${new URLSearchParams({ query })}`);

  if (!response.ok) {
    throw new Error(`Sanity route query failed: ${response.status}`);
  }

  const payload = await response.json();
  return payload.result ?? [];
}

async function writeRoute(routePath, html) {
  const routeDir = path.join(distDir, routePath);
  await mkdir(routeDir, { recursive: true });
  await writeFile(path.join(routeDir, 'index.html'), html);
}

function getRouteHtml(indexHtml, routePath) {
  const page = pageSeo[routePath];
  if (page) {
    return applyBasePageSeo(indexHtml, page);
  }

  return applyBasePageSeo(indexHtml, {
    title: `${siteName}`,
    description: siteDescription,
    path: `/${routePath}/`,
    keywords: [],
    fallbackTitle: siteName,
    fallbackBody: siteDescription,
  });
}

async function main() {
  const indexHtml = await readFile(path.join(distDir, 'index.html'), 'utf8');
  const sitemap = await readFile(path.join(distDir, 'sitemap.xml'), 'utf8');
  const routes = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)]
    .map((match) => match[1])
    .filter((loc) => loc.startsWith(SITE_URL))
    .map((loc) => normalizeRoutePath(new URL(loc).pathname))
    .filter(Boolean);

  await Promise.all(routes.map((routePath) => writeRoute(routePath, getRouteHtml(indexHtml, routePath))));

  const articles = await fetchPublishedArticles();
  await Promise.all(articles.flatMap((article) => {
    const slug = article.slug?.current || article._id;
    const articleHtml = applyArticleSeo(indexHtml, article);

    return [
      writeRoute(`article/${slug}`, articleHtml),
      writeRoute(`article/${article._id}`, articleHtml),
    ];
  }));

  console.log(`[routes] Generated ${routes.length} route index files and ${articles.length} article SEO pages.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
