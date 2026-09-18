-- Shared Commerce Core hardening before Novidades.store public launch.
-- Non-destructive: normalizes the neutral organization name, removes an
-- unnecessary SECURITY DEFINER boundary, and adds covering FK indexes.

update public.commerce_organizations
set
  code = 'mgj-commerce',
  name = 'MGJ Commerce Network',
  updated_at = now()
where code = 'novidades-commerce'
  and not exists (
    select 1
    from public.commerce_organizations existing
    where existing.code = 'mgj-commerce'
  );

alter function public.is_staff() security invoker;

create index if not exists appointments_order_id_idx
  on public.appointments(order_id);
create index if not exists appointments_product_id_idx
  on public.appointments(product_id);
create index if not exists appointments_service_id_idx
  on public.appointments(service_id);
create index if not exists cart_items_product_id_idx
  on public.cart_items(product_id);
create index if not exists carts_market_idx
  on public.carts(market);
create index if not exists coupons_market_idx
  on public.coupons(market);
create index if not exists customer_addresses_profile_id_idx
  on public.customer_addresses(profile_id);
create index if not exists customer_garage_profile_id_idx
  on public.customer_garage(profile_id);
create index if not exists customer_garage_vehicle_version_id_idx
  on public.customer_garage(vehicle_version_id);
create index if not exists favorites_product_id_idx
  on public.favorites(product_id);
create index if not exists inventory_items_location_id_idx
  on public.inventory_items(location_id);
create index if not exists orders_market_idx
  on public.orders(market);
create index if not exists pix_receivers_market_idx
  on public.pix_receivers(market);
create index if not exists product_market_offers_market_idx
  on public.product_market_offers(market);
create index if not exists product_media_product_id_idx
  on public.product_media(product_id);
create index if not exists product_variants_product_id_idx
  on public.product_variants(product_id);
create index if not exists products_brand_id_idx
  on public.products(brand_id);
create index if not exists profiles_market_idx
  on public.profiles(market);
