'use client';

import { useRef, useState, type KeyboardEvent } from 'react';
import { useTranslations } from 'next-intl';
import type { AlgorithmLanguage } from '@/lib/types/database';
import { CopyCodeButton } from './CopyCodeButton';

export type CodeTab = {
  language: AlgorithmLanguage;
  label: string;
  code: string;
  html: string;
};

export function CodeTabs({ tabs }: { tabs: CodeTab[] }) {
  const t = useTranslations('algorithm');
  const [active, setActive] = useState(tabs.some((tab) => tab.language === 'python') ? 'python' : tabs[0].language);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const current = tabs.find((tab) => tab.language === active) ?? tabs[0];

  function focusTab(index: number) {
    const next = tabs[(index + tabs.length) % tabs.length];
    setActive(next.language);
    buttonRefs.current[next.language]?.focus();
  }

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === 'ArrowRight') { event.preventDefault(); focusTab(index + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); focusTab(index - 1); }
    if (event.key === 'Home') { event.preventDefault(); focusTab(0); }
    if (event.key === 'End') { event.preventDefault(); focusTab(tabs.length - 1); }
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label={t('language')}>
        {tabs.map((tab) => {
          const selected = tab.language === current.language;
          return (
            <button
              key={tab.language}
              ref={(element) => { buttonRefs.current[tab.language] = element; }}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`code-panel-${tab.language}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(tab.language)}
              onKeyDown={(event) => onTabKeyDown(event, tabs.indexOf(tab))}
              className={selected
                ? 'rounded-md border border-white/20 bg-white px-3 py-2 text-xs font-semibold text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40'
                : 'rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 text-xs font-semibold text-zinc-500 transition hover:border-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30'}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b0d10]" aria-label={t('sourceCode')}>
        <div className="flex items-center justify-between gap-3 border-b border-white/8 bg-white/[0.02] px-4 py-3">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">{current.label}</span>
          <CopyCodeButton code={current.code} />
        </div>
        <div
          id={`code-panel-${current.language}`}
          role="tabpanel"
          className="code-viewer max-h-[70vh] overflow-auto p-4 sm:p-5"
          dangerouslySetInnerHTML={{ __html: current.html }}
        />
      </section>
    </div>
  );
}
