-- 0002: catalog domain — categories, brands, products, variants, market offers,
-- media, reviews and favorites.

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  universe text not null,
  description text not null default '',
  icon text not null default 'watch',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.brands (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  sku text not null unique,
  ean text unique,
  category_id uuid not null references public.categories(id),
  brand_id uuid references public.brands(id),
  title text not null,
  subtitle text not null default '',
  description text not null default '',
  specs jsonb not null default '[]'::jsonb,
  image_key text not null default 'gadget',
  currency char(3) not null default 'BRL' check (currency in ('BRL', 'EUR')),
  price_cents integer not null check (price_cents >= 0),
  compare_at_cents integer check (compare_at_cents is null or compare_at_cents >= price_cents),
  cost_cents integer, -- server/admin only: never exposed through anon policies
  stock integer not null default 0 check (stock >= 0),
  weight_grams integer not null default 0,
  warranty_months integer not null default 0,
  universal boolean not null default false,
  installable boolean not null default false,
  featured boolean not null default false,
  best_seller boolean not null default false,
  rating numeric(2,1) not null default 0 check (rating between 0 and 5),
  review_count integer not null default 0,
  badges text[] not null default '{}',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_products_category on public.products (category_id) where published;
create index idx_products_universe_cat on public.categories (universe);
create index idx_products_featured on public.products (featured) where published;
create index idx_products_title_trgm on public.products using gin (title extensions.gin_trgm_ops);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  sku text not null unique,
  title text not null,
  price_cents integer not null,
  stock integer not null default 0,
  attributes jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.product_market_offers (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  market text not null references public.markets(code),
  currency char(3) not null default 'BRL',
  price_cents integer not null check (price_cents >= 0),
  compare_at_cents integer,
  stock integer not null default 0,
  active boolean not null default true,
  unique (product_id, market)
);

create table public.product_media (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  kind text not null default 'image' check (kind in ('image', 'video', '360')),
  url text not null,
  alt text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  profile_id uuid, -- null when customer not authenticated
  author_name text not null,
  rating integer not null check (rating between 1 and 5),
  title text not null default '',
  body text not null default '',
  verified_purchase boolean not null default false,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create index idx_reviews_product on public.reviews (product_id) where status = 'approved';

create table public.favorites (
  profile_id uuid not null,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (profile_id, product_id)
);

create trigger trg_products_updated before update on public.products
  for each row execute function public.set_updated_at();
create trigger trg_categories_updated before update on public.categories
  for each row execute function public.set_updated_at();
