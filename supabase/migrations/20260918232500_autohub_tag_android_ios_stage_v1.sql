-- Stage the first AutoHub360 shared-Commerce-Core offer.
-- Android/iOS variants are prepared but kept non-public until stock/pricing is confirmed.

insert into public.product_variants(product_id,sku,title,price_cents,stock,attributes)
select p.id,'AUTOHUB-TAG-ANDROID','Android',p.price_cents,0,
  jsonb_build_object('platform','android','launch_state','staged')
from public.products p
where p.slug='smart-tag-bluetooth-localizador'
on conflict (sku) do update set
  product_id=excluded.product_id,
  title=excluded.title,
  attributes=excluded.attributes;

insert into public.product_variants(product_id,sku,title,price_cents,stock,attributes)
select p.id,'AUTOHUB-TAG-IOS','iOS',p.price_cents,0,
  jsonb_build_object('platform','ios','launch_state','staged')
from public.products p
where p.slug='smart-tag-bluetooth-localizador'
on conflict (sku) do update set
  product_id=excluded.product_id,
  title=excluded.title,
  attributes=excluded.attributes;

insert into public.product_listings(
  storefront_id,product_id,display_category_id,slug,locale,title,subtitle,description,
  seo_title,seo_description,status,featured,badges,metadata
)
select
  sf.id,p.id,c.id,p.slug,'pt-BR',
  'Tag Rastreador Smart',
  'Versões para Android e iOS.',
  'Tag compacta para localização de objetos. Oferta AutoHub360 em preparação.',
  'Tag Rastreador Smart — Android e iOS | AutoHub360',
  'Tag rastreador para objetos em versões Android e iOS. Oferta em preparação.',
  'draft',true,'{}'::text[],
  jsonb_build_object('launch_candidate',true,'source','shared-commerce-core')
from public.storefronts sf
join public.products p on p.slug='smart-tag-bluetooth-localizador'
join public.categories c on c.slug='rastreadores-tags'
where sf.code='AUTOHUB360-BR'
on conflict (storefront_id,slug,locale) do update set
  display_category_id=excluded.display_category_id,
  title=excluded.title,
  subtitle=excluded.subtitle,
  description=excluded.description,
  seo_title=excluded.seo_title,
  seo_description=excluded.seo_description,
  status='draft',
  featured=true,
  metadata=excluded.metadata,
  updated_at=now();

insert into public.listing_prices(listing_id,variant_id,currency,amount_cents,active)
select l.id,v.id,'BRL',v.price_cents,false
from public.product_listings l
join public.storefronts sf on sf.id=l.storefront_id and sf.code='AUTOHUB360-BR'
join public.products p on p.id=l.product_id and p.slug='smart-tag-bluetooth-localizador'
join public.product_variants v on v.product_id=p.id
where l.slug='smart-tag-bluetooth-localizador'
  and v.sku in ('AUTOHUB-TAG-ANDROID','AUTOHUB-TAG-IOS')
on conflict do nothing;
