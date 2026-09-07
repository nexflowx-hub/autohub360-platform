import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Clock,
  Gavel,
  Mail,
  MessageCircle,
  PackageSearch,
  ShieldQuestion,
  Wrench,
} from 'lucide-react';
import {
  Accordion,
  Breadcrumbs,
  Button,
  Card,
  Container,
  Section,
} from '@autohub360/ui';
import { EMAIL_ALIASES, whatsappLink } from '@autohub360/config';

export const metadata: Metadata = {
  title: 'Atendimento e suporte',
  description:
    'Fale com a AutoHub360: WhatsApp, e-mails por departamento, perguntas frequentes sobre prazos, trocas, garantia e instalação, além do canal oficial de reclamações.',
};

const WHATSAPP_ENTRIES = [
  {
    context: 'product' as const,
    label: 'Dúvidas de produto',
    text: 'Consultoria sobre especificações, uso e instalação.',
  },
  {
    context: 'fitment' as const,
    label: 'Compatibilidade veicular',
    text: 'Confirmação de encaixe para o seu carro, moto ou caminhão.',
  },
  {
    context: 'order' as const,
    label: 'Pedidos e entregas',
    text: 'Status, rastreamento e alterações de pedido.',
  },
  {
    context: 'support' as const,
    label: 'Suporte geral',
    text: 'Qualquer outro assunto — direcionamos para o time certo.',
  },
];

const EMAILS = [
  {
    address: EMAIL_ALIASES.store.vendas,
    label: 'Vendas',
    desc: 'Cotações, disponibilidade e orientação de compra.',
  },
  {
    address: EMAIL_ALIASES.store.pedidos,
    label: 'Pedidos',
    desc: 'Status de pedido, entrega e rastreamento.',
  },
  {
    address: EMAIL_ALIASES.store.trocas,
    label: 'Trocas e devoluções',
    desc: 'Arrependimento (7 dias), trocas e devoluções.',
  },
  {
    address: EMAIL_ALIASES.store.garantia,
    label: 'Garantia',
    desc: 'Acionamento de garantia contratual e legal.',
  },
  {
    address: EMAIL_ALIASES.store.suporte,
    label: 'Suporte',
    desc: 'Dúvidas técnicas e pós-venda.',
  },
  {
    address: EMAIL_ALIASES.store.reclamacoes,
    label: 'Reclamações',
    desc: 'Registro formal com protocolo imediato.',
  },
];

const FAQ = [
  {
    question: 'Qual o prazo de entrega das compras?',
    answer:
      'O prazo depende da região do CEP e é calculado no carrinho junto com o frete, contando a partir da confirmação do pagamento. Você também pode retirar em Anápolis - GO, com horário combinado pelo WhatsApp.',
  },
  {
    question: 'Como acompanho o meu pedido?',
    answer:
      'Enviamos o número do pedido na confirmação da compra (começa com AH). Consulte em "Meus pedidos" pelo número, ou fale no WhatsApp — com o pedido confirmado, você recebe o código de rastreamento da transportadora.',
  },
  {
    question: 'Como funcionam trocas e o direito de arrependimento?',
    answer:
      'Você tem até 7 dias corridos após o recebimento para se arrepender de compras feitas fora do estabelecimento comercial (art. 49 do CDC), sem custo. Acione trocas@autohub360.store com o número do pedido. Demais condições estão na página de Trocas, Devoluções e Arrependimento.',
  },
  {
    question: 'Qual é a garantia dos produtos?',
    answer:
      'Cada produto indica a garantia contratual na sua página (em meses), além da garantia legal de 90 dias para vícios ocultos prevista no CDC. O termo de garantia acompanha a política completa na página Garantia.',
  },
  {
    question: 'Quais formas de pagamento são aceitas?',
    answer:
      'Pix, cartão de crédito e boleto, conforme o provedor de pagamento ativo no momento da compra. Não coletamos nem armazenamos dados completos de cartão — o pagamento é processado pelo provedor certificado.',
  },
  {
    question: 'Como funciona a instalação em Anápolis?',
    answer:
      'Nosso parceiro oficial Generoso Auto Center instala som, segurança, LED e acessórios em Anápolis - GO. Você pode marcar "Produto + instalação" no carrinho ou agendar somente o serviço na página de Instalação; a data e a hora são confirmadas pelo WhatsApp.',
  },
];

