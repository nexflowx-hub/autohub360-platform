-- AutoHub360 catalog media v1
-- Keeps operational product media/provenance in the canonical catalog table.

alter table public.products
  add column if not exists image_url text,
  add column if not exists gallery_urls text[] not null default '{}',
  add column if not exists image_source_url text,
  add column if not exists image_verified_at timestamptz;

comment on column public.products.image_url is
  'Primary verified product/supplier image URL.';
comment on column public.products.gallery_urls is
  'Additional verified product media URLs.';
comment on column public.products.image_source_url is
  'Public source page used to validate the media.';
comment on column public.products.image_verified_at is
  'Timestamp of the latest media validation.';
