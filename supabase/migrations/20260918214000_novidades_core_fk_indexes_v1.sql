create index if not exists legal_entities_organization_id_idx
  on public.legal_entities(organization_id);

create index if not exists storefronts_legal_entity_id_idx
  on public.storefronts(legal_entity_id);

create index if not exists storefronts_market_idx
  on public.storefronts(market);

create index if not exists listing_prices_variant_id_idx
  on public.listing_prices(variant_id)
  where variant_id is not null;
