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
 * Newly sourced SRC-* records intentionally stay non-purchasable until fulfillment, invoice,
 * packaging and supplier availability have been verified for that SKU.
 */
export function resolveProductMarketOffer(
  product: Product,
  market: CatalogMarket,
): ProductMarketOffer | null {
  const override = product.marketOffers?.[market];
  if (override) return override;

  if (market === 'BR') {
    const sourcedPreview = product.sku.startsWith('SRC-');
    return {
      market: 'BR',
      currency: product.currency,
      priceCents: product.priceCents,
      compareAtCents: product.compareAtCents,
      stock: sourcedPreview ? 0 : product.stock,
      active: !sourcedPreview,
    };
  }

  return EU_PREVIEW_OFFERS[product.sku] ?? null;
}

export function isProductAvailableInMarket(product: Product, market: CatalogMarket): boolean {
  const offer = resolveProductMarketOffer(product, market);
  return Boolean(offer?.active && offer.stock > 0);
}
