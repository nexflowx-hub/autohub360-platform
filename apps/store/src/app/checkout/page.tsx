'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  CreditCard,
  Loader2,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  Store,
  Wrench,
} from 'lucide-react';
import {
  Button,
  Card,
  Checkbox,
  Container,
  Field,
  Input,
  PaymentMethods,
  Select,
} from '@autohub360/ui';
import { INSTALLATION_FEE_CENTS, formatBRL, useCart } from '@autohub360/commerce';
import { paymentsConfig } from '@autohub360/config';
import { checkoutSchema } from '@autohub360/commerce';
import { track } from '@autohub360/analytics';
import {
  couponDiscountCents,
  readStoredCoupon,
  readStoredShipping,
  writeStoredShipping,
  type ShippingOption,
} from '@/lib/coupon';

type DeliveryMethod = 'nationwide' | 'pickup' | 'pickup_installation';
type PaymentMethodId = 'pix' | 'credit' | 'boleto';

interface Slot {
  id: string;
  date: string;
  time: string;
}

const STEPS = [
  { n: 1, label: 'Identificação' },
  { n: 2, label: 'Entrega' },
  { n: 3, label: 'Pagamento' },
  { n: 4, label: 'Revisão' },
] as const;

function maskPhone(v: string): string {
  const d = v.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function maskCep(v: string): string {
  const d = v.replace(/\D/g, '').slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

function maskCpf(v: string): string {
  const d = v.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

export default function CheckoutPage() {
  const router = useRouter();
  const lines = useCart((s) => s.lines);
  const clear = useCart((s) => s.clear);

  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);

  // Identificação
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [document_, setDocument_] = useState('');

  // Entrega
  const [method, setMethod] = useState<DeliveryMethod>('nationwide');
  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [shipOption, setShipOption] = useState<ShippingOption | null>(null);
  const [shipOptions, setShipOptions] = useState<ShippingOption[]>([]);
  const [quoting, setQuoting] = useState(false);
  const [vehicle, setVehicle] = useState('');
  const [serviceNotes, setServiceNotes] = useState('');
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotId, setSlotId] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Pagamento
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>('pix');

  // Revisão
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const payCfg = useMemo(() => paymentsConfig({}), []);

  async function loadSlots() {
    if (slots.length > 0 || loadingSlots) return;
    setLoadingSlots(true);
    try {
      const res = await fetch('/api/appointments?service=instalacao-geral');
      const data = (await res.json()) as { ok?: boolean; slots?: Slot[] };
      if (data.ok && data.slots) setSlots(data.slots);
    } catch {
      // slots remain empty; UI shows fallback
    } finally {
      setLoadingSlots(false);
    }
  }

  useEffect(() => {
    if (method === 'pickup_installation') void loadSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [method]);

  useEffect(() => {
    setMounted(true);
    // Prefill from the cart page when available.
    const storedShipping = readStoredShipping();
    if (storedShipping) {
      setCep(maskCep(storedShipping.cep));
      setShipOption(storedShipping.option);
    }
  }, []);

  const subtotalCents = lines.reduce((s, l) => s + l.unitPriceCents * l.quantity, 0);
  const installationCents = lines.reduce(
    (s, l) => (l.installation ? s + INSTALLATION_FEE_CENTS * l.quantity : s),
    0,
  );
  const couponApplied = Boolean(readStoredCoupon());
  const discountCents = couponDiscountCents(subtotalCents, couponApplied);
  const shippingCents =
    method === 'pickup' || method === 'pickup_installation' ? 0 : (shipOption?.cents ?? 0);
  const totalCents = Math.max(
    0,
    subtotalCents + installationCents + shippingCents - discountCents,
  );

  async function quoteShipping() {
    const digits = cep.replace(/\D/g, '');
    if (digits.length !== 8) {
      setFieldErrors((f) => ({ ...f, cep: 'Informe um CEP válido com 8 dígitos.' }));
      return;
    }
    setQuoting(true);
    try {
      const res = await fetch('/api/shipping-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cep: digits, subtotalCents }),
      });
      const data = (await res.json()) as { ok?: boolean; options?: ShippingOption[] };
      if (data.ok && data.options) {
        const relevant = data.options.filter((o) => o.id !== 'pickup');
        setShipOptions(relevant);
        setShipOption((cur) => relevant.find((o) => o.id === cur?.id) ?? relevant[0] ?? null);
        writeStoredShipping({
          cep: digits,
          option: relevant[0] ?? { id: 'standard', label: 'Entrega padrão', days: 7, cents: 0 },
        });
      }
    } catch {
      setFieldErrors((f) => ({ ...f, cep: 'Falha ao calcular o frete. Tente novamente.' }));
    } finally {
      setQuoting(false);
    }
  }


  function goToStep(next: number) {
    setApiError('');
    setFieldErrors({});
    setStep(next);
    if (next > 1) {
      track('begin_checkout', { step: next, value: totalCents / 100, currency: 'BRL' });
    }
  }

  function validateStep1(): boolean {
    const errors: Record<string, string> = {};
    if (name.trim().length < 3) errors.name = 'Informe seu nome completo.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.email = 'Informe um e-mail válido.';
    if (phone.replace(/\D/g, '').length < 10) errors.phone = 'Informe um telefone com DDD.';
    const cpf = document_.replace(/\D/g, '');
    if (cpf && cpf.length !== 11) errors.document = 'CPF deve ter 11 dígitos (ou deixe em branco).';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function validateStep2(): boolean {
    const errors: Record<string, string> = {};
    if (method === 'nationwide') {
      if (cep.replace(/\D/g, '').length !== 8) errors.cep = 'CEP inválido.';
      if (street.trim().length < 3) errors.street = 'Informe o endereço.';
      if (!number.trim()) errors.number = 'Obrigatório.';
      if (district.trim().length < 2) errors.district = 'Informe o bairro.';
      if (city.trim().length < 2) errors.city = 'Informe a cidade.';
      if (state.trim().length !== 2) errors.state = 'UF com 2 letras.';
      if (!shipOption) errors.shipOption = 'Escolha uma opção de entrega.';
    }
    if (method === 'pickup_installation') {
      if (vehicle.trim().length < 2) errors.vehicle = 'Informe o veículo para a instalação.';
      if (!slotId) errors.slotId = 'Escolha uma data e horário disponíveis.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function nextFrom1() {
    if (validateStep1()) goToStep(2);
  }

  function nextFrom2() {
    if (!validateStep2()) return;
    if (method === 'nationwide' && shipOption) {
      track('select_delivery_method', { method: `nationwide_${shipOption.id}` });
    } else if (method === 'pickup') {
      track('select_delivery_method', { method: 'pickup' });
    } else {
      track('select_delivery_method', { method: 'pickup_installation' });
      track('select_installation', { method: 'pickup_installation' });
    }
    goToStep(3);
  }

  async function onSubmit() {
    setApiError('');
    if (!acceptedTerms) {
      setFieldErrors({ terms: 'É necessário aceitar os Termos de Venda para concluir.' });
      return;
    }

    const delivery =
      method === 'nationwide'
        ? {
            method: 'nationwide' as const,
            cep: cep.replace(/\D/g, ''),
            street: street.trim(),
            number: number.trim(),
            ...(complement.trim() ? { complement: complement.trim() } : {}),
            district: district.trim(),
            city: city.trim(),
            state: state.trim().toUpperCase(),
            option: shipOption?.id === 'express' ? ('express' as const) : ('standard' as const),
          }
        : method === 'pickup'
          ? { method: 'pickup' as const }
          : {
              method: 'pickup_installation' as const,
              slotId,
              vehicle: vehicle.trim(),
              ...(serviceNotes.trim() ? { serviceNotes: serviceNotes.trim() } : {}),
            };

    const payload = {
      market: 'BR' as const,
      customer: {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        ...(document_.trim() ? { document: document_.trim() } : {}),
      },
      delivery,
      items: lines.map((l) => ({
        productId: l.productId,
        quantity: l.quantity,
        installation: l.installation,
      })),
      paymentMethod,
      ...(couponApplied ? { couponCode: 'AUTOHUB10' } : {}),
    };

    // Client-side validation for UX — the server validates again with the same schema.
    const parsed = checkoutSchema.safeParse(payload);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        errors[issue.path.join('.') || 'form'] = issue.message;
      }
      setFieldErrors(errors);
      setApiError('Revise os campos destacados para continuar.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        orderId?: string;
        error?: string;
      };
      if (res.ok && data.ok && data.orderId) {
        track('purchase', { order_id: data.orderId, value: totalCents / 100, currency: 'BRL' });
        clear();
        writeStoredShipping(null);
        router.push(`/pedido/${data.orderId}?novo=1`);
      } else {
        setApiError(data.error ?? 'Não foi possível concluir o pedido. Tente novamente.');
      }
    } catch {
      setApiError('Falha de conexão com o servidor. Verifique sua internet e tente novamente.');
    } finally {
      setSubmitting(false);
    }
  }

  if (!mounted) {
    return (
      <Container className="flex min-h-[40vh] items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-ahblue-500" aria-label="Carregando checkout" />
      </Container>
    );
  }

  if (lines.length === 0) {
    return (
      <Container className="flex min-h-[50vh] items-center justify-center py-16">
        <div className="w-full max-w-md rounded-xl border border-surface-200 bg-white p-8 text-center shadow-[var(--ah-shadow-card)]">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-surface-100 text-ink-500">
            <ShoppingBag className="h-7 w-7" aria-hidden="true" />
          </span>
          <h1 className="mt-4 font-display text-xl font-extrabold text-ink-900">
            Nenhum item para finalizar
          </h1>
          <p className="mt-2 text-[15px] text-ink-500">
            Adicione produtos ao carrinho para iniciar o checkout.
          </p>
          <Button href="/" size="lg" className="mt-6 w-full">
            Voltar à loja
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-6 sm:py-10">
      <h1 className="font-display text-3xl font-extrabold text-ink-900">Checkout</h1>
      <p className="mt-1 text-[15px] text-ink-500">
        Finalize sua compra em 4 passos simples e seguros.
      </p>

      {/* Progress indicator */}
      <ol className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-3" aria-label="Etapas do checkout">
        {STEPS.map((s, i) => {
          const state = step === s.n ? 'current' : step > s.n ? 'done' : 'upcoming';
          return (
            <li key={s.n} className="flex items-center gap-2">
              {i > 0 && (
                <span className="mx-1 h-px w-6 bg-surface-300 sm:w-10" aria-hidden="true" />
              )}
              <span
                aria-current={state === 'current' ? 'step' : undefined}
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                  state === 'current'
                    ? 'bg-ahblue-500 text-white'
                    : state === 'done'
                      ? 'bg-emerald-500/15 text-emerald-600'
                      : 'bg-surface-100 text-ink-500'
                }`}
              >
                {state === 'done' ? <CheckCircle2 className="h-4.5 w-4.5" aria-hidden="true" /> : s.n}
              </span>
              <span
                className={`text-sm font-semibold ${
                  state === 'current' ? 'text-ink-900' : 'text-ink-500'
                }`}
              >
                {s.label}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.6fr] lg:gap-8">
        <div className="flex flex-col gap-4">
          {apiError && (
            <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-hidden="true" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-700">{apiError}</p>
                <Button variant="ghost-dark" size="sm" className="mt-2" onClick={onSubmit}>
                  Tentar novamente
                </Button>
              </div>
            </div>
          )}

          {/* ============ STEP 1 — Identificação ============ */}
          {step === 1 && (
            <Card className="p-5 sm:p-6">
              <h2 className="font-display text-lg font-extrabold text-ink-900">
                1. Identificação
              </h2>
              <p className="mt-1 text-sm text-ink-500">
                Usamos seus dados apenas para processar o pedido e a entrega.
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Nome completo" htmlFor="co-name" error={fieldErrors.name}>
                  <Input
                    id="co-name"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    aria-invalid={Boolean(fieldErrors.name)}
                  />
                </Field>
                <Field label="E-mail" htmlFor="co-email" error={fieldErrors.email}>
                  <Input
                    id="co-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={Boolean(fieldErrors.email)}
                  />
                </Field>
                <Field label="Telefone / WhatsApp" htmlFor="co-phone" error={fieldErrors.phone}>
                  <Input
                    id="co-phone"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="(62) 90000-0000"
                    value={phone}
                    onChange={(e) => setPhone(maskPhone(e.target.value))}
                    aria-invalid={Boolean(fieldErrors.phone)}
                  />
                </Field>
                <Field
                  label="CPF (opcional)"
                  htmlFor="co-doc"
                  error={fieldErrors.document}
                  hint="Necessário apenas para nota fiscal com CNPJ/CPF específico."
                >
                  <Input
                    id="co-doc"
                    inputMode="numeric"
                    placeholder="000.000.000-00"
                    value={document_}
                    onChange={(e) => setDocument_(maskCpf(e.target.value))}
                    aria-invalid={Boolean(fieldErrors.document)}
                  />
                </Field>
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={nextFrom1} size="lg">
                  Continuar para entrega
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Button>
              </div>
            </Card>
          )}

          {/* ============ STEP 2 — Entrega ============ */}
          {step === 2 && (
            <Card className="p-5 sm:p-6">
              <h2 className="font-display text-lg font-extrabold text-ink-900">2. Entrega</h2>
              <p className="mt-1 text-sm text-ink-500">Como você prefere receber seu pedido?</p>

              <div className="mt-5 flex flex-col gap-3" role="radiogroup" aria-label="Método de entrega">
                {(
                  [
                    {
                      id: 'nationwide' as const,
                      icon: MapPin,
                      title: 'Entrega nacional',
                      desc: 'Envio para todo o Brasil com rastreamento',
                    },
                    {
                      id: 'pickup' as const,
                      icon: Store,
                      title: 'Retirada em Anápolis',
                      desc: 'Retire sem custo de frete em Anápolis - GO (horário combinado por WhatsApp)',
                    },
                    {
                      id: 'pickup_installation' as const,
                      icon: Wrench,
                      title: 'Retirada + instalação',
                      desc: 'Instalação com nosso parceiro oficial Generoso Auto Center em Anápolis',
                    },
                  ]
                ).map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-colors ${
                      method === opt.id
                        ? 'border-ahblue-500 bg-ahblue-500/[0.05]'
                        : 'border-surface-200 hover:border-ahblue-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery-method"
                      value={opt.id}
                      checked={method === opt.id}
                      onChange={() => setMethod(opt.id)}
                      className="mt-1 h-4.5 w-4.5 accent-ahblue-500"
                    />
                    <opt.icon
                      className={`mt-0.5 h-5 w-5 shrink-0 ${method === opt.id ? 'text-ahblue-500' : 'text-ink-500'}`}
                      aria-hidden="true"
                    />
                    <span>
                      <span className="block font-display font-bold text-ink-900">{opt.title}</span>
                      <span className="mt-0.5 block text-sm text-ink-500">{opt.desc}</span>
                    </span>
                  </label>
                ))}
              </div>

              {method === 'nationwide' && (
                <div className="mt-6 border-t border-surface-100 pt-5">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Field label="CEP" htmlFor="co-cep" error={fieldErrors.cep}>
                      <div className="flex gap-2">
                        <Input
                          id="co-cep"
                          inputMode="numeric"
                          autoComplete="postal-code"
                          placeholder="00000-000"
                          value={cep}
                          onChange={(e) => setCep(maskCep(e.target.value))}
                          aria-invalid={Boolean(fieldErrors.cep)}
                        />
                      </div>
                    </Field>
                    <div className="flex items-end">
                      <Button
                        variant="ghost-dark"
                        size="sm"
                        className="h-11"
                        onClick={quoteShipping}
                        disabled={quoting}
                      >
                        {quoting ? (
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        ) : null}
                        Calcular frete
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-4 sm:grid-cols-6">
                    <Field label="Endereço" htmlFor="co-street" error={fieldErrors.street} className="sm:col-span-4">
                      <Input
                        id="co-street"
                        autoComplete="address-line1"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        aria-invalid={Boolean(fieldErrors.street)}
                      />
                    </Field>
                    <Field label="Número" htmlFor="co-number" error={fieldErrors.number} className="sm:col-span-2">
                      <Input
                        id="co-number"
                        inputMode="numeric"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        aria-invalid={Boolean(fieldErrors.number)}
                      />
                    </Field>
                    <Field label="Complemento (opcional)" htmlFor="co-complement" className="sm:col-span-3">
                      <Input
                        id="co-complement"
                        value={complement}
                        onChange={(e) => setComplement(e.target.value)}
                      />
                    </Field>
                    <Field label="Bairro" htmlFor="co-district" error={fieldErrors.district} className="sm:col-span-3">
                      <Input
                        id="co-district"
                        autoComplete="address-level3"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        aria-invalid={Boolean(fieldErrors.district)}
                      />
                    </Field>
                    <Field label="Cidade" htmlFor="co-city" error={fieldErrors.city} className="sm:col-span-4">
                      <Input
                        id="co-city"
                        autoComplete="address-level2"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        aria-invalid={Boolean(fieldErrors.city)}
                      />
                    </Field>
                    <Field label="UF" htmlFor="co-state" error={fieldErrors.state} className="sm:col-span-2">
                      <Input
                        id="co-state"
                        autoComplete="address-level1"
                        maxLength={2}
                        placeholder="GO"
                        value={state}
                        onChange={(e) => setState(e.target.value.toUpperCase())}
                        aria-invalid={Boolean(fieldErrors.state)}
                      />
                    </Field>
                  </div>

                  {shipOptions.length > 0 && (
                    <fieldset className="mt-5">
                      <legend className="text-sm font-bold text-ink-900">Opção de envio</legend>
                      <div className="mt-2.5 flex flex-col gap-2">
                        {shipOptions.map((o) => (
                          <label
                            key={o.id}
                            className={`flex cursor-pointer items-center justify-between gap-2 rounded-lg border px-3.5 py-2.5 text-sm transition-colors ${
                              shipOption?.id === o.id
                                ? 'border-ahblue-500 bg-ahblue-500/[0.06]'
                                : 'border-surface-200 hover:border-ahblue-400'
                            }`}
                          >
                            <span className="flex items-center gap-2.5">
                              <input
                                type="radio"
                                name="ship-option"
                                checked={shipOption?.id === o.id}
                                onChange={() => {
                                  setShipOption(o);
                                  writeStoredShipping({
                                    cep: cep.replace(/\D/g, ''),
                                    option: o,
                                  });
                                }}
                                className="h-4 w-4 accent-ahblue-500"
                              />
                              <span>
                                <span className="block font-semibold text-ink-900">{o.label}</span>
                                <span className="block text-xs text-ink-500">
                                  até {o.days} {o.days === 1 ? 'dia útil' : 'dias úteis'}
                                </span>
                              </span>
                            </span>
                            <span className="font-semibold text-ink-900">
                              {o.cents === 0 ? 'Grátis' : formatBRL(o.cents)}
                            </span>
                          </label>
                        ))}
                      </div>
                      {fieldErrors.shipOption && (
                        <p role="alert" className="mt-1.5 text-xs font-medium text-red-600">
                          {fieldErrors.shipOption}
                        </p>
                      )}
                    </fieldset>
                  )}
                </div>
              )}

              {method === 'pickup' && (
                <div className="mt-6 rounded-xl bg-surface-50 p-4 text-sm leading-relaxed text-ink-700">
                  <p className="font-semibold text-ink-900">Retirada em Anápolis - GO</p>
                  <p className="mt-1.5">
                    Após a confirmação do pagamento, nossa equipe entra em contato por WhatsApp para
                    combinar o melhor horário de retirada. Traga um documento com foto e o número do
                    pedido. O endereço fiscal da empresa em Goiânia{' '}
                    <strong>não é ponto de retirada</strong>.
                  </p>
                </div>
              )}

              {method === 'pickup_installation' && (
                <div className="mt-6 border-t border-surface-100 pt-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Veículo (marca, modelo e ano)"
                      htmlFor="co-vehicle"
                      error={fieldErrors.vehicle}
                      hint="Ex.: Honda Civic 2022 Touring 1.5 Turbo"
                    >
                      <Input
                        id="co-vehicle"
                        value={vehicle}
                        onChange={(e) => setVehicle(e.target.value)}
                        aria-invalid={Boolean(fieldErrors.vehicle)}
                      />
                    </Field>
                    <Field
                      label="Observações (opcional)"
                      htmlFor="co-notes"
                      hint="Ex.: preciso de risco no para-choque antes da instalação."
                    >
                      <Input
                        id="co-notes"
                        value={serviceNotes}
                        onChange={(e) => setServiceNotes(e.target.value)}
                      />
                    </Field>
                  </div>
                  <p className="mt-4 flex items-center gap-1.5 text-sm font-bold text-ink-900">
                    <CalendarClock className="h-4 w-4 text-ahorange-500" aria-hidden="true" />
                    Horários disponíveis (agenda demonstrativa)
                  </p>
                  {loadingSlots ? (
                    <p className="mt-2 flex items-center gap-2 text-sm text-ink-500">
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      Carregando horários…
                    </p>
                  ) : slots.length === 0 ? (
                    <p className="mt-2 text-sm text-ink-500">
                      Não foi possível carregar os horários agora — a data final será confirmada por
                      WhatsApp.
                    </p>
                  ) : (
                    <div className="mt-2.5">
                      <Field label="Data e horário" htmlFor="co-slot" error={fieldErrors.slotId}>
                        <Select
                          id="co-slot"
                          value={slotId}
                          onChange={(e) => setSlotId(e.target.value)}
                          aria-invalid={Boolean(fieldErrors.slotId)}
                        >
                          <option value="">Selecione um horário</option>
                          {slots.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.date} às {s.time}
                            </option>
                          ))}
                        </Select>
                      </Field>
                      <p className="mt-2 text-xs text-ink-500">
                        O agendamento é prévio e confirmado pelo parceiro pelo WhatsApp após o
                        pedido.
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-6 flex flex-wrap justify-between gap-3">
                <Button variant="ghost-dark" onClick={() => goToStep(1)}>
                  <ArrowLeft className="h-4.5 w-4.5" aria-hidden="true" />
                  Voltar
                </Button>
                <Button onClick={nextFrom2} size="lg">
                  Continuar para pagamento
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Button>
              </div>
            </Card>
          )}

          {/* ============ STEP 3 — Pagamento ============ */}
          {step === 3 && (
            <Card className="p-5 sm:p-6">
              <h2 className="font-display text-lg font-extrabold text-ink-900">3. Pagamento</h2>
              <p className="mt-1 text-sm text-ink-500">
                Escolha a forma de pagamento do pedido {formatBRL(totalCents)}.
              </p>

              <div className="mt-5 flex flex-col gap-3" role="radiogroup" aria-label="Forma de pagamento">
                {(
                  [
                    { id: 'pix' as const, label: 'Pix', desc: 'Aprovação imediata após o pagamento' },
                    {
                      id: 'credit' as const,
                      label: 'Cartão de crédito',
                      desc: 'Parcelamento conforme o provedor ativo no checkout',
                    },
                    { id: 'boleto' as const, label: 'Boleto bancário', desc: 'Prazo de até 3 dias úteis para baixa' },
                  ]
                ).map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-colors ${
                      paymentMethod === opt.id
                        ? 'border-ahblue-500 bg-ahblue-500/[0.05]'
                        : 'border-surface-200 hover:border-ahblue-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment-method"
                      value={opt.id}
                      checked={paymentMethod === opt.id}
                      onChange={() => setPaymentMethod(opt.id)}
                      className="h-4.5 w-4.5 accent-ahblue-500"
                    />
                    <CreditCard
                      className={`h-5 w-5 shrink-0 ${paymentMethod === opt.id ? 'text-ahblue-500' : 'text-ink-500'}`}
                      aria-hidden="true"
                    />
                    <span>
                      <span className="block font-display font-bold text-ink-900">{opt.label}</span>
                      <span className="mt-0.5 block text-sm text-ink-500">{opt.desc}</span>
                    </span>
                  </label>
                ))}
              </div>

              <div className="mt-5 rounded-xl bg-surface-50 p-4">
                <PaymentMethods config={payCfg} market="BR" showNote />
              </div>

              <div className="mt-4 flex items-start gap-2 text-sm text-ink-700">
                <ShieldCheck className="mt-0.5 h-4.5 w-4.5 shrink-0 text-emerald-500" aria-hidden="true" />
                <p>
                  Não coletamos nem armazenamos dados completos de cartão. Todo o pagamento é
                  processado pelo provedor certificado.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap justify-between gap-3">
                <Button variant="ghost-dark" onClick={() => goToStep(2)}>
                  <ArrowLeft className="h-4.5 w-4.5" aria-hidden="true" />
                  Voltar
                </Button>
                <Button onClick={() => goToStep(4)} size="lg">
                  Revisar pedido
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Button>
              </div>
            </Card>
          )}

          {/* ============ STEP 4 — Revisão ============ */}
          {step === 4 && (
            <Card className="p-5 sm:p-6">
              <h2 className="font-display text-lg font-extrabold text-ink-900">4. Revisão</h2>
              <p className="mt-1 text-sm text-ink-500">
                Confirme os dados antes de concluir o pedido.
              </p>

              <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-surface-50 p-4">
                  <dt className="text-xs font-bold uppercase tracking-wide text-ink-500">Cliente</dt>
                  <dd className="mt-1.5 space-y-0.5 text-sm text-ink-900">
                    <p className="font-semibold">{name}</p>
                    <p>{email}</p>
                    <p>{phone}</p>
                    {document_ && <p>CPF {document_}</p>}
                  </dd>
                </div>
                <div className="rounded-lg bg-surface-50 p-4">
                  <dt className="text-xs font-bold uppercase tracking-wide text-ink-500">Entrega</dt>
                  <dd className="mt-1.5 space-y-0.5 text-sm text-ink-900">
                    {method === 'nationwide' && (
                      <>
                        <p className="font-semibold">Entrega nacional — {shipOption?.label ?? 'padrão'}</p>
                        <p>
                          {street}, {number}
                          {complement ? ` — ${complement}` : ''}
                        </p>
                        <p>
                          {district}, {city} - {state}
                        </p>
                        <p>CEP {cep}</p>
                      </>
                    )}
                    {method === 'pickup' && (
                      <p>
                        <span className="font-semibold">Retirada em Anápolis - GO</span>
                        <br />
                        Horário combinado por WhatsApp após a confirmação.
                      </p>
                    )}
                    {method === 'pickup_installation' && (
                      <p>
                        <span className="font-semibold">Retirada + instalação em Anápolis</span>
                        <br />
                        Veículo: {vehicle}
                        <br />
                        Horário pré-agendado: {slots.find((s) => s.id === slotId)?.date} às{' '}
                        {slots.find((s) => s.id === slotId)?.time}
                      </p>
                    )}
                  </dd>
                </div>
              </dl>

              <div className="mt-4 overflow-hidden rounded-lg border border-surface-200">
                {lines.map((l) => (
                  <div
                    key={l.productId}
                    className="flex items-center justify-between gap-3 border-b border-surface-100 px-4 py-3 text-sm last:border-b-0"
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-ink-900">{l.title}</span>
                      <span className="text-xs text-ink-500">
                        {l.quantity} × {formatBRL(l.unitPriceCents)}
                        {l.installation ? ` · instalação ${formatBRL(INSTALLATION_FEE_CENTS)}/un` : ''}
                      </span>
                    </span>
                    <span className="shrink-0 font-semibold text-ink-900">
                      {formatBRL(l.unitPriceCents * l.quantity + (l.installation ? INSTALLATION_FEE_CENTS * l.quantity : 0))}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5">
                <Checkbox
                  id="co-terms"
                  checked={acceptedTerms}
                  onChange={(v) => setAcceptedTerms(v)}
                  label={
                    <span>
                      Li e concordo com os{' '}
                      <Link
                        href="/legal/termos-e-condicoes-de-venda"
                        className="font-semibold text-ahblue-600 underline underline-offset-2"
                      >
                        Termos de Venda
                      </Link>{' '}
                      e com a{' '}
                      <Link
                        href="/legal/privacidade-lgpd"
                        className="font-semibold text-ahblue-600 underline underline-offset-2"
                      >
                        Política de Privacidade
                      </Link>
                      .
                    </span>
                  }
                />
                {fieldErrors.terms && (
                  <p role="alert" className="mt-1.5 text-xs font-medium text-red-600">
                    {fieldErrors.terms}
                  </p>
                )}
              </div>

              <div className="mt-6 flex flex-wrap justify-between gap-3">
                <Button variant="ghost-dark" onClick={() => goToStep(3)} disabled={submitting}>
                  <ArrowLeft className="h-4.5 w-4.5" aria-hidden="true" />
                  Voltar
                </Button>
                <Button onClick={onSubmit} size="lg" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                      Processando…
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                      Confirmar pedido
                    </>
                  )}
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Order summary */}
        <aside>
          <Card className="p-5 lg:sticky lg:top-24">
            <h2 className="font-display text-lg font-extrabold text-ink-900">Resumo</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {lines.map((l) => (
                <li key={l.productId} className="flex items-start justify-between gap-3">
                  <span className="min-w-0 text-ink-700">
                    <span className="block truncate font-medium text-ink-900">{l.title}</span>
                    <span className="text-xs text-ink-500">
                      {l.quantity} × {formatBRL(l.unitPriceCents)}
                    </span>
                  </span>
                  <span className="shrink-0 font-semibold text-ink-900">
                    {formatBRL(l.unitPriceCents * l.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-2.5 border-t border-surface-100 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-700">Subtotal</dt>
                <dd className="font-semibold text-ink-900">{formatBRL(subtotalCents)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-700">Instalação</dt>
                <dd className="font-semibold text-ink-900">
                  {installationCents > 0 ? formatBRL(installationCents) : '—'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-700">Frete</dt>
                <dd className="font-semibold text-ink-900">
                  {method === 'nationwide'
                    ? shipOption
                      ? shippingCents === 0
                        ? 'Grátis'
                        : formatBRL(shippingCents)
                      : 'Calcule na entrega'
                    : 'Grátis'}
                </dd>
              </div>
              {discountCents > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <dt>Desconto (cupom demo)</dt>
                  <dd className="font-semibold">-{formatBRL(discountCents)}</dd>
                </div>
              )}
              <div className="flex items-baseline justify-between border-t border-surface-100 pt-3">
                <dt className="font-display text-base font-bold text-ink-900">Total</dt>
                <dd className="font-display text-2xl font-extrabold text-ink-900">
                  {formatBRL(totalCents)}
                </dd>
              </div>
            </dl>
            <p className="mt-4 text-[11px] leading-relaxed text-ink-500">
              Checkout ativo para o Brasil. Preços em reais (BRL) com tributos incluídos quando
              exigido pela legislação vigente.
            </p>
          </Card>
        </aside>
      </div>
    </Container>
  );
}
