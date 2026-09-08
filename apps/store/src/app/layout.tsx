import type { Metadata, Viewport } from 'next';
import { Archivo, Inter } from 'next/font/google';
import { storeSite } from '@autohub360/config';
import { CookieConsent, MotionOrchestrator, WhatsAppLauncher } from '@autohub360/ui';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ServiceWorkerRegister } from '@/components/service-worker-register';
import './globals.css';

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-archivo',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(storeSite.url),
  title: {
    default: storeSite.title,
    template: `%s | ${storeSite.name}`,
  },
  description: storeSite.description,
  applicationName: 'AutoHub360 Store',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [{ url: '/icons/favicon-32.png', sizes: '32x32', type: 'image/png' }],
    apple: [{ url: '/icons/icon-180.png', sizes: '180x180' }],
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: storeSite.url,
    siteName: storeSite.name,
    title: storeSite.title,
    description: storeSite.description,
    images: [{ url: '/og-store.png', width: 1200, height: 630, alt: 'AutoHub360 Store' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: storeSite.title,
    description: storeSite.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#0a1628',
  width: 'device-width',
  initialScale: 1,
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'OnlineStore',
  name: 'AutoHub360 Store',
  url: storeSite.url,
  description: storeSite.description,
  parentOrganization: {
    '@type': 'Organization',
    name: 'AutoHub360 Brasil',
    taxID: '66.991.513/0001-10',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Av. Portugal, 1148, Setor Oeste',
      addressLocality: 'Goiânia',
      addressRegion: 'GO',
      postalCode: '74140-020',
      addressCountry: 'BR',
    },
  },
  areaServed: 'BR',
  currenciesAccepted: 'BRL',
  paymentAccepted: 'Pix, Credit Card',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${archivo.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        >
          Pular para o conteúdo
        </a>
        <MotionOrchestrator />
        <Header />
        <main id="conteudo" className="flex-1">
          {children}
        </main>
        <Footer />
        <WhatsAppLauncher />
        <CookieConsent />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
