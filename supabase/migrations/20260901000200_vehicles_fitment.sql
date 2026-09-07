-- 0003: vehicle fitment — core differentiator. Structured compatibility,
-- never encoded only as product-description text.

create table public.vehicles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  vehicle_type text not null check (vehicle_type in ('car', 'moto', 'truck')),
  created_at timestamptz not null default now()
);

create table public.vehicle_models (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  slug text not null unique,
  name text not null,
  created_at timestamptz not null default now()
);

create index idx_vehicle_models_vehicle on public.vehicle_models (vehicle_id);

create table public.vehicle_versions (
  id uuid primary key default gen_random_uuid(),
  model_id uuid not null references public.vehicle_models(id) on delete cascade,
  name text not null,
  year_start integer not null,
  year_end integer not null,
  engine text not null default '',
  headlight_socket text,
  canbus boolean not null default false,
  created_at timestamptz not null default now(),
  check (year_end >= year_start)
);

create index idx_vehicle_versions_model on public.vehicle_versions (model_id);
create index idx_vehicle_versions_socket on public.vehicle_versions (headlight_socket);

create table public.product_compatibility (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  vehicle_version_id uuid not null references public.vehicle_versions(id) on delete cascade,
  notes text not null default '',
  confirmed boolean not null default true,
  unique (product_id, vehicle_version_id)
);

create index idx_compat_product on public.product_compatibility (product_id);
create index idx_compat_version on public.product_compatibility (vehicle_version_id);
