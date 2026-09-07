import { CreditCard, QrCode, Barcode, Landmark, CircleSlash } from 'lucide-react';
import type { PaymentsConfig, PaymentMethodId } from '@autohub360/config';
import { cn } from '../lib/cn';

/** Payment method badges — rendered from enabled configuration only.
 *  While no PSP is contracted (preview mode), badges render dimmed with an explicit notice. */

function BadgeArt({ badge }: { badge: string }) {
  switch (badge) {
    case 'visa':
      return (
        <span className="font-display text-[13px] font-black italic tracking-tight text-[#1a1f71]">
          VISA
        </span>
      );
    case 'mastercard':
      return (
        <span className="inline-flex items-center" aria-label="Mastercard">
          <span className="h-4 w-4 rounded-full bg-[#eb001b]" />
          <span className="-ml-1.5 h-4 w-4 rounded-full bg-[#f79e1b] opacity-90" />
        </span>
      );
    case 'elo':
      return (
        <span className="font-display text-[12px] font-black tracking-tight text-black">
          <span className="text-[#ffcb05]">e</span>
          <span className="text-[#00a4e0]">l</span>
          <span className="text-[#ef4123]">o</span>
        </span>
      );
    case 'pix':
      return (
        <span className="inline-flex items-center gap-1 text-[12px] font-bold text-[#32bcad]">
          <QrCode className="h-3.5 w-3.5" aria-hidden="true" />
          Pix
        </span>
      );
    case 'amex':
      return (
        <span className="font-display text-[10px] font-black tracking-tight text-[#006fcf]">
          AMEX
        </span>
      );
    case 'boleto':
      return (
        <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-ink-700">
          <Barcode className="h-3.5 w-3.5" aria-hidden="true" />
          Boleto
        </span>
      );
    case 'sepa':
      return (
        <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-ink-700">
          <Landmark className="h-3.5 w-3.5" aria-hidden="true" />
          SEPA
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center text-[12px] text-ink-500">
          <CircleSlash className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      );
  }
}

export function PaymentMethods({
  config,
  market = 'BR',
  className,
  showNote = false,
}: {
  config: PaymentsConfig;
  market?: 'BR' | 'EU';
  className?: string;
  showNote?: boolean;
}) {
  const methods = config.enabledIds;
  const available = methods.length > 0;
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex flex-wrap items-center gap-2" aria-label="Formas de pagamento">
        {available ? (
          methods.map((id: PaymentMethodId, i) => (
            <span
              key={`${id}-${i}`}
              className={cn(
                'flex h-8 min-w-14 items-center justify-center rounded-md border border-surface-200 bg-white px-2.5',
                config.previewMode && 'opacity-60 grayscale-[35%]',
              )}
              title={
                config.previewMode
                  ? 'Prévia — habilitado apenas com provedor de pagamento ativo'
                  : undefined
              }
            >
              <BadgeArt
                badge={
                  id === 'pix' ? 'pix' : id === 'boleto' ? 'boleto' : id === 'sepa' ? 'sepa' : 'visa'
                }
              />
            </span>
          ))
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs text-ink-500">
            <CreditCard className="h-4 w-4" aria-hidden="true" />
            Formas de pagamento em definição
          </span>
        )}
      </div>
      {(config.previewMode || showNote) && (
        <p className="max-w-md text-[11px] leading-relaxed text-ink-500">
          {config.previewMode
            ? 'Vitrine em modo demonstração: os métodos aparecem como prévia e são habilitados de fato somente com o provedor de pagamento contratado.'
            : undefined}
        </p>
      )}
    </div>
  );
}
