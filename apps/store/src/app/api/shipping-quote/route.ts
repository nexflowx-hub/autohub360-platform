import { NextResponse } from 'next/server';
import { demoShippingQuote } from '@autohub360/commerce';
import { clientIp, rateLimit } from '@autohub360/integrations';

export const runtime = 'nodejs';

/** POST { cep, subtotalCents } → demo shipping options (replaced by the shipping adapter when contracted). */
export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  const limit = rateLimit(`shipping-quote:${ip}`, 30, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: 'Muitas consultas de frete. Tente novamente em instantes.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSec ?? 60) } },
    );
  }

  let body: { cep?: unknown; subtotalCents?: unknown };
  try {
    body = (await request.json()) as { cep?: unknown; subtotalCents?: unknown };
  } catch {
    return NextResponse.json({ ok: false, error: 'Requisição inválida.' }, { status: 400 });
  }

  const cep = typeof body.cep === 'string' ? body.cep : '';
  const subtotalCents = typeof body.subtotalCents === 'number' ? Math.max(0, Math.round(body.subtotalCents)) : 0;

  const quote = demoShippingQuote(cep, subtotalCents);
  if (!quote) {
    return NextResponse.json({ ok: false, error: 'CEP inválido. Informe 8 dígitos.' }, { status: 422 });
  }

  return NextResponse.json({
    ok: true,
    options: [
      { id: 'standard', label: quote.standard.label, days: quote.standard.days, cents: quote.standard.cents },
      { id: 'express', label: quote.express.label, days: quote.express.days, cents: quote.express.cents },
      { id: 'pickup', label: quote.pickup.label, days: quote.pickup.days, cents: quote.pickup.cents },
    ],
  });
}
