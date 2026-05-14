import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ClientLayout from '@/components/layout/ClientLayout';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://horizmo.ru'),
  title: 'TG Shop Next — Оптовые поставки электроники',
  description: 'B2B оптовый магазин аксессуаров и электроники из Китая. Поставки напрямую. Telegram-connected storefront.',
  openGraph: {
    title: 'TG Shop Next — Оптовые поставки',
    description: 'B2B оптовый магазин аксессуаров и электроники',
    images: [{ url: 'https://bolt.new/static/og_default.png' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
