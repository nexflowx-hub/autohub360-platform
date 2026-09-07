/** Product universes shared by tech and store navigation, cards and catalog. */

export type UniverseKey =
  | 'auto'
  | 'moto'
  | 'truck'
  | 'tech'
  | 'casa-inteligente'
  | 'energia'
  | 'seguranca'
  | 'pro';

export interface Universe {
  key: UniverseKey;
  slug: string;
  label: string;
  shortLabel: string;
  description: string;
  subBrand?: 'auto' | 'tech' | 'energy' | 'vision' | 'pro';
}

export const UNIVERSES: Universe[] = [
  {
    key: 'auto',
    slug: 'auto',
    label: 'Auto',
    shortLabel: 'Auto',
    description: 'Acessórios e desempenho',
    subBrand: 'auto',
  },
  {
    key: 'moto',
    slug: 'moto',
    label: 'Moto',
    shortLabel: 'Moto',
    description: 'Liberdade com tecnologia',
  },
  {
    key: 'truck',
    slug: 'truck',
    label: 'Truck',
    shortLabel: 'Truck',
    description: 'Força para ir mais longe',
  },
  {
    key: 'tech',
    slug: 'tech',
    label: 'Tech',
    shortLabel: 'Tech',
    description: 'Eletrônicos e gadgets',
    subBrand: 'tech',
  },
  {
    key: 'casa-inteligente',
    slug: 'casa-inteligente',
    label: 'Casa Inteligente',
    shortLabel: 'Casa',
    description: 'Conforto e segurança',
  },
  {
    key: 'energia',
    slug: 'energia',
    label: 'Energia',
    shortLabel: 'Energia',
    description: 'Energia para um futuro melhor',
    subBrand: 'energy',
  },
  {
    key: 'seguranca',
    slug: 'seguranca',
    label: 'Segurança',
    shortLabel: 'Segurança',
    description: 'Proteção o que mais importa',
    subBrand: 'vision',
  },
  {
    key: 'pro',
    slug: 'pro',
    label: 'Pro',
    shortLabel: 'Pro',
    description: 'Soluções para profissionais',
    subBrand: 'pro',
  },
];

export function getUniverse(key: string): Universe | undefined {
  return UNIVERSES.find((u) => u.slug === key);
}
