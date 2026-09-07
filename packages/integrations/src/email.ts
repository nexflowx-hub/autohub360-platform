/**
 * Email provider abstraction (transactional email: order confirmations,
 * contact receipts, cancellation acknowledgements).
 * Provider credentials land in EMAIL_PROVIDER/EMAIL_API_KEY when contracted.
 */

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export interface EmailAdapter {
  readonly id: string;
  send(message: EmailMessage): Promise<{ ok: boolean; ref?: string }>;
}

export class NoopEmailAdapter implements EmailAdapter {
  readonly id = 'noop';
  async send(message: EmailMessage) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.info(`[email:noop] → ${message.to} :: ${message.subject}`);
    }
    return { ok: true as const, ref: `noop_${Date.now()}` };
  }
}

export function getEmailAdapter(): EmailAdapter {
  // if (process.env.EMAIL_PROVIDER === 'resend') return new ResendAdapter(...);
  return new NoopEmailAdapter();
}
