'use client';

import { useEffect, useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { whatsappLink, type WhatsAppContext } from '@autohub360/config';
import { track } from '@autohub360/analytics';
import { cn } from '../lib/cn';

export interface WhatsAppEntry {
  context: WhatsAppContext;
  label: string;
  description?: string;
}

const DEFAULT_ENTRIES: WhatsAppEntry[] = [
  { context: 'general', label: 'Atendimento geral' },
  { context: 'product', label: 'Consulta de produto' },
  { context: 'fitment', label: 'Compatibilidade' },
  { context: 'installation', label: 'Agendar instalação' },
  { context: 'order', label: 'Suporte a pedido' },
  { context: 'pro', label: 'B2B / Pro' },
];

/**
 * Contextual WhatsApp entry point (goes beyond a floating button):
 * opens a small menu with contextual pre-filled messages.
 */
export function WhatsAppLauncher({
  entries = DEFAULT_ENTRIES,
  dark = false,
  className,
}: {
  entries?: WhatsAppEntry[];
  dark?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className={cn('fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3', className)}>
      {open && (
        <div
          role="dialog"
          aria-label="Falar no WhatsApp"
          className="w-72 overflow-hidden rounded-xl border border-surface-200 bg-white shadow-[var(--ah-shadow-float)]"
        >
          <div className="bg-navy-900 px-4 py-3">
            <p className="font-display text-sm font-bold text-white">Fale com a AutoHub360</p>
            <p className="text-xs text-slate-400">+55 (62) 99190-3462</p>
          </div>
          <ul className="max-h-72 overflow-y-auto p-1.5">
            {entries.map((e) => (
              <li key={e.context}>
                <a
                  href={whatsappLink(e.context)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track('whatsapp_click', { context: e.context })}
                  className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-surface-100"
                >
                  <span className="block text-sm font-semibold text-ink-900">{e.label}</span>
                  {e.description && (
                    <span className="block text-xs text-ink-500">{e.description}</span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? 'Fechar menu WhatsApp' : 'Abrir opções de WhatsApp'}
        className={cn(
          'flex h-14 w-14 items-center justify-center rounded-full shadow-[var(--ah-shadow-float)] transition-transform hover:scale-105 active:scale-95',
          dark || open ? 'bg-navy-800 text-white' : 'bg-[#25d366] text-white',
        )}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-7 w-7" />}
      </button>
    </div>
  );
}
