import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Algorithm Repository',
  description: 'A multilingual repository of algorithms with clear explanations and implementation-ready code.',
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
