import type { CatalogProduct } from '@autohub360/catalog';

export type SortId = 'relevance' | 'price-asc' | 'price-desc' | 'rating';

export const SORT_OPTIONS: Array<{ id: SortId; label: string }> = [
  { id: 'relevance', label: 'Mais relevantes' },
  { id: 'price-asc', label: 'Menor preço' },
  { id: 'price-desc', label: 'Maior preço' },
  { id: 'rating', label: 'Melhor avaliação' },
];

/** Deterministic sorting shared by the search and category listings. */
export function sortProducts(
  list: CatalogProduct[],
  sort: string | undefined,
): CatalogProduct[] {
  const sorted = [...list];
  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => a.priceCents - b.priceCents);
    case 'price-desc':
      return sorted.sort((a, b) => b.priceCents - a.priceCents);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    default:
      return sorted.sort(
        (a, b) =>
          Number(b.bestSeller) - Number(a.bestSeller) ||
          Number(b.featured) - Number(a.featured) ||
          b.reviewCount - a.reviewCount,
      );
  }
}

export function isSortId(value: string | undefined): value is SortId {
  return !!value && SORT_OPTIONS.some((o) => o.id === value);
}
