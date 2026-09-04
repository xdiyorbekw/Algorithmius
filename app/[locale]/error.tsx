'use client';

import { useTranslations } from 'next-intl';

export default function LocaleError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations('common');

  return (
    <div className="min-h-[60vh] rounded-2xl border border-red-500/20 bg-red-500/5 p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-red-300/70">500</p>
      <h1 className="mt-3 text-2xl font-semibold text-white">{t('errorTitle')}</h1>
      <p className="mt-2 max-w-xl text-sm leading-6 text-red-100/70">{t('errorDescription')}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-lg border border-white/10 bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
      >
        {t('retry')}
      </button>
    </div>
  );
}
