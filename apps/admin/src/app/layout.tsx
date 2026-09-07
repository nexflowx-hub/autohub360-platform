import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { LogoHorizontal } from '@autohub360/ui';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  title: 'AutoHub360 Admin',
  description: 'Backoffice da plataforma AutoHub360.',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="min-h-screen antialiased">
        <header className="border-b border-white/10 bg-navy-900">
          <div className="mx-auto flex h-16 max-w-6xl items-center px-6">
            <LogoHorizontal size="sm" tagline={false} tone="dark" />
            <span className="ml-3 rounded-md border border-white/15 px-2 py-0.5 text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Backoffice
            </span>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
