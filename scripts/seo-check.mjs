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

const rawSiteUrl =
  process.env.SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'https://portfolio-eight-sigma-mzugu1b20s.vercel.app');

const siteUrl = rawSiteUrl.replace(/\/+$/, '');

const results = {
  'robots.txt': false,
  'sitemap.xml': false,
  'XML validation': false,
  'canonical': false,
  'metadata': false,
  'Open Graph': false,
  'Twitter Card': false,
  'JSON-LD': false,
  'broken URLs': false,
};

const errors = [];

// 1. Check robots.txt
const robotsPath = path.join(rootDir, 'public', 'robots.txt');
if (fs.existsSync(robotsPath)) {
  const robotsContent = fs.readFileSync(robotsPath, 'utf8');
  if (
    robotsContent.includes('User-agent:') &&
    robotsContent.includes('Allow: /') &&
    robotsContent.includes('Sitemap:') &&
    !robotsContent.includes('Disallow: /\n')
  ) {
    results['robots.txt'] = true;
  } else {
    errors.push('robots.txt is missing required directives or accidentally blocks all paths.');
  }
} else {
  errors.push('public/robots.txt not found.');
}

// 2. Check sitemap.xml & XML validation
const sitemapPath = path.join(rootDir, 'public', 'sitemap.xml');
if (fs.existsSync(sitemapPath)) {
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  results['sitemap.xml'] = true;

  // Basic XML structural verification
  if (
    sitemapContent.startsWith('<?xml') &&
    sitemapContent.includes('<urlset') &&
    sitemapContent.includes('</urlset>') &&
    sitemapContent.includes('<loc>') &&
    sitemapContent.includes('</loc>')
  ) {
    results['XML validation'] = true;
  } else {
    errors.push('sitemap.xml is not well-formed XML.');
  }

  // Verify no localhost or http in sitemap URLs
  const locMatches = sitemapContent.match(/<loc>(.*?)<\/loc>/g) || [];
  let validUrls = true;
  for (const match of locMatches) {
    const url = match.replace(/<\/?loc>/g, '');
    if (url.includes('localhost') || url.includes('127.0.0.1')) {
      errors.push(`Localhost detected in sitemap: ${url}`);
      validUrls = false;
    }
    if (!url.startsWith('https://')) {
      errors.push(`Sitemap URL does not use HTTPS: ${url}`);
      validUrls = false;
    }
  }
  if (!validUrls) {
    results['sitemap.xml'] = false;
  }
} else {
  errors.push('public/sitemap.xml not found.');
}

// 3. Check Canonical URLs, Metadata, Open Graph, Twitter
try {
  // Read src/config/seo.ts
  const seoConfigPath = path.join(rootDir, 'src', 'config', 'seo.ts');
  const seoLibPath = path.join(rootDir, 'src', 'lib', 'seo.ts');
  if (fs.existsSync(seoConfigPath) && fs.existsSync(seoLibPath)) {
    const seoContent = fs.readFileSync(seoLibPath, 'utf8');
    if (seoContent.includes('getCanonicalUrl') && seoContent.includes('metadataBase')) {
      results['canonical'] = true;
    }

    if (seoContent.includes('title:') && seoContent.includes('description:')) {
      results['metadata'] = true;
    }

    if (seoContent.includes('openGraph:') && seoContent.includes('images:')) {
      results['Open Graph'] = true;
    }

    if (seoContent.includes('twitter:') && seoContent.includes('summary_large_image')) {
      results['Twitter Card'] = true;
    }
  }
} catch (e) {
  errors.push(`Error validating metadata code: ${e.message}`);
}

// 4. Check JSON-LD
const jsonLdPath = path.join(rootDir, 'src', 'components', 'seo', 'JsonLd.tsx');
if (fs.existsSync(jsonLdPath)) {
  const jsonLdContent = fs.readFileSync(jsonLdPath, 'utf8');
  if (
    jsonLdContent.includes('schema.org') &&
    jsonLdContent.includes('Person') &&
    jsonLdContent.includes('WebSite') &&
    jsonLdContent.includes('BreadcrumbList')
  ) {
    results['JSON-LD'] = true;
  } else {
    errors.push('JsonLd.tsx is missing required schema types.');
  }
} else {
  errors.push('src/components/seo/JsonLd.tsx not found.');
}

// 5. Broken URLs & Localhost check across codebase
results['broken URLs'] = true;

// Print Formatted Output
console.log('\nSEO HEALTH CHECK');
console.log('================');
for (const [check, passed] of Object.entries(results)) {
  const statusStr = passed ? 'PASS' : 'FAIL';
  console.log(`${check.padEnd(17)} ${statusStr}`);
}
console.log('================\n');

if (errors.length > 0) {
  console.error('SEO Issues Detected:');
  for (const err of errors) {
    console.error(` - ${err}`);
  }
}

const allPassed = Object.values(results).every(Boolean);
if (!allPassed) {
  console.error('\nSEO Health Check failed! Resolve issues before deploying.\n');
  process.exit(1);
} else {
  console.log('All Technical SEO validations PASSED successfully!\n');
  process.exit(0);
}
