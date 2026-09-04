import type { Locale } from '@/i18n/routing';
import { createClient } from '@/lib/supabase/server';
import type { AlgorithmLanguage } from '@/lib/types/database';

const localeColumns = {
  en: { title: 'title_en', description: 'description_en' },
  ru: { title: 'title_ru', description: 'description_ru' },
  uz: { title: 'title_uz', description: 'description_uz' },
} as const;

type SearchRow = {
  id: string;
  slug: string;
  title_en: string;
  title_ru: string;
  title_uz: string;
  description_en: string;
  description_ru: string;
  description_uz: string;
};

type CodeVersionRow = { language: AlgorithmLanguage; code: string };

export type AlgorithmCard = { id: string; slug: string; title: string; description: string };
export type AlgorithmDetail = AlgorithmCard & { codes: CodeVersionRow[]; created_at: string; updated_at: string };
export type AdminAlgorithm = SearchRow & {
  published: boolean;
  created_at: string;
  updated_at: string;
  codes: Partial<Record<AlgorithmLanguage, string>>;
};


function makeSearchQuery(supabase: Awaited<ReturnType<typeof createClient>>, locale: Locale, query?: string) {
  const columns = localeColumns[locale];
  let request = supabase
    .from('algorithms')
    .select('id, slug, title_en, title_ru, title_uz, description_en, description_ru, description_uz')
    .eq('published', true)
    .order(columns.title, { ascending: true })
    .limit(100);

  const normalized = query?.trim().slice(0, 80) ?? '';
  const safe = normalized.replace(/[^\p{L}\p{N}\s-]/gu, '').trim();
  if (normalized && !safe) return request.eq('slug', '__no_valid_search_term__');
  if (safe) request = request.or(`${columns.title}.ilike.%${safe}%,${columns.description}.ilike.%${safe}%`);
  return request;
}

function localized(row: SearchRow, locale: Locale): Pick<AlgorithmCard, 'title' | 'description'> {
  const columns = localeColumns[locale];
  return { title: row[columns.title], description: row[columns.description] };
}

export async function searchAlgorithms(locale: Locale, query?: string): Promise<AlgorithmCard[]> {
  const supabase = await createClient();
  const request = makeSearchQuery(supabase, locale, query);
  const { data, error } = await request;
  if (error) throw new Error('ALGORITHMS_FETCH_FAILED');

  return (data ?? []).map((row) => ({
    id: row.id,
    slug: row.slug,
    ...localized(row as SearchRow, locale),
  }));
}

export async function getAlgorithmBySlug(locale: Locale, slug: string): Promise<AlgorithmDetail | null> {
  const supabase = await createClient();
  const query = supabase
    .from('algorithms')
    .select(`
      id, slug, title_en, title_ru, title_uz,
      description_en, description_ru, description_uz,
      created_at, updated_at,
      algorithm_code_versions(language, code)
    `)
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();

  const { data, error } = await query;
  if (error) throw new Error('ALGORITHM_FETCH_FAILED');
  if (!data) return null;

  const row = data as unknown as SearchRow & { created_at: string; updated_at: string; algorithm_code_versions: CodeVersionRow[] | null };
  return {
    id: row.id,
    slug: row.slug,
    ...localized(row, locale),
    codes: row.algorithm_code_versions ?? [],
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export async function listAdminAlgorithms(): Promise<Array<{ id: string; slug: string; title_en: string; published: boolean; updated_at: string; code_languages: AlgorithmLanguage[] }>> {
  const supabase = await createClient();
  const query = supabase
    .from('algorithms')
    .select('id, slug, title_en, published, updated_at, algorithm_code_versions(language)')
    .order('updated_at', { ascending: false });

  const { data, error } = await query;
  if (error) throw new Error('ADMIN_ALGORITHMS_FETCH_FAILED');

  return (data as unknown as Array<{
    id: string;
    slug: string;
    title_en: string;
    published: boolean;
    updated_at: string;
    algorithm_code_versions: Array<{ language: AlgorithmLanguage }> | null;
  }>).map((algorithm) => ({
    id: algorithm.id,
    slug: algorithm.slug,
    title_en: algorithm.title_en,
    published: algorithm.published,
    updated_at: algorithm.updated_at,
    code_languages: (algorithm.algorithm_code_versions ?? []).map((item) => item.language),
  }));
}

export async function getAdminAlgorithm(id: string): Promise<AdminAlgorithm | null> {
  const supabase = await createClient();
  const query = supabase
    .from('algorithms')
    .select(`
      id, slug, title_en, title_ru, title_uz,
      description_en, description_ru, description_uz,
      published, created_at, updated_at,
      algorithm_code_versions(language, code)
    `)
    .eq('id', id)
    .maybeSingle();

  const { data, error } = await query;
  if (error) throw new Error('ADMIN_ALGORITHM_FETCH_FAILED');
  if (!data) return null;

  const row = data as unknown as SearchRow & {
    published: boolean;
    created_at: string;
    updated_at: string;
    algorithm_code_versions: CodeVersionRow[] | null;
  };

  const codes: Partial<Record<AlgorithmLanguage, string>> = {};
  for (const item of row.algorithm_code_versions ?? []) codes[item.language] = item.code;

  return { ...row, codes };
}
