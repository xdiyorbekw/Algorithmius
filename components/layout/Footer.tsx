import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTelegram } from '@fortawesome/free-brands-svg-icons';
import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/lib/config';

export async function Footer() {
  const t = await getTranslations('footer');
  return (
    <footer className="mt-auto border-t border-white/8">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-7 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <span>{t('copyright')}</span>
        <a
          href={siteConfig.telegramUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 transition hover:text-white"
          aria-label={t('telegram')}
        >
          <FontAwesomeIcon icon={faTelegram} aria-hidden="true" />
          <span>{t('telegram')}</span>
        </a>
      </div>
    </footer>
  );
}
