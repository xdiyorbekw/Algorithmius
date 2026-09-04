'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Locale } from '@/i18n/routing';
import { loginSchema } from '@/lib/validation';

export type LoginState = { error?: 'invalid' | 'unauthorized' };

function getLocale(value: FormDataEntryValue | null): Locale {
  const locale = String(value ?? 'en');
  return locale === 'ru' || locale === 'uz' ? locale : 'en';
}

export async function signIn(_: LoginState, formData: FormData): Promise<LoginState> {
  const locale = getLocale(formData.get('locale'));
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.success) return { error: 'invalid' };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: 'invalid' };

  const { data, error: userError } = await supabase.auth.getUser();
  if (userError || !data.user) return { error: 'invalid' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .maybeSingle();

  if (profile?.role !== 'admin') {
    await supabase.auth.signOut();
    return { error: 'unauthorized' };
  }

  redirect(`/${locale}/admin`);
}

export async function signOut(formData: FormData): Promise<never> {
  const locale = getLocale(formData.get('locale'));
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(`/${locale}/admin/login`);
}
