'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Loader2, Mail } from 'lucide-react';
import { Input } from '@autohub360/ui';

type Status = 'idle' | 'sending' | 'success' | 'error';

export function NewsletterForm({ source = 'tech-home' }: { source?: string }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim() || status === 'sending') return;
    setStatus('sending');
    setErrorMessage(null);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source }),
      });
      if (res.ok) {
        setStatus('success');
        setEmail('');
        return;
      }
      if (res.status === 429) {
        setErrorMessage('Muitas tentativas em pouco tempo. Aguarde um minuto e tente de novo.');
      } else {
        setErrorMessage('Não foi possível cadastrar seu e-mail. Confira o endereço e tente novamente.');
      }
      setStatus('error');
    } catch {
      setErrorMessage('Falha de conexão. Verifique sua internet e tente novamente.');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div
        role="status"
        className="flex h-full flex-col justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6"
      >
        <p className="flex items-center gap-2 font-display text-base font-bold text-emerald-700">
          <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
          Inscrição confirmada!
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ink-700">
          Pronto! Você vai receber novidades, guias e lançamentos da AutoHub360 direto no seu
          e-mail. Sem spam — cancele quando quiser.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate={false} className="flex h-full flex-col justify-center">
      <p className="flex items-center gap-2 font-display text-base font-extrabold text-ink-900">
        <Mail className="h-5 w-5 text-ahblue-600" aria-hidden="true" />
        Receba novidades e guias
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-500">
        Um resumo periódico com lançamentos, dicas de produto e conteúdos do Hub — direto ao
        ponto, sem enrolação.
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          Seu melhor e-mail
        </label>
        <Input
          id="newsletter-email"
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="Seu melhor e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1"
        />
        <button
          type="submit"
          disabled={status === 'sending' || email.trim().length === 0}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-[10px] bg-ahblue-500 px-5 font-display text-sm font-bold text-white shadow-[0_4px_14px_rgb(30_111_235/0.35)] transition-colors hover:bg-ahblue-600 disabled:pointer-events-none disabled:opacity-50"
        >
          {status === 'sending' ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          )}
          {status === 'sending' ? 'Enviando...' : 'Inscrever'}
        </button>
      </div>
      {status === 'error' && errorMessage && (
        <p role="alert" className="mt-2 text-sm font-medium text-red-600">
          {errorMessage}
        </p>
      )}
      <p className="mt-3 text-xs leading-relaxed text-ink-500">
        Ao se inscrever você concorda com o tratamento do seu e-mail para envio de novidades, nos
        termos da{' '}
        <Link href="/legal/privacidade-lgpd" className="underline underline-offset-2 hover:text-ahblue-600">
          Política de Privacidade e LGPD
        </Link>
        .
      </p>
    </form>
  );
}
