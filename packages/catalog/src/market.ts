import type { CatalogMarket, Product, ProductMarketOffer } from './types';

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

  return null;
}

export function isProductAvailableInMarket(product: Product, market: CatalogMarket): boolean {
  const offer = resolveProductMarketOffer(product, market);
  return Boolean(offer?.active && offer.stock > 0);
}
