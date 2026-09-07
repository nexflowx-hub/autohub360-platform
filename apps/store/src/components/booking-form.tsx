'use client';

import { useEffect, useState } from 'react';
import { CalendarClock, CheckCircle2, Loader2, MessageCircle } from 'lucide-react';
import { Button, Card, Field, Input, Select, Textarea } from '@autohub360/ui';
import { whatsappLink } from '@autohub360/config';

import { INSTALLATION_SERVICES } from '@/lib/installation-services';

const TIMES = ['09:00', '11:00', '14:00', '16:00'] as const;

function tomorrowISO(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

function minDateISO(): string {
  return tomorrowISO();
}

export function BookingForm() {
  const [product, setProduct] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [service, setService] = useState<string>(INSTALLATION_SERVICES[0]!.id);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState<{ appointmentId: string } | null>(null);

  useEffect(() => {
    setDate(minDateISO());
  }, []);

  const selectedService = INSTALLATION_SERVICES.find((s) => s.id === service);

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (vehicle.trim().length < 2) e.vehicle = 'Informe marca, modelo e ano do veículo.';
    if (!date) e.date = 'Escolha uma data.';
    if (!time) e.time = 'Escolha um horário.';
    if (name.trim().length < 3) e.name = 'Informe seu nome.';
    if (phone.replace(/\D/g, '').length < 10) e.phone = 'Telefone com DDD, ex.: (62) 90000-0000.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;
    setPending(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(product.trim() ? { productSlug: product.trim() } : {}),
          vehicle: vehicle.trim(),
          service,
          date,
          time,
          name: name.trim(),
          phone: phone.trim(),
          ...(notes.trim() ? { notes: notes.trim() } : {}),
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        appointmentId?: string;
        error?: string;
      };
      if (res.ok && data.ok && data.appointmentId) {
        setSuccess({ appointmentId: data.appointmentId });
      } else if (res.status === 429) {
        setApiError('Muitas solicitações seguidas. Aguarde um instante e tente novamente.');
      } else {
        setApiError(data.error ?? 'Não foi possível registrar o agendamento. Tente novamente.');
      }
    } catch {
      setApiError('Falha de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setPending(false);
    }
  }

  if (success) {
    return (
      <Card className="p-6 sm:p-8">
        <div className="text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
            <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
          </span>
          <h2 className="mt-4 font-display text-xl font-extrabold text-ink-900">
            Solicitação de agendamento registrada
          </h2>
          <p className="mt-2 text-[15px] text-ink-700">
            Número do agendamento:{' '}
            <strong className="font-display text-ahblue-600">{success.appointmentId}</strong>
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-500">
            O parceiro Generoso Auto Center confirma data e horário pelo WhatsApp no próximo horário
            comercial. Fique de olho no número informado.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Button href={whatsappLink('installation')} variant="accent">
              <MessageCircle className="h-4.5 w-4.5" aria-hidden="true" />
              Adiantar pelo WhatsApp
            </Button>
            <Button
              variant="ghost-dark"
              onClick={() => {
                setSuccess(null);
                setVehicle('');
                setProduct('');
                setNotes('');
                setTime('');
              }}
            >
              Fazer outro agendamento
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-5 sm:p-6" id="form-agendamento">
      <h2 className="flex items-center gap-2 font-display text-lg font-extrabold text-ink-900">
        <CalendarClock className="h-5 w-5 text-ahorange-500" aria-hidden="true" />
        Solicitar agendamento
      </h2>
      <p className="mt-1 text-sm text-ink-500">
        Preencha os dados e o parceiro confirma a data e o horário pelo WhatsApp.
      </p>

      {apiError && (
        <div role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
          {apiError}
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-5 grid gap-4 sm:grid-cols-2" noValidate>
        <Field label="Serviço" htmlFor="bk-service" error={errors.service} className="sm:col-span-2">
          <Select
            id="bk-service"
            value={service}
            onChange={(e) => setService(e.target.value)}
          >
            {INSTALLATION_SERVICES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label} — R$ {(s.priceCents / 100).toFixed(2).replace('.', ',')} ({s.duration})
              </option>
            ))}
          </Select>
        </Field>

        <Field
          label="Veículo (marca, modelo e ano)"
          htmlFor="bk-vehicle"
          error={errors.vehicle}
        >
          <Input
            id="bk-vehicle"
            placeholder="Ex.: Toyota Corolla 2021 XEi 2.0"
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value)}
            aria-invalid={Boolean(errors.vehicle)}
          />
        </Field>

        <Field
          label="Produto (opcional)"
          htmlFor="bk-product"
          hint="Ex.: kit LED Ultra Vision H4 — se já comprou, informe o produto."
        >
          <Input
            id="bk-product"
            placeholder="Produto para instalar"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
          />
        </Field>

        <Field label="Data preferida" htmlFor="bk-date" error={errors.date}>
          <Input
            id="bk-date"
            type="date"
            min={minDateISO()}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            aria-invalid={Boolean(errors.date)}
          />
        </Field>

        <Field label="Horário preferido" htmlFor="bk-time" error={errors.time}>
          <Select id="bk-time" value={time} onChange={(e) => setTime(e.target.value)}>
            <option value="">Selecione</option>
            {TIMES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Seu nome" htmlFor="bk-name" error={errors.name}>
          <Input
            id="bk-name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={Boolean(errors.name)}
          />
        </Field>

        <Field label="Telefone / WhatsApp" htmlFor="bk-phone" error={errors.phone}>
          <Input
            id="bk-phone"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(62) 90000-0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            aria-invalid={Boolean(errors.phone)}
          />
        </Field>

        <Field label="Observações (opcional)" htmlFor="bk-notes" className="sm:col-span-2">
          <Textarea
            id="bk-notes"
            placeholder="Detalhes que ajudam a equipe a se preparar."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Field>

        <div className="flex items-center justify-between gap-3 sm:col-span-2">
          {selectedService && (
            <p className="text-sm text-ink-500">
              Valor do serviço:{' '}
              <strong className="text-ink-900">
                R$ {(selectedService.priceCents / 100).toFixed(2).replace('.', ',')}
              </strong>{' '}
              · {selectedService.duration}
            </p>
          )}
          <Button type="submit" size="lg" disabled={pending}>
            {pending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                Enviando…
              </>
            ) : (
              'Solicitar agendamento'
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
