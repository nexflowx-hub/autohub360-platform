export interface NavItem {
  label: string;
  href: string;
  highlight?: boolean;
}

export interface SiteConfig {
  key: 'tech' | 'store';
  name: string;
  domain: string;
  url: string;
  title: string;
  description: string;
  nav: NavItem[];
}

export const TECH_URL = process.env.NEXT_PUBLIC_TECH_URL || 'https://autohub360.tech';
export const STORE_URL = process.env.NEXT_PUBLIC_STORE_URL || 'https://autohub360.store';

export const techSite: SiteConfig = {
  key: 'tech',
  name: 'AutoHub360',
  domain: 'autohub360.tech',
  url: TECH_URL,
  title: 'AutoHub360 — Tecnologia para o carro, para a casa e para o seu dia',
  description:
    'Peças, acessórios, eletrônicos, segurança e instalação especializada. Auto, Tech e Smart Living em um só ecossistema. Instalação em Anápolis - GO.',
  nav: [
    { label: 'Início', href: '/' },
    { label: 'Auto & Mobility', href: '/auto-mobility' },
    { label: 'Smart Living', href: '/smart-living' },
    { label: 'Tech', href: '/tech' },
    { label: 'Energy', href: '/energy' },
    { label: 'Vision & Security', href: '/vision-security' },
    { label: 'Pro', href: '/pro' },
    { label: 'Blog', href: '/hub' },
    { label: 'Contato', href: '/contato' },
  ],
};

export const storeSite: SiteConfig = {
  key: 'store',
  name: 'AutoHub360 Store',
  domain: 'autohub360.store',
  url: STORE_URL,
  title: 'AutoHub360 Store — Tudo para o seu veículo e muito mais',
  description:
    'Loja de peças, acessórios, eletrônicos, gadgets e soluções inteligentes. Compre com instalação especializada em Anápolis - GO e receba em todo o Brasil.',
  nav: [
    { label: 'Auto', href: '/categoria/auto' },
    { label: 'Moto', href: '/categoria/moto' },
    { label: 'Truck', href: '/categoria/truck' },
    { label: 'Tech', href: '/categoria/tech' },
    { label: 'Casa Inteligente', href: '/categoria/casa-inteligente' },
    { label: 'Energia', href: '/categoria/energia' },
    { label: 'Segurança', href: '/categoria/seguranca' },
    { label: 'Pro', href: '/categoria/pro' },
    { label: 'Ofertas', href: '/ofertas', highlight: true },
  ],
};

export const ENV = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eivqvrfsreaopzlvhadu.supabase.co',
  supabasePublishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '',
  hasSupabaseServiceRole: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
  gaId: process.env.NEXT_PUBLIC_GA_ID || '',
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || '',
  tiktokPixelId: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || '',
  whatsappBr: process.env.NEXT_PUBLIC_WHATSAPP_BR || '5562991903462',
} as const;

/** Data mode: 'supabase' when publishable credentials exist, otherwise bundled seed demo data. */
export function dataMode(): 'supabase' | 'seed' {
  return ENV.supabasePublishableKey ? 'supabase' : 'seed';
}
