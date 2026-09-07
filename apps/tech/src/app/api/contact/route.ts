import { NextResponse } from 'next/server';
import { z } from 'zod';
import { clientIp, rateLimit, getEmailAdapter } from '@autohub360/integrations';
import { supabaseServiceRole } from '@autohub360/auth/server';

export const runtime = 'nodejs';

const techContactSchema = z.object({
  department: z.enum(['contato', 'comercial', 'pro', 'parcerias']).default('contato'),
  name: z.string().min(3).max(120),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
  subject: z.string().min(3).max(150),
  message: z.string().min(10).max(2000),
  /** Bot check: form must have been open for at least 2 seconds. */
  formStartedAt: z.number().int().optional(),
});

export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  const limit = rateLimit(`tech-contact:${ip}`, 5, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: 'rate_limited' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSec ?? 60) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const parsed = techContactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'invalid_payload' }, { status: 400 });
  }

  const data = parsed.data;

  // Honeypot-style timing check — accept silently without processing.
  if (
    typeof data.formStartedAt === 'number' &&
    Date.now() - data.formStartedAt < 2000
  ) {
    return NextResponse.json({ ok: true, ticket: 'OK' });
  }

  const ticket = `TEC${Date.now().toString(36).toUpperCase()}`;
  const receivedAt = new Date().toISOString();

  // Persist when the database is configured (trusted server path).
  const db = supabaseServiceRole();
  if (db) {
    const { error } = await db.from('contact_requests').insert({
      app: 'tech',
      department: data.department,
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
      ticket,
      received_at: receivedAt,
      acknowledged_at: receivedAt,
    });
    if (error) {
      // Request is still acknowledged to the user; ops can recover via logs.
      console.error('[tech-contact] db insert failed', error.message);
    }
  }

  // Immediate acknowledgement receipt by email (noop adapter until provider is contracted).
  await getEmailAdapter().send({
    to: data.email,
    subject: `Recebemos sua mensagem — protocolo ${ticket}`,
    html: `<p>Olá, ${data.name}!</p><p>Recebemos sua mensagem enviada para a AutoHub360 (departamento: ${data.department}).</p><p>Protocolo: <strong>${ticket}</strong><br/>Data/hora: ${receivedAt}</p><p>Nossa equipe responderá em até 1 dia útil.</p>`,
  });

  return NextResponse.json({ ok: true, ticket, receivedAt });
}
