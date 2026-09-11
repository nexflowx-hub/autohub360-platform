-- AutoHub360 Platform — V1
-- 0001: extensions, deterministic UUID helper and market configuration.
-- Project: eivqvrfsreaopzlvhadu (sa-east-1, PostgreSQL 17)

create extension if not exists pgcrypto with schema extensions;
create extension if not exists pg_trgm with schema extensions;
create extension if not exists "uuid-ossp" with schema extensions;

-- Deterministic UUID from a natural key: seeds stay stable across environments.
create or replace function public.stable_uuid(key text)
returns uuid
language sql
immutable
as $$
  select extensions.uuid_generate_v5('6f1e1a58-2b17-5a37-8bd8-9a2f6f13b100'::uuid, key);
$$;

-- updated_at bookkeeping
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.markets (
  code text primary key check (code in ('BR', 'EU')),
  name text not null,
  currency char(3) not null check (currency in ('BRL', 'EUR')),
  locale text not null default 'pt-BR',
  status text not null default 'preview' check (status in ('live', 'preview')),
  checkout_enabled boolean not null default false,
  operator_line text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.markets (code, name, currency, locale, status, checkout_enabled, operator_line) values
  ('BR', 'Brasil', 'BRL', 'pt-BR', 'live', true,
   'AutoHub360 Brasil — CNPJ 66.991.513/0001-10'),
  ('EU', 'Europa', 'EUR', 'pt-BR', 'preview', false,
   'AutoHub360 Europe — marca operada pela Auto Lux Europe SAS')
on conflict (code) do nothing;

create trigger trg_markets_updated before update on public.markets
  for each row execute function public.set_updated_at();
