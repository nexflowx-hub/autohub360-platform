/** Pricing helpers — BRL formatting and installment rules. */

export function formatBRL(cents: number): string {
  return (cents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function formatPrice(cents: number, currency: 'BRL' | 'EUR'): string {
  return (cents / 100).toLocaleString(currency === 'BRL' ? 'pt-BR' : 'pt-PT', {
    style: 'currency',
    currency,
  });
}

export const MAX_INSTALLMENTS = 12;
export const MIN_INSTALLMENT_CENTS = 1500; // R$ 15,00 minimum installment

/** Highest installment count that respects the minimum parcel value. */
export function installmentCount(priceCents: number): number {
  const n = Math.floor(priceCents / MIN_INSTALLMENT_CENTS);
  return Math.max(1, Math.min(MAX_INSTALLMENTS, n));
}

export function installmentLabel(priceCents: number): string | null {
  const n = installmentCount(priceCents);
  if (n < 2) return null;
  const value = priceCents / n;
  return `em até ${n}x de ${formatBRL(Math.round(value))}`;
}

/** Demo shipping quote — replaced by the shipping adapter when a provider is contracted. */
export function demoShippingQuote(cep: string, subtotalCents: number) {
  const digits = cep.replace(/\D/g, '');
  if (digits.length !== 8) return null;
  const region = Number(digits[0]);
  const free = subtotalCents >= 39900;
  const base = [2490, 2290, 2690, 2990, 3290, 3590, 3990, 4290, 4790, 4990][region] ?? 4990;
  return {
    standard: { label: 'Entrega padrão', days: 7 + region, cents: free ? 0 : base },
    express: { label: 'Entrega expressa', days: 3 + Math.floor(region / 3), cents: free ? Math.round(base * 1.8) : Math.round(base * 2.2) },
    pickup: { label: 'Retirada em Anápolis - GO', days: 2, cents: 0 },
  };
}

/** Installation fee for eligible products booked with the Anápolis partner. */
export const INSTALLATION_FEE_CENTS = 9900;

export function withInstallation(unitPriceCents: number, quantity: number, install: boolean): number {
  return install ? unitPriceCents * quantity + INSTALLATION_FEE_CENTS * quantity : unitPriceCents * quantity;
}
