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

// ===== Vehicle lookups (pure, client-safe) =====
export function getVehicleMakes(type?: string): VehicleMake[] {
  return type ? vehicleMakes.filter((m) => m.type === type) : vehicleMakes;
}
export function getVehicleModels(makeId: string): VehicleModel[] {
  return vehicleModels.filter((m) => m.makeId === makeId);
}
export function getVehicleVersions(modelId: string): VehicleVersion[] {
  return vehicleVersions.filter((v) => v.modelId === modelId);
}
export function getVehicleVersion(versionId: string): VehicleVersion | undefined {
  return vehicleVersions.find((v) => v.id === versionId);
}
export function getVehicleModel(modelId: string): VehicleModel | undefined {
  return vehicleModels.find((m) => m.id === modelId);
}
export function getVehicleMake(makeId: string): VehicleMake | undefined {
  return vehicleMakes.find((m) => m.id === makeId);
}
export function describeVehicle(versionId: string): string {
  const v = getVehicleVersion(versionId);
  if (!v) return '';
  const model = getVehicleModel(v.modelId);
  const make = model ? getVehicleMake(model.makeId) : undefined;
  return [make?.name, model?.name, v.name].filter(Boolean).join(' ');
}
