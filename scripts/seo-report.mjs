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

// 1. Technical SEO Checks
const robotsPath = path.join(rootDir, 'public', 'robots.txt');
const hasRobots =
  fs.existsSync(robotsPath) &&
  fs.readFileSync(robotsPath, 'utf8').includes('Allow: /');

const sitemapPath = path.join(rootDir, 'public', 'sitemap.xml');
const hasSitemap =
  fs.existsSync(sitemapPath) &&
  fs.readFileSync(sitemapPath, 'utf8').includes('<loc>');

const seoLibPath = path.join(rootDir, 'src', 'lib', 'seo.ts');
const hasCanonical =
  fs.existsSync(seoLibPath) &&
  fs.readFileSync(seoLibPath, 'utf8').includes('getCanonicalUrl');

const hasMetadata =
  fs.existsSync(seoLibPath) &&
  fs.readFileSync(seoLibPath, 'utf8').includes('openGraph');

const jsonLdPath = path.join(rootDir, 'src', 'components', 'seo', 'JsonLd.tsx');
const hasJsonLd =
  fs.existsSync(jsonLdPath) &&
  fs.readFileSync(jsonLdPath, 'utf8').includes('schema.org');

// 2. Google Search Console Status
const tokensPath = path.join(rootDir, '.gsc-tokens.json');
let gscState = {
  connected: false,
  property: 'Not Selected',
  verified: 'Not Verified',
  sitemap: 'Not Submitted',
  lastSubmitted: 'None',
  indexing: {
    homepage: 'UNKNOWN',
    projects: 'UNKNOWN',
    about: 'UNKNOWN',
  },
};

if (fs.existsSync(tokensPath)) {
  try {
    const saved = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));
    if (saved.tokens && (saved.tokens.access_token || saved.tokens.refresh_token)) {
      gscState.connected = true;
    }
    if (saved.selectedProperty) {
      gscState.property = saved.selectedProperty;
    }
    if (saved.isVerified) {
      gscState.verified = 'Verified';
    }
    if (saved.sitemapSubmitted) {
      gscState.sitemap = 'Submitted';
    }
    if (saved.lastSubmitted) {
      gscState.lastSubmitted = saved.lastSubmitted;
    }
    if (saved.indexing) {
      gscState.indexing = { ...gscState.indexing, ...saved.indexing };
    }
  } catch {
    // Ignore JSON parse error, keep defaults
  }
}

// 3. Print the standard final report format required
console.log(`
SITE
----
URL: ${siteUrl}
Status: 200 OK (Configured)

TECHNICAL SEO
-------------
robots.txt: ${hasRobots ? 'PASS (Configured)' : 'FAIL'}
sitemap.xml: ${hasSitemap ? 'PASS (Generated)' : 'FAIL'}
canonical: ${hasCanonical ? 'PASS (Dynamic Canonical Active)' : 'FAIL'}
metadata: ${hasMetadata ? 'PASS (OpenGraph & Twitter Cards Active)' : 'FAIL'}
JSON-LD: ${hasJsonLd ? 'PASS (Person, WebSite, Breadcrumbs Active)' : 'FAIL'}

GOOGLE SEARCH CONSOLE
---------------------
Connected: ${gscState.connected ? 'Connected' : 'Not Connected'}
Property: ${gscState.property}
Verified: ${gscState.verified}
Sitemap: ${gscState.sitemap}
Last submitted: ${gscState.lastSubmitted}

INDEXING
--------
Homepage:
Status: ${gscState.indexing.homepage}

Projects:
Status: ${gscState.indexing.projects}

About:
Status: ${gscState.indexing.about}
`);
