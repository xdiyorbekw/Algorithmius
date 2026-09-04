'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useTranslations } from 'next-intl';
import { deleteAlgorithm, type DeleteActionState } from '@/actions/algorithms';

const initialState: DeleteActionState = { ok: true };

function SubmitButton() {
  const { pending } = useFormStatus();
  const common = useTranslations('common');
  return (
    <button type="submit" disabled={pending} className="inline-flex min-h-10 items-center gap-2 rounded-md px-3 py-2 text-sm text-zinc-500 transition hover:bg-red-500/10 hover:text-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300/30 disabled:opacity-50">
      <FontAwesomeIcon icon={faTrash} aria-hidden="true" />
      <span>{pending ? common('loading') : common('delete')}</span>
    </button>
  );
}

export function DeleteAlgorithmButton({ id }: { id: string }) {
  const t = useTranslations('admin');
  const common = useTranslations('common');
  const [state, formAction] = useActionState(deleteAlgorithm, initialState);

  return (
    <div>
      <form
        action={formAction}
        onSubmit={(event) => {
          if (!window.confirm(t('deleteConfirm'))) event.preventDefault();
        }}
      >
        <input type="hidden" name="id" value={id} />
        <SubmitButton />
      </form>
      {!state.ok ? <p className="mt-1 text-right text-xs text-red-300" role="alert">{common('genericError')}</p> : null}
    </div>
  );
}
