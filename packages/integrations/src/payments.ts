/**
 * Payment abstraction — provider-agnostic adapter contract.
 * No gateway is coupled to commerce logic. Implementations to add when a PSP
 * is contracted (Stripe, XPayments, Mercado Pago, Pagar.me, Asaas...):
 * see docs/PRODUCTION_GAPS.md.
 */

export type NormalizedPaymentMethod = 'pix' | 'credit' | 'debit' | 'boleto' | 'sepa';

export type NormalizedPaymentStatus =
  | 'pending'
  | 'authorized'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'canceled';

export interface CreatePaymentInput {
  orderId: string;
  amountCents: number;
  currency: 'BRL' | 'EUR';
  method: NormalizedPaymentMethod;
  installments?: number;
  description: string;
  customer: { name: string; email: string; document?: string };
  /** Idempotency key to avoid double charges on retries. */
  idempotencyKey: string;
  returnUrl: string;
  webhookUrl: string;
}

export interface PaymentIntentResult {
  provider: string;
  providerRef: string;
  status: NormalizedPaymentStatus;
  /** Hosted checkout URL or Pix QR payload, depending on the provider. */
  redirectUrl?: string;
  pixQrCode?: string;
  pixQrCodeImage?: string;
  expiresAt?: string;
}

export interface PaymentAdapter {
  readonly id: string;
  readonly methods: NormalizedPaymentMethod[];
  readonly markets: Array<'BR' | 'EU'>;
  createPayment(input: CreatePaymentInput): Promise<PaymentIntentResult>;
  readStatus(providerRef: string): Promise<NormalizedPaymentStatus>;
  /** Verify and normalize a webhook event. Throws on invalid signature. */
  verifyWebhook(rawBody: string, signature: string | null): { event: string; providerRef: string; status: NormalizedPaymentStatus };
  requestRefund(providerRef: string, amountCents?: number): Promise<{ ok: boolean; ref?: string }>;
}

/**
 * Demo adapter used while no PSP is contracted. It never charges anyone and
 * clearly labels orders as demo. Production MUST configure a real adapter.
 */
export class DemoPaymentAdapter implements PaymentAdapter {
  readonly id = 'demo';
  readonly methods: NormalizedPaymentMethod[] = ['pix', 'credit', 'boleto'];
  readonly markets: Array<'BR' | 'EU'> = ['BR'];

  async createPayment(input: CreatePaymentInput): Promise<PaymentIntentResult> {
    return {
      provider: this.id,
      providerRef: `demo_${input.idempotencyKey}`,
      status: 'pending',
      redirectUrl: `/pedido/${input.orderId}?demo=1`,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    };
  }

  async readStatus(): Promise<NormalizedPaymentStatus> {
    return 'pending';
  }

  verifyWebhook(rawBody: string, signature: string | null) {
    if (!signature) throw new Error('demo: missing signature');
    const parsed = JSON.parse(rawBody) as { event?: string; providerRef?: string; status?: NormalizedPaymentStatus };
    return {
      event: parsed.event ?? 'unknown',
      providerRef: parsed.providerRef ?? '',
      status: parsed.status ?? 'pending',
    };
  }

  async requestRefund() {
    return { ok: false as const };
  }
}

export function getPaymentAdapter(providerEnv?: string | null): PaymentAdapter {
  // Real adapters activate when a provider is contracted:
  // if (providerEnv === 'stripe') return new StripeAdapter(process.env.PAYMENT_SECRET_KEY!);
  return new DemoPaymentAdapter();
}
