import type { Metadata, Viewport } from 'next';
import { Archivo, Inter } from 'next/font/google';
import { SOCIAL, techSite } from '@autohub360/config';
import { CookieConsent, WhatsAppLauncher } from '@autohub360/ui';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
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
  metadataBase: new URL(techSite.url),
  title: {
    default: techSite.title,
    template: `%s | ${techSite.name}`,
  },
  description: techSite.description,
  applicationName: 'AutoHub360',
  icons: {
    icon: [{ url: '/icons/favicon-32.png', sizes: '32x32', type: 'image/png' }],
    apple: [{ url: '/icons/icon-180.png', sizes: '180x180' }],
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: techSite.url,
    siteName: 'AutoHub360',
    title: techSite.title,
    description: techSite.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: techSite.title,
    description: techSite.description,
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
  '@type': 'Organization',
  name: 'AutoHub360',
  url: techSite.url,
  logo: `${techSite.url}/icons/icon-512.png`,
  description: techSite.description,
  slogan: 'Tecnologia move melhores caminhos.',
  sameAs: [SOCIAL.instagram, SOCIAL.facebook, SOCIAL.youtube].filter(Boolean),
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: '+55-62-99190-3462',
      availableLanguage: 'Portuguese',
    },
  ],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Av. Portugal, 1148, Setor Oeste',
    addressLocality: 'Goiânia',
    addressRegion: 'GO',
    postalCode: '74140-020',
    addressCountry: 'BR',
  },
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
        <Header />
        <main id="conteudo" className="flex-1">
          {children}
        </main>
        <Footer />
        <WhatsAppLauncher
          entries={[
            { context: 'general', label: 'Atendimento geral', description: 'Dúvidas, produtos e compatibilidade' },
            { context: 'installation', label: 'Agendar instalação', description: 'Anápolis - GO' },
            { context: 'pro', label: 'AutoHub360 Pro', description: 'Empresas, frotas e oficinas' },
            { context: 'support', label: 'Suporte', description: 'Pós-venda e assistência' },
          ]}
        />
        <CookieConsent />
      </body>
    </html>
  );
}
