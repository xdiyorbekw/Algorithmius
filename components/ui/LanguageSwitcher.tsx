'use client';

import { useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';

const languages: Array<{ code: Locale; label: string }> = [
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
  { code: 'uz', label: 'UZ' },
];

export function LanguageSwitcher({ currentLocale }: { currentLocale?: Locale }) {
  const locale = useLocale() as Locale;
  const activeLocale = currentLocale ?? locale;
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('common');
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] p-1" aria-label={t('language')}>
      {languages.map((item) => (
        <button
          key={item.code}
          type="button"
          disabled={pending || item.code === activeLocale}
          className={`rounded-md px-2 py-1 text-xs font-semibold tracking-wide transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${item.code === activeLocale ? 'bg-white/10 text-white' : 'text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200 disabled:opacity-50'}`}
          aria-pressed={item.code === activeLocale}
          aria-label={t('switchLanguage', { language: item.label })}
          onClick={() => startTransition(() => router.replace(pathname, { locale: item.code }))}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
