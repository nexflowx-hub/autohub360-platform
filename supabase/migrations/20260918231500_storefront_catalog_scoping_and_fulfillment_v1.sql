-- Multi-storefront catalog scoping and multi-fulfillment foundation.
-- Applied to shared Supabase Commerce Core.
-- Product/listing separation remains additive; no destructive catalog rewrite.

alter table public.products
  add column if not exists fulfillment_type text not null default 'physical'
    check (fulfillment_type in ('physical','digital','service')),
  add column if not exists requires_shipping boolean not null default true;

alter table public.product_listings
  add column if not exists display_category_id uuid references public.categories(id) on delete restrict;

create index if not exists product_listings_display_category_id_idx
  on public.product_listings(display_category_id)
  where display_category_id is not null;

create table if not exists public.storefront_categories (
  id uuid primary key default gen_random_uuid(),
  storefront_id uuid not null references public.storefronts(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  label_override text,
  status text not null default 'active'
    check (status in ('active','hidden')),
  sort_order integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(storefront_id, category_id)
);

create index if not exists storefront_categories_storefront_idx
  on public.storefront_categories(storefront_id, status, sort_order);
create index if not exists storefront_categories_category_idx
  on public.storefront_categories(category_id);

alter table public.storefront_categories enable row level security;

drop policy if exists storefront_categories_public_read on public.storefront_categories;
create policy storefront_categories_public_read
  on public.storefront_categories for select
  to anon, authenticated
  using (
    status = 'active'
    and exists (
      select 1
      from public.storefronts sf
      where sf.id = storefront_id
        and sf.status = 'live'
    )
  );

grant select on public.storefront_categories to anon, authenticated;

insert into public.categories(slug,name,universe,description,icon,sort_order)
values
  ('casa-e-utilidade','Casa & Utilidade','novidades','Soluções práticas e descobertas para o lar.','home',110),
  ('auto-tech','Auto & Tech','novidades','Mobilidade, acessórios e tecnologia útil.','car',120),
  ('pets','Pets','novidades','Descobertas para a rotina de quem vive com animais.','paw-print',130),
  ('saude-bem-estar','Saúde & Bem-estar','novidades','Produtos e experiências de saúde e bem-estar publicados após validação.','heart-pulse',140),
  ('viagem-estilo','Viagem & Estilo','novidades','Acessórios e ideias para mobilidade e estilo.','luggage',150),
  ('trabalho-estudo','Trabalho & Estudo','novidades','Ferramentas para produtividade, organização e aprendizagem.','briefcase',160),
  ('presentes','Presentes','novidades','Seleções pensadas para presentear.','gift',170),
  ('digital-market','Digital Market','digital','E-books, formações, templates, automações e outros produtos digitais.','sparkles',180),
  ('servicos-ssm','Serviços SSM','services','Serviços e packs de marketing digital e operação online.','briefcase-business',190)
on conflict (slug) do update set
  name=excluded.name,
  universe=excluded.universe,
  description=excluded.description,
  icon=excluded.icon,
  sort_order=excluded.sort_order,
  updated_at=now();

update public.product_listings l
set display_category_id = p.category_id,
    updated_at = now()
from public.products p
where p.id = l.product_id
  and l.display_category_id is null;

insert into public.storefront_categories(storefront_id,category_id,status,sort_order)
select sf.id,c.id,'active',c.sort_order
from public.storefronts sf
join public.categories c on c.slug in (
  'rastreadores-tags','estacionamento','cameras-veiculares','energia-emergencia',
  'carregadores-conectividade','iluminacao-automotiva','cuidados-ferramentas'
)
where sf.code='AUTOHUB360-BR'
on conflict (storefront_id,category_id) do update set
  status='active',sort_order=excluded.sort_order,updated_at=now();

insert into public.storefront_categories(storefront_id,category_id,status,sort_order)
select sf.id,c.id,case when c.slug='arte-e-vida' then 'active' else 'hidden' end,c.sort_order
from public.storefronts sf
join public.categories c on c.slug in (
  'arte-e-vida','casa-e-utilidade','auto-tech','pets','saude-bem-estar',
  'viagem-estilo','trabalho-estudo','presentes','digital-market','servicos-ssm'
)
where sf.code='NOVIDADES-BRL'
on conflict (storefront_id,category_id) do update set
  status=excluded.status,sort_order=excluded.sort_order,updated_at=now();

insert into public.storefront_categories(storefront_id,category_id,status,sort_order)
select sf.id,c.id,'active',c.sort_order
from public.storefronts sf
join public.categories c on c.slug='arte-e-vida'
where sf.code='SIGNUM312-BR'
on conflict (storefront_id,category_id) do update set
  status='active',sort_order=excluded.sort_order,updated_at=now();

insert into public.storefront_categories(storefront_id,category_id,status,sort_order)
select sf.id,c.id,'hidden',c.sort_order
from public.storefronts sf
join public.categories c on c.slug in (
  'arte-e-vida','casa-e-utilidade','auto-tech','pets','saude-bem-estar',
  'viagem-estilo','trabalho-estudo','presentes','digital-market','servicos-ssm'
)
where sf.code='NOVIDADES-EURO'
on conflict (storefront_id,category_id) do update set
  status='hidden',sort_order=excluded.sort_order,updated_at=now();

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
  coalesce(l.display_category_id, p.category_id) as category_id,
  c.slug as category_slug,
  c.name as category_name,
  b.name as brand_name,
  p.fulfillment_type,
  p.requires_shipping
from public.storefronts sf
left join public.storefront_domains d
  on d.storefront_id=sf.id and d.is_primary
join public.product_listings l
  on l.storefront_id=sf.id and l.status='published'
join public.products p
  on p.id=l.product_id and p.published
join public.categories c
  on c.id=coalesce(l.display_category_id, p.category_id)
left join public.brands b on b.id=p.brand_id
where sf.status='live';

grant select on public.storefront_catalog to anon, authenticated;
