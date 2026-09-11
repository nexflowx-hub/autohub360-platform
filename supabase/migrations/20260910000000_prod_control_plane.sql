-- AutoHub360 production control plane: payments, suppliers, campaigns and lead attribution.

-- Harden public lead/contact ingestion: browser clients must use validated server routes.
drop policy if exists "leads_insert" on public.leads;
drop policy if exists "contact_insert" on public.contact_requests;

alter table public.leads drop constraint if exists leads_kind_check;
alter table public.leads add constraint leads_kind_check check (kind in ('pro','newsletter','b2b','consumer','whatsapp','international','price_alert'));
alter table public.leads add column if not exists product_id uuid references public.products(id) on delete set null;
alter table public.leads add column if not exists landing_path text;
alter table public.leads add column if not exists vehicle_text text;
alter table public.leads add column if not exists utm_source text;
alter table public.leads add column if not exists utm_medium text;
alter table public.leads add column if not exists utm_campaign text;
alter table public.leads add column if not exists consent_marketing boolean not null default false;
alter table public.leads add column if not exists last_activity_at timestamptz not null default now();
alter table public.leads add column if not exists updated_at timestamptz not null default now();

create table public.lead_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete cascade,
  session_id text,
  event_type text not null check (event_type in ('page_view','cta_click','whatsapp_click','product_view','fitment_search','add_to_cart','begin_checkout','form_submit','qualified','note')),
  source text,
  path text,
  product_id uuid references public.products(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index idx_lead_events_lead on public.lead_events (lead_id, created_at desc);
create index idx_lead_events_session on public.lead_events (session_id, created_at desc);

create trigger trg_leads_updated before update on public.leads
  for each row execute function public.set_updated_at();

create table public.payment_providers (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  display_name text not null,
  provider_kind text not null check (provider_kind in ('gateway','acquirer','wallet','pix_static','pix_dynamic')),
  status text not null default 'draft' check (status in ('draft','test','live','disabled')),
  enabled boolean not null default false,
  markets text[] not null default '{BR}',
  methods text[] not null default '{}',
  priority integer not null default 100,
  routing_weight integer not null default 100 check (routing_weight between 0 and 1000),
  health_status text not null default 'unknown' check (health_status in ('unknown','healthy','degraded','down')),
  config_public jsonb not null default '{}'::jsonb,
  secret_env_prefix text,
  webhook_path text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.payment_routes (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.payment_providers(id) on delete cascade,
  market text not null default 'BR' references public.markets(code),
  method text not null,
  min_amount_cents integer not null default 0,
  max_amount_cents integer,
  max_installments integer,
  priority integer not null default 100,
  active boolean not null default true,
  conditions jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (provider_id, market, method)
);
create index idx_payment_routes_lookup on public.payment_routes (market, method, active, priority);

create table public.payment_webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider_code text not null,
  provider_event_id text not null,
  provider_ref text,
  event_type text,
  normalized_status text,
  payload jsonb,
  processed boolean not null default false,
  processing_error text,
  created_at timestamptz not null default now(),
  processed_at timestamptz,
  unique (provider_code, provider_event_id)
);

create table public.pix_receivers (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  market text not null default 'BR' references public.markets(code),
  key_type text not null check (key_type in ('cnpj','cpf','email','phone','random')),
  pix_key text not null,
  merchant_name text not null,
  merchant_city text not null,
  txid_prefix text not null default 'AH360',
  active boolean not null default false,
  priority integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (pix_key)
);

create table public.suppliers (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  website text,
  status text not null default 'candidate' check (status in ('candidate','approved','active','paused','blocked')),
  fulfillment_model text not null default 'dropship' check (fulfillment_model in ('stock','dropship','crossdock','on_demand')),
  integration_type text not null default 'manual' check (integration_type in ('manual','csv','api','marketplace')),
  api_base_url text,
  neutral_packaging boolean not null default false,
  invoice_model text,
  default_lead_days integer,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_supplier_offers (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  supplier_id uuid not null references public.suppliers(id) on delete cascade,
  supplier_sku text,
  cost_cents integer not null check (cost_cents >= 0),
  supplier_stock integer,
  origin_label text,
  priority integer not null default 100,
  active boolean not null default true,
  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, supplier_id, supplier_sku)
);
create index idx_supplier_offers_product on public.product_supplier_offers (product_id, active, priority);

create table public.marketplace_channels (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  display_name text not null,
  status text not null default 'draft' check (status in ('draft','test','live','disabled')),
  enabled boolean not null default false,
  integration_type text not null default 'api' check (integration_type in ('api','csv','manual')),
  config_public jsonb not null default '{}'::jsonb,
  secret_env_prefix text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  kind text not null check (kind in ('banner','offer','event','flash_sale','lead_gen','content')),
  market text not null default 'BR' references public.markets(code),
  status text not null default 'draft' check (status in ('draft','scheduled','live','ended','disabled')),
  placement text not null default 'home_hero',
  headline text not null,
  subheadline text,
  cta_label text,
  cta_url text,
  image_key text,
  starts_at timestamptz,
  ends_at timestamptz,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_campaigns_live on public.campaigns (market, status, placement, starts_at, ends_at);

create trigger trg_payment_providers_updated before update on public.payment_providers for each row execute function public.set_updated_at();
create trigger trg_pix_receivers_updated before update on public.pix_receivers for each row execute function public.set_updated_at();
create trigger trg_suppliers_updated before update on public.suppliers for each row execute function public.set_updated_at();
create trigger trg_supplier_offers_updated before update on public.product_supplier_offers for each row execute function public.set_updated_at();
create trigger trg_marketplace_channels_updated before update on public.marketplace_channels for each row execute function public.set_updated_at();
create trigger trg_campaigns_updated before update on public.campaigns for each row execute function public.set_updated_at();

alter table public.lead_events enable row level security;
alter table public.payment_providers enable row level security;
alter table public.payment_routes enable row level security;
alter table public.payment_webhook_events enable row level security;
alter table public.pix_receivers enable row level security;
alter table public.suppliers enable row level security;
alter table public.product_supplier_offers enable row level security;
alter table public.marketplace_channels enable row level security;
alter table public.campaigns enable row level security;

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role in ('staff','admin'));
$$;
grant execute on function public.is_staff() to authenticated;

create policy "payment_providers_staff" on public.payment_providers for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "payment_routes_staff" on public.payment_routes for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "payment_events_staff" on public.payment_webhook_events for select to authenticated using (public.is_staff());
create policy "pix_receivers_staff" on public.pix_receivers for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "suppliers_staff" on public.suppliers for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "supplier_offers_staff" on public.product_supplier_offers for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "marketplaces_staff" on public.marketplace_channels for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "campaigns_staff" on public.campaigns for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "campaigns_public_read" on public.campaigns for select to anon, authenticated using (status = 'live' and (starts_at is null or starts_at <= now()) and (ends_at is null or ends_at >= now()));

create or replace view public.public_payment_methods with (security_invoker = false) as
select code, display_name, provider_kind, markets, methods, priority, config_public
from public.payment_providers
where enabled and status = 'live' and health_status in ('healthy','unknown');
grant select on public.public_payment_methods to anon, authenticated;

insert into public.payment_providers (code, display_name, provider_kind, status, enabled, markets, methods, priority, config_public, secret_env_prefix, webhook_path, notes) values
  ('mercado_pago','Mercado Pago','gateway','draft',false,'{BR}','{pix,credit,debit,boleto}',10,'{"checkout":"transparent","orders_api":"preferred"}'::jsonb,'MERCADOPAGO','/api/webhooks/payments/mercado-pago','Pix, cartões e boleto; ativar após credenciais e testes.'),
  ('picpay','PicPay','gateway','draft',false,'{BR}','{pix,credit,wallet}',20,'{"checkout":"transparent"}'::jsonb,'PICPAY','/api/webhooks/payments/picpay','Gateway PicPay suporta cartão, Pix e Wallet; ativar após homologação.'),
  ('stone_online','Stone Online','acquirer','draft',false,'{BR}','{credit,debit}',30,'{"scope":"transactional"}'::jsonb,'STONE','/api/webhooks/payments/stone','Stone Online é transacional; Pagar.me pode ser preferível quando antifraude/tokenização/orquestração forem necessários.'),
  ('pagarme','Pagar.me','gateway','draft',false,'{BR}','{pix,credit,debit,boleto}',35,'{}'::jsonb,'PAGARME','/api/webhooks/payments/pagarme','Avaliar comercialmente como gateway Stone completo.'),
  ('stripe_br','Stripe Brasil','gateway','draft',false,'{BR}','{credit,pix}',40,'{"pix_eligibility":"verify_account"}'::jsonb,'STRIPE','/api/webhooks/payments/stripe','Cartões; Pix depende de elegibilidade/ativação da conta.'),
  ('pix_static','Pix direto (QR estático)','pix_static','draft',false,'{BR}','{pix}',90,'{"reconciliation":"manual"}'::jsonb,'PIX_STATIC',null,'Fallback: QR estático/copia-e-cola; nunca liberar pedido automaticamente sem conciliação.'),
  ('recargapay','RecargaPay PJ','wallet','draft',false,'{BR}','{pix}',95,'{"integration":"commercial_validation_required"}'::jsonb,'RECARGAPAY',null,'Conta PJ/Pix disponível; API e-commerce pública não confirmada, validar integração comercial antes de ativar.')
on conflict (code) do nothing;

insert into public.marketplace_channels (code, display_name, status, enabled, integration_type, secret_env_prefix) values
  ('mercado_livre','Mercado Livre','draft',false,'api','MERCADOLIVRE'),
  ('shopee','Shopee','draft',false,'api','SHOPEE'),
  ('amazon_br','Amazon Brasil','draft',false,'api','AMAZON')
on conflict (code) do nothing;

insert into public.suppliers (code,name,website,status,fulfillment_model,integration_type,neutral_packaging,notes) values
  ('ph_representante','PH Representante','https://www.phrepresentante.com.br/','candidate','dropship','manual',false,'Automotivo; confirmar contrato, catálogo, NF, SLA e embalagem antes de publicar.'),
  ('olibra','Olibra Representações','https://olibrarepresentacoes.com.br/','candidate','dropship','manual',false,'Autopeças/acessórios para marketplaces; validar condições comerciais.'),
  ('dropping','Dropping','https://www.dropping.com.br/','candidate','dropship','api',false,'Multi-fornecedor nacional; validar API/integração e SLA.'),
  ('dropify','Dropify','https://dropify.com.br/','candidate','dropship','api',false,'API REST anunciada para pedidos/frete/estoque/produtos/notas/webhooks; solicitar homologação.'),
  ('onedrop','OneDrop','https://onedrop.com.br/','candidate','dropship','api',false,'Catálogo nacional e integrações anunciadas; validar oferta e operação.'),
  ('rayx','RAYX','https://www.rayx.com.br/','candidate','stock','manual',false,'Distribuidor B2B automotivo; potencial para estoque/cross-dock.'),
  ('rytop','RyTop Brasil','https://www.rytopbrasil.com.br/','candidate','stock','manual',false,'Atacado automotivo, eletrônicos, ferramentas e casa.'),
  ('eletrohub','EletroHub Atacado','https://www.eletrohubatacado.com.br/','candidate','stock','manual',false,'Eletrônicos atacado; validar disponibilidade para fulfillment direto.')
on conflict (code) do nothing;

insert into public.campaigns (code,name,kind,market,status,placement,headline,subheadline,cta_label,cta_url) values
  ('launch_auto360','Lançamento AutoHub360','banner','BR','draft','home_hero','Tecnologia para o carro, para a casa e para o seu dia.','Campanha de lançamento — ativar somente quando catálogo e fulfillment estiverem confirmados.','Explorar produtos','/'),
  ('installation_anapolis','Instalação em Anápolis','lead_gen','BR','draft','home_mid','Compre online e instale com especialista em Anápolis.','Campanha local ligada ao parceiro Generoso Auto Center.','Agendar instalação','/instalacao')
on conflict (code) do nothing;
