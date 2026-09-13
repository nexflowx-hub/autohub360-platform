-- AutoHub360 Operations Control Plane V1
-- CRM, first-party webtracking, shipment timeline, post-sale support and automation outbox.

create table if not exists public.crm_contacts (
  id uuid primary key default gen_random_uuid(), market text not null default 'BR' check (market in ('BR','EU')),
  full_name text, email text, phone text, company text,
  lifecycle_stage text not null default 'lead' check (lifecycle_stage in ('lead','prospect','customer','active','vip','churned')),
  source text, owner text, tags text[] not null default '{}', consent_marketing boolean not null default false,
  lead_id uuid references public.leads(id) on delete set null, profile_id uuid references public.profiles(id) on delete set null,
  last_order_id uuid references public.orders(id) on delete set null, lifetime_value_cents bigint not null default 0,
  currency char(3) not null default 'BRL' check (currency in ('BRL','EUR')), last_activity_at timestamptz not null default now(),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create unique index if not exists crm_contacts_email_unique on public.crm_contacts(lower(email)) where email is not null;
create index if not exists crm_contacts_stage_idx on public.crm_contacts(lifecycle_stage,last_activity_at desc);
create index if not exists crm_contacts_lead_id_idx on public.crm_contacts(lead_id);
create index if not exists crm_contacts_profile_id_idx on public.crm_contacts(profile_id);
create index if not exists crm_contacts_last_order_id_idx on public.crm_contacts(last_order_id);

create table if not exists public.crm_activities (
  id uuid primary key default gen_random_uuid(), contact_id uuid not null references public.crm_contacts(id) on delete cascade,
  kind text not null check (kind in ('note','email','whatsapp','call','lead','web','order','payment','shipment','support','ai','marketing','system')),
  direction text not null default 'system' check (direction in ('inbound','outbound','system')), subject text, body text, actor text,
  metadata jsonb not null default '{}', created_at timestamptz not null default now()
);
create index if not exists crm_activities_contact_idx on public.crm_activities(contact_id,created_at desc);

create table if not exists public.web_sessions (
  id uuid primary key default gen_random_uuid(), session_id text not null unique,
  contact_id uuid references public.crm_contacts(id) on delete set null, lead_id uuid references public.leads(id) on delete set null,
  market text not null default 'BR' check (market in ('BR','EU')), first_path text, last_path text, referrer text,
  utm_source text, utm_medium text, utm_campaign text, utm_content text, utm_term text, device text, browser text, ip_hash text,
  event_count integer not null default 0, first_seen_at timestamptz not null default now(), last_seen_at timestamptz not null default now(),
  metadata jsonb not null default '{}'
);
create index if not exists web_sessions_last_seen_idx on public.web_sessions(last_seen_at desc);
create index if not exists web_sessions_campaign_idx on public.web_sessions(utm_campaign,utm_source);
create index if not exists web_sessions_contact_id_idx on public.web_sessions(contact_id);
create index if not exists web_sessions_lead_id_idx on public.web_sessions(lead_id);

alter table public.shipments add column if not exists public_code text;
alter table public.shipments add column if not exists last_event_at timestamptz;
alter table public.shipments add column if not exists delivered_at timestamptz;
update public.shipments set public_code='AH'||upper(substr(md5(id::text||created_at::text),1,16)) where public_code is null or length(public_code)<18;
alter table public.shipments alter column public_code set default ('AH'||upper(substr(md5(gen_random_uuid()::text||clock_timestamp()::text),1,16)));
create unique index if not exists shipments_public_code_key on public.shipments(public_code) where public_code is not null;
create index if not exists shipments_order_id_idx on public.shipments(order_id);
alter table public.shipments drop constraint if exists shipments_status_check;
alter table public.shipments add constraint shipments_status_check check (status in ('created','labeled','in_transit','out_for_delivery','delivered','exception','returned'));

create table if not exists public.shipment_events (
  id uuid primary key default gen_random_uuid(), shipment_id uuid not null references public.shipments(id) on delete cascade,
  event_code text not null, status text not null, title text not null, description text, location text,
  occurred_at timestamptz not null default now(), raw_payload jsonb, created_at timestamptz not null default now()
);
create index if not exists shipment_events_shipment_idx on public.shipment_events(shipment_id,occurred_at desc);

create table if not exists public.support_cases (
  id uuid primary key default gen_random_uuid(), ticket text not null unique default ('AH-'||upper(substr(md5(gen_random_uuid()::text),1,10))),
  contact_id uuid references public.crm_contacts(id) on delete set null, order_id uuid references public.orders(id) on delete set null,
  market text not null default 'BR' check (market in ('BR','EU')), channel text not null default 'web' check (channel in ('web','email','whatsapp','phone','ai')),
  category text not null default 'support', priority text not null default 'normal' check (priority in ('low','normal','high','urgent')),
  status text not null default 'open' check (status in ('open','ai_handling','waiting_customer','waiting_team','resolved','closed')),
  subject text not null, summary text, ai_enabled boolean not null default true,
  ai_status text not null default 'idle' check (ai_status in ('idle','drafting','responded','escalated','disabled')),
  ai_confidence numeric(5,4), assigned_to text, last_message_at timestamptz not null default now(),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists support_cases_queue_idx on public.support_cases(status,priority,updated_at desc);
create index if not exists support_cases_market_status_idx on public.support_cases(market,status,updated_at desc);
create index if not exists support_cases_contact_id_idx on public.support_cases(contact_id);
create index if not exists support_cases_order_id_idx on public.support_cases(order_id);

create table if not exists public.support_messages (
  id uuid primary key default gen_random_uuid(), case_id uuid not null references public.support_cases(id) on delete cascade,
  author_type text not null check (author_type in ('customer','agent','ai','system')), author_label text, body text not null,
  visible_to_customer boolean not null default true, metadata jsonb not null default '{}', created_at timestamptz not null default now()
);
create index if not exists support_messages_case_idx on public.support_messages(case_id,created_at);

create table if not exists public.notification_templates (
  id uuid primary key default gen_random_uuid(), code text not null, market text not null default 'BR' check (market in ('BR','EU','ALL')),
  channel text not null check (channel in ('email','whatsapp','webpush')), name text not null, subject text, body text not null,
  variables jsonb not null default '[]', status text not null default 'active' check (status in ('draft','active','paused')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(code,market,channel)
);

create table if not exists public.automation_rules (
  id uuid primary key default gen_random_uuid(), code text not null unique, name text not null, trigger_event text not null,
  market text not null default 'ALL' check (market in ('BR','EU','ALL')), audience text not null default 'transactional',
  channel text not null check (channel in ('email','whatsapp','webpush')), template_code text not null,
  delay_minutes integer not null default 0 check (delay_minutes>=0), frequency_cap_hours integer not null default 0 check (frequency_cap_hours>=0),
  conditions jsonb not null default '{}', status text not null default 'active' check (status in ('draft','active','paused')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists automation_rules_trigger_idx on public.automation_rules(trigger_event,status);

create table if not exists public.notification_outbox (
  id uuid primary key default gen_random_uuid(), contact_id uuid references public.crm_contacts(id) on delete set null,
  order_id uuid references public.orders(id) on delete set null, case_id uuid references public.support_cases(id) on delete set null,
  rule_id uuid references public.automation_rules(id) on delete set null, template_code text not null,
  market text not null default 'BR' check (market in ('BR','EU')), channel text not null check (channel in ('email','whatsapp','webpush')),
  destination text not null, status text not null default 'queued' check (status in ('queued','sending','sent','failed','cancelled')),
  scheduled_for timestamptz not null default now(), sent_at timestamptz, attempts integer not null default 0,
  provider text, provider_ref text, payload jsonb not null default '{}', error text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists notification_outbox_queue_idx on public.notification_outbox(status,scheduled_for);
create index if not exists notification_outbox_contact_id_idx on public.notification_outbox(contact_id);
create index if not exists notification_outbox_order_id_idx on public.notification_outbox(order_id);
create index if not exists notification_outbox_case_id_idx on public.notification_outbox(case_id);
create index if not exists notification_outbox_rule_id_idx on public.notification_outbox(rule_id);

create index if not exists order_items_product_id_idx on public.order_items(product_id);
create index if not exists lead_events_product_id_idx on public.lead_events(product_id);
create index if not exists leads_product_id_idx on public.leads(product_id);
create index if not exists product_supplier_offers_supplier_id_idx on public.product_supplier_offers(supplier_id);

alter table public.crm_contacts enable row level security;
alter table public.crm_activities enable row level security;
alter table public.web_sessions enable row level security;
alter table public.shipment_events enable row level security;
alter table public.support_cases enable row level security;
alter table public.support_messages enable row level security;
alter table public.notification_templates enable row level security;
alter table public.automation_rules enable row level security;
alter table public.notification_outbox enable row level security;

grant all on public.crm_contacts,public.crm_activities,public.web_sessions,public.shipment_events,public.support_cases,public.support_messages,public.notification_templates,public.automation_rules,public.notification_outbox to service_role;

drop policy if exists crm_contacts_staff on public.crm_contacts;
create policy crm_contacts_staff on public.crm_contacts for all to authenticated using (public.is_staff()) with check (public.is_staff());
drop policy if exists crm_activities_staff on public.crm_activities;
create policy crm_activities_staff on public.crm_activities for all to authenticated using (public.is_staff()) with check (public.is_staff());
drop policy if exists web_sessions_staff on public.web_sessions;
create policy web_sessions_staff on public.web_sessions for select to authenticated using (public.is_staff());
drop policy if exists shipment_events_staff on public.shipment_events;
create policy shipment_events_staff on public.shipment_events for all to authenticated using (public.is_staff()) with check (public.is_staff());
drop policy if exists support_cases_staff on public.support_cases;
create policy support_cases_staff on public.support_cases for all to authenticated using (public.is_staff()) with check (public.is_staff());
drop policy if exists support_messages_staff on public.support_messages;
create policy support_messages_staff on public.support_messages for all to authenticated using (public.is_staff()) with check (public.is_staff());
drop policy if exists notification_templates_staff on public.notification_templates;
create policy notification_templates_staff on public.notification_templates for all to authenticated using (public.is_staff()) with check (public.is_staff());
drop policy if exists automation_rules_staff on public.automation_rules;
create policy automation_rules_staff on public.automation_rules for all to authenticated using (public.is_staff()) with check (public.is_staff());
drop policy if exists notification_outbox_staff on public.notification_outbox;
create policy notification_outbox_staff on public.notification_outbox for all to authenticated using (public.is_staff()) with check (public.is_staff());
revoke execute on function public.available_stock(uuid) from anon,authenticated,public;

create or replace function public.ah_contact_by_email(p_email text,p_name text default null,p_phone text default null,p_market text default 'BR',p_source text default null)
returns uuid language plpgsql security invoker set search_path=public as $$
declare v_id uuid;
begin
  if p_email is not null then select id into v_id from public.crm_contacts where lower(email)=lower(p_email) limit 1; end if;
  if v_id is null then
    insert into public.crm_contacts(full_name,email,phone,market,source,currency) values(p_name,p_email,p_phone,case when p_market='EU' then 'EU' else 'BR' end,p_source,case when p_market='EU' then 'EUR' else 'BRL' end) returning id into v_id;
  else
    update public.crm_contacts set full_name=coalesce(p_name,full_name),phone=coalesce(p_phone,phone),market=case when p_market='EU' then 'EU' else market end,source=coalesce(p_source,source),last_activity_at=now(),updated_at=now() where id=v_id;
  end if;
  return v_id;
end $$;
revoke all on function public.ah_contact_by_email(text,text,text,text,text) from public,anon,authenticated;
grant execute on function public.ah_contact_by_email(text,text,text,text,text) to service_role;

create or replace function public.ah_enqueue_event_rules(p_event text,p_contact uuid,p_order uuid,p_case uuid,p_market text,p_email text,p_phone text,p_payload jsonb)
returns integer language plpgsql security invoker set search_path=public as $$
declare r public.automation_rules%rowtype; v_destination text; v_count integer:=0; v_consent boolean:=false;
begin
  if p_contact is not null then select consent_marketing into v_consent from public.crm_contacts where id=p_contact; end if;
  for r in select * from public.automation_rules where status='active' and trigger_event=p_event and (market='ALL' or market=p_market) loop
    if r.audience='marketing' and not coalesce(v_consent,false) then continue; end if;
    v_destination:=case r.channel when 'email' then p_email when 'whatsapp' then p_phone else null end;
    if v_destination is null or length(trim(v_destination))=0 then continue; end if;
    insert into public.notification_outbox(contact_id,order_id,case_id,rule_id,template_code,market,channel,destination,scheduled_for,payload)
    values(p_contact,p_order,p_case,r.id,r.template_code,case when p_market='EU' then 'EU' else 'BR' end,r.channel,v_destination,now()+make_interval(mins=>r.delay_minutes),coalesce(p_payload,'{}'::jsonb));
    v_count:=v_count+1;
  end loop;
  return v_count;
end $$;
revoke all on function public.ah_enqueue_event_rules(text,uuid,uuid,uuid,text,text,text,jsonb) from public,anon,authenticated;
grant execute on function public.ah_enqueue_event_rules(text,uuid,uuid,uuid,text,text,text,jsonb) to service_role;

create or replace function public.ah_on_lead_created() returns trigger language plpgsql security invoker set search_path=public as $$
declare v_contact uuid;
begin
  v_contact:=public.ah_contact_by_email(new.email,new.name,new.phone,new.market,new.source);
  update public.crm_contacts set lead_id=new.id,consent_marketing=new.consent_marketing,lifecycle_stage='lead',last_activity_at=now(),updated_at=now() where id=v_contact;
  insert into public.crm_activities(contact_id,kind,direction,subject,metadata) values(v_contact,'lead','inbound','Novo lead captado',jsonb_build_object('lead_id',new.id,'source',new.source,'utm_source',new.utm_source,'utm_medium',new.utm_medium,'utm_campaign',new.utm_campaign,'landing_path',new.landing_path));
  perform public.ah_enqueue_event_rules('lead.created',v_contact,null,null,new.market,new.email,new.phone,jsonb_build_object('name',coalesce(new.name,''),'source',coalesce(new.source,''),'utm_campaign',coalesce(new.utm_campaign,'')));
  return new;
end $$;
drop trigger if exists ah_lead_created on public.leads;
create trigger ah_lead_created after insert on public.leads for each row execute function public.ah_on_lead_created();

create or replace function public.ah_on_order_created() returns trigger language plpgsql security invoker set search_path=public as $$
declare v_contact uuid;
begin
  v_contact:=public.ah_contact_by_email(new.customer_email,new.customer_name,new.customer_phone,new.market,'order');
  update public.crm_contacts set lifecycle_stage='customer',last_order_id=new.id,lifetime_value_cents=lifetime_value_cents+new.total_cents,currency=new.currency,last_activity_at=now(),updated_at=now() where id=v_contact;
  insert into public.crm_activities(contact_id,kind,direction,subject,metadata) values(v_contact,'order','inbound','Pedido criado',jsonb_build_object('order_id',new.id,'number',new.number,'status',new.status,'total_cents',new.total_cents,'currency',new.currency));
  perform public.ah_enqueue_event_rules('order.created',v_contact,new.id,null,new.market,new.customer_email,new.customer_phone,jsonb_build_object('name',new.customer_name,'order_number',new.number,'total_cents',new.total_cents,'currency',new.currency));
  return new;
end $$;
drop trigger if exists ah_order_created on public.orders;
create trigger ah_order_created after insert on public.orders for each row execute function public.ah_on_order_created();

create or replace function public.ah_on_shipment_event() returns trigger language plpgsql security invoker set search_path=public as $$
declare v_order public.orders%rowtype; v_ship public.shipments%rowtype; v_contact uuid; v_event text;
begin
  update public.shipments set status=new.status,last_event_at=new.occurred_at,delivered_at=case when new.status='delivered' then coalesce(delivered_at,new.occurred_at) else delivered_at end,updated_at=now() where id=new.shipment_id returning * into v_ship;
  select * into v_order from public.orders where id=v_ship.order_id;
  if new.status in ('in_transit','out_for_delivery') and v_order.status in ('paid','preparing') then update public.orders set status='shipped',updated_at=now() where id=v_order.id; v_order.status:='shipped';
  elsif new.status='delivered' and v_order.status<>'delivered' then update public.orders set status='delivered',updated_at=now() where id=v_order.id; v_order.status:='delivered'; end if;
  v_contact:=public.ah_contact_by_email(v_order.customer_email,v_order.customer_name,v_order.customer_phone,v_order.market,'shipment');
  insert into public.crm_activities(contact_id,kind,direction,subject,body,metadata) values(v_contact,'shipment','system',new.title,new.description,jsonb_build_object('shipment_id',new.shipment_id,'tracking_code',v_ship.tracking_code,'public_code',v_ship.public_code,'status',new.status,'location',new.location));
  v_event:=case when new.status='delivered' then 'shipment.delivered' else 'shipment.updated' end;
  perform public.ah_enqueue_event_rules(v_event,v_contact,v_order.id,null,v_order.market,v_order.customer_email,v_order.customer_phone,jsonb_build_object('name',v_order.customer_name,'order_number',v_order.number,'status',new.status,'title',new.title,'tracking_code',v_ship.tracking_code,'public_code',v_ship.public_code,'location',new.location));
  return new;
end $$;
drop trigger if exists ah_shipment_event_created on public.shipment_events;
create trigger ah_shipment_event_created after insert on public.shipment_events for each row execute function public.ah_on_shipment_event();

insert into public.notification_templates(code,market,channel,name,subject,body,status) values
('lead_welcome','BR','email','Boas-vindas lead','AutoHub360 — recebemos o seu interesse','Olá {{name}}, recebemos o seu interesse na AutoHub360. Podemos ajudar a escolher o produto certo para o seu veículo ou projeto.','active'),
('lead_welcome','EU','email','Lead welcome EU','AutoHub360 Europe — we received your request','Hello {{name}}, we received your interest in AutoHub360 Europe.','active'),
('order_created','BR','email','Pedido criado','AutoHub360 — pedido {{order_number}} recebido','Olá {{name}}, recebemos o pedido {{order_number}}. Você será avisado em cada etapa até a entrega.','active'),
('order_created','EU','email','Order created EU','AutoHub360 Europe — order {{order_number}} received','Hello {{name}}, your order {{order_number}} has been received.','active'),
('shipment_update','BR','email','Atualização de entrega','AutoHub360 — seu pedido avançou','O pedido {{order_number}} teve uma nova atualização: {{title}}. Código público: {{public_code}}.','active'),
('shipment_update','EU','email','Shipment update EU','AutoHub360 Europe — shipment update','Your order {{order_number}} has a new shipment update: {{title}}.','active'),
('shipment_delivered','BR','email','Pedido entregue','AutoHub360 — entrega concluída','O pedido {{order_number}} foi marcado como entregue. Se precisar de ajuda, nossa assistência pós-venda está disponível.','active'),
('shipment_delivered','EU','email','Delivered EU','AutoHub360 Europe — delivered','Your order {{order_number}} has been marked as delivered.','active'),
('support_received','BR','email','Ticket pós-venda recebido','AutoHub360 — protocolo {{ticket}}','Olá {{name}}, recebemos o seu pedido de assistência. Protocolo: {{ticket}}.','active'),
('support_received','EU','email','Support case received','AutoHub360 Europe — case {{ticket}}','Hello {{name}}, we received your support request. Reference: {{ticket}}.','active'),
('post_sale_checkin','BR','email','Check-in pós-venda 24h','AutoHub360 — correu tudo bem com o seu pedido?','Olá {{name}}, o pedido {{order_number}} foi entregue. Se precisar de ajuda, responda a esta mensagem ou abra o pós-venda.','active'),
('post_sale_checkin','EU','email','Post-sale check-in','AutoHub360 Europe — is everything OK with your order?','Hello {{name}}, order {{order_number}} was delivered. Contact us if you need help.','active'),
('review_request','BR','email','Pedido de avaliação 72h','AutoHub360 — conte-nos como foi a experiência','Olá {{name}}, como foi a sua experiência com o pedido {{order_number}}?','active'),
('review_request','EU','email','Review request','AutoHub360 Europe — tell us about your experience','Hello {{name}}, how was your experience with order {{order_number}}?','active')
on conflict(code,market,channel) do update set name=excluded.name,subject=excluded.subject,body=excluded.body,status=excluded.status,updated_at=now();

insert into public.automation_rules(code,name,trigger_event,market,audience,channel,template_code,delay_minutes,frequency_cap_hours,status) values
('lead_welcome_email','Novo lead — confirmação imediata','lead.created','ALL','marketing','email','lead_welcome',0,24,'active'),
('order_created_email','Pedido — confirmação','order.created','ALL','transactional','email','order_created',0,0,'active'),
('shipment_update_email','Expedição — atualização','shipment.updated','ALL','transactional','email','shipment_update',0,0,'active'),
('shipment_delivered_email','Entrega — confirmação','shipment.delivered','ALL','transactional','email','shipment_delivered',0,0,'active'),
('support_received_email','Pós-venda — confirmação do ticket','support.created','ALL','transactional','email','support_received',0,0,'active'),
('post_sale_checkin_24h','Pós-venda — check-in 24h','shipment.delivered','ALL','post_sale','email','post_sale_checkin',1440,24,'draft'),
('review_request_72h','Pós-venda — avaliação 72h','shipment.delivered','ALL','post_sale','email','review_request',4320,168,'draft')
on conflict(code) do update set name=excluded.name,trigger_event=excluded.trigger_event,market=excluded.market,audience=excluded.audience,channel=excluded.channel,template_code=excluded.template_code,delay_minutes=excluded.delay_minutes,frequency_cap_hours=excluded.frequency_cap_hours,status=excluded.status,updated_at=now();

drop trigger if exists crm_contacts_touch on public.crm_contacts;
create trigger crm_contacts_touch before update on public.crm_contacts for each row execute function public.set_updated_at();
drop trigger if exists support_cases_touch on public.support_cases;
create trigger support_cases_touch before update on public.support_cases for each row execute function public.set_updated_at();
drop trigger if exists notification_templates_touch on public.notification_templates;
create trigger notification_templates_touch before update on public.notification_templates for each row execute function public.set_updated_at();
drop trigger if exists automation_rules_touch on public.automation_rules;
create trigger automation_rules_touch before update on public.automation_rules for each row execute function public.set_updated_at();
drop trigger if exists notification_outbox_touch on public.notification_outbox;
create trigger notification_outbox_touch before update on public.notification_outbox for each row execute function public.set_updated_at();
