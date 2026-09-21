import { MetadataRoute } from 'next';
import { seoConfig } from '@/config/seo';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: `${seoConfig.siteUrl}/sitemap.xml`,
  };
}
