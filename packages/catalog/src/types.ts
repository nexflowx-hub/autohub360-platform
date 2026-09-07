/** Catalog domain types shared by all AutoHub360 apps. */

export type Currency = 'BRL' | 'EUR';
export type VehicleType = 'car' | 'moto' | 'truck';

export interface Category {
  id: string;
  slug: string;
  name: string;
  universe: string;
  description: string;
  /** Icon key rendered by the shared design system. */
  icon: string;
}

export interface Brand {
  id: string;
  slug: string;
  name: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  ean?: string;
  categoryId: string;
  brandId: string;
  title: string;
  subtitle: string;
  description: string;
  specs: ProductSpec[];
  /** Category-themed placeholder key (no real photography in V1 demo). */
  imageKey: string;
  priceCents: number;
  compareAtCents?: number;
  currency: Currency;
  stock: number;
  weightGrams: number;
  warrantyMonths: number;
  /** true = fits any vehicle/none needed (gadgets, smart home...). */
  universal: boolean;
  /** Eligible for "Produto + instalação" with the Anápolis partner. */
  installable: boolean;
  featured: boolean;
  bestSeller: boolean;
  rating: number;
  reviewCount: number;
  badges: string[];
  createdAt: string;
}

export interface VehicleMake {
  id: string;
  slug: string;
  name: string;
  type: VehicleType;
}

export interface VehicleModel {
  id: string;
  makeId: string;
  slug: string;
  name: string;
}

export interface VehicleVersion {
  id: string;
  modelId: string;
  name: string;
  yearStart: number;
  yearEnd: number;
  engine: string;
  /** Headlight socket used by fitment for lighting products. */
  headlightSocket?: 'H1' | 'H4' | 'H7' | 'H11' | '9005' | '9006';
  canbus?: boolean;
}

export interface Selection {
  makeId?: string;
  modelId?: string;
  versionId?: string;
}

export type FitmentStatus =
  | 'compatible'
  | 'not_compatible'
  | 'unconfirmed'
  | 'universal'
  | 'no_vehicle';

export interface ArticleSection {
  heading: string;
  body: string[];
}

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  categoryLabel: string;
  readMinutes: number;
  publishedAt: string;
  imageKey: string;
  body: ArticleSection[];
}

export interface OrderItemLine {
  productId: string;
  slug: string;
  title: string;
  sku: string;
  unitPriceCents: number;
  quantity: number;
  installation: boolean;
}

export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'preparing'
  | 'shipped'
  | 'delivered'
  | 'canceled'
  | 'payment_failed';

export interface Order {
  id: string;
  number: string;
  status: OrderStatus;
  currency: Currency;
  items: OrderItemLine[];
  subtotalCents: number;
  shippingCents: number;
  discountCents: number;
  installationCents: number;
  totalCents: number;
  paymentMethod: string;
  customer: { name: string; email: string; phone: string };
  delivery: { method: string; address?: Record<string, string>; pickup?: boolean };
  createdAt: string;
  demo: boolean;
}

/** Hydrated product with joined display fields (category/brand). */
export interface CatalogProduct extends Product {
  categoryName: string;
  categorySlug: string;
  universe: string;
  brandName: string;
}
