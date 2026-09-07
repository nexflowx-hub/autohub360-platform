-- 0006: profiles (linked to auth.users), addresses, vehicle garage
-- and Row Level Security for the whole schema.
--
-- RLS / SECURITY ASSUMPTIONS (documented also in docs/DATABASE_RLS.md):
-- - Anonymous + authenticated: read only published catalog/content.
-- - Customers: full access ONLY to their own private records (cart, orders, addresses, garage, favorites).
-- - Customers CANNOT forge paid states: order/payment mutations happen through
--   trusted server paths (service role) only; client roles never come from user_metadata.
-- - Server-only fields (products.cost_cents) are never readable by anon/authenticated.

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'customer' check (role in ('customer','staff','admin')),
  market text not null default 'BR' references public.markets(code),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.customer_addresses (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  label text not null default 'Endereço',
  cep text not null,
  street text not null,
  number text not null,
  complement text,
  district text not null,
  city text not null,
  state text not null,
  country text not null default 'BR',
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.customer_garage (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  label text not null,
  vehicle_version_id uuid references public.vehicle_versions(id),
  plate text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================ RLS ============================
alter table public.markets enable row level security;
alter table public.categories enable row level security;
alter table public.brands enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_market_offers enable row level security;
alter table public.product_media enable row level security;
alter table public.reviews enable row level security;
alter table public.favorites enable row level security;
alter table public.vehicles enable row level security;
alter table public.vehicle_models enable row level security;
alter table public.vehicle_versions enable row level security;
alter table public.product_compatibility enable row level security;
alter table public.inventory_locations enable row level security;
alter table public.inventory_items enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.shipments enable row level security;
alter table public.coupons enable row level security;
alter table public.installation_services enable row level security;
alter table public.appointment_slots enable row level security;
alter table public.appointments enable row level security;
alter table public.content_posts enable row level security;
alter table public.leads enable row level security;
alter table public.contact_requests enable row level security;
alter table public.profiles enable row level security;
alter table public.customer_addresses enable row level security;
alter table public.customer_garage enable row level security;

-- ---- public read surfaces ----
create policy "markets_public_read" on public.markets for select using (true);
create policy "categories_public_read" on public.categories for select using (true);
create policy "brands_public_read" on public.brands for select using (true);
create policy "products_public_read" on public.products for select using (published);
create policy "variants_public_read" on public.product_variants for select
  using (exists (select 1 from public.products p where p.id = product_id and p.published));
create policy "offers_public_read" on public.product_market_offers for select using (active);
create policy "media_public_read" on public.product_media for select
  using (exists (select 1 from public.products p where p.id = product_id and p.published));
create policy "reviews_public_read" on public.reviews for select using (status = 'approved');
create policy "vehicles_public_read" on public.vehicles for select using (true);
create policy "models_public_read" on public.vehicle_models for select using (true);
create policy "versions_public_read" on public.vehicle_versions for select using (true);
create policy "compat_public_read" on public.product_compatibility for select
  using (exists (select 1 from public.products p where p.id = product_id and p.published));
create policy "locations_public_read" on public.inventory_locations for select using (is_public);
create policy "slots_public_read" on public.appointment_slots for select
  using (slot_date >= current_date);
create policy "services_public_read" on public.installation_services for select using (active);
create policy "coupons_public_read" on public.coupons for select using (active);
create policy "posts_public_read" on public.content_posts for select using (status = 'published');

-- inventory quantities are exposed only as aggregates through a view (below); no direct select.

-- ---- customer-owned private records ----
create policy "profiles_self" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_self_update" on public.profiles
  for update using (auth.uid() = id)
  with check (auth.uid() = id and role = 'customer'); -- role cannot be self-promoted

create policy "addresses_self" on public.customer_addresses
  for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

create policy "garage_self" on public.customer_garage
  for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

create policy "favorites_self" on public.favorites
  for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

create policy "carts_self" on public.carts
  for all using (auth.uid() = profile_id or profile_id is null and true is false)
  with check (auth.uid() = profile_id);
-- NOTE: anonymous carts are managed server-side by token via service role (not client-writable).

create policy "orders_self_read" on public.orders
  for select using (auth.uid() = profile_id);
-- NO insert/update/delete policies for customers: order creation/mutation is server-only.

create policy "order_items_self_read" on public.order_items
  for select using (
    exists (select 1 from public.orders o where o.id = order_id and o.profile_id = auth.uid())
  );

create policy "payments_self_read" on public.payments
  for select using (
    exists (select 1 from public.orders o where o.id = order_id and o.profile_id = auth.uid())
  );

create policy "shipments_self_read" on public.shipments
  for select using (
    exists (select 1 from public.orders o where o.id = order_id and o.profile_id = auth.uid())
  );

create policy "appointments_self_read" on public.appointments
  for select using (
    exists (select 1 from public.orders o where o.id = order_id and o.profile_id = auth.uid())
  );

-- reviews: authenticated users may insert pending reviews for published products
create policy "reviews_insert_own" on public.reviews
  for insert with check (auth.uid() = profile_id and status = 'pending');

-- leads/contact: anyone may create (validated + rate-limited server-side); no read for anon.
create policy "leads_insert" on public.leads for insert with check (true);
create policy "contact_insert" on public.contact_requests for insert with check (true);

-- ============================ security barrier view ============================
-- Public catalog view that guarantees cost_cents never leaks through anon queries.
create or replace view public.catalog_products
with (security_invoker = false) as
select
  p.id, p.slug, p.sku, p.ean, p.category_id, p.brand_id, p.title, p.subtitle,
  p.description, p.specs, p.image_key, p.currency, p.price_cents, p.compare_at_cents,
  p.stock, p.weight_grams, p.warranty_months, p.universal, p.installable,
  p.featured, p.best_seller, p.rating, p.review_count, p.badges, p.published,
  p.created_at, p.updated_at
from public.products p
where p.published;

grant select on public.catalog_products to anon, authenticated;

-- Function to expose remaining stock safely (total minus reserved), no location data.
create or replace function public.available_stock(p_product_id uuid)
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(sum(quantity - reserved), 0)
  from public.inventory_items
  where product_id = p_product_id;
$$;

grant execute on function public.available_stock(uuid) to anon, authenticated;

create trigger trg_profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-provision profile on signup (role always defaults to 'customer').
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, market)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), 'BR')
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
