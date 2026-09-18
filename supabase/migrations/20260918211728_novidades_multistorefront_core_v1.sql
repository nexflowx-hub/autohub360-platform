-- Shared multi-storefront Commerce Core extension.
-- Applied to Supabase project eivqvrfsreaopzlvhadu on 2026-09-18.
-- Additive only: preserves existing AutoHub360 catalog/orders while allowing
-- Novidades.store, dedicated funnels and future storefronts to share the same core.

create table if not exists public.commerce_organizations (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  status text not null default 'active' check (status in ('active','inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.legal_entities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.commerce_organizations(id) on delete restrict,
  code text not null unique,
  country_code char(2) not null,
  legal_name text not null,
  trade_name text,
  registration_number text not null,
  tax_number text,
  capital_cents bigint,
  capital_currency char(3),
  address jsonb not null default '{}'::jsonb,
  email text,
  phone text,
  privacy_email text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.storefronts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.commerce_organizations(id) on delete restrict,
  legal_entity_id uuid not null references public.legal_entities(id) on delete restrict,
  code text not null unique,
  name text not null,
  slug text not null,
  market text references public.markets(code),
  default_locale text not null default 'pt-BR',
  default_currency char(3) not null default 'BRL',
  status text not null default 'preview' check (status in ('preview','live','paused')),
  commerce_mode text not null default 'catalog' check (commerce_mode in ('catalog','store','funnel')),
  theme_config jsonb not null default '{}'::jsonb,
  checkout_config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists storefronts_org_slug_uq
  on public.storefronts(organization_id, slug);

create table if not exists public.storefront_domains (
  id uuid primary key default gen_random_uuid(),
  storefront_id uuid not null references public.storefronts(id) on delete cascade,
  hostname text not null unique,
  is_primary boolean not null default false,
  locale_strategy text not null default 'path',
  currency_strategy text not null default 'market',
  canonical_base_url text,
  status text not null default 'active' check (status in ('active','preview','disabled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists storefront_domains_storefront_idx
  on public.storefront_domains(storefront_id);

create table if not exists public.product_listings (
  id uuid primary key default gen_random_uuid(),
  storefront_id uuid not null references public.storefronts(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  slug text not null,
  locale text not null default 'pt-BR',
  title text not null,
  subtitle text not null default '',
  description text not null default '',
  seo_title text,
  seo_description text,
  external_funnel_url text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  featured boolean not null default false,
  badges text[] not null default '{}',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(storefront_id, slug, locale)
);
create index if not exists product_listings_product_idx
  on public.product_listings(product_id);
create index if not exists product_listings_storefront_status_idx
  on public.product_listings(storefront_id, status);

create table if not exists public.listing_prices (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.product_listings(id) on delete cascade,
  variant_id uuid references public.product_variants(id) on delete cascade,
  currency char(3) not null,
  amount_cents integer not null check (amount_cents >= 0),
  compare_at_cents integer check (compare_at_cents is null or compare_at_cents >= amount_cents),
  active boolean not null default true,
  active_from timestamptz,
  active_to timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists listing_prices_listing_variant_currency_uq
  on public.listing_prices(
    listing_id,
    coalesce(variant_id, '00000000-0000-0000-0000-000000000000'::uuid),
    currency
  );
create index if not exists listing_prices_active_idx
  on public.listing_prices(listing_id, currency)
  where active;

create table if not exists public.product_listing_media (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.product_listings(id) on delete cascade,
  kind text not null default 'image' check (kind in ('image','video')),
  url text not null,
  alt_text text not null default '',
  sort_order integer not null default 0,
  is_primary boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists product_listing_media_listing_idx
  on public.product_listing_media(listing_id, sort_order);

alter table public.orders
  add column if not exists storefront_id uuid references public.storefronts(id),
  add column if not exists seller_entity_id uuid references public.legal_entities(id),
  add column if not exists payment_store text,
  add column if not exists locale text not null default 'pt-BR',
  add column if not exists metadata jsonb not null default '{}'::jsonb;

alter table public.order_items
  add column if not exists variant_id uuid references public.product_variants(id),
  add column if not exists listing_id uuid references public.product_listings(id),
  add column if not exists metadata jsonb not null default '{}'::jsonb;

alter table public.payments
  add column if not exists storefront_id uuid references public.storefronts(id),
  add column if not exists payment_store text,
  add column if not exists idempotency_key text,
  add column if not exists metadata jsonb not null default '{}'::jsonb;

create unique index if not exists payments_idempotency_uq
  on public.payments(idempotency_key)
  where idempotency_key is not null;

alter table public.web_sessions
  add column if not exists storefront_id uuid references public.storefronts(id);

alter table public.campaigns
  add column if not exists storefront_id uuid references public.storefronts(id);

create index if not exists orders_storefront_created_idx
  on public.orders(storefront_id, created_at desc);
create index if not exists orders_seller_created_idx
  on public.orders(seller_entity_id, created_at desc);
create index if not exists payments_storefront_created_idx
  on public.payments(storefront_id, created_at desc);
create index if not exists web_sessions_storefront_idx
  on public.web_sessions(storefront_id, last_seen_at desc);
create index if not exists campaigns_storefront_idx
  on public.campaigns(storefront_id, status);

alter table public.commerce_organizations enable row level security;
alter table public.legal_entities enable row level security;
alter table public.storefronts enable row level security;
alter table public.storefront_domains enable row level security;
alter table public.product_listings enable row level security;
alter table public.listing_prices enable row level security;
alter table public.product_listing_media enable row level security;

drop policy if exists commerce_organizations_public_read on public.commerce_organizations;
create policy commerce_organizations_public_read
  on public.commerce_organizations for select
  to anon, authenticated
  using (status = 'active');

drop policy if exists legal_entities_public_read on public.legal_entities;
create policy legal_entities_public_read
  on public.legal_entities for select
  to anon, authenticated
  using (active);

drop policy if exists storefronts_public_read on public.storefronts;
create policy storefronts_public_read
  on public.storefronts for select
  to anon, authenticated
  using (status in ('live','preview'));

drop policy if exists storefront_domains_public_read on public.storefront_domains;
create policy storefront_domains_public_read
  on public.storefront_domains for select
  to anon, authenticated
  using (status in ('active','preview'));

drop policy if exists product_listings_public_read on public.product_listings;
create policy product_listings_public_read
  on public.product_listings for select
  to anon, authenticated
  using (
    status = 'published'
    and exists (
      select 1 from public.products p
      where p.id = product_id and p.published
    )
  );

drop policy if exists listing_prices_public_read on public.listing_prices;
create policy listing_prices_public_read
  on public.listing_prices for select
  to anon, authenticated
  using (
    active
    and (active_from is null or active_from <= now())
    and (active_to is null or active_to > now())
    and exists (
      select 1 from public.product_listings l
      where l.id = listing_id and l.status = 'published'
    )
  );

drop policy if exists product_listing_media_public_read on public.product_listing_media;
create policy product_listing_media_public_read
  on public.product_listing_media for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.product_listings l
      where l.id = listing_id and l.status = 'published'
    )
  );

grant select on public.commerce_organizations, public.legal_entities, public.storefronts,
  public.storefront_domains, public.product_listings, public.listing_prices,
  public.product_listing_media to anon, authenticated;

insert into public.commerce_organizations(code, name, status)
values ('novidades-commerce', 'Novidades Commerce Network', 'active')
on conflict (code) do update
set name=excluded.name, status=excluded.status, updated_at=now();

insert into public.legal_entities(
  organization_id, code, country_code, legal_name, trade_name,
  registration_number, tax_number, capital_cents, capital_currency,
  address, email, phone, privacy_email, active
)
select
  o.id, 'novidades-br', 'BR',
  '69.093.616 MICAELA GOMES DE JESUS', 'NOVIDADES.STORE',
  '69.093.616/0001-50', '69.093.616/0001-50',
  500000, 'BRL',
  jsonb_build_object(
    'street','AVENIDA JOAO FLORENTINO',
    'lot','9','block','2','district','RESIDENCIAL ARAGUAIA',
    'postal_code','75071-430','city','ANAPOLIS','state','GO','country','BRASIL'
  ),
  'contato@novidades.store', '+55 (62) 99190-3462',
  'privacidade@novidades.store', true
from public.commerce_organizations o
where o.code='novidades-commerce'
on conflict (code) do update set
  legal_name=excluded.legal_name, trade_name=excluded.trade_name,
  registration_number=excluded.registration_number, tax_number=excluded.tax_number,
  capital_cents=excluded.capital_cents, capital_currency=excluded.capital_currency,
  address=excluded.address, email=excluded.email, phone=excluded.phone,
  privacy_email=excluded.privacy_email, active=true, updated_at=now();

insert into public.legal_entities(
  organization_id, code, country_code, legal_name, trade_name,
  registration_number, address, email, phone, privacy_email, active
)
select
  o.id, 'mgj-expert-uk', 'GB',
  'MGJ EXPERT LTD', 'NOVIDADES.STORE', '17422467',
  jsonb_build_object(
    'street','71-75 Shelton Street','district','Covent Garden',
    'city','London','postal_code','WC2H 9JQ','country','United Kingdom'
  ),
  'hello@novidades.store', '+44 7451 214299',
  'privacy@novidades.store', true
from public.commerce_organizations o
where o.code='novidades-commerce'
on conflict (code) do update set
  legal_name=excluded.legal_name, trade_name=excluded.trade_name,
  registration_number=excluded.registration_number, address=excluded.address,
  email=excluded.email, phone=excluded.phone, privacy_email=excluded.privacy_email,
  active=true, updated_at=now();

insert into public.storefronts(
  organization_id, legal_entity_id, code, name, slug, market,
  default_locale, default_currency, status, commerce_mode, checkout_config
)
select o.id, le.id, 'NOVIDADES-BRL', 'Novidades.store Brasil', 'novidades-br', 'BR',
  'pt-BR','BRL','live','store',
  jsonb_build_object('payment_store','NOVIDADES-BRL','primary_method','pix')
from public.commerce_organizations o
join public.legal_entities le on le.code='novidades-br'
where o.code='novidades-commerce'
on conflict (code) do update set
  legal_entity_id=excluded.legal_entity_id, market=excluded.market,
  default_locale=excluded.default_locale, default_currency=excluded.default_currency,
  status=excluded.status, checkout_config=excluded.checkout_config, updated_at=now();

insert into public.storefronts(
  organization_id, legal_entity_id, code, name, slug, market,
  default_locale, default_currency, status, commerce_mode, checkout_config
)
select o.id, le.id, 'NOVIDADES-EURO', 'Novidades.store Europe', 'novidades-euro', 'EU',
  'en-GB','EUR','preview','store',
  jsonb_build_object('payment_store','NOVIDADES-EURO','enabled',false)
from public.commerce_organizations o
join public.legal_entities le on le.code='mgj-expert-uk'
where o.code='novidades-commerce'
on conflict (code) do update set
  legal_entity_id=excluded.legal_entity_id, market=excluded.market,
  default_locale=excluded.default_locale, default_currency=excluded.default_currency,
  status=excluded.status, checkout_config=excluded.checkout_config, updated_at=now();

insert into public.storefronts(
  organization_id, legal_entity_id, code, name, slug, market,
  default_locale, default_currency, status, commerce_mode, checkout_config
)
select o.id, le.id, 'SIGNUM312-BR', 'SIGNUM 312', 'signum312', 'BR',
  'pt-BR','BRL','live','funnel',
  jsonb_build_object('payment_store','NOVIDADES-BRL','primary_method','pix')
from public.commerce_organizations o
join public.legal_entities le on le.code='novidades-br'
where o.code='novidades-commerce'
on conflict (code) do update set
  legal_entity_id=excluded.legal_entity_id, market=excluded.market,
  status=excluded.status, checkout_config=excluded.checkout_config, updated_at=now();

insert into public.storefronts(
  organization_id, legal_entity_id, code, name, slug, market,
  default_locale, default_currency, status, commerce_mode, checkout_config
)
select o.id, le.id, 'AUTOHUB360-BR', 'AutoHub360 Store Brasil', 'autohub360-br', 'BR',
  'pt-BR','BRL','live','store','{}'::jsonb
from public.commerce_organizations o
join public.legal_entities le on le.code='novidades-br'
where o.code='novidades-commerce'
on conflict (code) do update set updated_at=now();

insert into public.storefront_domains(
  storefront_id, hostname, is_primary, locale_strategy, currency_strategy,
  canonical_base_url, status
)
select id,'novidades.store',true,'path','market','https://novidades.store','active'
from public.storefronts where code='NOVIDADES-BRL'
on conflict (hostname) do update set
  storefront_id=excluded.storefront_id, is_primary=true,
  canonical_base_url=excluded.canonical_base_url, status='active', updated_at=now();

insert into public.storefront_domains(
  storefront_id, hostname, is_primary, locale_strategy, currency_strategy,
  canonical_base_url, status
)
select id,'signum312.novidades.store',true,'fixed','fixed',
  'https://signum312.novidades.store','active'
from public.storefronts where code='SIGNUM312-BR'
on conflict (hostname) do update set
  storefront_id=excluded.storefront_id, is_primary=true,
  canonical_base_url=excluded.canonical_base_url, status='active', updated_at=now();

insert into public.storefront_domains(
  storefront_id, hostname, is_primary, locale_strategy, currency_strategy,
  canonical_base_url, status
)
select id,'autohub360.store',true,'market','market',
  'https://autohub360.store','active'
from public.storefronts where code='AUTOHUB360-BR'
on conflict (hostname) do update set
  storefront_id=excluded.storefront_id, is_primary=true,
  canonical_base_url=excluded.canonical_base_url, status='active', updated_at=now();

insert into public.categories(slug,name,universe,description,icon,sort_order)
values (
  'arte-e-vida','Arte & Vida','arte-vida',
  'Símbolos, presentes e objetos com significado.','sparkles',90
)
on conflict (slug) do update set
  name=excluded.name, universe=excluded.universe,
  description=excluded.description, updated_at=now();

insert into public.brands(slug,name)
values ('arte-e-vida','Arte & Vida')
on conflict (slug) do update set name=excluded.name;

insert into public.products(
  slug,sku,category_id,brand_id,title,subtitle,description,specs,image_key,
  currency,price_cents,compare_at_cents,stock,weight_grams,warranty_months,
  universal,installable,featured,best_seller,rating,review_count,badges,published
)
select
  'signum-312','SIGNUM312',c.id,b.id,'SIGNUM 312','Fé. Coragem. Propósito.',
  'Coleção contemporânea inspirada em simbolismo histórico e cristão.',
  '[]'::jsonb,'signum','BRL',9990,null,0,0,0,
  true,false,true,false,0,0,'{}'::text[],true
from public.categories c
join public.brands b on b.slug='arte-e-vida'
where c.slug='arte-e-vida'
on conflict (slug) do update set
  category_id=excluded.category_id, brand_id=excluded.brand_id,
  title=excluded.title, subtitle=excluded.subtitle, description=excluded.description,
  currency=excluded.currency, price_cents=excluded.price_cents,
  featured=true, best_seller=false, rating=0, review_count=0,
  badges='{}'::text[], published=true, updated_at=now();

insert into public.product_variants(product_id,sku,title,price_cents,stock,attributes)
select p.id,'SIGNUM312-PATINA','Pátina',9990,0,jsonb_build_object('finish','patina')
from public.products p where p.slug='signum-312'
on conflict (sku) do update set
  title=excluded.title, price_cents=excluded.price_cents, attributes=excluded.attributes;

insert into public.product_variants(product_id,sku,title,price_cents,stock,attributes)
select p.id,'SIGNUM312-GOLD','Dourada',8990,0,jsonb_build_object('finish','gold')
from public.products p where p.slug='signum-312'
on conflict (sku) do update set
  title=excluded.title, price_cents=excluded.price_cents, attributes=excluded.attributes;

insert into public.product_variants(product_id,sku,title,price_cents,stock,attributes)
select p.id,'SIGNUM312-DUO','Duo',16990,0,
  jsonb_build_object('bundle',true,'contains',jsonb_build_array('SIGNUM312-PATINA','SIGNUM312-GOLD'))
from public.products p where p.slug='signum-312'
on conflict (sku) do update set
  title=excluded.title, price_cents=excluded.price_cents, attributes=excluded.attributes;

insert into public.product_listings(
  storefront_id,product_id,slug,locale,title,subtitle,description,
  seo_title,seo_description,external_funnel_url,status,featured,badges,metadata
)
select sf.id,p.id,'signum-312','pt-BR','SIGNUM 312','Fé. Coragem. Propósito.',
  'Mais que um acessório. Um símbolo que atravessa o tempo.',
  'SIGNUM 312 — Arte & Vida | Novidades.store',
  'Conheça SIGNUM 312, coleção Arte & Vida da Novidades.store.',
  'https://signum312.novidades.store','published',true,'{}'::text[],
  jsonb_build_object('ecosystem','Arte&Vida')
from public.storefronts sf
join public.products p on p.slug='signum-312'
where sf.code='NOVIDADES-BRL'
on conflict (storefront_id,slug,locale) do update set
  title=excluded.title, subtitle=excluded.subtitle, description=excluded.description,
  seo_title=excluded.seo_title, seo_description=excluded.seo_description,
  external_funnel_url=excluded.external_funnel_url, status='published',
  featured=true, badges='{}'::text[], metadata=excluded.metadata, updated_at=now();

insert into public.product_listings(
  storefront_id,product_id,slug,locale,title,subtitle,description,
  external_funnel_url,status,featured,badges,metadata
)
select sf.id,p.id,'signum-312','pt-BR','SIGNUM 312','Fé. Coragem. Propósito.',
  'Uma interpretação contemporânea de um universo simbólico histórico.',
  null,'published',true,'{}'::text[],
  jsonb_build_object('ecosystem','Arte&Vida','funnel',true)
from public.storefronts sf
join public.products p on p.slug='signum-312'
where sf.code='SIGNUM312-BR'
on conflict (storefront_id,slug,locale) do update set
  status='published', featured=true, badges='{}'::text[],
  metadata=excluded.metadata, updated_at=now();

insert into public.listing_prices(listing_id,variant_id,currency,amount_cents,active)
select l.id,v.id,'BRL',v.price_cents,true
from public.product_listings l
join public.storefronts sf on sf.id=l.storefront_id and sf.code='NOVIDADES-BRL'
join public.products p on p.id=l.product_id and p.slug='signum-312'
join public.product_variants v on v.product_id=p.id
where l.slug='signum-312'
on conflict do nothing;

insert into public.listing_prices(listing_id,variant_id,currency,amount_cents,active)
select l.id,v.id,'BRL',v.price_cents,true
from public.product_listings l
join public.storefronts sf on sf.id=l.storefront_id and sf.code='SIGNUM312-BR'
join public.products p on p.id=l.product_id and p.slug='signum-312'
join public.product_variants v on v.product_id=p.id
where l.slug='signum-312'
on conflict do nothing;

create or replace view public.storefront_catalog
with (security_invoker = true) as
select
  sf.code as storefront_code,
  sf.name as storefront_name,
  sf.default_locale,
  sf.default_currency,
  d.hostname,
  l.id as listing_id,
  l.slug as listing_slug,
  l.locale,
  l.title,
  l.subtitle,
  l.description,
  l.seo_title,
  l.seo_description,
  l.external_funnel_url,
  l.featured,
  l.badges,
  l.metadata as listing_metadata,
  p.id as product_id,
  p.sku as product_sku,
  p.image_url,
  p.gallery_urls,
  p.category_id,
  c.slug as category_slug,
  c.name as category_name,
  b.name as brand_name
from public.storefronts sf
left join public.storefront_domains d
  on d.storefront_id=sf.id and d.is_primary
join public.product_listings l
  on l.storefront_id=sf.id and l.status='published'
join public.products p
  on p.id=l.product_id and p.published
join public.categories c on c.id=p.category_id
left join public.brands b on b.id=p.brand_id
where sf.status in ('live','preview');

grant select on public.storefront_catalog to anon, authenticated;
