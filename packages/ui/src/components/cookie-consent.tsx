'use client';

import Link from 'next/link';
import { Cookie } from 'lucide-react';
import { useConsent } from '@autohub360/analytics';
import { Button } from './button';
import { Checkbox } from './form';

/** GDPR/LGPD-aware cookie preferences component. Non-essential trackers never
 *  load before consent; rejecting is as easy as accepting; reopen from footer. */
export function CookieConsent() {
  const { consent, open, acceptAll, rejectAll, setConsent, setOpen } = useConsent();

  // Hydration-safe: wait for persisted state.
  const ready = useConsent.persist.hasHydrated();
  if (!ready || !open) return null;

  const analytics = consent?.analytics ?? false;
  const marketing = consent?.marketing ?? false;
  const personalization = consent?.personalization ?? false;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Preferências de cookies"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-white/10 bg-navy-950/95 p-4 text-white backdrop-blur-md sm:p-5"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <p className="flex items-center gap-2 font-display text-sm font-bold">
            <Cookie className="h-4.5 w-4.5 text-ahblue-300" aria-hidden="true" />
            Cookies e privacidade
          </p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-slate-300">
            Usamos cookies necessários para o funcionamento da loja. Os demais — análise,
            marketing e personalização — só são ativados com o seu consentimento, e você pode
            alterar suas escolhas a qualquer momento no rodapé.{' '}
            <Link href="/legal/politica-de-cookies" className="text-ahblue-300 underline underline-offset-2">
              Política de Cookies
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-col gap-3 lg:w-96">
          <div className="grid grid-cols-1 gap-1.5 text-[13px] sm:grid-cols-3">
            <Checkbox id="ck-an" checked={analytics} onChange={(v) => setConsent({ analytics: v, marketing, personalization })} label="Análise" />
            <Checkbox id="ck-mk" checked={marketing} onChange={(v) => setConsent({ analytics, marketing: v, personalization })} label="Marketing" />
            <Checkbox id="ck-ps" checked={personalization} onChange={(v) => setConsent({ analytics, marketing, personalization: v })} label="Personalização" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={acceptAll}>
              Aceitar todos
            </Button>
            <Button size="sm" variant="outline-light" onClick={rejectAll}>
              Recusar opcionais
            </Button>
            <Button size="sm" variant="ghost-light" onClick={() => setConsent({ analytics, marketing, personalization })}>
              Salvar escolha
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Footer link to reopen preferences. */
export function CookiePreferencesLink() {
  const setOpen = useConsent((s) => s.setOpen);
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="transition-colors hover:text-white"
    >
      Preferências de cookies
    </button>
  );
}
