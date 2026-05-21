import { access, mkdir, writeFile } from 'node:fs/promises';

const SITE_URL = 'https://magazine.chameleonstudio.xyz';
const projectId = process.env.VITE_SANITY_PROJECT_ID || 'a5gektp6';
const dataset = process.env.VITE_SANITY_DATASET || 'production';
const apiVersion = process.env.VITE_SANITY_API_VERSION || '2025-08-15';

const staticPages = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/about', changefreq: 'monthly', priority: '0.7' },
  { path: '/category/editors-pick', changefreq: 'daily', priority: '0.8' },
  { path: '/category/news', changefreq: 'daily', priority: '0.8' },
  { path: '/category/listen', changefreq: 'daily', priority: '0.8' },
  { path: '/category/visual', changefreq: 'daily', priority: '0.8' },
  { path: '/category/culture', changefreq: 'daily', priority: '0.8' },
];

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function toUrl(path) {
  if (path === '/') {
    return `${SITE_URL}/`;
  }

  return `${SITE_URL}${path.replace(/\/+$/, '')}/`;
}

function toDate(value) {
  return new Date(value).toISOString().slice(0, 10);
}

async function fetchPublishedArticles() {
  const query = `*[
    _type == "article" &&
    defined(slug.current) &&
    defined(publishedAt) &&
    !(_id in path("drafts.**"))
  ] | order(publishedAt desc) {
    _id,
    slug,
    _updatedAt,
    publishedAt
  }`;

  const endpoint = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`;
  const response = await fetch(`${endpoint}?${new URLSearchParams({ query })}`);

  if (!response.ok) {
    throw new Error(`Sanity sitemap query failed: ${response.status}`);
  }

  const payload = await response.json();
  return payload.result ?? [];
}

function buildSitemap(articleDocs) {
  const today = toDate(new Date());
  const urls = [
    ...staticPages.map((page) => ({
      loc: toUrl(page.path),
      lastmod: today,
      changefreq: page.changefreq,
      priority: page.priority,
    })),
    ...articleDocs.map((article) => ({
      loc: toUrl(`/article/${article.slug?.current || article._id}`),
      lastmod: toDate(article._updatedAt || article.publishedAt || new Date()),
      changefreq: 'weekly',
      priority: '0.7',
    })),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;
}

async function main() {
  let articles = [];
  let preserveExistingSitemap = false;

  await mkdir('public', { recursive: true });

  try {
    articles = await fetchPublishedArticles();
  } catch (error) {
    console.warn(`[sitemap] ${error instanceof Error ? error.message : error}`);
    try {
      await access('public/sitemap.xml');
      preserveExistingSitemap = true;
      console.warn('[sitemap] Existing sitemap.xml preserved.');
    } catch {
      console.warn('[sitemap] Continuing with static pages only.');
    }
  }

  if (!preserveExistingSitemap) {
    await writeFile('public/sitemap.xml', buildSitemap(articles));
  }

  await writeFile('public/robots.txt', `User-agent: *
Allow: /
Disallow: /admin
Disallow: /search

Sitemap: ${SITE_URL}/sitemap.xml
`);

  if (preserveExistingSitemap) {
    console.log('[sitemap] Preserved existing sitemap.xml.');
  } else {
    console.log(`[sitemap] Generated sitemap.xml with ${articles.length} article URLs.`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
