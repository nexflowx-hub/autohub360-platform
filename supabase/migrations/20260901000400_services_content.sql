-- 0005: installation services (Generoso Auto Center partnership), appointments,
-- editorial content, leads and contact requests.

create table public.installation_services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  base_fee_cents integer not null default 0,
  duration_minutes integer not null default 60,
  active boolean not null default true,
  partner_name text not null default 'Generoso Auto Center',
  city text not null default 'Anápolis',
  state text not null default 'GO',
  created_at timestamptz not null default now()
);

create table public.appointment_slots (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.installation_services(id) on delete cascade,
  slot_date date not null,
  slot_time time not null,
  capacity integer not null default 1,
  booked integer not null default 0,
  unique (service_id, slot_date, slot_time),
  check (booked <= capacity)
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id),
  service_id uuid not null references public.installation_services(id),
  slot_id uuid references public.appointment_slots(id),
  product_id uuid references public.products(id),
  customer_name text not null,
  customer_phone text not null,
  vehicle text not null,
  status text not null default 'requested'
    check (status in ('requested','confirmed','done','canceled','no_show')),
  notes text,
  demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_appointments_slot on public.appointments (slot_id);

create table public.content_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  kind text not null default 'article' check (kind in ('article', 'guide', 'news')),
  app text not null default 'tech' check (app in ('tech', 'store')),
  title text not null,
  excerpt text not null default '',
  body jsonb not null default '[]'::jsonb,
  category_label text not null default '',
  image_key text not null default 'gadget',
  read_minutes integer not null default 5,
  status text not null default 'published' check (status in ('draft','published')),
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  kind text not null default 'pro' check (kind in ('pro', 'newsletter', 'b2b')),
  name text,
  email text not null,
  phone text,
  company text,
  message text,
  source text,
  market text not null default 'BR',
  status text not null default 'new' check (status in ('new','contacted','qualified','lost')),
  created_at timestamptz not null default now()
);

create index idx_leads_kind on public.leads (kind);

create table public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  app text not null default 'tech' check (app in ('tech', 'store')),
  department text not null default 'contato',
  name text not null,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  ticket text not null unique,
  status text not null default 'received'
    check (status in ('received','acknowledged','in_progress','resolved','canceled')),
  received_at timestamptz not null default now(),
  acknowledged_at timestamptz,
  created_at timestamptz not null default now()
);

create index idx_contact_ticket on public.contact_requests (ticket);

create trigger trg_appointments_updated before update on public.appointments
  for each row execute function public.set_updated_at();
create trigger trg_posts_updated before update on public.content_posts
  for each row execute function public.set_updated_at();
