import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { createClient } from '@/lib/supabase/server';
import { siteConfig } from '@/lib/config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  for (const locale of routing.locales) {
    entries.push({ url: `${siteConfig.siteUrl}/${locale}`, changeFrequency: 'daily' });
    entries.push({ url: `${siteConfig.siteUrl}/${locale}/about`, changeFrequency: 'monthly' });
  }

  try {
    const supabase = await createClient();
    const { data } = await supabase.from('algorithms').select('slug, updated_at').eq('published', true);
    for (const algorithm of data ?? []) {
      for (const locale of routing.locales) {
        entries.push({ url: `${siteConfig.siteUrl}/${locale}/algorithms/${algorithm.slug}`, lastModified: algorithm.updated_at });
      }
    }
  } catch {
    // Sitemap remains valid even if the database is temporarily unavailable.
  }

  return entries;
}
