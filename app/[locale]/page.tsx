import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { AlgorithmCard } from '@/components/algorithms/AlgorithmCard';
import { SearchBox } from '@/components/search/SearchBox';
import { searchAlgorithms } from '@/lib/data/algorithms';
import { routing, type Locale } from '@/i18n/routing';

export const dynamic = 'force-dynamic';

function getLocale(value: string): Locale {
  if (!routing.locales.includes(value as Locale)) notFound();
  return value as Locale;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = getLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: 'meta' });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  return {
    title: 'Algorithmius',
    description: t('description'),
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: Object.fromEntries(routing.locales.map((item) => [item, `${siteUrl}/${item}`])),
    },
    openGraph: {
      type: 'website',
      title: 'Algorithmius',
      description: t('description'),
      url: `${siteUrl}/${locale}`,
    },
  };
}

export default async function HomePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const locale = getLocale((await params).locale);
  const search = await searchParams;
  const rawQuery = Array.isArray(search.q) ? search.q[0] : search.q;
  const query = rawQuery?.slice(0, 80) ?? '';
  const t = await getTranslations({ locale, namespace: 'home' });

  let algorithms = [] as Awaited<ReturnType<typeof searchAlgorithms>>;
  let failed = false;

  try {
    algorithms = await searchAlgorithms(locale, query);
  } catch {
    failed = true;
  }

  return (
    <div>
      <section className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-600">{t('eyebrow')}</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">{t('title')}</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-500 sm:text-lg">{t('intro')}</p>
        <div className="mt-8"><SearchBox initialQuery={query} /></div>
      </section>

      <section className="mt-10" aria-live="polite" aria-busy={false}>
        {failed ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5 text-sm text-red-200">{t('databaseError')}</div>
        ) : algorithms.length === 0 ? (
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-8 text-center text-sm text-zinc-500">
            {query ? t('noResults') : t('results', { count: 0 })}
          </div>
        ) : (
          <>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-600">{t('results', { count: algorithms.length })}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {algorithms.map((algorithm) => <AlgorithmCard key={algorithm.id} algorithm={algorithm} />)}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
