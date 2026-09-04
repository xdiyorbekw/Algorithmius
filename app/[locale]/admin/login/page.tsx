import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { LoginForm } from '@/components/admin/LoginForm';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('admin');
  return {
    title: t('loginTitle'),
    robots: { index: false, follow: false },
  };
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const t = await getTranslations('admin');

  return (
    <div className="mx-auto flex max-w-md justify-center py-10 sm:py-20">
      <section className="w-full rounded-2xl border border-white/8 bg-white/[0.02] p-6 shadow-2xl shadow-black/20 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-600">{t('title')}</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white">{t('loginTitle')}</h1>
        <p className="mt-2 text-sm leading-6 text-zinc-500">{t('loginIntro')}</p>
        {error === 'unauthorized' ? (
          <p className="mt-5 rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-200" role="alert">
            {t('unauthorized')}
          </p>
        ) : null}
        <div className="mt-6"><LoginForm /></div>
      </section>
    </div>
  );
}
