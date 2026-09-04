import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export default async function LocalizedNotFound() {
  const t = await getTranslations('common');

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl items-center">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-600">404</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">{t('notFoundTitle')}</h1>
        <p className="mt-3 max-w-lg text-sm leading-6 text-zinc-500">{t('notFoundDescription')}</p>
        <Link
          href="/"
          className="mt-7 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-zinc-200 transition hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        >
          <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />
          {t('back')}
        </Link>
      </div>
    </main>
  );
}
