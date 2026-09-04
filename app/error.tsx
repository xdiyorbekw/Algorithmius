'use client';

import { useEffect } from 'react';

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {}, []);
  return (
    <div className="min-h-screen bg-[#08090b] text-zinc-100">
      <main className="mx-auto flex min-h-screen max-w-2xl items-center px-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-600">500</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Something went wrong.</h1>
          <button onClick={() => reset()} className="mt-6 rounded-lg border border-white/10 bg-white px-4 py-2 text-sm font-semibold text-black">Try again</button>
        </div>
      </main>
    </div>
  );
}
