'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { supportedLanguages } from '@/lib/constants';
import type { Locale } from '@/i18n/routing';
import { algorithmInputSchema, type AlgorithmInput } from '@/lib/validation';

export type AlgorithmActionState = {
  ok: boolean;
  message?: 'validation' | 'slug' | 'generic';
  fieldErrors?: Record<string, string>;
};

function getLocale(formData: FormData): Locale {
  const value = String(formData.get('locale') ?? 'en');
  return value === 'ru' || value === 'uz' ? value : 'en';
}

function readAlgorithmForm(formData: FormData) {
  const codes = Object.fromEntries(
    supportedLanguages.map((language) => [language, String(formData.get(`code_${language}`) ?? '')]),
  ) as Record<(typeof supportedLanguages)[number], string>;

  return {
    slug: String(formData.get('slug') ?? ''),
    title_en: String(formData.get('title_en') ?? ''),
    title_ru: String(formData.get('title_ru') ?? ''),
    title_uz: String(formData.get('title_uz') ?? ''),
    description_en: String(formData.get('description_en') ?? ''),
    description_ru: String(formData.get('description_ru') ?? ''),
    description_uz: String(formData.get('description_uz') ?? ''),
    codes,
    published: formData.get('published') === 'on',
  };
}

function validate(formData: FormData): { success: true; data: AlgorithmInput } | AlgorithmActionState {
  const result = algorithmInputSchema.safeParse(readAlgorithmForm(formData));
  if (result.success) return result;

  const fieldErrors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const path = issue.path.map(String);
    const key = path[0] === 'codes' && path[1] ? `code_${path[1]}` : path[0] ?? 'generic';
    if (fieldErrors[key]) continue;
    fieldErrors[key] = issue.code === 'too_big' ? 'maxLength' : issue.code === 'invalid_format' ? 'invalidSlug' : 'required';
  }
  return { ok: false, message: 'validation', fieldErrors };
}

async function replaceCodes(
  supabase: Awaited<ReturnType<typeof requireAdmin>>['supabase'],
  algorithmId: string,
  codes: AlgorithmInput['codes'],
) {
  const { error } = await supabase.rpc('replace_algorithm_codes', {
    p_algorithm_id: algorithmId,
    p_codes: codes,
  });
  if (error) throw new Error('ALGORITHM_CODE_PERSIST_FAILED');
}

async function writeAlgorithm(
  formData: FormData,
  mode: 'create' | 'update',
): Promise<never | AlgorithmActionState> {
  const locale = getLocale(formData);
  const { supabase } = await requireAdmin(locale);
  const parsed = validate(formData);
  if (!('success' in parsed)) return parsed;

  const values = parsed.data;
  let id = String(formData.get('id') ?? '');

  if (mode === 'create') {
    const { data, error } = await supabase
      .from('algorithms')
      .insert({
        slug: values.slug,
        title_en: values.title_en,
        title_ru: values.title_ru,
        title_uz: values.title_uz,
        description_en: values.description_en,
        description_ru: values.description_ru,
        description_uz: values.description_uz,
        published: values.published,
      })
      .select('id')
      .single();

    if (error || !data) return { ok: false, message: error?.code === '23505' ? 'slug' : 'generic' };
    id = data.id;
  } else if (!id) {
    return { ok: false, message: 'generic' };
  }

  if (mode === 'update') {
    const { error } = await supabase
      .from('algorithms')
      .update({
        slug: values.slug,
        title_en: values.title_en,
        title_ru: values.title_ru,
        title_uz: values.title_uz,
        description_en: values.description_en,
        description_ru: values.description_ru,
        description_uz: values.description_uz,
        published: values.published,
      })
      .eq('id', id);

    if (error) return { ok: false, message: error.code === '23505' ? 'slug' : 'generic' };
  }

  try {
    await replaceCodes(supabase, id, values.codes);
  } catch {
    if (mode === 'create') await supabase.from('algorithms').delete().eq('id', id);
    return { ok: false, message: 'generic' };
  }

  revalidatePath('/', 'layout');
  redirect(`/${locale}/admin`);
}

export async function createAlgorithm(_: AlgorithmActionState, formData: FormData): Promise<AlgorithmActionState> {
  return writeAlgorithm(formData, 'create');
}

export async function updateAlgorithm(_: AlgorithmActionState, formData: FormData): Promise<AlgorithmActionState> {
  return writeAlgorithm(formData, 'update');
}

export type DeleteActionState = { ok: boolean; message?: 'generic' };

export async function deleteAlgorithm(_: DeleteActionState, formData: FormData): Promise<DeleteActionState> {
  const { supabase } = await requireAdmin(getLocale(formData));
  const id = String(formData.get('id') ?? '');
  if (!id) return { ok: false, message: 'generic' };

  const { error } = await supabase.from('algorithms').delete().eq('id', id);
  if (error) return { ok: false, message: 'generic' };

  revalidatePath('/', 'layout');
  return { ok: true };
}
