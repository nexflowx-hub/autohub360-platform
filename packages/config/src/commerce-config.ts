/**
 * Payment / shipping configuration — provider-agnostic.
 * Production must only advertise payment methods actually enabled by the
 * active provider (see ZAI_MASTER_PROMPT_V1, PAYMENT ABSTRACTION).
 */

export type PaymentMethodId = 'pix' | 'credit' | 'debit' | 'boleto' | 'card_eu' | 'sepa';

export interface PaymentMethodDef {
  id: PaymentMethodId;
  label: string;
  markets: Array<'BR' | 'EU'>;
  /** Provider-independent visual badge spec consumed by <PaymentMethods/>. */
  badge: 'visa' | 'mastercard' | 'elo' | 'pix' | 'amex' | 'boleto' | 'sepa';
}

export const PAYMENT_METHODS: PaymentMethodDef[] = [
  { id: 'pix', label: 'Pix', markets: ['BR'], badge: 'pix' },
  { id: 'credit', label: 'Cartão de crédito', markets: ['BR'], badge: 'visa' },
  { id: 'credit', label: 'Cartão de crédito', markets: ['BR'], badge: 'mastercard' },
  { id: 'credit', label: 'Cartão de crédito', markets: ['BR'], badge: 'elo' },
  { id: 'credit', label: 'Cartão de crédito', markets: ['BR'], badge: 'amex' },
  { id: 'boleto', label: 'Boleto', markets: ['BR'], badge: 'boleto' },
  { id: 'card_eu', label: 'Cartão', markets: ['EU'], badge: 'visa' },
  { id: 'card_eu', label: 'Cartão', markets: ['EU'], badge: 'mastercard' },
  { id: 'sepa', label: 'SEPA', markets: ['EU'], badge: 'sepa' },
];

export interface PaymentsConfig {
  /** True while no real PSP is contracted — badges render in preview mode with explicit notice. */
  previewMode: boolean;
  provider: string;
  enabledIds: PaymentMethodId[];
}

export function paymentsConfig(env: { PAYMENT_PROVIDER?: string | null }): PaymentsConfig {
  const provider = env.PAYMENT_PROVIDER?.trim() || '';
  return {
    previewMode: provider === '',
    provider: provider || 'preview',
    enabledIds: provider === '' ? ['pix', 'credit'] : ['pix', 'credit', 'boleto'],
  };
}

export type ShippingMethodId = 'nationwide' | 'pickup' | 'pickup_installation' | 'local_delivery';

export interface ShippingMethodDef {
  id: ShippingMethodId;
  label: string;
  description: string;
  markets: Array<'BR' | 'EU'>;
  status: 'available' | 'configurable';
}

export const SHIPPING_METHODS: ShippingMethodDef[] = [
  {
    id: 'nationwide',
    label: 'Entrega nacional',
    description: 'Envio para todo o Brasil com rastreamento',
    markets: ['BR'],
    status: 'available',
  },
  {
    id: 'pickup',
    label: 'Retirada local',
    description: 'Retire em Anápolis - GO (mediante disponibilidade)',
    markets: ['BR'],
    status: 'available',
  },
  {
    id: 'pickup_installation',
    label: 'Retirada + instalação',
    description: 'Instalação com nosso parceiro em Anápolis',
    markets: ['BR'],
    status: 'available',
  },
  {
    id: 'local_delivery',
    label: 'Entrega local',
    description: 'Entrega em Anápolis e região (mét futuro configurável)',
    markets: ['BR'],
    status: 'configurable',
  },
];
