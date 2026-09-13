-- Optional idempotent DEMO data for the Operations Control Plane.
-- All synthetic contacts use example.com and queued external messages are cancelled.
do $$
declare v_product uuid; v_lead uuid; v_order uuid; v_contact uuid; v_shipment uuid; v_case uuid;
begin
  insert into public.campaigns(code,name,kind,market,status,placement,headline,subheadline,cta_label,cta_url,config)
  values('demo_meta_smart_tag','DEMO · Meta Ads · Smart Tag','lead_gen','BR','draft','offer_funnel','DEMO · Smart Tag','Campanha sintética para validar atribuição, CRM e automações.','Ver oferta','/ofertas/smart-tag-localizador',jsonb_build_object('demo',true,'utm_source','meta','utm_campaign','demo_smart_tag'))
  on conflict(code) do update set updated_at=now(),config=excluded.config;
  select id into v_product from public.products where sku='SRC-BR-TAG-001' limit 1;
  select id into v_lead from public.leads where email='demo-controlplane@example.com' and source='offer:smart-tag-localizador' limit 1;
  if v_lead is null then
    insert into public.leads(kind,name,email,phone,source,market,status,product_id,landing_path,utm_source,utm_medium,utm_campaign,consent_marketing,last_activity_at)
    values('consumer','Cliente DEMO AutoHub360','demo-controlplane@example.com','+5500000000000','offer:smart-tag-localizador','BR','qualified',v_product,'/ofertas/smart-tag-localizador','meta','paid_social','demo_smart_tag',true,now()) returning id into v_lead;
  end if;
  insert into public.web_sessions(session_id,lead_id,market,first_path,last_path,referrer,utm_source,utm_medium,utm_campaign,utm_content,device,event_count,first_seen_at,last_seen_at,metadata)
  values('DEMO-SESSION-META-001',v_lead,'BR','/ofertas/smart-tag-localizador','/checkout','https://instagram.com/','meta','paid_social','demo_smart_tag','video_a','mobile',6,now()-interval '45 minutes',now()-interval '18 minutes',jsonb_build_object('demo',true))
  on conflict(session_id) do update set lead_id=excluded.lead_id,last_seen_at=excluded.last_seen_at,event_count=excluded.event_count,metadata=excluded.metadata;
  select id into v_order from public.orders where number='AH-DEMO-001' limit 1;
  if v_order is null then
    insert into public.orders(number,market,status,customer_name,customer_email,customer_phone,delivery_method,shipping_address,shipping_option,shipping_cents,installation_cents,subtotal_cents,discount_cents,total_cents,currency,notes,idempotency_key,demo,created_at,updated_at)
    values('AH-DEMO-001','BR','paid','Cliente DEMO AutoHub360','demo-controlplane@example.com','+5500000000000','nationwide',jsonb_build_object('city','Anápolis','state','GO','country','BR','demo',true),'DEMO Standard',1990,0,2590,0,4580,'BRL','DEMO — pedido sintético','demo-controlplane-order-001',true,now()-interval '25 minutes',now()-interval '25 minutes') returning id into v_order;
  end if;
  if not exists(select 1 from public.order_items where order_id=v_order and sku='SRC-BR-TAG-001') then insert into public.order_items(order_id,product_id,title,sku,unit_price_cents,quantity,installation) values(v_order,v_product,'Smart Tag Bluetooth Localizador de Objetos','SRC-BR-TAG-001',2590,1,false); end if;
  select id into v_shipment from public.shipments where order_id=v_order limit 1;
  if v_shipment is null then insert into public.shipments(order_id,carrier,tracking_code,status,estimated_delivery,created_at,updated_at) values(v_order,'AutoHub360 DEMO Logistics','DEMO-BR-001','created',current_date+3,now()-interval '20 minutes',now()-interval '20 minutes') returning id into v_shipment; end if;
  if not exists(select 1 from public.shipment_events where shipment_id=v_shipment and event_code='created') then
    insert into public.shipment_events(shipment_id,event_code,status,title,description,location,occurred_at) values
    (v_shipment,'created','created','Pedido preparado para expedição','DEMO — pedido separado e conferido.','Anápolis - GO',now()-interval '20 minutes'),
    (v_shipment,'labeled','labeled','Etiqueta emitida','DEMO — volume etiquetado.','Anápolis - GO',now()-interval '15 minutes'),
    (v_shipment,'in_transit','in_transit','Em trânsito','DEMO — encomenda iniciou o percurso.','Centro de distribuição GO',now()-interval '8 minutes');
  end if;
  select id into v_contact from public.crm_contacts where lower(email)='demo-controlplane@example.com' limit 1;
  select id into v_case from public.support_cases where order_id=v_order and subject='DEMO · Dúvida sobre configuração do Smart Tag' limit 1;
  if v_case is null then
    insert into public.support_cases(contact_id,order_id,market,channel,category,priority,status,subject,summary,ai_enabled,ai_status,assigned_to,last_message_at)
    values(v_contact,v_order,'BR','web','post_sale','normal','waiting_team','DEMO · Dúvida sobre configuração do Smart Tag','DEMO — dúvida de configuração.',true,'drafting','Equipe AutoHub360',now()-interval '3 minutes') returning id into v_case;
    insert into public.support_messages(case_id,author_type,author_label,body,visible_to_customer,metadata,created_at) values
    (v_case,'customer','Cliente DEMO AutoHub360','DEMO — Gostaria de saber como faço o emparelhamento do Smart Tag quando ele chegar.',true,jsonb_build_object('demo',true),now()-interval '4 minutes'),
    (v_case,'ai','AutoHub AI Copilot','DEMO — RASCUNHO PRIVADO: confirme o sistema/compatibilidade indicado no produto antes de orientar o passo a passo.',false,jsonb_build_object('demo',true,'draft',true,'model','demo-seed'),now()-interval '3 minutes');
    perform public.ah_enqueue_event_rules('support.created',v_contact,v_order,v_case,'BR','demo-controlplane@example.com','+5500000000000',jsonb_build_object('demo',true,'name','Cliente DEMO AutoHub360','ticket',(select ticket from public.support_cases where id=v_case),'order_number','AH-DEMO-001'));
  end if;
  update public.notification_outbox set status='cancelled',error='DEMO — envio externo intencionalmente bloqueado.',updated_at=now() where destination in ('demo-controlplane@example.com','+5500000000000') and status in ('queued','sending');
end $$;
