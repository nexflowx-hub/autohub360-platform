import type { CatalogMarket, Product, ProductMarketOffer } from './types';

/**
 * Temporary bundled mirror of validated DB preview offers.
 * Supabase remains the source of truth; this keeps the static storefront market-aware
 * until the catalog datasource is fully DB-backed.
 */
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
 * Bundled catalog prices are treated as the BR fallback only.
 */
export function resolveProductMarketOffer(
  product: Product,
  market: CatalogMarket,
): ProductMarketOffer | null {
  const override = product.marketOffers?.[market];
  if (override) return override;

  if (market === 'BR') {
    return {
      market: 'BR',
      currency: product.currency,
      priceCents: product.priceCents,
      compareAtCents: product.compareAtCents,
      stock: product.stock,
      active: true,
    };
  }

  return EU_PREVIEW_OFFERS[product.sku] ?? null;
}

export function isProductAvailableInMarket(product: Product, market: CatalogMarket): boolean {
  const offer = resolveProductMarketOffer(product, market);
  return Boolean(offer?.active && offer.stock > 0);
}
