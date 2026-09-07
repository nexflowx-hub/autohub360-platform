-- 0004: inventory, carts, orders, payments, shipments and promotions.

create table public.inventory_locations (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  city text not null,
  state text not null,
  kind text not null default 'warehouse' check (kind in ('warehouse', 'pickup_point', 'partner_workshop')),
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);

-- is_public rows are safe to expose (city/region only); full address is not public.
create table public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  location_id uuid not null references public.inventory_locations(id) on delete cascade,
  quantity integer not null default 0 check (quantity >= 0),
  reserved integer not null default 0 check (reserved >= 0),
  unique (product_id, location_id)
);

create table public.carts (
  id uuid primary key default gen_random_uuid(),
  token text not null unique, -- anonymous cart token (cookie)
  profile_id uuid, -- set when authenticated
  market text not null default 'BR' references public.markets(code),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  product_id uuid not null references public.products(id),
  quantity integer not null check (quantity > 0),
  installation boolean not null default false,
  unit_price_cents integer not null,
  created_at timestamptz not null default now(),
  unique (cart_id, product_id)
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  number text not null unique,
  profile_id uuid, -- null for guest checkout (mandatory support)
  market text not null default 'BR' references public.markets(code),
  status text not null default 'pending_payment'
    check (status in ('pending_payment','paid','preparing','shipped','delivered','canceled','payment_failed')),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  customer_document text,
  delivery_method text not null
    check (delivery_method in ('nationwide','pickup','pickup_installation','local_delivery')),
  shipping_address jsonb,
  shipping_option text,
  shipping_cents integer not null default 0,
  installation_cents integer not null default 0,
  subtotal_cents integer not null default 0,
  discount_cents integer not null default 0,
  total_cents integer not null default 0,
  currency char(3) not null default 'BRL',
  coupon_code text,
  notes text,
  idempotency_key text unique,
  demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_orders_profile on public.orders (profile_id) where profile_id is not null;
create index idx_orders_status on public.orders (status);
create index idx_orders_email on public.orders (lower(customer_email));

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id),
  title text not null,
  sku text not null,
  unit_price_cents integer not null,
  quantity integer not null check (quantity > 0),
  installation boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_order_items_order on public.order_items (order_id);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  provider text not null,
  provider_ref text,
  method text not null,
  status text not null default 'pending'
    check (status in ('pending','authorized','paid','failed','refunded','canceled')),
  amount_cents integer not null,
  currency char(3) not null default 'BRL',
  raw_payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_payments_order on public.payments (order_id);
create index idx_payments_provider_ref on public.payments (provider_ref);

create table public.shipments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  carrier text not null default '',
  tracking_code text,
  status text not null default 'created'
    check (status in ('created','in_transit','out_for_delivery','delivered','returned')),
  estimated_delivery date,
  history jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  kind text not null check (kind in ('percent', 'fixed')),
  value integer not null,
  min_subtotal_cents integer not null default 0,
  market text not null default 'BR' references public.markets(code),
  active boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz,
  usage_limit integer,
  usage_count integer not null default 0,
  created_at timestamptz not null default now()
);

create trigger trg_orders_updated before update on public.orders
  for each row execute function public.set_updated_at();
create trigger trg_payments_updated before update on public.payments
  for each row execute function public.set_updated_at();
create trigger trg_shipments_updated before update on public.shipments
  for each row execute function public.set_updated_at();
create trigger trg_carts_updated before update on public.carts
  for each row execute function public.set_updated_at();
