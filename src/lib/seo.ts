import { Metadata } from 'next';
import { seoConfig } from '@/config/seo';

export function getCanonicalUrl(path: string = ''): string {
  const base = seoConfig.siteUrl;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const full = `${base}${cleanPath}`.replace(/\/+$/, '') || base;

  // Never allow localhost or 127.0.0.1 in production canonical URLs
  if (process.env.NODE_ENV === 'production' && (full.includes('localhost') || full.includes('127.0.0.1'))) {
    console.warn(`[SEO Warning] Localhost detected in canonical URL in production: ${full}`);
  }

  return full;
}

export interface ConstructMetadataOptions {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
  noIndex?: boolean;
}

export function constructMetadata({
  title,
  description,
  path = '',
  ogImage,
  noIndex = false,
}: ConstructMetadataOptions = {}): Metadata {
  const pageTitle = title
    ? `${title} | ${seoConfig.siteName}`
    : `${seoConfig.ownerName} — ${seoConfig.ownerRole}`;

  const pageDescription = description || seoConfig.description;
  const canonicalUrl = getCanonicalUrl(path);
  const imageUrl = ogImage || seoConfig.ogImage;

  return {
    metadataBase: new URL(seoConfig.siteUrl),
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: canonicalUrl,
      title: pageTitle,
      description: pageDescription,
      siteName: seoConfig.siteName,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${seoConfig.ownerName} Portfolio`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [imageUrl],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}
