import { Activity, BellRing, Bot, Boxes, PackageCheck, ShoppingBag, UsersRound } from 'lucide-react';
import { EmptyState, MetricCard, PageHeading, Panel, StatusBadge } from '@/components/admin-ui';
import { adminDb, formatDate, formatMoney } from '@/lib/admin-data';

export const metadata = { title: 'Visão geral' };

export default async function DashboardPage() {
  const db = adminDb();
  if (!db) return <Panel title="Supabase não configurado"><p className="text-sm text-amber-200">SUPABASE_SERVICE_ROLE_KEY ausente no projeto Admin.</p></Panel>;
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const [contactsR, leadsR, ordersR, shipmentsR, supportR, outboxR, sessionsR, activitiesR, sourcingR] = await Promise.all([
    db.from('crm_contacts').select('id', { count: 'exact', head: true }),
    db.from('leads').select('id', { count: 'exact', head: true }),
    db.from('orders').select('id,number,status,total_cents,currency,demo,created_at'),
    db.from('shipments').select('id,status', { count: 'exact' }),
    db.from('support_cases').select('id,status', { count: 'exact' }),
    db.from('notification_outbox').select('id,status', { count: 'exact' }),
    db.from('web_sessions').select('id', { count: 'exact', head: true }).gte('last_seen_at', since),
    db.from('crm_activities').select('id,kind,subject,body,created_at,metadata').order('created_at', { ascending: false }).limit(8),
    db.from('product_supplier_offers').select('id,direct_ship_status,active'),
  ]);
  const orders = ordersR.data ?? [];
  const paidStates = new Set(['paid','preparing','shipped','delivered']);
  const brlRevenue = orders.filter((o) => String(o.currency).trim() === 'BRL' && paidStates.has(o.status)).reduce((sum, o) => sum + (o.total_cents ?? 0), 0);
  const eurRevenue = orders.filter((o) => String(o.currency).trim() === 'EUR' && paidStates.has(o.status)).reduce((sum, o) => sum + (o.total_cents ?? 0), 0);
  const shipments = shipmentsR.data ?? [];
  const support = supportR.data ?? [];
  const outbox = outboxR.data ?? [];
  const sourcing = sourcingR.data ?? [];
  const unknownFulfillment = sourcing.filter((s) => s.direct_ship_status !== 'approved' && s.direct_ship_status !== 'validated').length;

  return <div className="space-y-6">
    <PageHeading title="Visão geral operacional" description="Jornada consolidada de aquisição, venda, fulfillment, entrega, relacionamento e automação. Dados lidos diretamente do Supabase operacional." />
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
      <MetricCard label="CRM" value={String(contactsR.count ?? 0)} detail="contactos unificados" icon={<UsersRound className="h-4 w-4" />} />
      <MetricCard label="Leads" value={String(leadsR.count ?? 0)} detail="captações registradas" icon={<Activity className="h-4 w-4" />} tone="violet" />
      <MetricCard label="Pedidos" value={String(orders.length)} detail={`${orders.filter((o)=>o.demo).length} demo`} icon={<ShoppingBag className="h-4 w-4" />} tone="orange" />
      <MetricCard label="Receita BR" value={formatMoney(brlRevenue,'BRL')} detail="estados pagos+" icon={<Boxes className="h-4 w-4" />} tone="green" />
      <MetricCard label="Receita EU" value={formatMoney(eurRevenue,'EUR')} detail="Europa preview" icon={<Boxes className="h-4 w-4" />} />
      <MetricCard label="Entregas" value={String(shipmentsR.count ?? 0)} detail={`${shipments.filter((s)=>s.status==='delivered').length} entregues`} icon={<PackageCheck className="h-4 w-4" />} />
      <MetricCard label="Outbox" value={String(outbox.filter((n)=>n.status==='queued').length)} detail={`${outbox.filter((n)=>n.status==='failed').length} falhas`} icon={<BellRing className="h-4 w-4" />} tone="violet" />
    </div>
    <div className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
      <Panel title="Jornada de conversão" subtitle="Indicadores operacionais — não substituem analytics de marketing.">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {[['Sessões 24h',sessionsR.count ?? 0],['Leads',leadsR.count ?? 0],['Pedidos',orders.length],['Expedições',shipmentsR.count ?? 0],['Pós-venda',supportR.count ?? 0]].map(([label,value],i)=><div key={String(label)} className="relative rounded-xl border border-white/8 bg-black/15 p-3"><p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{label}</p><p className="mt-2 text-xl font-black text-white">{String(value)}</p>{i<4?<span className="absolute -right-2 top-1/2 hidden text-slate-700 sm:block">→</span>:null}</div>)}
        </div>
      </Panel>
      <Panel title="Readiness & alertas" subtitle="Itens que ainda condicionam escala e produção.">
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between rounded-lg bg-white/[0.03] p-3"><span className="text-slate-400">Brasil checkout</span><StatusBadge value="live" /></div>
          <div className="flex items-center justify-between rounded-lg bg-white/[0.03] p-3"><span className="text-slate-400">Europa checkout</span><StatusBadge value="draft" /></div>
          <div className="flex items-center justify-between rounded-lg bg-white/[0.03] p-3"><span className="text-slate-400">IA WebChat / Support</span><StatusBadge value={process.env.AI_CHAT_ENABLED==='true'?'active':'draft'} /></div>
          <div className="flex items-center justify-between rounded-lg bg-white/[0.03] p-3"><span className="text-slate-400">Notificações e-mail</span><StatusBadge value={process.env.EMAIL_PROVIDER?'active':'draft'} /></div>
          <div className="flex items-center justify-between rounded-lg bg-white/[0.03] p-3"><span className="text-slate-400">Sourcing a validar</span><span className="font-bold text-amber-300">{unknownFulfillment} ofertas</span></div>
        </div>
      </Panel>
    </div>
    <Panel title="Atividade CRM recente" subtitle="Eventos gerados por lead, pedido, tracking, suporte e automação.">
      {(activitiesR.data ?? []).length === 0 ? <EmptyState text="Ainda não existem atividades CRM." /> : <div className="divide-y divide-white/6">{(activitiesR.data ?? []).map((a)=><div key={a.id} className="flex items-start gap-3 py-3"><span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-400"/><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="text-xs font-bold text-white">{a.subject ?? a.kind}</p><StatusBadge value={a.kind}/></div><p className="mt-1 line-clamp-2 text-xs text-slate-500">{a.body ?? 'Evento operacional registrado.'}</p></div><time className="shrink-0 text-[10px] text-slate-600">{formatDate(a.created_at)}</time></div>)}</div>}
    </Panel>
  </div>;
}
