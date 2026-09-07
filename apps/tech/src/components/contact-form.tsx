'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import { Button, Field, Input, Select, Textarea } from '@autohub360/ui';

type Department = 'contato' | 'comercial' | 'pro' | 'parcerias';

const DEPARTMENTS: Array<{ value: Department; label: string }> = [
  { value: 'contato', label: 'Contato geral' },
  { value: 'comercial', label: 'Comercial' },
  { value: 'pro', label: 'AutoHub360 Pro / B2B' },
  { value: 'parcerias', label: 'Parcerias' },
];

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export function ContactForm({ initialDepartment }: { initialDepartment?: string }) {
  const validInitial = DEPARTMENTS.some((d) => d.value === initialDepartment)
    ? (initialDepartment as Department)
    : 'contato';
  const [department, setDepartment] = useState<Department>(validInitial);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [pending, setPending] = useState(false);
  const [ticket, setTicket] = useState<string | null>(null);
  const [serverError, setServerError] = useState(false);
  const formStartedAt = useRef<number>(Date.now());

  useEffect(() => {
    formStartedAt.current = Date.now();
  }, []);

  function validate(): boolean {
    const e: FormErrors = {};
    if (name.trim().length < 3) e.name = 'Informe seu nome completo.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Informe um e-mail válido.';
    if (subject.trim().length < 3) e.subject = 'Descreva o assunto em poucas palavras.';
    if (message.trim().length < 10) e.message = 'Conte um pouco mais (mínimo 10 caracteres).';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setServerError(false);
    if (!validate()) return;
    setPending(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          department,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          subject: subject.trim(),
          message: message.trim(),
          formStartedAt: formStartedAt.current,
        }),
      });
      if (res.status === 429) {
        setServerError(true);
        return;
      }
      const data = (await res.json()) as { ok?: boolean; ticket?: string };
      if (data.ok && data.ticket) {
        setTicket(data.ticket);
      } else {
        setServerError(true);
      }
    } catch {
      setServerError(true);
    } finally {
      setPending(false);
    }
  }

  if (ticket) {
    return (
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.06] p-6 text-center sm:p-8">
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" aria-hidden="true" />
        <h2 className="mt-3 font-display text-xl font-extrabold text-ink-900">
          Mensagem recebida!
        </h2>
        <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-ink-700">
          Este é o recibo imediato da sua solicitação. Guarde o protocolo:{' '}
          <strong className="font-display">{ticket}</strong>. Nossa equipe responde em até 1 dia
          útil.
        </p>
        <Button variant="ghost-dark" className="mt-4" onClick={() => setTicket(null)}>
          Enviar outra mensagem
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      {serverError && (
        <div role="alert" className="rounded-lg border border-red-500/30 bg-red-500/[0.06] px-4 py-3 text-sm text-red-700">
          Não foi possível enviar agora. Aguarde um instante e tente novamente — ou fale com a
          gente pelo WhatsApp.
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nome completo" htmlFor="ct-name" error={errors.name}>
          <Input
            id="ct-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
          />
        </Field>
        <Field label="E-mail" htmlFor="ct-email" error={errors.email}>
          <Input
            id="ct-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
          />
        </Field>
        <Field label="Telefone / WhatsApp (opcional)" htmlFor="ct-phone">
          <Input
            id="ct-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            placeholder="(62) 90000-0000"
          />
        </Field>
        <Field label="Departamento" htmlFor="ct-dept">
          <Select
            id="ct-dept"
            value={department}
            onChange={(e) => setDepartment(e.target.value as Department)}
          >
            {DEPARTMENTS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <Field label="Assunto" htmlFor="ct-subject" error={errors.subject}>
        <Input
          id="ct-subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Ex.: orçamento para frota, parceria de instalação..."
          aria-invalid={Boolean(errors.subject)}
        />
      </Field>
      <Field label="Mensagem" htmlFor="ct-message" error={errors.message}>
        <Textarea
          id="ct-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Como podemos ajudar?"
          aria-invalid={Boolean(errors.message)}
        />
      </Field>
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs leading-relaxed text-ink-500">
          Ao enviar, você concorda com o tratamento dos seus dados conforme a{' '}
          <Link href="/legal/privacidade-lgpd" className="text-ahblue-600 underline underline-offset-2">
            Política de Privacidade
          </Link>
          .
        </p>
        <Button type="submit" disabled={pending}>
          {pending ? (
            <Loader2 className="h-4.5 w-4.5 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="h-4.5 w-4.5" aria-hidden="true" />
          )}
          {pending ? 'Enviando...' : 'Enviar mensagem'}
        </Button>
      </div>
    </form>
  );
}
