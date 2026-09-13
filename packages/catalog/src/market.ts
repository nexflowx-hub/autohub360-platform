import type { CatalogMarket, Product, ProductMarketOffer } from './types';

/**
 * Bundled commercial mirror for sourced products while the storefront catalog remains static.
 * Supabase is the operational source of truth. Only SKUs with recently observed supplier stock
 * and a conservative AutoHub availability buffer are enabled here.
 */
const BR_VERIFIED_OFFERS: Record<string, Pick<ProductMarketOffer, 'stock' | 'active'>> = {
  'SRC-BR-TAG-001': { stock: 3, active: true },
  'SRC-BR-PARK-001': { stock: 3, active: true },
  'SRC-BR-PARK-002': { stock: 3, active: true },
  'SRC-BR-CHG-001': { stock: 3, active: true },
  'SRC-BR-CHG-002': { stock: 3, active: true },
  'SRC-BR-ENE-002': { stock: 3, active: true },
};

const EU_PREVIEW_OFFERS: Record<string, ProductMarketOffer> = {
  'SRC-BR-CAM-002': {
    market: 'EU',
    currency: 'EUR',
    priceCents: 2440,
    stock: 0,
    active: false,
  },
  'SRC-BR-ENE-001': {
    market: 'EU',
    currency: 'EUR',
    priceCents: 7149,
    stock: 0,
    active: false,
  },
};

/**
 * Resolves the commercial offer for a product in a market.
 * Sourced products are purchasable only when their SKU is explicitly mirrored from verified
 * operational inventory. Unknown/unverified supplier availability stays visible but unavailable.
 */
export function resolveProductMarketOffer(
  product: Product,
  market: CatalogMarket,
): ProductMarketOffer | null {
  const override = product.marketOffers?.[market];
  if (override) return override;

  if (market === 'BR') {
    if (product.sku.startsWith('SRC-')) {
      const verified = BR_VERIFIED_OFFERS[product.sku];
      return {
        market: 'BR',
        currency: product.currency,
        priceCents: product.priceCents,
        compareAtCents: product.compareAtCents,
        stock: verified?.stock ?? 0,
        active: verified?.active ?? false,
      };
    }

    return {
      market: 'BR',
      currency: product.currency,
      priceCents: product.priceCents,
      compareAtCents: product.compareAtCents,
      stock: product.stock,
      active: product.stock > 0,
    };
  }

  return EU_PREVIEW_OFFERS[product.sku] ?? null;
}

export function isProductAvailableInMarket(product: Product, market: CatalogMarket): boolean {
  const offer = resolveProductMarketOffer(product, market);
  return Boolean(offer?.active && offer.stock > 0);
}
