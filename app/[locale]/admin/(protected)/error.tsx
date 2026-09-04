'use client';

import { useTranslations } from 'next-intl';

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations('common');

  return (
    <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
      <p className="text-sm font-semibold text-red-200">{t('errorTitle')}</p>
      <p className="mt-2 text-sm leading-6 text-red-100/70">{t('errorDescription')}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-5 rounded-lg border border-white/10 bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
      >
        {t('retry')}
      </button>
    </div>
  );
}
