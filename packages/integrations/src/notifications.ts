/** Provider-neutral notification helpers used by the operations outbox. */
export function renderTemplate(template: string, payload: Record<string, unknown>): string {
  return template.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_match, key: string) => {
    const value = key.split('.').reduce<unknown>((current, part) => {
      if (current && typeof current === 'object' && part in current) {
        return (current as Record<string, unknown>)[part];
      }
      return undefined;
    }, payload);
    return value == null ? '' : String(value);
  });
}

export interface WhatsAppMessage {
  to: string;
  text: string;
  metadata?: Record<string, unknown>;
}

export interface WhatsAppResult {
  ok: boolean;
  ref?: string;
  error?: string;
}

export interface WhatsAppAdapter {
  readonly id: string;
  send(message: WhatsAppMessage): Promise<WhatsAppResult>;
}

class NoopWhatsAppAdapter implements WhatsAppAdapter {
  readonly id = 'noop';
  async send(message: WhatsAppMessage): Promise<WhatsAppResult> {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.info(`[whatsapp:noop] → ${message.to} :: ${message.text.slice(0, 80)}`);
    }
    return { ok: false, error: 'WHATSAPP_PROVIDER não configurado.' };
  }
}

class WebhookWhatsAppAdapter implements WhatsAppAdapter {
  readonly id = 'webhook';
  constructor(
    private readonly url: string,
    private readonly secret?: string,
  ) {}

  async send(message: WhatsAppMessage): Promise<WhatsAppResult> {
    try {
      const response = await fetch(this.url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          ...(this.secret ? { authorization: `Bearer ${this.secret}` } : {}),
        },
        body: JSON.stringify({ channel: 'whatsapp', ...message }),
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) return { ok: false, error: `Webhook WhatsApp HTTP ${response.status}` };
      const data = (await response.json().catch(() => ({}))) as { id?: string; ref?: string };
      return { ok: true, ref: data.id ?? data.ref ?? `wa_${Date.now()}` };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : 'Falha no webhook WhatsApp.' };
    }
  }
}

export function getWhatsAppAdapter(): WhatsAppAdapter {
  if (process.env.WHATSAPP_PROVIDER === 'webhook' && process.env.WHATSAPP_WEBHOOK_URL) {
    return new WebhookWhatsAppAdapter(
      process.env.WHATSAPP_WEBHOOK_URL,
      process.env.WHATSAPP_WEBHOOK_SECRET,
    );
  }
  return new NoopWhatsAppAdapter();
}
