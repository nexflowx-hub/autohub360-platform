/** Transactional e-mail abstraction. Credentials stay server-side. */
export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  metadata?: Record<string, unknown>;
}

export interface EmailResult {
  ok: boolean;
  ref?: string;
  error?: string;
}

export interface EmailAdapter {
  readonly id: string;
  send(message: EmailMessage): Promise<EmailResult>;
}

export class NoopEmailAdapter implements EmailAdapter {
  readonly id = 'noop';
  async send(message: EmailMessage): Promise<EmailResult> {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.info(`[email:noop] → ${message.to} :: ${message.subject}`);
    }
    return { ok: false, error: 'EMAIL_PROVIDER não configurado.' };
  }
}

class WebhookEmailAdapter implements EmailAdapter {
  readonly id = 'webhook';
  constructor(
    private readonly url: string,
    private readonly secret?: string,
  ) {}

  async send(message: EmailMessage): Promise<EmailResult> {
    try {
      const response = await fetch(this.url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          ...(this.secret ? { authorization: `Bearer ${this.secret}` } : {}),
        },
        body: JSON.stringify({
          channel: 'email',
          from: process.env.EMAIL_FROM || 'AutoHub360 <no-reply@autohub360.store>',
          ...message,
        }),
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) return { ok: false, error: `Webhook e-mail HTTP ${response.status}` };
      const data = (await response.json().catch(() => ({}))) as { id?: string; ref?: string };
      return { ok: true, ref: data.id ?? data.ref ?? `webhook_${Date.now()}` };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : 'Falha no webhook de e-mail.' };
    }
  }
}

export function getEmailAdapter(): EmailAdapter {
  if (process.env.EMAIL_PROVIDER === 'webhook' && process.env.EMAIL_WEBHOOK_URL) {
    return new WebhookEmailAdapter(process.env.EMAIL_WEBHOOK_URL, process.env.EMAIL_WEBHOOK_SECRET);
  }
  return new NoopEmailAdapter();
}
