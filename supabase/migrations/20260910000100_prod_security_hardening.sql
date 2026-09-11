-- Production hardening after initial schema bootstrap.

create table if not exists public.product_costs (
  product_id uuid primary key references public.products(id) on delete cascade,
  cost_cents integer not null check (cost_cents >= 0),
  currency char(3) not null default 'BRL',
  updated_at timestamptz not null default now()
);
insert into public.product_costs (product_id, cost_cents, currency)
select id, cost_cents, currency from public.products where cost_cents is not null
on conflict (product_id) do update set cost_cents = excluded.cost_cents, currency = excluded.currency, updated_at = now();
alter table public.products drop column if exists cost_cents;
alter table public.product_costs enable row level security;
create policy "product_costs_staff" on public.product_costs for all to authenticated using (public.is_staff()) with check (public.is_staff());

create or replace view public.catalog_products with (security_invoker = true) as
select p.id, p.slug, p.sku, p.ean, p.category_id, p.brand_id, p.title, p.subtitle,
  p.description, p.specs, p.image_key, p.currency, p.price_cents, p.compare_at_cents,
  p.stock, p.weight_grams, p.warranty_months, p.universal, p.installable,
  p.featured, p.best_seller, p.rating, p.review_count, p.badges, p.published,
  p.created_at, p.updated_at
from public.products p where p.published;

drop view if exists public.public_payment_methods;

create or replace function public.stable_uuid(key text)
returns uuid language sql immutable set search_path = '' as $$
  select extensions.uuid_generate_v5('6f1e1a58-2b17-5a37-8bd8-9a2f6f13b100'::uuid, key);
$$;

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.is_staff() from public, anon;
grant execute on function public.is_staff() to authenticated;
revoke execute on function public.available_stock(uuid) from public;
grant execute on function public.available_stock(uuid) to anon, authenticated;

do $$ begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    execute 'revoke execute on function public.rls_auto_enable() from public, anon, authenticated';
  end if;
end $$;

create policy "inventory_items_staff" on public.inventory_items for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "cart_items_staff_read" on public.cart_items for select to authenticated using (public.is_staff());
create policy "leads_staff" on public.leads for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "lead_events_staff" on public.lead_events for select to authenticated using (public.is_staff());
create policy "contact_requests_staff" on public.contact_requests for all to authenticated using (public.is_staff()) with check (public.is_staff());
