export type MarketCode = 'BR' | 'EU';

export interface MarketContext {
  code: MarketCode;
  name: string;
  currency: 'BRL' | 'EUR';
  locale: string;
  status: 'live' | 'preview';
  /** When false, checkout must be disabled with a visible explanation. */
  checkoutEnabled: boolean;
  operatorLine: string;
  legalFooterLine: string;
  paymentNote: string;
  shippingNote: string;
  returnsNote: string;
}

/** Supplied institutional data only — never fabricate missing EU legal data. */
export const MARKETS: Record<MarketCode, MarketContext> = {
  BR: {
    code: 'BR',
    name: 'Brasil',
    currency: 'BRL',
    locale: 'pt-BR',
    status: 'live',
    checkoutEnabled: true,
    operatorLine: 'AutoHub360 Brasil — CNPJ 66.991.513/0001-10',
    legalFooterLine:
      'AutoHub360 Brasil — CNPJ 66.991.513/0001-10 · Av. Portugal, 1148, Setor Oeste, Goiânia - GO, CEP 74140-020, Brasil',
    paymentNote:
      'Pagamentos processados por provedor certificado. Pix e cartão de crédito conforme disponibilidade do provedor ativo.',
    shippingNote: 'Entrega para todo o Brasil · Retirada local em Anápolis - GO',
    returnsNote:
      'Direito de arrependimento em até 7 (sete) dias corridos a contar do recebimento, conforme art. 49 do CDC.',
  },
  EU: {
    code: 'EU',
    name: 'Europa',
    currency: 'EUR',
    locale: 'pt-BR',
    status: 'preview',
    checkoutEnabled: false,
    operatorLine: 'AutoHub360 Europe — marca operada pela Auto Lux Europe SAS',
    legalFooterLine:
      'AutoHub360 Europe é uma marca comercial operada pela Auto Lux Europe SAS · SIREN 924 799 356 · RCS Paris · TVA FR06924799356',
    paymentNote:
      'Checkout europeu temporariamente indisponível enquanto dados jurídicos e de pagamento obrigatórios não são concluídos.',
    shippingNote: 'Logística europeia em configuração — prazos e condições ainda não disponíveis.',
    returnsNote:
      'Direito de retratação de 14 dias (UE) será aplicado conforme CGV definitivas. Documento em preparação.',
  },
};

export const DEFAULT_MARKET: MarketCode = 'BR';
