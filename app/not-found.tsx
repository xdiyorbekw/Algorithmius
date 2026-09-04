import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#08090b] px-6 py-20 text-zinc-100">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-600">404</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Page not found</h1>
        <Link href="/en" className="mt-6 inline-flex rounded-lg border border-white/10 bg-white px-4 py-2.5 text-sm font-semibold text-black hover:bg-zinc-200">Back to repository</Link>
      </div>
    </main>
  );
}
