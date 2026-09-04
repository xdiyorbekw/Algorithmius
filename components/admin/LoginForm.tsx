'use client';

import { useActionState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { signIn, type LoginState } from '@/actions/auth';

const initialState: LoginState = {};

export function LoginForm() {
  const t = useTranslations('admin');
  const locale = useLocale();
  const [state, formAction, pending] = useActionState(signIn, initialState);
  const input = 'mt-2 h-11 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-white/20';

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="locale" value={locale} />
      <div>
        <label htmlFor="email" className="text-sm font-medium text-zinc-300">{t('email')}</label>
        <input id="email" name="email" type="email" required autoComplete="email" className={input} />
      </div>
      <div>
        <label htmlFor="password" className="text-sm font-medium text-zinc-300">{t('password')}</label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className={input} />
      </div>
      {state.error === 'invalid' ? <p className="text-sm text-red-300" role="alert">{t('invalidCredentials')}</p> : null}
      {state.error === 'unauthorized' ? <p className="text-sm text-red-300" role="alert">{t('unauthorized')}</p> : null}
      <button type="submit" disabled={pending} className="h-11 w-full rounded-lg border border-white/10 bg-white text-sm font-semibold text-black hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50">
        {pending ? t('signingIn') : t('signIn')}
      </button>
    </form>
  );
}
