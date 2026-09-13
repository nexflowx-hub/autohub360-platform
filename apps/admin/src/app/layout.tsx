import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'AutoHub360 Control Plane', template: '%s | AutoHub360 Admin' },
  description: 'CRM, operações, tracking, marketing, pós-venda e automações AutoHub360.',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
