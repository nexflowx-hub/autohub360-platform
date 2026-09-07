/** Demo kits/bundles — compositions of seed products with bundle pricing. */
export interface KitDef {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  productSlugs: string[];
  discountPct: number;
  imageKey: string;
}

export const KITS: KitDef[] = [
  {
    slug: 'kit-visibilidade-noturna',
    title: 'Kit Visibilidade Noturna',
    subtitle: 'Kit LED + Câmera de ré com instalação',
    description:
      'O combo que transforma a direção noturna: kit LED Ultra Vision para o farol do seu veículo e câmera de ré HD com visão noturna. Instalação disponível em Anápolis com o parceiro oficial.',
    productSlugs: ['kit-led-automotivo-ultra-vision-h4', 'camera-de-re-hd-visao-noturna'],
    discountPct: 12,
    imageKey: 'led-kit',
  },
  {
    slug: 'kit-seguranca-total',
    title: 'Kit Segurança Total',
    subtitle: 'Rastreador 4G + Alarme + Dashcam',
    description:
      'Proteção completa: rastreamento em tempo real com bloqueio por app, alarme com sensor de presença e dashcam Full HD para evidências. Instalação especializada disponível.',
    productSlugs: ['rastreador-veicular-4g-com-app', 'alarme-veicular-com-controle-e-presenca', 'dashcam-full-hd-com-wi-fi'],
    discountPct: 15,
    imageKey: 'tracker',
  },
  {
    slug: 'kit-casa-conectada',
    title: 'Kit Casa Conectada',
    subtitle: 'Câmera 360° + Lâmpada Wi-Fi + Tomada inteligente',
    description:
      'Comece sua casa inteligente do jeito certo: monitoramento interno com áudio, iluminação por voz e controle de consumo na palma da mão. Configuração guiada pelo nosso suporte.',
    productSlugs: ['camera-wi-fi-interna-smart-360-full-hd', 'lampada-inteligente-wifi-rgb-9w', 'tomada-inteligente-wifi-15a'],
    discountPct: 10,
    imageKey: 'cam-360',
  },
  {
    slug: 'kit-energia-viagem',
    title: 'Kit Energia Viagem',
    subtitle: 'Estação 300W + Placa solar 100W',
    description:
      'Autonomia total para acampar, trabalhar fora ou enfrentar faltas de energia: estação portátil de 288Wh com recarga solar dobrável de 100W.',
    productSlugs: ['estacao-de-energia-portatil-300w', 'placa-solar-portatil-dobravel-100w'],
    discountPct: 8,
    imageKey: 'power-station',
  },
];

export function getKit(slug: string): KitDef | undefined {
  return KITS.find((k) => k.slug === slug);
}
