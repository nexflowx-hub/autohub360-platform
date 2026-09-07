import { NextResponse } from 'next/server';
import {
  checkoutSchema,
  demoShippingQuote,
  INSTALLATION_FEE_CENTS,
  formatBRL,
} from '@autohub360/commerce';
import {
  getProductsByIds,
} from '@autohub360/catalog/server';;
import {
  getEmailAdapter,
  getPaymentAdapter,
  clientIp,
  rateLimit,
} from '@autohub360/integrations';
import { supabaseServiceRole } from '@autohub360/auth/server';
import { STORE_URL } from '@autohub360/config';

export const runtime = 'nodejs';

const COUPON_CODE = 'AUTOHUB10';
const COUPON_MIN_SUBTOTAL_CENTS = 20000;

/** Never trust client prices: all monetary values are recomputed from the catalog here. */
export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  const limit = rateLimit(`checkout:${ip}`, 5, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: 'Muitas tentativas em sequência. Aguarde um instante e tente novamente.' },
      { status: 429 },
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Requisição inválida.' }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'Dados do pedido inválidos. Revise as informações.', issues: parsed.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })) },
      { status: 422 },
    );
  }
  const payload = parsed.data;

  // ===== Server-side totals from catalog data =====
  const products = getProductsByIds(payload.items.map((i) => i.productId));
  const byId = new Map(products.map((p) => [p.id, p]));

  let subtotalCents = 0;
  let installationCents = 0;
  for (const item of payload.items) {
    const product = byId.get(item.productId);
    if (!product) {
      return NextResponse.json(
        { ok: false, error: 'Produto indisponível no catálogo. Atualize o carrinho e tente novamente.' },
        { status: 409 },
      );
    }
    if (product.stock <= 0) {
      return NextResponse.json(
        { ok: false, error: `Produto sem estoque: ${product.title}.` },
        { status: 409 },
      );
    }
    subtotalCents += product.priceCents * item.quantity;
    if (item.installation && product.installable) {
      installationCents += INSTALLATION_FEE_CENTS * item.quantity;
    }
  }

  // Shipping — computed deterministically from CEP (demo quote until a carrier is contracted).
  let shippingCents = 0;
  let shippingOption: string | null = null;
  if (payload.delivery.method === 'nationwide') {
    const quote = demoShippingQuote(payload.delivery.cep, subtotalCents);
    if (!quote) {
      return NextResponse.json({ ok: false, error: 'CEP inválido para cálculo de frete.' }, { status: 422 });
    }
    const chosen = payload.delivery.option === 'express' ? quote.express : quote.standard;
    shippingCents = chosen.cents;
    shippingOption = payload.delivery.option;
  }

  // Coupon — same demo rule as the storefront (revalidated here).
  let discountCents = 0;
  let appliedCoupon: string | null = null;
  if (payload.couponCode && payload.couponCode.toUpperCase() === COUPON_CODE) {
    if (subtotalCents >= COUPON_MIN_SUBTOTAL_CENTS) {
      discountCents = Math.round(subtotalCents * 0.1);
      appliedCoupon = COUPON_CODE;
    }
  }

  const totalCents = Math.max(0, subtotalCents + installationCents + shippingCents - discountCents);

  // Public order id: AH + 10 digits (number is the same, unique per order).
  const orderId = `AH${Math.floor(Math.random() * 10_000_000_000)
    .toString()
    .padStart(10, '0')}`;

  // Payment intent through the adapter abstraction (demo adapter while no PSP is contracted).
  const adapter = getPaymentAdapter(process.env.PAYMENT_PROVIDER);
  let payment;
  try {
    payment = await adapter.createPayment({
      orderId,
      amountCents: totalCents,
      currency: 'BRL',
      method: payload.paymentMethod,
      description: `AutoHub360 Store — pedido ${orderId}`,
      customer: {
        name: payload.customer.name,
        email: payload.customer.email,
        ...(payload.customer.document ? { document: payload.customer.document } : {}),
      },
      idempotencyKey: orderId,
      returnUrl: `${STORE_URL}/pedido/${orderId}`,
      webhookUrl: `${STORE_URL}/api/webhooks/payments`,
    });
  } catch {
    payment = null;
  }

  const totals = {
    subtotalCents,
    installationCents,
    shippingCents,
    discountCents,
    totalCents,
  };

  // ===== Persistence (only with service role; demo response otherwise) =====
  const db = supabaseServiceRole();
  let demo = true;
  if (db) {
    const shippingAddress =
      payload.delivery.method === 'nationwide'
        ? {
            cep: payload.delivery.cep,
            street: payload.delivery.street,
            number: payload.delivery.number,
            ...(payload.delivery.complement ? { complement: payload.delivery.complement } : {}),
            district: payload.delivery.district,
            city: payload.delivery.city,
            state: payload.delivery.state,
          }
        : null;

    const { data: orderRow, error: orderError } = await db
      .from('orders')
      .insert({
        number: orderId,
        market: 'BR',
        status: 'pending_payment',
        customer_name: payload.customer.name,
        customer_email: payload.customer.email,
        customer_phone: payload.customer.phone,
        ...(payload.customer.document ? { customer_document: payload.customer.document } : {}),
        delivery_method: payload.delivery.method,
        ...(shippingAddress ? { shipping_address: shippingAddress } : {}),
        ...(shippingOption ? { shipping_option: shippingOption } : {}),
        shipping_cents: shippingCents,
        installation_cents: installationCents,
        subtotal_cents: subtotalCents,
        discount_cents: discountCents,
        total_cents: totalCents,
        currency: 'BRL',
        ...(appliedCoupon ? { coupon_code: appliedCoupon } : {}),
        ...(payload.notes ? { notes: payload.notes } : {}),
        idempotency_key: orderId,
        demo: false,
      })
      .select('id')
      .single();

    if (orderError || !orderRow) {
      // DB configured but insert failed — log and fall back to the demo response path.
      console.error('[checkout] order insert failed:', orderError?.message);
    } else {
      demo = false;
      const items = payload.items.map((item) => {
        const product = byId.get(item.productId)!;
        return {
          order_id: orderRow.id,
          title: product.title,
          sku: product.sku,
          unit_price_cents: product.priceCents,
          quantity: item.quantity,
          installation: item.installation && product.installable,
        };
      });
      const { error: itemsError } = await db.from('order_items').insert(items);
      if (itemsError) console.error('[checkout] order_items insert failed:', itemsError.message);

      if (payment) {
        const { error: paymentError } = await db.from('payments').insert({
          order_id: orderRow.id,
          provider: payment.provider,
          provider_ref: payment.providerRef,
          method: payload.paymentMethod,
          status: payment.status,
          amount_cents: totalCents,
          currency: 'BRL',
          raw_payload: payment as unknown as Record<string, unknown>,
        });
        if (paymentError) console.error('[checkout] payment insert failed:', paymentError.message);
      }
    }
  }

  // Transactional email (noop adapter logs while no provider is contracted).
  try {
    await getEmailAdapter().send({
      to: payload.customer.email,
      subject: `AutoHub360 Store — pedido ${orderId} recebido`,
      html: `<p>Olá, ${payload.customer.name}!</p><p>Recebemos seu pedido <strong>${orderId}</strong> no valor de ${formatBRL(totalCents)}.</p><p>${
        demo
          ? 'Vitrine em modo demonstração: nenhum pagamento foi cobrado.'
          : 'Você receberá a confirmação de pagamento em seguida.'
      }</p>`,
    });
  } catch {
    // e-mail is best-effort; never blocks the order response.
  }

  return NextResponse.json({
    ok: true,
    orderId,
    number: orderId,
    demo,
    totals,
    ...(payment?.redirectUrl ? { redirectUrl: payment.redirectUrl } : {}),
  });
}
