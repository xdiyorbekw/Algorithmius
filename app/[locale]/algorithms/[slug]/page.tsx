import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { getAlgorithmBySlug } from '@/lib/data/algorithms';
import { AlgorithmCodeSelector } from '@/components/code/AlgorithmCodeSelector';
import { Link } from '@/i18n/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { routing } from '@/i18n/routing';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const common = await getTranslations({ locale, namespace: 'common' });
  const algorithm = await getAlgorithmBySlug(locale, slug);
  if (!algorithm) return { title: common('notFoundTitle'), robots: { index: false, follow: false } };
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  return {
    title: algorithm.title,
    description: algorithm.description,
    alternates: {
      canonical: `${siteUrl}/${locale}/algorithms/${encodeURIComponent(algorithm.slug)}`,
      languages: Object.fromEntries(routing.locales.map((item) => [item, `${siteUrl}/${item}/algorithms/${encodeURIComponent(algorithm.slug)}`])),
    },
    openGraph: {
      type: 'article',
      title: algorithm.title,
      description: algorithm.description,
      url: `${siteUrl}/${locale}/algorithms/${encodeURIComponent(algorithm.slug)}`,
    },
  };
}

export default async function AlgorithmPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'algorithm' });
  const common = await getTranslations({ locale, namespace: 'common' });

  let algorithm;
  try {
    algorithm = await getAlgorithmBySlug(locale, slug);
  } catch {
    return <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-sm text-red-200">{t('databaseError')}</div>;
  }

  if (!algorithm) notFound();

  return (
    <article className="max-w-4xl">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-600 transition hover:text-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30">
        <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />
        <span>{common('back')}</span>
      </Link>
      <div className="mt-7">
        <h1 className="text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">{algorithm.title}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-400">{algorithm.description}</p>
      </div>
      <div className="mt-10">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-600">{t('code')}</h2>
        <AlgorithmCodeSelector versions={algorithm.codes} />
      </div>
    </article>
  );
}
