import { NextResponse } from 'next/server';
import { getPaymentAdapter } from '@autohub360/integrations';

export const runtime = 'nodejs';

/**
 * Payment webhook — NEVER trusts the payload without signature verification.
 * The active adapter decides how to verify; the demo adapter throws when the
 * signature header is absent, which maps to 400 below.
 */
export async function POST(request: Request) {
  const signature =
    request.headers.get('x-payment-signature') ??
    request.headers.get('x-signature') ??
    request.headers.get('stripe-signature') ??
    null;

  const rawBody = await request.text();
  if (!rawBody) {
    return NextResponse.json({ ok: false, error: 'Empty body.' }, { status: 400 });
  }

  try {
    const adapter = getPaymentAdapter(process.env.PAYMENT_PROVIDER);
    const event = adapter.verifyWebhook(rawBody, signature);

    // Status transitions (paid/failed/refunded) are applied to orders when a
    // real provider is contracted; the demo flow only acknowledges receipt.
    console.info(
      `[webhooks/payments] verified event=${event.event} ref=${event.providerRef} status=${event.status}`,
    );

    return NextResponse.json({ received: true });
  } catch (error) {
    console.warn(
      '[webhooks/payments] rejected unverified payload:',
      error instanceof Error ? error.message : 'unknown error',
    );
    return NextResponse.json({ ok: false, error: 'Invalid signature.' }, { status: 400 });
  }
}
