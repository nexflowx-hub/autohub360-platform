import type { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import { Archivo, Inter } from 'next/font/google';
import { BR, EU, MARKETS, SOCIAL, techSite, type MarketCode } from '@autohub360/config';
import {
  CookieConsent,
  MarketProvider,
  MotionOrchestrator,
  WhatsAppLauncher,
} from '@autohub360/ui';
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

function marketFromCookie(value?: string): MarketCode {
  return value === 'EU' ? 'EU' : 'BR';
}

function organizationJsonLd(market: MarketCode) {
  const common = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AutoHub360',
    url: techSite.url,
    logo: `${techSite.url}/icons/icon-512.png`,
    description: techSite.description,
    slogan: 'Tecnologia move melhores caminhos.',
    sameAs: [SOCIAL.instagram, SOCIAL.facebook, SOCIAL.youtube].filter(Boolean),
  };

  if (market === 'EU') {
    return {
      ...common,
      alternateName: 'AutoHub360 Europe',
      parentOrganization: {
        '@type': 'Organization',
        name: EU.operator.legalName,
        identifier: EU.operator.siren,
        vatID: EU.operator.vat,
      },
      areaServed: 'EU',
    };
  }

  return {
    ...common,
    legalName: BR.registeredName,
    taxID: BR.cnpj,
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
      streetAddress: BR.address.street,
      addressLocality: BR.address.city,
      addressRegion: BR.address.state,
      postalCode: BR.address.zip,
      addressCountry: 'BR',
    },
    areaServed: 'BR',
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const market = marketFromCookie(cookieStore.get('ah_market')?.value);
  const marketConfig = MARKETS[market];
  const jsonLd = organizationJsonLd(market);

  return (
    <html lang={marketConfig.locale} className={`${archivo.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <MarketProvider initialMarket={market}>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
          <WhatsAppLauncher
            entries={[
              { context: 'general', label: 'Atendimento geral', description: 'Dúvidas, produtos e compatibilidade' },
              { context: 'installation', label: 'Agendar instalação', description: 'Anápolis - GO' },
              { context: 'pro', label: 'AutoHub360 Pro', description: 'Empresas, frotas e oficinas' },
              { context: 'support', label: 'Suporte', description: 'Pós-venda e assistência' },
            ]}
          />
          <CookieConsent />
        </MarketProvider>
      </body>
    </html>
  );
}
