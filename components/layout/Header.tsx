import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faHouse, faShieldHalved } from '@fortawesome/free-solid-svg-icons';
import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import type { Locale } from '@/i18n/routing';

export async function Header() {
  const t = await getTranslations('common');
  const locale = (await getLocale()) as Locale;

  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-[#08090b]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-3 font-semibold tracking-tight text-white" aria-label={t('appName')}>
          <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.03]">
            <FontAwesomeIcon icon={faCode} className="text-sm text-zinc-300" aria-hidden="true" />
          </span>
          <span className="truncate sm:block">{t('appName')}</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2" aria-label={t('primaryNav')}>
          <Link className="inline-flex items-center gap-2 rounded-md px-2 py-2 text-xs text-zinc-400 transition hover:bg-white/[0.04] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 sm:px-3 sm:text-sm" href="/">
            <FontAwesomeIcon icon={faHouse} aria-hidden="true" />
            <span className="hidden sm:inline">{t('home')}</span>
          </Link>
          <Link className="rounded-md px-2 py-2 text-xs text-zinc-400 transition hover:bg-white/[0.04] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 sm:px-3 sm:text-sm" href="/about">
            {t('about')}
          </Link>
          <Link aria-label={t('admin')} className="inline-flex items-center gap-2 rounded-md px-2 py-2 text-xs text-zinc-400 transition hover:bg-white/[0.04] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 sm:px-3 sm:text-sm" href="/admin">
            <FontAwesomeIcon icon={faShieldHalved} aria-hidden="true" />
            <span className="hidden sm:inline">{t('admin')}</span>
          </Link>
          <LanguageSwitcher currentLocale={locale} />
        </nav>
      </div>
    </header>
  );
}
