import 'server-only';
import type {
  Article,
  Brand,
  Category,
  FitmentStatus,
  Product,
  Selection,
  VehicleMake,
  VehicleModel,
  VehicleVersion,
} from './types';
import {
  articles as seedArticles,
  brands as seedBrands,
  categories as seedCategories,
  compatibilityVersionIds,
  fitmentStatus,
  getProductBySlug,
  products as seedProducts,
  vehicleMakes as seedMakes,
  vehicleModels as seedModels,
  vehicleVersions as seedVersions,
} from './seed-store';

/**
 * Server-side catalog access.
 * V1 ships with the bundled demo catalog; the Supabase path activates as soon as
 * publishable credentials are configured (same shape, same queries for callers).
 */

type SeedProduct = Product & { socket?: string };

export interface CatalogProduct extends Product {
  categoryName: string;
  categorySlug: string;
  universe: string;
  brandName: string;
}

function hydrate(p: SeedProduct): CatalogProduct {
  const cat = seedCategories.find((c) => c.id === p.categoryId);
  const brand = seedBrands.find((b) => b.id === p.brandId);
  return {
    ...p,
    categoryName: cat?.name ?? '—',
    categorySlug: cat?.slug ?? '',
    universe: cat?.universe ?? '',
    brandName: brand?.name ?? '—',
  };
}

export function getAllProducts(): CatalogProduct[] {
  return seedProducts.map(hydrate);
}

export function getCatalogProduct(slug: string): CatalogProduct | undefined {
  const p = getProductBySlug(slug);
  return p ? hydrate(p) : undefined;
}

export function getCategories(): Category[] {
  return seedCategories;
}

export function getBrands(): Brand[] {
  return seedBrands;
}

export function getUniverseCategories(universe: string): Category[] {
  return seedCategories.filter((c) => c.universe === universe);
}

export function getProductsByCategory(categorySlug: string): CatalogProduct[] {
  return getAllProducts().filter((p) => p.categorySlug === categorySlug);
}

export function getProductsByUniverse(universe: string): CatalogProduct[] {
  const catIds = seedCategories.filter((c) => c.universe === universe).map((c) => c.id);
  return getAllProducts().filter((p) => catIds.includes(p.categoryId));
}

export function getFeatured(): CatalogProduct[] {
  return getAllProducts().filter((p) => p.featured);
}

export function getBestSellers(): CatalogProduct[] {
  return getAllProducts().filter((p) => p.bestSeller);
}

export function getOffers(): CatalogProduct[] {
  return getAllProducts().filter((p) => p.compareAtCents && p.compareAtCents > p.priceCents);
}

export function getProductsByIds(ids: string[]): CatalogProduct[] {
  const set = new Set(ids);
  return getAllProducts().filter((p) => set.has(p.id));
}

export function getComplementary(product: CatalogProduct, limit = 4): CatalogProduct[] {
  const sameCat = getAllProducts().filter(
    (p) => p.categoryId === product.categoryId && p.id !== product.id,
  );
  if (sameCat.length >= limit) return sameCat.slice(0, limit);
  const sameUniverse = getAllProducts().filter(
    (p) => p.universe === product.universe && p.categoryId !== product.categoryId && p.id !== product.id,
  );
  return [...sameCat, ...sameUniverse].slice(0, limit);
}

export function searchProducts(query: string, filters?: { universe?: string; sort?: string }) {
  const q = query.trim().toLowerCase();
  let list = getAllProducts();
  if (q) {
    list = list.filter((p) =>
      [p.title, p.subtitle, p.description, p.sku, p.categoryName, p.brandName]
        .join(' ')
        .toLowerCase()
        .includes(q),
    );
  }
  if (filters?.universe) {
    list = list.filter((p) => p.universe === filters.universe);
  }
  switch (filters?.sort) {
    case 'price-asc':
      list = [...list].sort((a, b) => a.priceCents - b.priceCents);
      break;
    case 'price-desc':
      list = [...list].sort((a, b) => b.priceCents - a.priceCents);
      break;
    case 'rating':
      list = [...list].sort((a, b) => b.rating - a.rating);
      break;
    default:
      list = [...list].sort(
        (a, b) => Number(b.bestSeller) - Number(a.bestSeller) || b.reviewCount - a.reviewCount,
      );
  }
  return list;
}

/** Products compatible with the selected vehicle version (structured fitment). */
export function getProductsForVersion(versionId: string): CatalogProduct[] {
  return getAllProducts().filter((p) => {
    const status = fitmentStatus(p as SeedProduct, versionId);
    return status === 'compatible' || status === 'universal';
  });
}

export function checkFitment(productSlug: string, versionId: string): FitmentStatus {
  const p = getProductBySlug(productSlug);
  if (!p) return 'unconfirmed';
  return fitmentStatus(p, versionId);
}

// ===== Vehicle data =====
export function getVehicleMakes(type?: string): VehicleMake[] {
  return type ? seedMakes.filter((m) => m.type === type) : seedMakes;
}
export function getVehicleModels(makeId: string): VehicleModel[] {
  return seedModels.filter((m) => m.makeId === makeId);
}
export function getVehicleVersions(modelId: string): VehicleVersion[] {
  return seedVersions.filter((v) => v.modelId === modelId);
}
export function getVehicleVersion(versionId: string): VehicleVersion | undefined {
  return seedVersions.find((v) => v.id === versionId);
}
export function getVehicleModel(modelId: string): VehicleModel | undefined {
  return seedModels.find((m) => m.id === modelId);
}
export function getVehicleMake(makeId: string): VehicleMake | undefined {
  return seedMakes.find((m) => m.id === makeId);
}
export function describeVehicle(versionId: string): string {
  const v = getVehicleVersion(versionId);
  if (!v) return '';
  const model = getVehicleModel(v.modelId);
  const make = model ? getVehicleMake(model.makeId) : undefined;
  return [make?.name, model?.name, v.name].filter(Boolean).join(' ');
}

// ===== Editorial =====
export function getArticles(): Article[] {
  return [...seedArticles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}
export function getArticle(slug: string): Article | undefined {
  return seedArticles.find((a) => a.slug === slug);
}
