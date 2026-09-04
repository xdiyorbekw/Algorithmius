export default function LocaleLoading() {
  return (
    <div className="space-y-8" aria-busy="true">
      <div className="h-3 w-56 animate-pulse rounded bg-white/[0.06]" />
      <div className="h-12 w-80 max-w-full animate-pulse rounded bg-white/[0.06]" />
      <div className="h-20 max-w-2xl animate-pulse rounded bg-white/[0.04]" />
      <div className="h-12 max-w-2xl animate-pulse rounded-xl bg-white/[0.05]" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="h-40 animate-pulse rounded-2xl bg-white/[0.04]" />
        <div className="h-40 animate-pulse rounded-2xl bg-white/[0.04]" />
      </div>
    </div>
  );
}
