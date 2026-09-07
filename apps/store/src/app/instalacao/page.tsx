import type { Metadata } from 'next';
import {
  CalendarClock,
  CircleCheck,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Wrench,
} from 'lucide-react';
import {
  Breadcrumbs,
  Button,
  Card,
  Container,
  Section,
  TrustStrip,
} from '@autohub360/ui';
import { GENEROSO, whatsappLink } from '@autohub360/config';
import { INSTALLATION_SERVICES } from '@/lib/installation-services';
import { BookingForm } from '@/components/booking-form';
import { formatBRL } from '@autohub360/commerce';

export const metadata: Metadata = {
  title: 'Instalação especializada em Anápolis - GO',
  description:
    'Compre na loja e instale com o Generoso Auto Center, parceiro oficial AutoHub360 em Anápolis - GO. Agende instalação de som, segurança, LED e acessórios com garantia.',
};

const HOW_IT_WORKS = [
  {
    title: 'Escolha o produto',
    text: 'Selecione na loja o produto que quer instalar — sozinho ou junto com um kit.',
  },
  {
    title: 'Opte por Produto + instalação ou agende',
    text: 'No carrinho, marque a instalação do produto; ou agende somente o serviço nesta página.',
  },
  {
    title: 'Confirme data e hora pelo WhatsApp',
    text: 'O parceiro confirma o melhor horário com você e alinha os detalhes do veículo.',
  },
  {
    title: 'Instalação com garantia',
    text: 'Serviço executado com mão de obra qualificada e garantia do serviço prestado.',
  },
];

export default function InstalacaoPage() {
  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    // Only city-level info — no street address is fabricated for the partner.
    '@type': 'AutoRepair',
    name: GENEROSO.name,
    description: GENEROSO.wording,
    areaServed: `${GENEROSO.city} - ${GENEROSO.state}`,
    telephone: '+55 62 99190-3462',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />

      {/* Hero with orange accent */}
      <section className="ah-hero-glow relative overflow-hidden text-white" aria-labelledby="instalacao-title">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-6 h-96 w-96 rounded-full bg-ahorange-500/25 blur-[110px]"
        />
        <Container className="relative py-12 sm:py-16">
          <p className="inline-flex items-center gap-2 rounded-full border border-ahorange-400/40 bg-ahorange-500/15 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-ahorange-300">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            Anápolis - GO
          </p>
          <div className="mt-4 grid items-end gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h1
                id="instalacao-title"
                className="font-display text-4xl font-extrabold leading-[1.05] sm:text-5xl"
              >
                Compre na loja e{' '}
                <span className="bg-gradient-to-r from-ahorange-300 to-ahorange-500 bg-clip-text text-transparent">
                  instale com confiança
                </span>
              </h1>
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-slate-300 sm:text-lg">
                {GENEROSO.wording} Mão de obra qualificada para som, segurança, iluminação LED e
                acessórios — com a tranquilidade de quem entende o que faz.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button href="#agendamento" variant="accent" size="lg">
                  <CalendarClock className="h-5 w-5" aria-hidden="true" />
                  Agendar instalação
                </Button>
                <Button href={whatsappLink('installation')} variant="outline-light" size="lg">
                  <MessageCircle className="h-5 w-5" aria-hidden="true" />
                  Falar no WhatsApp
                </Button>
              </div>
            </div>
            <div className="ah-glass rounded-2xl p-6">
              <p className="font-display text-lg font-extrabold text-white">{GENEROSO.name}</p>
              <p className="mt-1 text-sm italic text-slate-400">&ldquo;{GENEROSO.tagline}&rdquo;</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-200">
                {GENEROSO.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-2">
                    <CircleCheck className="h-4 w-4 shrink-0 text-ahorange-400" aria-hidden="true" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <Container className="pt-4">
        <Breadcrumbs items={[{ label: 'Instalação em Anápolis' }]} />
      </Container>

      {/* Como funciona */}
      <Section ariaLabel="Como funciona a instalação" className="py-10 sm:py-12">
        <Container>
          <h2 className="font-display text-2xl font-extrabold text-ink-900 sm:text-3xl">
            Como funciona
          </h2>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((step, i) => (
              <li key={step.title}>
                <Card hover className="h-full p-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ahblue-500 text-white font-display font-extrabold">
                    {i + 1}
                  </span>
                  <h3 className="mt-3.5 font-display text-[17px] font-extrabold text-ink-900">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{step.text}</p>
                </Card>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* Serviços + agendamento */}
      <Section ariaLabel="Serviços de instalação e agendamento" className="bg-surface-50 py-10 sm:py-12">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
            <div>
              <h2 className="font-display text-2xl font-extrabold text-ink-900 sm:text-3xl">
                Serviços disponíveis
              </h2>
              <p className="mt-2 text-[15px] text-ink-500">
                Valores de mão de obra praticados pelo parceiro. Peças e produtos são cobrados à
                parte, pela loja.
              </p>
              <ul className="mt-6 flex flex-col gap-3">
                {INSTALLATION_SERVICES.map((s) => (
                  <li key={s.id}>
                    <Card className="flex items-center justify-between gap-4 p-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ahorange-500/15 text-ahorange-600">
                          <Wrench className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <div>
                          <p className="font-display text-[15px] font-bold text-ink-900">{s.label}</p>
                          <p className="text-xs text-ink-500">{s.duration}</p>
                        </div>
                      </div>
                      <p className="font-display text-lg font-extrabold text-ink-900">
                        {formatBRL(s.priceCents)}
                      </p>
                    </Card>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
                <p className="text-sm leading-relaxed text-amber-800">
                  <strong>Atenção ao endereço:</strong> o endereço corporativo da AutoHub360 em
                  Goiânia <strong>não é</strong> o local de instalação — o atendimento é realizado em{' '}
                  <strong>Anápolis - GO</strong>, região metropolitana, com endereço informado no
                  agendamento.
                </p>
              </div>
            </div>

            <div id="agendamento" className="scroll-mt-24">
              <BookingForm />
            </div>
          </div>
        </Container>
      </Section>

      <Section ariaLabel="Vantagens da instalação AutoHub360" className="py-10 sm:py-12">
        <Container>
          <TrustStrip
            items={[
              { icon: 'package', title: 'Mão de obra qualificada', subtitle: 'Parceiro oficial AutoHub360' },
              { icon: 'shield', title: 'Garantia do serviço', subtitle: 'Instalação com respaldo' },
              { icon: 'calendar', title: 'Horários flexíveis', subtitle: 'Segunda a sábado' },
              { icon: 'pin', title: 'Anápolis - GO', subtitle: 'Atendimento local e regional' },
            ]}
          />
          <div className="mt-10 rounded-xl border border-ahblue-500/25 bg-gradient-to-br from-ahblue-500/[0.07] to-white p-6 text-center">
            <ShieldCheck className="mx-auto h-7 w-7 text-ahblue-500" aria-hidden="true" />
            <h2 className="mt-3 font-display text-xl font-extrabold text-ink-900">
              Ficou com dúvida sobre o serviço ideal?
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-[15px] text-ink-500">
              Fale com a equipe: orientamos produto, serviço e horário — tudo pelo WhatsApp, sem
              compromisso.
            </p>
            <Button href={whatsappLink('installation')} variant="primary" size="lg" className="mt-5">
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              Conversar agora
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
