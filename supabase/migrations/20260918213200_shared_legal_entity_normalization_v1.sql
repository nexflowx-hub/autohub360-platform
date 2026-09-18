-- Normalize the shared Brazilian legal seller independently of any one brand.

update public.legal_entities
set
  code = 'mgj-br',
  trade_name = null,
  updated_at = now()
where code = 'novidades-br'
  and not exists (
    select 1 from public.legal_entities existing
    where existing.code = 'mgj-br'
  );

update public.storefronts sf
set legal_entity_id = le.id,
    updated_at = now()
from public.legal_entities le
where le.code = 'mgj-br'
  and sf.code in ('NOVIDADES-BRL','SIGNUM312-BR','AUTOHUB360-BR');

create index if not exists orders_storefront_id_idx on public.orders(storefront_id);
create index if not exists orders_seller_entity_id_idx on public.orders(seller_entity_id);
create index if not exists order_items_variant_id_idx on public.order_items(variant_id);
create index if not exists order_items_listing_id_idx on public.order_items(listing_id);
create index if not exists payments_storefront_id_idx on public.payments(storefront_id);
create index if not exists web_sessions_storefront_id_idx on public.web_sessions(storefront_id);
create index if not exists campaigns_storefront_id_idx on public.campaigns(storefront_id);
