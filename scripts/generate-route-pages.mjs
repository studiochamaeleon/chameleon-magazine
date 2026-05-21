import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createImageUrlBuilder } from '@sanity/image-url';

const SITE_URL = 'https://magazine.chameleonstudio.xyz';
const distDir = 'dist';
const projectId = process.env.VITE_SANITY_PROJECT_ID || 'a5gektp6';
const dataset = process.env.VITE_SANITY_DATASET || 'production';
const apiVersion = process.env.VITE_SANITY_API_VERSION || '2025-08-15';
const defaultImage = `${SITE_URL}/og-image.png`;
const builder = createImageUrlBuilder({ projectId, dataset });

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

  html = html.replace(
    '</head>',
    `      <link rel="canonical" href="${escapeHtml(url)}" />
      <meta property="article:published_time" content="${escapeHtml(publishedAt)}" />
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

async function main() {
  const indexHtml = await readFile(path.join(distDir, 'index.html'), 'utf8');
  const sitemap = await readFile(path.join(distDir, 'sitemap.xml'), 'utf8');
  const routes = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)]
    .map((match) => match[1])
    .filter((loc) => loc.startsWith(SITE_URL))
    .map((loc) => normalizeRoutePath(new URL(loc).pathname))
    .filter(Boolean);

  await Promise.all(routes.map((routePath) => writeRoute(routePath, indexHtml)));

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
