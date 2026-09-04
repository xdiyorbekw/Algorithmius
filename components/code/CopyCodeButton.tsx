'use client';

import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCopy } from '@fortawesome/free-solid-svg-icons';
import { useTranslations } from 'next-intl';

export function CopyCodeButton({ code }: { code: string }) {
  const t = useTranslations('common');
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle');
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setStatus('copied');
    } catch {
      setStatus('failed');
    }
    timeoutRef.current = window.setTimeout(() => setStatus('idle'), 1800);
  }

  const label = status === 'copied' ? t('copied') : status === 'failed' ? t('copyFailed') : t('copy');

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-zinc-300 transition hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
      aria-label={label}
    >
      <FontAwesomeIcon icon={status === 'copied' ? faCheck : faCopy} aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}
