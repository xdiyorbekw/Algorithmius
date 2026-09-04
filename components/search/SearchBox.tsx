'use client';

import { useEffect, useState, useTransition } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';

export function SearchBox({ initialQuery }: { initialQuery: string }) {
  const t = useTranslations('common');
  const [value, setValue] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => setValue(initialQuery), [initialQuery]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      const trimmed = value.trim();
      if (trimmed === initialQuery.trim()) return;
      startTransition(() => {
        router.replace(`${pathname}${trimmed ? `?q=${encodeURIComponent(trimmed)}` : ''}`);
      });
    }, 280);
    return () => window.clearTimeout(handle);
  }, [initialQuery, pathname, router, value]);

  return (
    <div className="relative max-w-2xl">
      <label htmlFor="algorithm-search" className="sr-only">{t('search')}</label>
      <FontAwesomeIcon icon={faMagnifyingGlass} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" aria-hidden="true" />
      <input
        id="algorithm-search"
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={t('searchPlaceholder')}
        className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-11 pr-4 text-sm text-white outline-none ring-0 placeholder:text-zinc-600 focus:border-white/20 focus:bg-white/[0.045]"
        autoComplete="off"
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-600" aria-live="polite">
        {isPending ? t('loading') : ''}
      </span>
    </div>
  );
}