export default function AtendimentoPage() {
  return (
    <>
      <Container className="pt-4">
        <Breadcrumbs items={[{ label: 'Atendimento' }]} />
      </Container>

      <Section ariaLabel="Canais de atendimento" className="py-8 sm:py-10">
        <Container>
          <div className="max-w-2xl">
            <p className="mb-1.5 text-xs font-display font-bold uppercase tracking-[0.2em] text-ahblue-500">
              Estamos aqui para ajudar
            </p>
            <h1 className="font-display text-3xl font-extrabold text-ink-900 sm:text-4xl">
              Atendimento e suporte
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-500">
              Escolha o canal mais conveniente: WhatsApp para agilidade, e-mail para os temas de
              cada departamento ou o canal de reclamações para registro formal com protocolo.
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {/* WhatsApp card */}
            <Card className="p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#25d366]/15 text-[#128c4b]">
                <MessageCircle className="h-6 w-6" aria-hidden="true" />
              </span>
              <h2 className="mt-3.5 font-display text-lg font-extrabold text-ink-900">
                WhatsApp — mais rápido
              </h2>
              <p className="mt-1 text-sm text-ink-500">+55 (62) 99190-3462</p>
              <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {WHATSAPP_ENTRIES.map((e) => (
                  <li key={e.context}>
                    <a
                      href={whatsappLink(e.context)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block h-full rounded-lg border border-surface-200 px-3.5 py-2.5 transition-colors hover:border-[#25d366] hover:bg-[#25d366]/[0.06]"
                    >
                      <span className="block text-sm font-semibold text-ink-900">{e.label}</span>
                      <span className="mt-0.5 block text-xs leading-snug text-ink-500">
                        {e.text}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Emails card */}
            <Card className="p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ahblue-500/15 text-ahblue-600">
                <Mail className="h-6 w-6" aria-hidden="true" />
              </span>
              <h2 className="mt-3.5 font-display text-lg font-extrabold text-ink-900">
                E-mail por departamento
              </h2>
              <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {EMAILS.map((e) => (
                  <li key={e.address}>
                    <a
                      href={`mailto:${e.address}`}
                      className="block h-full rounded-lg border border-surface-200 px-3.5 py-2.5 transition-colors hover:border-ahblue-400 hover:bg-ahblue-500/[0.04]"
                    >
                      <span className="block text-sm font-semibold text-ink-900">{e.label}</span>
                      <span className="mt-0.5 block text-xs leading-snug text-ink-500">{e.desc}</span>
                      <span className="mt-1 block truncate text-[11px] font-medium text-ahblue-600">
                        {e.address}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Complaints + schedule */}
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Card className="flex items-start gap-4 p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ahorange-500/15 text-ahorange-600">
                <Gavel className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-display text-base font-bold text-ink-900">
                  Canal de Reclamações
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-ink-500">
                  Registro formal com recibo imediato e protocolo. Primeiro tentamos resolver
                  diretamente com você.
                </p>
                <Button href="/canal-de-reclamacoes" variant="outline-dark" size="sm" className="mt-3">
                  Abrir canal de reclamações
                </Button>
              </div>
            </Card>
            <Card className="flex items-start gap-4 p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ahblue-500/15 text-ahblue-600">
                <Clock className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-display text-base font-bold text-ink-900">
                  Horário comercial
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-ink-500">
                  Segunda a sexta, das 8h às 18h, e sábado, das 8h às 12h (horário de Brasília).
                  Mensagens fora do horário são respondidas no próximo dia útil.
                </p>
              </div>
            </Card>
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section ariaLabel="Perguntas frequentes" className="bg-surface-50 py-10 sm:py-12">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <h2 className="font-display text-2xl font-extrabold text-ink-900 sm:text-3xl">
                Perguntas frequentes
              </h2>
              <p className="mt-2 text-[15px] text-ink-500">
                As respostas que resolvem a maior parte das dúvidas — sem esperar na fila.
              </p>
              <div className="mt-5 flex flex-col gap-3">
                <Button href="/conta/pedidos" variant="ghost-dark" size="sm" className="justify-start">
                  <PackageSearch className="h-4.5 w-4.5" aria-hidden="true" />
                  Consultar meu pedido
                </Button>
                <Button href="/instalacao" variant="ghost-dark" size="sm" className="justify-start">
                  <Wrench className="h-4.5 w-4.5" aria-hidden="true" />
                  Agendar instalação
                </Button>
                <Button
                  href="/legal/atendimento-e-reclamacoes"
                  variant="ghost-dark"
                  size="sm"
                  className="justify-start"
                >
                  <ShieldQuestion className="h-4.5 w-4.5" aria-hidden="true" />
                  Política de atendimento
                </Button>
              </div>
            </div>
            <Accordion items={FAQ} />
          </div>
        </Container>
      </Section>

      <p className="pb-10 text-center text-sm text-ink-500">
        Precisa de ajuda com acompanhamento de pedido?{' '}
        <Link href="/conta/pedidos" className="font-semibold text-ahblue-600 hover:underline">
          use a consulta por número
        </Link>
        .
      </p>
    </>
  );
}
