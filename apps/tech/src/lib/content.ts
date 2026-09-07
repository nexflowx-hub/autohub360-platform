/** Shared content helpers for the tech app. Server-safe, no side effects. */

/** Installation services — same 4 services/prices/durations as the store (seeded installation_services). */
export interface InstallService {
  slug: string;
  name: string;
  description: string;
  /** Price in BRL cents (base fee). */
  priceCents: number;
  durationMinutes: number;
}

export const INSTALL_SERVICES: InstallService[] = [
  {
    slug: 'instalacao-geral',
    name: 'Instalação de acessório (compra AutoHub360)',
    description: 'Instalação especializada com o parceiro oficial em Anápolis - GO.',
    priceCents: 9900,
    durationMinutes: 60,
  },
  {
    slug: 'instalacao-multimidia',
    name: 'Instalação de central multimídia / som',
    description: 'Instalação com adaptação de chicote e teste completo.',
    priceCents: 19900,
    durationMinutes: 120,
  },
  {
    slug: 'instalacao-seguranca',
    name: 'Instalação de rastreador / alarme / câmera',
    description: 'Instalação discreta com teste de funcionamento e orientação de uso do app.',
    priceCents: 14900,
    durationMinutes: 90,
  },
  {
    slug: 'instalacao-iluminacao',
    name: 'Instalação de kit LED com regulagem de farol',
    description: 'Troca de lâmpadas + regulagem de feixe luminoso.',
    priceCents: 7900,
    durationMinutes: 45,
  },
];

export function formatBRL(cents: number): string {
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h${String(m).padStart(2, '0')}`;
}

/** Hub article category → store category slug. */
const ARTICLE_STORE_CATEGORY: Record<string, string> = {
  'Iluminação': 'auto',
  'Segurança': 'seguranca',
  'Smart Living': 'casa-inteligente',
  'Energia': 'energia',
  'Auto & Tech': 'auto',
};

export function storeCategoryForArticle(categoryLabel: string): string {
  return ARTICLE_STORE_CATEGORY[categoryLabel] ?? 'auto';
}

export function formatArticleDate(iso: string): string {
  return new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }).format(
    new Date(iso),
  );
}
