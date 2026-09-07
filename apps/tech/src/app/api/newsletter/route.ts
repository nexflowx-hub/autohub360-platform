import { NextResponse } from 'next/server';
import { z } from 'zod';
import { clientIp, rateLimit } from '@autohub360/integrations';
import { supabaseServiceRole } from '@autohub360/auth/server';

export const runtime = 'nodejs';

const newsletterSchema = z.object({
  email: z.string().email(),
  source: z.string().max(60).optional(),
});

export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  const limit = rateLimit(`tech-newsletter:${ip}`, 5, 60_000);
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

  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 400 });
  }

  const db = supabaseServiceRole();
  if (db) {
    await db.from('leads').insert({
      kind: 'newsletter',
      email: parsed.data.email,
      source: parsed.data.source ?? 'tech',
      market: 'BR',
    });
  }

  return NextResponse.json({ ok: true });
}
