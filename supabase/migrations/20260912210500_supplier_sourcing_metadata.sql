alter table public.product_supplier_offers
  add column if not exists cost_currency char(3) not null default 'BRL',
  add column if not exists source_url text,
  add column if not exists source_title text,
  add column if not exists source_seller text,
  add column if not exists source_marketplace text,
  add column if not exists observed_at timestamptz,
  add column if not exists direct_ship_status text not null default 'unknown',
  add column if not exists source_metadata jsonb not null default '{}'::jsonb;

alter table public.product_supplier_offers
  drop constraint if exists product_supplier_offers_cost_currency_check;
alter table public.product_supplier_offers
  add constraint product_supplier_offers_cost_currency_check
  check (cost_currency in ('BRL','EUR','USD','GBP'));

alter table public.product_supplier_offers
  drop constraint if exists product_supplier_offers_direct_ship_status_check;
alter table public.product_supplier_offers
  add constraint product_supplier_offers_direct_ship_status_check
  check (direct_ship_status in ('unknown','claimed','verified','not_available'));

create index if not exists product_supplier_offers_marketplace_idx
  on public.product_supplier_offers (source_marketplace, active);
create index if not exists product_supplier_offers_observed_at_idx
  on public.product_supplier_offers (observed_at desc);
