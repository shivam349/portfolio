import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load environment variables if .env.local exists
const envPath = path.join(rootDir, '.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [k, ...v] = trimmed.split('=');
      if (!process.env[k.trim()]) {
        process.env[k.trim()] = v.join('=').trim().replace(/^["']|["']$/g, '');
      }
    }
  }
}

function resolveProductionUrl() {
  if (process.env.GITHUB_ACTIONS === 'true') {
    return process.env.SITE_URL || 'https://shivam349.github.io/portfolio';
  }
  if (process.env.VERCEL === '1') {
    if (process.env.SITE_URL && !process.env.SITE_URL.includes('github.io')) {
      return process.env.SITE_URL;
    }
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
      return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
    }
    return 'https://portfolio-eight-sigma-mzugu1b20s.vercel.app';
  }
  if (process.env.SITE_URL && !process.env.SITE_URL.includes('github.io')) {
    return process.env.SITE_URL;
  }
  if (process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes('github.io')) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return 'https://portfolio-eight-sigma-mzugu1b20s.vercel.app';
}

const rawSiteUrl = resolveProductionUrl();
const siteUrl = rawSiteUrl.replace(/\/+$/, '');
const currentDate = new Date().toISOString().split('T')[0];

console.log(`[SEO Build] Generating sitemap.xml and robots.txt for: ${siteUrl}`);

// Public routes (excluding /admin, /api, private routes)
const publicRoutes = [
  { path: '/', priority: '1.0', changefreq: 'monthly' },
];

// Generate sitemap XML
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${publicRoutes
  .map(
    (r) => `  <url>
    <loc>${siteUrl}${r.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

// Generate robots.txt
const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${siteUrl}/sitemap.xml
`;

// Write to public/
const publicDir = path.join(rootDir, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf8');
fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt, 'utf8');

console.log(`✓ Generated public/sitemap.xml`);
console.log(`✓ Generated public/robots.txt`);

// Also write to out/ if it exists (for static export)
const outDir = path.join(rootDir, 'out');
if (fs.existsSync(outDir)) {
  fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemapXml, 'utf8');
  fs.writeFileSync(path.join(outDir, 'robots.txt'), robotsTxt, 'utf8');
  console.log(`✓ Synced to out/sitemap.xml and out/robots.txt`);
}
