import { NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseServiceRole } from '@autohub360/auth/server';
import { clientIp, rateLimit } from '@autohub360/integrations';

export const runtime = 'nodejs';
const schema = z.object({
  kind: z.enum(['consumer','pro','b2b','whatsapp','international','price_alert']).default('consumer'),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(220),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  source: z.string().trim().max(160).optional(),
  landingPath: z.string().trim().max(700).optional(),
  market: z.enum(['BR','EU']).default('BR'),
  sessionId: z.string().trim().max(120).optional(),
  utmSource: z.string().trim().max(180).optional(),
  utmMedium: z.string().trim().max(180).optional(),
  utmCampaign: z.string().trim().max(220).optional(),
  consentMarketing: z.literal(true),
});

export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  const limit = rateLimit(`lead:${ip}`, 8, 60_000);
  if (!limit.ok) return NextResponse.json({ ok: false, error: 'Muitas solicitações em sequência.' }, { status: 429 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: 'Revise os dados e confirme o consentimento.' }, { status: 422 });
  const db = supabaseServiceRole();
  if (!db) return NextResponse.json({ ok: false, error: 'Captação temporariamente indisponível.' }, { status: 503 });
  const d = parsed.data;
  const { data: lead, error } = await db.from('leads').insert({ kind: d.kind, name: d.name, email: d.email, phone: d.phone || null, source: d.source ?? 'web', market: d.market, status: 'new', landing_path: d.landingPath ?? null, utm_source: d.utmSource ?? null, utm_medium: d.utmMedium ?? null, utm_campaign: d.utmCampaign ?? null, consent_marketing: true, last_activity_at: new Date().toISOString() }).select('id').single();
  if (error || !lead) return NextResponse.json({ ok: false, error: 'Não foi possível registrar o interesse.' }, { status: 500 });
  if (d.sessionId) {
    await db.from('web_sessions').update({ lead_id: lead.id, last_seen_at: new Date().toISOString() }).eq('session_id', d.sessionId);
    await db.from('lead_events').insert({ lead_id: lead.id, session_id: d.sessionId, event_type: 'form_submit', source: d.utmSource ?? d.source ?? 'web', path: d.landingPath ?? null, metadata: { market: d.market, form: 'offer_lead_capture', utm_source: d.utmSource, utm_medium: d.utmMedium, utm_campaign: d.utmCampaign } });
  }
  return NextResponse.json({ ok: true, leadId: lead.id });
}
