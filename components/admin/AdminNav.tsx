import { getLocale, getTranslations } from 'next-intl/server';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faArrowRightFromBracket, faGaugeHigh } from '@fortawesome/free-solid-svg-icons';
import { Link } from '@/i18n/navigation';
import { signOut } from '@/actions/auth';

export async function AdminNav() {
  const locale = await getLocale();
  const t = await getTranslations('admin');
  const common = await getTranslations('common');

  return (
    <div className="mb-8 flex flex-col gap-4 border-b border-white/8 pb-5 sm:flex-row sm:items-center sm:justify-between">
      <nav className="flex flex-wrap items-center gap-1" aria-label={common('adminNav')}>
        <Link href="/admin" className="inline-flex min-h-10 items-center gap-2 rounded-md px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/[0.04] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30">
          <FontAwesomeIcon icon={faGaugeHigh} aria-hidden="true" />
          {t('dashboard')}
        </Link>
        <Link href="/admin/algorithms/new" className="inline-flex min-h-10 items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30">
          <FontAwesomeIcon icon={faPlus} aria-hidden="true" />
          <span>{t('newAlgorithm')}</span>
        </Link>
      </nav>
      <form action={signOut}>
        <input type="hidden" name="locale" value={locale} />
        <button type="submit" className="inline-flex min-h-10 items-center gap-2 rounded-md px-3 py-2 text-sm text-zinc-500 transition hover:bg-white/[0.04] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30">
          <FontAwesomeIcon icon={faArrowRightFromBracket} aria-hidden="true" />
          <span>{common('logout')}</span>
        </button>
      </form>
    </div>
  );
}
