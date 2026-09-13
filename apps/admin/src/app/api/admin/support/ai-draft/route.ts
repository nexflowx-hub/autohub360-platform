import { NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseServiceRole } from '@autohub360/auth/server';
import { generateSupportAIDraft } from '@autohub360/integrations';
import { hasAdminSession } from '@/lib/admin-session';

const schema = z.object({ caseId: z.string().uuid() });
type SupportRole = 'customer' | 'agent' | 'ai';

export async function POST(request: Request) {
  if (!(await hasAdminSession())) return NextResponse.json({ ok: false, error: 'Não autorizado.' }, { status: 401 });
  const p = schema.safeParse(await request.json().catch(() => null));
  if (!p.success) return NextResponse.json({ ok: false, error: 'Ticket inválido.' }, { status: 422 });
  const db = supabaseServiceRole();
  if (!db) return NextResponse.json({ ok: false, error: 'DB indisponível.' }, { status: 503 });
  const { data: ticket } = await db.from('support_cases').select('*').eq('id', p.data.caseId).maybeSingle();
  if (!ticket) return NextResponse.json({ ok: false, error: 'Ticket não encontrado.' }, { status: 404 });
  const { data: messages } = await db.from('support_messages').select('author_type,body,created_at').eq('case_id', ticket.id).order('created_at').limit(20);
  const lastCustomer = [...(messages ?? [])].reverse().find((m) => m.author_type === 'customer');
  if (!lastCustomer) return NextResponse.json({ ok: false, error: 'Ticket sem mensagem do cliente.' }, { status: 422 });
  let orderContext = 'não vinculado';
  if (ticket.order_id) {
    const { data: o } = await db.from('orders').select('number,status,total_cents,currency').eq('id', ticket.order_id).maybeSingle();
    if (o) orderContext = `Pedido ${o.number}; status ${o.status}; valor ${o.total_cents} ${String(o.currency).trim()}`;
  }
  const conversation = (messages ?? []).map((m) => ({
    role: (m.author_type === 'customer' ? 'customer' : m.author_type === 'ai' ? 'ai' : 'agent') as SupportRole,
    body: m.body,
  }));
  const result = await generateSupportAIDraft({ subject: ticket.subject, customerMessage: lastCustomer.body, market: ticket.market === 'EU' ? 'EU' : 'BR', orderContext, conversation });
  if (!result.ok || !result.reply) return NextResponse.json({ ok: false, error: result.error ?? 'IA indisponível.' }, { status: 503 });
  const { error } = await db.from('support_messages').insert({ case_id: ticket.id, author_type: 'ai', author_label: 'AutoHub AI Copilot', body: result.reply, visible_to_customer: false, metadata: { draft: true, model: result.model } });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  await db.from('support_cases').update({ ai_status: 'drafting', updated_at: new Date().toISOString() }).eq('id', ticket.id);
  return NextResponse.json({ ok: true });
}
