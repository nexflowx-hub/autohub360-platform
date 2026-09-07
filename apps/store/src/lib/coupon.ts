/** Demo coupon rule shared by cart and checkout (client-side preview; server revalidates). */
export const COUPON_CODE = 'AUTOHUB10';
export const COUPON_MIN_SUBTOTAL_CENTS = 20000;

export function couponDiscountCents(subtotalCents: number, applied: boolean): number {
  return applied && subtotalCents >= COUPON_MIN_SUBTOTAL_CENTS
    ? Math.round(subtotalCents * 0.1)
    : 0;
}

export interface ShippingOption {
  id: string;
  label: string;
  days: number;
  cents: number;
}

export interface StoredShipping {
  cep: string;
  option: ShippingOption;
}

/** sessionStorage helpers (wrapped — storage may be unavailable). */
export function readStoredShipping(): StoredShipping | null {
  try {
    const raw = sessionStorage.getItem('autohub360.shipping');
    return raw ? (JSON.parse(raw) as StoredShipping) : null;
  } catch {
    return null;
  }
}

export function writeStoredShipping(value: StoredShipping | null): void {
  try {
    if (value) sessionStorage.setItem('autohub360.shipping', JSON.stringify(value));
    else sessionStorage.removeItem('autohub360.shipping');
  } catch {
    // storage unavailable
  }
}

export function readStoredCoupon(): string | null {
  try {
    return sessionStorage.getItem('autohub360.coupon');
  } catch {
    return null;
  }
}

export function writeStoredCoupon(code: string | null): void {
  try {
    if (code) sessionStorage.setItem('autohub360.coupon', code);
    else sessionStorage.removeItem('autohub360.coupon');
  } catch {
    // storage unavailable
  }
}
