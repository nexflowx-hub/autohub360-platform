import { MousePointer2, UsersRound } from 'lucide-react';
import { EmptyState, MetricCard, PageHeading, Panel, StatusBadge } from '@/components/admin-ui';
import { formatDate, formatMoney } from '@/lib/admin-data';
import { backendAdminConfigured, backendAdminFetch } from '@/lib/backend-admin';

export const metadata = { title: 'CRM & Webtracking' };

type Contact = { id:string; full_name:string|null; email:string|null; phone:string|null; lifecycle_stage:string; source:string|null; consent_marketing:boolean; lifetime_value_cents:number; currency:string; last_activity_at:string };
type Session = { id:string; first_path:string|null; last_path:string|null; referrer:string|null; utm_source:string|null; utm_medium:string|null; utm_campaign:string|null; event_count:number; last_seen_at:string };
type Activity = { id:string; kind:string; subject:string|null; body:string|null; created_at:string };
type Lead = { id:string; status:string; source:string|null; utm_source:string|null; utm_campaign:string|null; created_at:string };
type ListResponse<T> = { success:boolean; data:T[] };

export default async function CrmPage() {
  if (!backendAdminConfigured()) return <EmptyState text="Backend AutoHub360 não configurado no Admin."/>;
  const [contactsR,activitiesR,sessionsR,leadsR]=await Promise.all([
    backendAdminFetch<ListResponse<Contact>>('/api/v1/admin/crm/contacts?limit=60'),
    backendAdminFetch<ListResponse<Activity>>('/api/v1/admin/crm/activities?limit=40'),
    backendAdminFetch<ListResponse<Session>>('/api/v1/admin/crm/sessions?limit=40'),
    backendAdminFetch<ListResponse<Lead>>('/api/v1/admin/leads?limit=100'),
  ]);
  const contacts=contactsR.data; const sessions=sessionsR.data; const leads=leadsR.data; const activities=activitiesR.data;
  return <div className="space-y-6"><PageHeading title="CRM & Webtracking" description="Visão única do contacto e da origem: campanha, páginas visitadas, lead, pedidos, comunicações e pós-venda."/>
    <div className="grid gap-3 sm:grid-cols-3"><MetricCard label="Contactos" value={String(contacts.length)} icon={<UsersRound className="h-4 w-4"/>}/><MetricCard label="Sessões rastreadas" value={String(sessions.length)} detail="janela carregada" icon={<MousePointer2 className="h-4 w-4"/>} tone="violet"/><MetricCard label="Leads" value={String(leads.length)} detail={`${leads.filter((l)=>l.status==='new').length} novos`} tone="orange"/></div>
    <Panel title="Pipeline de contactos"><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-xs"><thead className="text-[10px] uppercase tracking-wide text-slate-600"><tr><th className="pb-3">Contacto</th><th>Stage</th><th>Origem</th><th>Consent.</th><th>LTV</th><th>Última atividade</th></tr></thead><tbody className="divide-y divide-white/6">{contacts.map((c)=><tr key={c.id}><td className="py-3 pr-4"><p className="font-semibold text-white">{c.full_name??'Sem nome'}</p><p className="text-slate-500">{c.email??c.phone??'—'}</p></td><td><StatusBadge value={c.lifecycle_stage}/></td><td className="text-slate-400">{c.source??'—'}</td><td className={c.consent_marketing?'text-emerald-300':'text-slate-600'}>{c.consent_marketing?'Marketing OK':'Não'}</td><td className="font-semibold text-slate-300">{formatMoney(Number(c.lifetime_value_cents??0),String(c.currency??'BRL').trim())}</td><td className="text-slate-500">{formatDate(c.last_activity_at)}</td></tr>)}</tbody></table>{contacts.length===0?<EmptyState text="Nenhum contacto CRM ainda."/>:null}</div></Panel>
    <div className="grid gap-5 xl:grid-cols-2"><Panel title="Webtracking recente" subtitle="Somente após consentimento analytics.">{sessions.length===0?<EmptyState text="Sem sessões consentidas ainda."/>:<div className="space-y-2">{sessions.slice(0,12).map((s)=><div key={s.id} className="rounded-xl border border-white/7 bg-black/15 p-3"><div className="flex items-center justify-between gap-3"><p className="truncate text-xs font-semibold text-white">{s.last_path??s.first_path??'/'}</p><span className="text-[10px] text-slate-600">{formatDate(s.last_seen_at)}</span></div><p className="mt-1 text-[11px] text-slate-500">{[s.utm_source,s.utm_medium,s.utm_campaign].filter(Boolean).join(' / ')||s.referrer||'direto'} · {s.event_count} eventos</p></div>)}</div>}</Panel><Panel title="Atividades do relacionamento">{activities.length===0?<EmptyState text="Sem atividades."/>:<div className="space-y-2">{activities.slice(0,12).map((a)=><div key={a.id} className="flex gap-3 rounded-xl border border-white/7 bg-black/15 p-3"><StatusBadge value={a.kind}/><div className="min-w-0"><p className="truncate text-xs font-semibold text-white">{a.subject??a.kind}</p><p className="mt-1 line-clamp-2 text-[11px] text-slate-500">{a.body??'Evento registrado'}</p></div></div>)}</div>}</Panel></div>
  </div>;
}
