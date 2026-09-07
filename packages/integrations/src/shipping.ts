/**
 * Shipping abstraction — Brazilian carriers/aggregators and EU logistics plug in
 * behind this contract when contracted (Correios, Melhor Envio, Frenet, DHL...).
 */

export interface ShippingQuoteInput {
  cep?: string;
  country?: string;
  weightGrams: number;
  subtotalCents: number;
  itemsCount: number;
}

export interface ShippingQuoteOption {
  id: string;
  label: string;
  days: number;
  cents: number;
}

export interface ShippingAdapter {
  readonly id: string;
  quote(input: ShippingQuoteInput): Promise<ShippingQuoteOption[]>;
}

export class DemoShippingAdapter implements ShippingAdapter {
  readonly id = 'demo-br';

  async quote(input: ShippingQuoteInput): Promise<ShippingQuoteOption[]> {
    // Same deterministic logic as packages/commerce pricing for consistency.
    const digits = (input.cep ?? '').replace(/\D/g, '');
    if (digits.length !== 8) return [];
    const region = Number(digits[0]);
    const free = input.subtotalCents >= 39900;
    const base = [2490, 2290, 2690, 2990, 3290, 3590, 3990, 4290, 4790, 4990][region] ?? 4990;
    return [
      { id: 'standard', label: 'Entrega padrão', days: 7 + region, cents: free ? 0 : base },
      {
        id: 'express',
        label: 'Entrega expressa',
        days: 3 + Math.floor(region / 3),
        cents: Math.round(base * 1.8),
      },
      { id: 'pickup', label: 'Retirada em Anápolis - GO', days: 2, cents: 0 },
    ];
  }
}

export function getShippingAdapter(_providerEnv?: string | null): ShippingAdapter {
  return new DemoShippingAdapter();
}
