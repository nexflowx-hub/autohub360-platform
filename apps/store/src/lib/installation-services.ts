/** Installation services catalog (Generoso Auto Center partnership). */
export interface InstallationService {
  id: string;
  label: string;
  description: string;
  priceCents: number;
  duration: string;
}

export const INSTALLATION_SERVICES: InstallationService[] = [
  {
    id: 'instalacao-geral',
    label: 'Instalação geral',
    description: 'Sensores, alarmes e acessórios em geral.',
    priceCents: 9900,
    duration: '≈ 1 hora',
  },
  {
    id: 'instalacao-som',
    label: 'Som e multimídia',
    description: 'Centrais multimídia, alto-falantes e amplificadores.',
    priceCents: 19900,
    duration: '≈ 2h30',
  },
  {
    id: 'instalacao-seguranca',
    label: 'Segurança e rastreamento',
    description: 'Rastreadores, bloqueadores e câmeras.',
    priceCents: 14900,
    duration: '≈ 2 horas',
  },
  {
    id: 'instalacao-led',
    label: 'Iluminação LED',
    description: 'Kits LED com regulagem de feixe incluída.',
    priceCents: 7900,
    duration: '≈ 50 min',
  },
];
