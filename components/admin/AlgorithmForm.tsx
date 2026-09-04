'use client';

import { useActionState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { createAlgorithm, updateAlgorithm, type AlgorithmActionState } from '@/actions/algorithms';
import type { Database } from '@/lib/types/database';
import { languageLabels, supportedLanguages } from '@/lib/constants';
import { Link } from '@/i18n/navigation';

const initialState: AlgorithmActionState = { ok: true };

type Algorithm = Database['public']['Tables']['algorithms']['Row'] & {
  codes?: Partial<Record<(typeof supportedLanguages)[number], string>>;
};

export function AlgorithmForm({ algorithm }: { algorithm?: Algorithm | null }) {
  const t = useTranslations('admin');
  const common = useTranslations('common');
  const locale = useLocale();
  const action = algorithm ? updateAlgorithm : createAlgorithm;
  const [state, formAction, pending] = useActionState(action, initialState);

  function error(field: string) {
    const value = state.fieldErrors?.[field];
    if (!value) return null;
    const translated = value === 'required'
      ? common('required')
      : value === 'invalidSlug'
        ? common('invalidSlug')
        : value === 'maxLength'
          ? common('maxLength')
          : common('genericError');
    return <p className="mt-1 text-xs text-red-300">{translated}</p>;
  }

  const input = 'mt-2 h-11 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-white/25 focus:bg-white/[0.045] focus-visible:ring-2 focus-visible:ring-white/20';
  const textarea = 'mt-2 min-h-28 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-3 text-sm leading-6 text-white outline-none placeholder:text-zinc-600 focus:border-white/25 focus:bg-white/[0.045] focus-visible:ring-2 focus-visible:ring-white/20';

  return (
    <form action={formAction} className="space-y-7" noValidate>
      <input type="hidden" name="locale" value={locale} />
      {algorithm ? <input type="hidden" name="id" value={algorithm.id} /> : null}

      <section className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 sm:p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-600">{t('title')}</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">{algorithm ? t('formTitleEdit') : t('formTitleNew')}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">{t('formIntro')}</p>
        </div>

        <div className="mt-6 grid gap-5">
          <div>
            <label htmlFor="slug" className="text-sm font-medium text-zinc-300">{t('slug')}</label>
            <input id="slug" name="slug" defaultValue={algorithm?.slug ?? ''} className={input} autoCapitalize="none" autoCorrect="off" spellCheck={false} />
            {error('slug')}
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {(['title_en', 'title_ru', 'title_uz'] as const).map((field) => (
              <div key={field}>
                <label htmlFor={field} className="text-sm font-medium text-zinc-300">{t(field === 'title_en' ? 'titleEn' : field === 'title_ru' ? 'titleRu' : 'titleUz')}</label>
                <input id={field} name={field} defaultValue={algorithm?.[field] ?? ''} className={input} />
                {error(field)}
              </div>
            ))}
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {(['description_en', 'description_ru', 'description_uz'] as const).map((field) => (
              <div key={field}>
                <label htmlFor={field} className="text-sm font-medium text-zinc-300">{t(field === 'description_en' ? 'descriptionEn' : field === 'description_ru' ? 'descriptionRu' : 'descriptionUz')}</label>
                <textarea id={field} name={field} defaultValue={algorithm?.[field] ?? ''} className={textarea} />
                {error(field)}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 sm:p-6">
        <div>
          <h2 className="text-lg font-semibold text-white">{t('codeVersions')}</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-zinc-500">{t('codeVersionsIntro')}</p>
        </div>

        <div className="mt-6 grid gap-6">
          {supportedLanguages.map((language) => {
            const required = language === 'python';
            return (
              <div key={language}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label htmlFor={`code_${language}`} className="text-sm font-medium text-zinc-300">
                    {languageLabels[language]}
                    {required ? <span className="ml-2 text-xs text-zinc-600">{t('requiredLanguage')}</span> : null}
                  </label>
                  {language === 'python' ? <span className="text-xs text-zinc-600">{t('defaultLanguage')}</span> : <span className="text-xs text-zinc-700">{t('optionalLanguage')}</span>}
                </div>
                <textarea
                  id={`code_${language}`}
                  name={`code_${language}`}
                  defaultValue={algorithm?.codes?.[language] ?? ''}
                  required={required}
                  className="mt-2 min-h-[280px] w-full resize-y rounded-lg border border-white/10 bg-[#0b0d10] px-4 py-4 font-mono text-sm leading-6 text-zinc-200 outline-none focus:border-white/25 focus-visible:ring-2 focus-visible:ring-white/20"
                  spellCheck={false}
                  autoCapitalize="none"
                  autoCorrect="off"
                  aria-describedby={required ? `code_${language}_hint` : undefined}
                />
                {required ? <p id={`code_${language}_hint`} className="mt-1 text-xs text-zinc-600">{t('pythonRequired')}</p> : null}
                {error(`code_${language}`)}
              </div>
            );
          })}
        </div>

        <label className="mt-6 inline-flex min-h-11 cursor-pointer items-center gap-3 text-sm text-zinc-300">
          <input type="checkbox" name="published" defaultChecked={algorithm?.published ?? true} className="size-4 rounded border-white/20 bg-white/[0.03] accent-white focus-visible:ring-2 focus-visible:ring-white/30" />
          <span>{t('published')}</span>
        </label>
      </section>

      {state.message ? (
        <p className="rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-200" role="alert">
          {state.message === 'slug' ? common('slugTaken') : state.message === 'validation' ? t('formError') : common('genericError')}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={pending} className="inline-flex h-11 items-center justify-center rounded-lg border border-white/10 bg-white px-5 text-sm font-semibold text-black transition hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 disabled:cursor-not-allowed disabled:opacity-50">
          {pending ? common('loading') : common('save')}
        </button>
        <Link href="/admin" className="inline-flex h-11 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] px-5 text-sm font-semibold text-zinc-300 transition hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30">
          {common('cancel')}
        </Link>
      </div>
    </form>
  );
}
