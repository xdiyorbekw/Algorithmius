import type { ReactNode } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#08090b] text-zinc-100">
      <Header />
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col px-4 sm:px-6">
        <main className="py-10 sm:py-14">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
