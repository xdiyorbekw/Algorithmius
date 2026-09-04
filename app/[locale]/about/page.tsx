import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('about');

  return {
    title: `${t('title')} — Algorithm Repository`,
    description: t('body'),
  };
}

export default async function AboutPage() {
  const t = await getTranslations('about');

  return (
    <article className="max-w-3xl">
      <h1 className="text-4xl font-semibold tracking-[-0.04em] text-white">
        {t('title')}
      </h1>

      <p className="mt-6 text-lg leading-8 text-zinc-400">
        {t('body')}
      </p>

      <div className="mt-10 border-t border-white/8 pt-8">
        <h2 className="text-lg font-semibold text-white">
          {t('principlesTitle')}
        </h2>

        <p className="mt-3 text-base leading-7 text-zinc-500">
          {t('principles')}
        </p>
      </div>
    </article>
  );
}