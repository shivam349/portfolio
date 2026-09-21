import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const rawSiteUrl =
  process.env.SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'https://portfolio-eight-sigma-mzugu1b20s.vercel.app');

const siteUrl = rawSiteUrl.replace(/\/+$/, '');

console.log('==================================================');
console.log('POST-DEPLOYMENT LIVE SEO VERIFICATION');
console.log(`Target: ${siteUrl}`);
console.log('==================================================');

async function runLiveVerification() {
  const errors = [];

  // STEP 1: Check website availability
  console.log('\nSTEP 1: Checking website availability...');
  try {
    const res = await fetch(siteUrl, { redirect: 'follow' });
    if (res.status === 200) {
      console.log(`✓ Website is online and returned HTTP ${res.status}`);
    } else {
      errors.push(`Website returned HTTP ${res.status}`);
    }
  } catch (e) {
    errors.push(`Website availability check failed: ${e.message}`);
  }

  // STEP 2: Check robots.txt
  console.log('\nSTEP 2: Checking /robots.txt...');
  const robotsUrl = `${siteUrl}/robots.txt`;
  let robotsTxt = '';
  try {
    const res = await fetch(robotsUrl);
    if (res.status === 200) {
      robotsTxt = await res.text();
      if (
        robotsTxt.includes('User-agent:') &&
        robotsTxt.includes('Allow: /') &&
        robotsTxt.includes('Sitemap:') &&
        !robotsTxt.includes('Disallow: /\n')
      ) {
        console.log(`✓ robots.txt verified at ${robotsUrl}`);
      } else {
        errors.push(`robots.txt missing directives or contains invalid Disallow: /`);
      }
    } else {
      errors.push(`/robots.txt returned HTTP ${res.status}`);
    }
  } catch (e) {
    errors.push(`Failed to fetch /robots.txt: ${e.message}`);
  }

  // STEP 3 & 4: Check /sitemap.xml and parse
  console.log('\nSTEP 3 & 4: Checking & parsing /sitemap.xml...');
  const sitemapUrl = `${siteUrl}/sitemap.xml`;
  let sitemapXml = '';
  const discoveredUrls = [];
  try {
    const res = await fetch(sitemapUrl);
    if (res.status === 200) {
      sitemapXml = await res.text();
      const locMatches = sitemapXml.match(/<loc>(.*?)<\/loc>/g) || [];
      for (const m of locMatches) {
        const u = m.replace(/<\/?loc>/g, '').trim();
        discoveredUrls.push(u);
      }
      console.log(`✓ sitemap.xml verified. Discovered ${discoveredUrls.length} public route(s).`);
    } else {
      errors.push(`/sitemap.xml returned HTTP ${res.status}`);
    }
  } catch (e) {
    errors.push(`Failed to fetch /sitemap.xml: ${e.message}`);
  }

  // STEP 5 & 6: Check every sitemap URL and require HTTP 200
  console.log('\nSTEP 5 & 6: Checking every sitemap URL for HTTP 200...');
  for (const url of discoveredUrls) {
    try {
      const res = await fetch(url);
      if (res.status === 200) {
        console.log(`✓ [200 OK] ${url}`);
      } else {
        errors.push(`Sitemap URL ${url} returned HTTP ${res.status}`);
      }
    } catch (e) {
      errors.push(`Error requesting sitemap URL ${url}: ${e.message}`);
    }
  }

  // STEP 7, 8, 9: Canonical, Metadata, JSON-LD on homepage
  console.log('\nSTEP 7, 8, 9: Validating Canonical, Metadata & JSON-LD...');
  try {
    const res = await fetch(siteUrl);
    const html = await res.text();

    // Canonical
    if (html.includes('rel="canonical"')) {
      console.log('✓ Canonical link element verified');
    } else {
      errors.push('Homepage missing <link rel="canonical" ...>');
    }

    // Metadata
    if (html.includes('<title>') && html.includes('name="description"')) {
      console.log('✓ Title and Meta Description verified');
    } else {
      errors.push('Homepage missing title or meta description');
    }

    // JSON-LD
    if (html.includes('application/ld+json')) {
      console.log('✓ Schema.org JSON-LD structured data verified');
    } else {
      errors.push('Homepage missing Schema.org JSON-LD tag');
    }
  } catch (e) {
    errors.push(`Error checking page HTML: ${e.message}`);
  }

  console.log('\n==================================================');
  if (errors.length > 0) {
    console.error('LIVE SEO VERIFICATION ISSUES:');
    for (const err of errors) {
      console.error(` ✗ ${err}`);
    }
    console.error('==================================================\n');
    // Exit with code 1 if live verification failed
    process.exit(1);
  } else {
    console.log('ALL LIVE TECHNICAL SEO CHECKS PASSED (HTTP 200)');
    console.log('==================================================\n');
    process.exit(0);
  }
}

runLiveVerification();
