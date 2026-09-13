import { MousePointer2, UsersRound } from 'lucide-react';
import { EmptyState, MetricCard, PageHeading, Panel, StatusBadge } from '@/components/admin-ui';
import { adminDb, formatDate, formatMoney } from '@/lib/admin-data';

export const metadata = { title: 'CRM & Webtracking' };

export default async function CrmPage() {
  const db=adminDb(); if(!db) return <EmptyState text="Supabase não configurado."/>;
  const [contactsR,activitiesR,sessionsR,leadsR]=await Promise.all([
    db.from('crm_contacts').select('*').order('last_activity_at',{ascending:false}).limit(60),
    db.from('crm_activities').select('*').order('created_at',{ascending:false}).limit(40),
    db.from('web_sessions').select('*').order('last_seen_at',{ascending:false}).limit(40),
    db.from('leads').select('id,status,source,utm_source,utm_campaign,created_at'),
  ]);
  const contacts=contactsR.data??[]; const sessions=sessionsR.data??[]; const leads=leadsR.data??[];
  return <div className="space-y-6"><PageHeading title="CRM & Webtracking" description="Visão única do contacto e da origem: campanha, páginas visitadas, lead, pedidos, comunicações e pós-venda."/>
    <div className="grid gap-3 sm:grid-cols-3"><MetricCard label="Contactos" value={String(contacts.length)} icon={<UsersRound className="h-4 w-4"/>}/><MetricCard label="Sessões rastreadas" value={String(sessions.length)} detail="janela carregada" icon={<MousePointer2 className="h-4 w-4"/>} tone="violet"/><MetricCard label="Leads" value={String(leads.length)} detail={`${leads.filter((l)=>l.status==='new').length} novos`} tone="orange"/></div>
    <Panel title="Pipeline de contactos"><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-xs"><thead className="text-[10px] uppercase tracking-wide text-slate-600"><tr><th className="pb-3">Contacto</th><th>Stage</th><th>Origem</th><th>Consent.</th><th>LTV</th><th>Última atividade</th></tr></thead><tbody className="divide-y divide-white/6">{contacts.map((c)=><tr key={c.id}><td className="py-3 pr-4"><p className="font-semibold text-white">{c.full_name??'Sem nome'}</p><p className="text-slate-500">{c.email??c.phone??'—'}</p></td><td><StatusBadge value={c.lifecycle_stage}/></td><td className="text-slate-400">{c.source??'—'}</td><td className={c.consent_marketing?'text-emerald-300':'text-slate-600'}>{c.consent_marketing?'Marketing OK':'Não'}</td><td className="font-semibold text-slate-300">{formatMoney(Number(c.lifetime_value_cents??0),String(c.currency??'BRL').trim())}</td><td className="text-slate-500">{formatDate(c.last_activity_at)}</td></tr>)}</tbody></table>{contacts.length===0?<EmptyState text="Nenhum contacto CRM ainda."/>:null}</div></Panel>
    <div className="grid gap-5 xl:grid-cols-2"><Panel title="Webtracking recente" subtitle="Somente após consentimento analytics.">{sessions.length===0?<EmptyState text="Sem sessões consentidas ainda."/>:<div className="space-y-2">{sessions.slice(0,12).map((s)=><div key={s.id} className="rounded-xl border border-white/7 bg-black/15 p-3"><div className="flex items-center justify-between gap-3"><p className="truncate text-xs font-semibold text-white">{s.last_path??s.first_path??'/'}</p><span className="text-[10px] text-slate-600">{formatDate(s.last_seen_at)}</span></div><p className="mt-1 text-[11px] text-slate-500">{[s.utm_source,s.utm_medium,s.utm_campaign].filter(Boolean).join(' / ')||s.referrer||'direto'} · {s.event_count} eventos</p></div>)}</div>}</Panel><Panel title="Atividades do relacionamento">{(activitiesR.data??[]).length===0?<EmptyState text="Sem atividades."/>:<div className="space-y-2">{(activitiesR.data??[]).slice(0,12).map((a)=><div key={a.id} className="flex gap-3 rounded-xl border border-white/7 bg-black/15 p-3"><StatusBadge value={a.kind}/><div className="min-w-0"><p className="truncate text-xs font-semibold text-white">{a.subject??a.kind}</p><p className="mt-1 line-clamp-2 text-[11px] text-slate-500">{a.body??'Evento registrado'}</p></div></div>)}</div>}</Panel></div>
  </div>;
}
