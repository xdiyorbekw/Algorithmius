import { notFound } from 'next/navigation';
import { AdminNav } from '@/components/admin/AdminNav';
import { requireAdmin } from '@/lib/auth';
import { routing, type Locale } from '@/i18n/routing';

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!routing.locales.includes(rawLocale as Locale)) notFound();

  const locale = rawLocale as Locale;
  await requireAdmin(locale);

  return (
    <section className="mx-auto max-w-6xl">
      <AdminNav />
      {children}
    </section>
  );
}
