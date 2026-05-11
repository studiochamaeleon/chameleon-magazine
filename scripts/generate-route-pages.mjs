import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const SITE_URL = 'https://magazine.chameleonstudio.xyz';
const distDir = 'dist';

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

async function main() {
  const indexHtml = await readFile(path.join(distDir, 'index.html'), 'utf8');
  const sitemap = await readFile(path.join(distDir, 'sitemap.xml'), 'utf8');
  const routes = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)]
    .map((match) => match[1])
    .filter((loc) => loc.startsWith(SITE_URL))
    .map((loc) => normalizeRoutePath(new URL(loc).pathname))
    .filter(Boolean);

  await Promise.all(routes.map(async (routePath) => {
    const routeDir = path.join(distDir, routePath);
    await mkdir(routeDir, { recursive: true });
    await writeFile(path.join(routeDir, 'index.html'), indexHtml);
  }));

  console.log(`[routes] Generated ${routes.length} route index files.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
