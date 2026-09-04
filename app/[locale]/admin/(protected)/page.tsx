import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { listAdminAlgorithms } from '@/lib/data/algorithms';
import { DeleteAlgorithmButton } from '@/components/admin/DeleteAlgorithmButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const locale = await getLocale();
  const t = await getTranslations('admin');
  const common = await getTranslations('common');
  const algorithms = await listAdminAlgorithms();

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-600">{t('title')}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">{t('dashboard')}</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-500">{t('dashboardIntro')}</p>
        </div>
        <Link href="/admin/algorithms/new" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/10 bg-white px-4 text-sm font-semibold text-black transition hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40">
          {t('newAlgorithm')}
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02]">
        {algorithms.length === 0 ? (
          <div className="p-8 text-sm text-zinc-500">{t('empty')}</div>
        ) : (
          <div className="divide-y divide-white/8">
            {algorithms.map((algorithm) => (
              <div key={algorithm.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-semibold text-white">{algorithm.title_en}</p>
                    <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-zinc-500">{algorithm.code_languages.length} {t('languagesCount')}</span>
                    {!algorithm.published ? <span className="rounded-full border border-yellow-500/20 bg-yellow-500/5 px-2 py-0.5 text-[11px] text-yellow-300">{t('draft')}</span> : null}
                  </div>
                  <p className="mt-1 truncate text-xs text-zinc-600">/{algorithm.slug}</p>
                </div>
                <div className="flex flex-wrap items-center gap-1 sm:shrink-0">
                  <a href={`/${locale}/algorithms/${algorithm.slug}`} target="_blank" rel="noopener,noreferrer" aria-label={`${common('view')}: ${algorithm.title_en}`} className="inline-flex min-h-10 items-center gap-2 rounded-md px-3 py-2 text-sm text-zinc-500 transition hover:bg-white/[0.04] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30">
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} aria-hidden="true" />
                    <span className="hidden sm:inline">{common('view')}</span>
                  </a>
                  <Link href={`/admin/algorithms/${algorithm.id}/edit`} className="inline-flex min-h-10 items-center gap-2 rounded-md px-3 py-2 text-sm text-zinc-500 transition hover:bg-white/[0.04] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30">
                    <FontAwesomeIcon icon={faPenToSquare} aria-hidden="true" />
                    <span>{common('edit')}</span>
                  </Link>
                  <DeleteAlgorithmButton id={algorithm.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
