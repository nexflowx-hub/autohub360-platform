import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle2,
  ClipboardList,
  CreditCard,
  Home,
  MessageCircle,
  PackageSearch,
  Wrench,
} from 'lucide-react';
import { Button, Card, Container } from '@autohub360/ui';
import { whatsappLink } from '@autohub360/config';

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ novo?: string; demo?: string }>;
}

export const metadata: Metadata = {
  title: 'Pedido confirmado',
  description: 'Confirmação do pedido na AutoHub360 Store.',
  robots: { index: false, follow: false },
};

const ORDER_ID_PATTERN = /^AH\d{10}$/;

export default async function PedidoPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { novo } = await searchParams;

  // Public order ids follow the AH + 10 digits convention. Anything else is unknown.
  const knownFormat = ORDER_ID_PATTERN.test(id);
  if (!knownFormat) notFound();

  const isNew = novo === '1';

  return (
    <Container className="py-10 sm:py-16">
      <div className="mx-auto max-w-2xl">
        {isNew && (
          <div
            role="status"
            className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4"
          >
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
            <p className="text-sm font-semibold text-emerald-700">
              Pedido registrado com sucesso! Guarde o número abaixo para acompanhar.
            </p>
          </div>
        )}

        <Card className="overflow-hidden">
          <div className="ah-hero-glow px-6 py-8 text-center text-white sm:px-8">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
              <ClipboardList className="h-7 w-7" aria-hidden="true" />
            </span>
            <h1 className="mt-4 font-display text-2xl font-extrabold sm:text-3xl">
              Pedido registrado
            </h1>
            <p className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 font-display text-lg font-extrabold tracking-wide">
              Pedido <span className="text-ahblue-300">{id}</span>
            </p>
          </div>

          <div className="p-6 sm:p-8">
            <p className="inline-flex items-center gap-1.5 rounded-md bg-amber-500/15 px-2.5 py-1 text-xs font-display font-bold uppercase tracking-wide text-amber-700">
              <CreditCard className="h-3.5 w-3.5" aria-hidden="true" />
              Aguardando pagamento
            </p>

            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-800">
                Modo demonstração — nenhum pagamento foi cobrado.
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-amber-700">
                A vitrine AutoHub360 opera em modo de demonstração enquanto o provedor de pagamento
                não está contratado. Seus dados não foram enviados a nenhum gateway e nenhum valor
                foi cobrado.
              </p>
            </div>

            <h2 className="mt-6 font-display text-base font-bold text-ink-900">Próximos passos</h2>
            <ol className="mt-3 space-y-3 text-sm text-ink-700">
              {[
                {
                  icon: ClipboardList,
                  text: 'Confirme os dados do pedido no resumo enviado para o seu e-mail.',
                },
                {
                  icon: CreditCard,
                  text: 'Com o provedor de pagamento ativo, você receberá o link ou o código Pix para pagar.',
                },
                {
                  icon: PackageSearch,
                  text: 'Após a confirmação do pagamento, enviamos o código de rastreamento da entrega.',
                },
                {
                  icon: Wrench,
                  text: 'Se você optou por instalação, o parceiro confirma a data e o horário por WhatsApp.',
                },
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ahblue-500/10 text-ahblue-600">
                    <step.icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="leading-relaxed">{step.text}</span>
                </li>
              ))}
            </ol>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href={whatsappLink('order')} variant="accent" className="flex-1">
                <MessageCircle className="h-4.5 w-4.5" aria-hidden="true" />
                Falar sobre este pedido
              </Button>
              <Button href="/conta/pedidos" variant="outline-dark" className="flex-1">
                Meus pedidos
              </Button>
              <Button href="/" variant="ghost-dark" className="flex-1">
                <Home className="h-4.5 w-4.5" aria-hidden="true" />
                Voltar à loja
              </Button>
            </div>

            <p className="mt-6 text-center text-xs text-ink-500">
              Dúvidas? Consulte a{' '}
              <Link href="/atendimento" className="font-semibold text-ahblue-600 hover:underline">
                página de atendimento
              </Link>{' '}
              ou a{' '}
              <Link
                href="/legal/termos-e-condicoes-de-venda"
                className="font-semibold text-ahblue-600 hover:underline"
              >
                política de vendas
              </Link>
              .
            </p>
          </div>
        </Card>
      </div>
    </Container>
  );
}
