import { NextResponse } from 'next/server';
import { newsletterSchema } from '@autohub360/commerce';
import { clientIp, rateLimit } from '@autohub360/integrations';
import { supabaseServiceRole } from '@autohub360/auth/server';

export const runtime = 'nodejs';

/** POST — newsletter opt-in (consent given in the form; LGPD note in the footer). */
export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  const limit = rateLimit(`newsletter:${ip}`, 5, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: 'Muitas inscrições em sequência. Tente novamente mais tarde.' },
      { status: 429 },
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Requisição inválida.' }, { status: 400 });
  }

  const parsed = newsletterSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Informe um e-mail válido.' }, { status: 422 });
  }
  const { email, source } = parsed.data;

  const db = supabaseServiceRole();
  if (db) {
    const { error } = await db.from('leads').insert({
      kind: 'newsletter',
      email,
      ...(source ? { source } : {}),
    });
    if (error) {
      // Duplicate leads (unique constraints) or schema drift must not break the UX promise.
      console.error('[newsletter] insert skipped:', error.message);
    }
  }

  return NextResponse.json({ ok: true });
}
