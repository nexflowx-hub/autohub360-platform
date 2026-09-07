import { NextResponse } from 'next/server';
import { contactSchema } from '@autohub360/commerce';
import { clientIp, rateLimit, getEmailAdapter } from '@autohub360/integrations';
import { supabaseServiceRole } from '@autohub360/auth/server';

export const runtime = 'nodejs';

function makeTicket(): string {
  return `REC${Date.now().toString(36).toUpperCase()}`;
}

/** POST — contact/complaint intake with immediate protocol (recibo). */
export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  const limit = rateLimit(`contact:${ip}`, 3, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: 'Muitas mensagens em sequência. Aguarde alguns minutos e tente novamente.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSec ?? 60) } },
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Requisição inválida.' }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'Dados inválidos. Revise os campos do formulário.' },
      { status: 422 },
    );
  }
  const data = parsed.data;

  const ticket = makeTicket();
  const receivedAt = new Date().toISOString();

  const db = supabaseServiceRole();
  if (db) {
    const { error } = await db.from('contact_requests').insert({
      app: 'store',
      department: data.department,
      name: data.name,
      email: data.email,
      ...(data.phone ? { phone: data.phone } : {}),
      subject: data.subject,
      message: data.message,
      ticket,
      status: 'acknowledged',
      received_at: receivedAt,
      acknowledged_at: receivedAt,
    });
    if (error) {
      console.error('[contact] insert failed:', error.message);
      return NextResponse.json(
        { ok: false, error: 'Não foi possível registrar sua mensagem agora. Tente novamente.' },
        { status: 500 },
      );
    }
  }

  // Acknowledgement e-mail (noop adapter logs while no provider is contracted).
  try {
    await getEmailAdapter().send({
      to: data.email,
      subject: `AutoHub360 — recebemos sua mensagem (${ticket})`,
      html: `<p>Olá, ${data.name}!</p><p>Registramos sua mensagem com o protocolo <strong>${ticket}</strong>. Nossa equipe responde no prazo da política de atendimento.</p>`,
      replyTo: 'suporte@autohub360.store',
    });
  } catch {
    // best-effort
  }

  return NextResponse.json({ ok: true, ticket, receivedAt });
}
