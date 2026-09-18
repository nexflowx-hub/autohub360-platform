drop policy if exists storefronts_public_read on public.storefronts;

create policy storefronts_public_read
  on public.storefronts for select
  to anon, authenticated
  using (status = 'live');

drop policy if exists storefront_domains_public_read on public.storefront_domains;

create policy storefront_domains_public_read
  on public.storefront_domains for select
  to anon, authenticated
  using (status = 'active');
