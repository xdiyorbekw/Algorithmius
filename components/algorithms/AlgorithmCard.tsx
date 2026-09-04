import { Link } from '@/i18n/navigation';
import type { AlgorithmCard as AlgorithmCardType } from '@/lib/data/algorithms';

export function AlgorithmCard({ algorithm }: { algorithm: AlgorithmCardType }) {
  return (
    <Link
      href={`/algorithms/${algorithm.slug}`}
      className="group block rounded-2xl border border-white/8 bg-white/[0.02] p-5 transition hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/[0.035] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
    >
      <h2 className="text-base font-semibold tracking-tight text-white group-hover:text-zinc-200">{algorithm.title}</h2>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-500 group-hover:text-zinc-400">{algorithm.description}</p>
    </Link>
  );
}
