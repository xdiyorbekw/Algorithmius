import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', disallow: ['/admin', '/en/admin', '/ru/admin', '/uz/admin', '/api/admin'] }],
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
  };
}
