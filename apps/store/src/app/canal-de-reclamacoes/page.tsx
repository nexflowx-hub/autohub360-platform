'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import { Button, Card, Container, Field, Input, Select, Textarea } from '@autohub360/ui';

const CATEGORIES = [
  { value: 'pedido', label: 'Pedido ou entrega' },
  { value: 'produto', label: 'Produto ou compatibilidade' },
  { value: 'instalacao', label: 'Instalação / serviço' },
  { value: 'atendimento', label: 'Atendimento' },
  { value: 'pagamento', label: 'Pagamento ou cobrança' },
  { value: 'outro', label: 'Outro assunto' },
];

interface Protocol {
  ticket: string;
  receivedAt: string;
}

export default function CanalDeReclamacoesPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]!.value);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [formStartedAt, setFormStartedAt] = useState<number | undefined>(undefined);

  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [protocol, setProtocol] = useState<Protocol | null>(null);

  useEffect(() => {
    // Simple bot check: form started at least a second before submit.
    setFormStartedAt(Date.now());
  }, []);

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (name.trim().length < 3) e.name = 'Informe seu nome completo.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = 'Informe um e-mail válido.';
    if (order.trim() && !/^AH\d{10}$/i.test(order.trim()))
      e.order = 'Formato esperado: AH1234567890 (ou deixe em branco).';
    if (subject.trim().length < 3) e.subject = 'Descreva o assunto em poucas palavras.';
    if (message.trim().length < 10) e.message = 'Conte o que aconteceu (mínimo 10 caracteres).';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;
    setPending(true);
    try {
      const categoryLabel = CATEGORIES.find((c) => c.value === category)?.label ?? category;
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          department: 'reclamacoes',
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: `Categoria: ${categoryLabel}\n${order.trim() ? `Pedido: ${order.trim()}\n` : ''}\n${message.trim()}`,
          ...(formStartedAt ? { formStartedAt } : {}),
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        ticket?: string;
        receivedAt?: string;
        error?: string;
      };
      if (res.ok && data.ok && data.ticket) {
        setProtocol({ ticket: data.ticket, receivedAt: data.receivedAt ?? new Date().toISOString() });
      } else if (res.status === 429) {
        setApiError(
          'Recebemos muitas mensagens seguidas deste acesso. Aguarde alguns minutos antes de enviar novamente.',
        );
      } else {
        setApiError(data.error ?? 'Não foi possível registrar a reclamação agora. Tente novamente.');
      }
    } catch {
      setApiError('Falha de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setPending(false);
    }
  }

  return (
    <Container className="py-8 sm:py-12">
      <div className="mx-auto max-w-2xl">
        <nav aria-label="Trilha de navegação" className="text-[13px] text-ink-500">
          <Link href="/" className="transition-colors hover:text-ahblue-600">
            Início
          </Link>
          <span className="mx-1.5 text-ink-300">/</span>
          <span className="font-medium text-ink-900" aria-current="page">
            Canal de Reclamações
          </span>
        </nav>

        <h1 className="mt-4 font-display text-3xl font-extrabold text-ink-900 sm:text-4xl">
          Canal de Reclamações
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-500">
          Primeiro tentamos resolver diretamente com você — com atenção e agilidade. Ao registrar
          uma reclamação aqui, você recebe o <strong>recibo imediato com número de protocolo</strong>{' '}
          e acompanha a resposta pelo e-mail informado.
        </p>

        {protocol ? (
          <Card className="mt-8 p-6 sm:p-8">
            <div className="text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
                <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
              </span>
              <h2 className="mt-4 font-display text-xl font-extrabold text-ink-900">
                Reclamação registrada
              </h2>
              <p className="mt-2 text-[15px] text-ink-700">
                Protocolo:{' '}
                <strong className="font-display text-ahblue-600">{protocol.ticket}</strong>
              </p>
              <p className="text-xs text-ink-500">
                Recebido em{' '}
                {new Date(protocol.receivedAt).toLocaleString('pt-BR', {
                  dateStyle: 'short',
                  timeStyle: 'short',
                })}
              </p>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink-500">
                Guarde este número. Nossa equipe responde no e-mail informado dentro do prazo
                combinado na política de atendimento.
              </p>
              <Button
                variant="ghost-dark"
                className="mt-5"
                onClick={() => {
                  setProtocol(null);
                  setSubject('');
                  setMessage('');
                  setOrder('');
                  setFormStartedAt(Date.now());
                }}
              >
                Registrar outra reclamação
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="mt-8 p-5 sm:p-6">
            {apiError && (
              <div
                role="alert"
                className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm font-medium text-red-700"
              >
                {apiError}
              </div>
            )}

            <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2" noValidate>
              <Field label="Seu nome" htmlFor="rc-name" error={errors.name}>
                <Input
                  id="rc-name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-invalid={Boolean(errors.name)}
                />
              </Field>
              <Field label="E-mail para resposta" htmlFor="rc-email" error={errors.email}>
                <Input
                  id="rc-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={Boolean(errors.email)}
                />
              </Field>
              <Field
                label="Número do pedido (opcional)"
                htmlFor="rc-order"
                error={errors.order}
                hint="Ajuda a localizar o histórico rapidamente."
              >
                <Input
                  id="rc-order"
                  placeholder="AH1234567890"
                  value={order}
                  onChange={(e) => setOrder(e.target.value.toUpperCase())}
                  aria-invalid={Boolean(errors.order)}
                />
              </Field>
              <Field label="Categoria" htmlFor="rc-category">
                <Select
                  id="rc-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Assunto" htmlFor="rc-subject" error={errors.subject} className="sm:col-span-2">
                <Input
                  id="rc-subject"
                  placeholder="Resuma o problema em uma frase"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  aria-invalid={Boolean(errors.subject)}
                />
              </Field>
              <Field
                label="Mensagem"
                htmlFor="rc-message"
                error={errors.message}
                className="sm:col-span-2"
                hint="Quanto mais contexto (datas, números, produtos), mais rápido conseguimos resolver."
              >
                <Textarea
                  id="rc-message"
                  className="min-h-36"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  aria-invalid={Boolean(errors.message)}
                />
              </Field>

              <div className="flex items-center justify-between gap-3 sm:col-span-2">
                <p className="text-xs text-ink-500">
                  Seus dados são tratados conforme a Política de Privacidade (LGPD).
                </p>
                <Button type="submit" size="lg" disabled={pending}>
                  {pending ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                      Enviando…
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" aria-hidden="true" />
                      Registrar reclamação
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        )}

        <div className="mt-8 rounded-xl border border-surface-200 bg-white p-5">
          <h2 className="font-display text-base font-bold text-ink-900">Órgãos de defesa do consumidor</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-700">
            Além deste canal, você pode recorrer aos Procons do seu município e ao consumidor.gov.br.
            A integração automática com o Consumidor.gov.br desta empresa aparece na plataforma
            apenas após a empresa estar oficialmente cadastrada — até lá, registre sua demanda
            diretamente no Procon de sua cidade.
          </p>
        </div>
      </div>
    </Container>
  );
}
