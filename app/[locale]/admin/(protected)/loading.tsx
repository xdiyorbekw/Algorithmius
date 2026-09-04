export default function AdminLoading() {
  return (
    <div className="space-y-6" aria-busy="true">
      <div className="h-8 w-64 animate-pulse rounded bg-white/[0.06]" />
      <div className="h-32 animate-pulse rounded-2xl bg-white/[0.04]" />
      <div className="h-32 animate-pulse rounded-2xl bg-white/[0.04]" />
    </div>
  );
}
