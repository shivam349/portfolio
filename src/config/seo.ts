import { portfolioData } from '@/data/portfolio';

function cleanUrl(url: string): string {
  if (!url) return '';
  return url.replace(/\/+$/, '');
}

// Compute production site URL from env or fallback
const rawSiteUrl =
  process.env.SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  'https://shivam349.github.io/portfolio';

export const seoConfig = {
  siteUrl: cleanUrl(rawSiteUrl),
  siteName:
    process.env.SITE_NAME ||
    process.env.NEXT_PUBLIC_SITE_NAME ||
    `${portfolioData.profile.name} | Data Analyst & BI Specialist`,
  ownerName:
    process.env.OWNER_NAME ||
    process.env.NEXT_PUBLIC_OWNER_NAME ||
    portfolioData.profile.name,
  ownerRole:
    process.env.OWNER_ROLE ||
    process.env.NEXT_PUBLIC_OWNER_ROLE ||
    portfolioData.profile.headline,
  description:
    process.env.DESCRIPTION ||
    process.env.NEXT_PUBLIC_DESCRIPTION ||
    portfolioData.profile.bio,
  ogImage:
    process.env.OG_IMAGE ||
    process.env.NEXT_PUBLIC_OG_IMAGE ||
    `${cleanUrl(rawSiteUrl)}/og-image.png`,
  email:
    process.env.OWNER_EMAIL ||
    process.env.NEXT_PUBLIC_OWNER_EMAIL ||
    portfolioData.profile.email,
  phone:
    process.env.OWNER_PHONE ||
    process.env.NEXT_PUBLIC_OWNER_PHONE ||
    portfolioData.profile.phone,
  location:
    process.env.OWNER_LOCATION ||
    process.env.NEXT_PUBLIC_OWNER_LOCATION ||
    portfolioData.profile.location,

  // Google Search Console settings
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleRedirectUri:
    process.env.GOOGLE_REDIRECT_URI ||
    'http://localhost:3001/api/auth/google/callback',
  gscPropertyId: process.env.GSC_PROPERTY_ID || '',

  // Excluded paths from indexing/sitemap
  excludedPaths: [
    '/admin',
    '/admin/seo',
    '/admin/setup',
    '/api',
    '/api/auth',
    '/api/seo',
    '/preview',
    '/test',
    '/_not-found',
  ],
};
