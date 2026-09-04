import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { PublicShell } from '@/components/layout/PublicShell';
import { routing, type Locale } from '@/i18n/routing';

export function generateStaticParams(): Array<{ locale: Locale }> {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!routing.locales.includes(rawLocale as Locale)) notFound();

  const locale = rawLocale as Locale;
  const t = await getTranslations({ locale, namespace: 'meta' });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: 'Algorithmius',
      template: '%s — Algorithmius',
    },
    description: t('description'),
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((item) => [item, `${siteUrl}/${item}`]),
      ),
    },
    openGraph: {
      type: 'website',
      siteName: 'Algorithmius',
      title: 'Algorithmius',
      description: t('description'),
      url: `${siteUrl}/${locale}`,
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!routing.locales.includes(rawLocale as Locale)) notFound();

  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <PublicShell>{children}</PublicShell>
    </NextIntlClientProvider>
  );
}
