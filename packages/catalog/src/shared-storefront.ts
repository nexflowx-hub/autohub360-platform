import 'server-only';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  '';

export type SharedStorefrontListing = {
  storefrontCode: string;
  listingId: string;
  productId: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  categorySlug: string;
  categoryName: string;
  brandName: string | null;
  imageUrl: string | null;
  galleryUrls: string[];
  funnelUrl: string | null;
  featured: boolean;
  badges: string[];
  currency: 'BRL' | 'EUR';
  priceCents: number | null;
};

function assertConfigured() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error('SHARED_COMMERCE_CORE_NOT_CONFIGURED');
  }
}

function headers() {
  return {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    Accept: 'application/json',
  };
}

async function rest<T>(path: string): Promise<T> {
  assertConfigured();

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: headers(),
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(
      `SHARED_COMMERCE_CORE_${response.status}: ${body.slice(0, 300)}`,
    );
  }

  return (await response.json()) as T;
}

/**
 * Reads the generic multi-storefront catalog introduced by Novidades.store.
 *
 * This adapter is deliberately additive. Existing AutoHub360 pages can continue
 * using the bundled catalog until they are migrated screen-by-screen.
 */
export async function getSharedStorefrontCatalog(
  storefrontCode = process.env.COMMERCE_STOREFRONT_CODE ?? 'AUTOHUB360-BR',
): Promise<SharedStorefrontListing[]> {
  const rows = await rest<
    Array<{
      storefront_code: string;
      listing_id: string;
      listing_slug: string;
      title: string;
      subtitle: string;
      description: string;
      external_funnel_url: string | null;
      featured: boolean;
      badges: string[];
      product_id: string;
      image_url: string | null;
      gallery_urls: string[] | null;
      category_slug: string;
      category_name: string;
      brand_name: string | null;
      default_currency: 'BRL' | 'EUR';
    }>
  >(
    'storefront_catalog?select=storefront_code,listing_id,listing_slug,title,subtitle,description,external_funnel_url,featured,badges,product_id,image_url,gallery_urls,category_slug,category_name,brand_name,default_currency&storefront_code=eq.' +
      encodeURIComponent(storefrontCode),
  );

  if (rows.length === 0) return [];

  const listingIds = rows.map((row) => row.listing_id);
  const priceFilter = listingIds.map((id) => `"${id}"`).join(',');

  const prices = await rest<
    Array<{
      listing_id: string;
      currency: 'BRL' | 'EUR';
      amount_cents: number;
      active: boolean;
    }>
  >(
    'listing_prices?select=listing_id,currency,amount_cents,active&active=eq.true&listing_id=in.(' +
      priceFilter +
      ')',
  );

  return rows.map((row) => {
    const price = prices
      .filter((item) => item.listing_id === row.listing_id)
      .sort((a, b) => a.amount_cents - b.amount_cents)[0];

    return {
      storefrontCode: row.storefront_code,
      listingId: row.listing_id,
      productId: row.product_id,
      slug: row.listing_slug,
      title: row.title,
      subtitle: row.subtitle,
      description: row.description,
      categorySlug: row.category_slug,
      categoryName: row.category_name,
      brandName: row.brand_name,
      imageUrl: row.image_url,
      galleryUrls: row.gallery_urls ?? [],
      funnelUrl: row.external_funnel_url,
      featured: row.featured,
      badges: row.badges ?? [],
      currency: price?.currency ?? row.default_currency,
      priceCents: price?.amount_cents ?? null,
    };
  });
}
