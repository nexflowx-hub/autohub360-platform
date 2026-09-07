/**
 * AutoHub360 — institutional data.
 * Values supplied by the company. Do NOT invent additional legal data here:
 * missing production data must be tracked in docs/PRODUCTION_GAPS.md instead.
 */

export const BR = {
  legalName: 'AutoHub360 Brasil',
  cnpj: '66.991.513/0001-10',
  address: {
    street: 'Av. Portugal, 1148',
    district: 'Setor Oeste',
    city: 'Goiânia',
    state: 'GO',
    zip: '74140-020',
    country: 'Brasil',
  },
  whatsapp: '+55 (62) 99190-3462',
  whatsappDigits: '5562991903462',
} as const;

export const EU = {
  brandName: 'AutoHub360 Europe',
  operator: {
    legalName: 'Auto Lux Europe SAS',
    siren: '924 799 356',
    rcs: 'Paris',
    vat: 'FR06924799356',
  },
  operatorWording:
    'AutoHub360 Europe é uma marca comercial operada pela Auto Lux Europe SAS.',
  supportWhatsapp: '+55 (62) 99190-3462',
} as const;

export const GENEROSO = {
  name: 'Generoso Auto Center',
  wording: 'Generoso Auto Center — parceiro oficial de instalação AutoHub360 em Anápolis.',
  city: 'Anápolis',
  state: 'GO',
  region: 'Anápolis e região - GO',
  tagline: 'Seu carro em boas mãos, sempre.',
  highlights: [
    'Instalação especializada',
    'Mão de obra qualificada',
    'Atendimento local',
    'Mais tecnologia na sua rotina',
  ],
} as const;

export const BRAND = {
  name: 'AUTOHUB360',
  tagline: 'Auto • Tech • Smart Living',
  proposition: 'Tecnologia para o carro, para a casa e para o seu dia.',
  supportingLine: 'Tecnologia move melhores caminhos.',
  subBrands: [
    { key: 'auto', name: 'AutoHub360 Auto', description: 'Peças, acessórios e desempenho.' },
    { key: 'tech', name: 'AutoHub360 Tech', description: 'Eletrônicos, gadgets e inovação.' },
    { key: 'energy', name: 'AutoHub360 Energy', description: 'Energia para um futuro melhor.' },
    { key: 'vision', name: 'AutoHub360 Vision', description: 'Segurança e monitoramento.' },
    { key: 'pro', name: 'AutoHub360 Pro', description: 'Soluções para profissionais.' },
  ] as const,
} as const;

export type SubBrandKey = (typeof BRAND.subBrands)[number]['key'];
