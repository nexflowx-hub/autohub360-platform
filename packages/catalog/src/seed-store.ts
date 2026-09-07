import type {
  Article,
  Brand,
  Category,
  Product,
  VehicleMake,
  VehicleModel,
  VehicleVersion,
} from './types';
import categoriesData from './data/categories.json';
import brandsData from './data/brands.json';
import products1 from './data/products-1.json';
import products2 from './data/products-2.json';
import products3 from './data/products-3.json';
import vehiclesData from './data/vehicles.json';
import articlesData from './data/articles.json';

/** Bundled demo catalog (supabase/seed is the SQL counterpart). */
export const categories = categoriesData as unknown as Category[];
export const brands = brandsData as unknown as Brand[];
export const products = [...products1, ...products2, ...products3] as unknown as Array<
  Product & { socket?: string }
>;
export const vehicleMakes = vehiclesData.makes as unknown as VehicleMake[];
export const vehicleModels = vehiclesData.models as unknown as VehicleModel[];
export const vehicleVersions = vehiclesData.versions as unknown as VehicleVersion[];
export const articles = articlesData as unknown as Article[];

export function getCategory(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getBrand(id: string): Brand | undefined {
  return brands.find((b) => b.id === id);
}

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

/** Resolves structured compatibility for a product (socket-based for lighting, else universal). */
export function compatibilityVersionIds(product: Product & { socket?: string }): string[] {
  if (product.universal) return [];
  if (product.socket) {
    return vehicleVersions
      .filter((v) => v.headlightSocket === product.socket)
      .map((v) => v.id);
  }
  return [];
}

export function fitmentStatus(
  product: Product & { socket?: string },
  versionId?: string,
): 'compatible' | 'not_compatible' | 'unconfirmed' | 'universal' {
  if (product.universal) return 'universal';
  const ids = compatibilityVersionIds(product);
  if (!versionId) return 'unconfirmed';
  return ids.includes(versionId) ? 'compatible' : 'not_compatible';
}
