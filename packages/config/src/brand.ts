/**
 * AutoHub360 — institutional data.
 * Values supplied by the company. Do NOT invent additional legal data here:
 * missing production data must be tracked in docs/PRODUCTION_GAPS.md instead.
 */

export const BR = {
  legalName: 'AutoHub360 Brasil',
  registeredName: '69.093.616 MICAELA GOMES DE JESUS',
  cnpj: '69.093.616/0001-50',
  address: {
    street: 'Avenida João Florentino, 9 - Q4',
    district: 'Residencial Araguaia',
    city: 'Anápolis',
    state: 'GO',
    zip: '75071-430',
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
    'AutoHub360 Europe é uma marca comercial operada pela Auto Lux Europe SAS; a operação europeia é independente das vendas realizadas pela AutoHub360 Brasil.',
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
