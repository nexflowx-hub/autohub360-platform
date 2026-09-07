import type { Metadata } from 'next';
import Link from 'next/link';
import {
  CalendarCheck,
  Check,
  ClipboardCheck,
  Clock,
  MapPin,
  MessageCircle,
  ShoppingCart,
  Wrench,
} from 'lucide-react';
import {
  Accordion,
  Breadcrumbs,
  breadcrumbJsonLd,
  Button,
  Container,
  Section,
  SectionHeader,
} from '@autohub360/ui';
import { GENEROSO, storeSite, techSite, whatsappLink } from '@autohub360/config';
import { INSTALL_SERVICES, formatBRL, formatDuration } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Instalação e assistência em Anápolis - GO',
  description:
    'Instalação especializada de multimídia, câmeras de ré, kits LED, rastreadores, som e alarmes em Anápolis - GO, com o parceiro oficial Generoso Auto Center. Agende horário na loja AutoHub360.',
  alternates: { canonical: '/instalacao-anapolis' },
  openGraph: {
    title: 'Instalação e assistência em Anápolis - GO',
    description:
      'Multimídia, câmeras, LED, rastreadores e som instalados com padrão de fábrica pelo parceiro oficial AutoHub360 em Anápolis.',
  },
};

const steps = [
  {
    title: 'Escolha o produto na loja',
    description:
      'Na autohub360.store, opte por "Produto + instalação" nos produtos elegíveis — ou apenas finalize a compra e agende depois.',
    icon: ShoppingCart,
  },
  {
    title: 'Agende data e horário',
    description:
      'No agendamento você informa o veículo, o serviço desejado e escolhe entre os horários disponíveis. A vaga é confirmada por WhatsApp ou e-mail.',
    icon: CalendarCheck,
  },
  {
    title: 'Instalação com padrão de fábrica',
    description:
      'O Generoso Auto Center executa conforme especificação do fabricante: chicote protegido, testes funcionais e nada de gambiarra.',
    icon: Wrench,
  },
  {
    title: 'Saída com orientação',
    description:
      'No final, você recebe o teste completo, a orientação de uso (inclusive do aplicativo, quando houver) e a garantia de mão de obra no comprovante.',
    icon: ClipboardCheck,
  },
];

const faq = [
  {
    question: 'Onde acontece a instalação?',
    answer:
      'A instalação é realizada pelo Generoso Auto Center, parceiro oficial AutoHub360, em Anápolis - GO. O endereço exato e as instruções de chegada são informados no momento da confirmação do agendamento.',
  },
  {
    question: 'Preciso ter comprado o produto na loja AutoHub360?',
    answer:
      'O valor promocional de instalação vale para produtos adquiridos na autohub360.store. Para produtos de fora, o parceiro avalia o serviço e o valor diretamente — mas comprar com a gente garante compatibilidade e o preço de tabela.',
  },
  {
    question: 'Quanto tempo dura uma instalação?',
    answer:
      'Depende do serviço: um kit LED com regulagem de farol leva cerca de 45 minutos; uma central multimídia com adaptação de chicote pode levar 2 horas. Cada serviço na tabela informa a duração estimada para você planejar o dia.',
  },
  {
    question: 'Posso remarcar ou cancelar meu horário?',
    answer:
      'Sim. Remarcações são gratuitas com antecedência mínima de 12 horas, direto pelo canal de atendimento. Cancelamentos e ajustes de última hora são tratados caso a caso, com bom senso.',
  },
  {
    question: 'A instalação tem garantia?',
    answer:
      'Sim. A garantia de mão de obra é fornecida pelo parceiro e informada no comprovante do serviço. Danos preexistentes no veículo devem ser apontados antes da execução — o checklist de entrada cobre isso.',
  },
];

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AutoRepair',
  name: `${GENEROSO.name} — parceiro oficial de instalação AutoHub360`,
  description: `Instalação especializada de acessórios automotivos em ${GENEROSO.city} - ${GENEROSO.state}: multimídia, câmeras de ré, kits LED, rastreadores, som e alarmes.`,
  telephone: '+55-62-99190-3462',
  areaServed: {
    '@type': 'City',
    name: `${GENEROSO.city}`,
    containedInPlace: {
      '@type': 'State',
      name: 'Goiás',
    },
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: GENEROSO.city,
    addressRegion: GENEROSO.state,
    addressCountry: 'BR',
  },
  provider: {
    '@type': 'Organization',
    name: 'AutoHub360',
    url: techSite.url,
  },
};

export default function InstalacaoAnapolisPage() {
  const breadcrumbJsonLdData = breadcrumbJsonLd(
    [{ label: 'Instalação em Anápolis', href: '/instalacao-anapolis' }],
    techSite.url,
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLdData) }}
      />

      <Container className="py-4">
        <Breadcrumbs items={[{ label: 'Instalação em Anápolis', href: '/instalacao-anapolis' }]} />
      </Container>

      {/* Hero */}
      <section className="ah-hero-glow relative overflow-hidden text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.13]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(124,176,255,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(124,176,255,0.25) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-10 h-96 w-96 rounded-full bg-ahorange-500/20 blur-[110px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-ahblue-500/20 blur-[110px]"
        />
        <Container className="relative py-14 sm:py-20">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-ahorange-300">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            {GENEROSO.city} - {GENEROSO.state}
          </p>
          <h1 className="max-w-3xl font-display text-3xl font-extrabold leading-[1.08] tracking-tight sm:text-4xl lg:text-5xl">
            Instalação e assistência em{' '}
            <span className="bg-gradient-to-r from-ahorange-300 to-ahorange-500 bg-clip-text text-transparent">
              Anápolis
            </span>
            .
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Compre na loja AutoHub360 e instale com quem faz isso todos os dias: o{' '}
            <strong className="text-white">{GENEROSO.name}</strong>, nosso parceiro oficial de
            instalação em Anápolis - GO. Multimídia, câmeras de ré, kits LED, rastreadores, som e
            alarmes — com padrão de fábrica, do chicote ao teste final.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button href={`${storeSite.url}/instalacao`} size="lg" variant="accent">
              Agendar instalação
              <CalendarCheck className="h-5 w-5" aria-hidden="true" />
            </Button>
            <Button href={whatsappLink('installation')} size="lg" variant="outline-light">
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              Tirar dúvidas no WhatsApp
            </Button>
          </div>
        </Container>
      </section>

      {/* Services table */}
      <Section ariaLabel="Serviços de instalação">
        <Container>
          <SectionHeader
            overline="Serviços e valores"
            title="O que instalamos (e quanto tempo leva)"
            subtitle="Valores de tabela para produtos adquiridos na loja AutoHub360. O agendamento com data e horário acontece na própria loja, no checkout ou depois da compra."
          />
          <div className="overflow-hidden rounded-xl border border-surface-200 bg-white shadow-[var(--ah-shadow-card)]">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">
                Tabela de serviços de instalação em Anápolis com valores e duração estimada
              </caption>
              <thead className="bg-surface-50 text-xs uppercase tracking-wide text-ink-500">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold sm:px-6">
                    Serviço
                  </th>
                  <th scope="col" className="hidden px-4 py-3 font-semibold md:table-cell">
                    Inclui
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Valor
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold sm:px-6">
                    Duração
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200">
                {INSTALL_SERVICES.map((service) => (
                  <tr key={service.slug} className="align-top">
                    <td className="px-4 py-4 font-display font-bold text-ink-900 sm:px-6">
                      {service.name}
                      <p className="mt-1 text-xs font-normal text-ink-500 md:hidden">
                        {service.description}
                      </p>
                    </td>
                    <td className="hidden px-4 py-4 text-ink-700 md:table-cell">
                      {service.description}
                    </td>
                    <td className="px-4 py-4 font-semibold text-ink-900">
                      {formatBRL(service.priceCents)}
                    </td>
                    <td className="px-4 py-4 text-ink-700 sm:px-6">
                      <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                        <Clock className="h-3.5 w-3.5 text-ahblue-500" aria-hidden="true" />
                        {formatDuration(service.durationMinutes)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-ink-500">
            Valores de mão de obra para produtos comprados na autohub360.store, sujeitos a
            confirmação no agendamento. A garantia de mão de obra é fornecida pelo parceiro e
            informada no comprovante.
          </p>
        </Container>
      </Section>

      {/* Como funciona */}
      <Section ariaLabel="Como funciona" className="bg-surface-50">
        <Container>
          <SectionHeader
            overline="Passo a passo"
            title="Como funciona o agendamento"
            subtitle="Do carrinho à chave na mão: quatro passos, sem complicação."
          />
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <li
                key={step.title}
                className="relative rounded-xl border border-surface-200 bg-white p-5 shadow-[var(--ah-shadow-card)]"
              >
                <span
                  aria-hidden="true"
                  className="absolute right-4 top-4 font-display text-3xl font-extrabold text-surface-200"
                >
                  {i + 1}
                </span>
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-ahblue-500/15 to-ahblue-500/5 text-ahblue-600">
                  <step.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="font-display text-base font-extrabold text-ink-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{step.description}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* Generoso + local SEO content */}
      <Section ariaLabel="Parceria Generoso Auto Center" dark className="bg-navy-900">
        <Container>
          <div className="grid items-start gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div id="generoso" className="scroll-mt-24">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-ahorange-400">
                Nossa parceria
              </p>
              <h2 className="font-display text-2xl font-extrabold text-white sm:text-3xl">
                {GENEROSO.name}
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-slate-300">
                {GENEROSO.wording} A parceria nasceu de perto: antes de ser marca, a AutoHub360
                era rotina de bancada — e é esse padrão de serviço que o parceiro executa em cada
                veículo.
              </p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {GENEROSO.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-2.5 text-sm text-slate-200">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ahorange-500/20 text-ahorange-300">
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    {h}
                  </li>
                ))}
              </ul>
              <blockquote className="mt-6 border-l-2 border-ahorange-500/60 pl-4 text-lg italic leading-relaxed text-slate-200">
                &ldquo;{GENEROSO.tagline}&rdquo;
              </blockquote>
              <p className="mt-6 flex items-center gap-2 text-sm text-slate-400">
                <MapPin className="h-4 w-4 text-ahorange-400" aria-hidden="true" />
                {GENEROSO.region}
              </p>
            </div>
            <div className="space-y-4 text-[15px] leading-relaxed text-slate-300">
              <h3 className="font-display text-lg font-extrabold text-white">
                Instalação de verdade, em cada detalhe
              </h3>
              <p>
                Câmera de ré bem instalada não tem fio aparente descendo pela tampa traseira: o
                cabo passa embutido, o chicote fica protegido e a imagem chega limpa na central —
                sem ruído, sem oxidação meses depois. Kit LED bem instalado sai da bancada com
                regulagem de feixe, respeitando o corte de luz e o motorista que vem na direção
                contrária.
              </p>
              <p>
                Na multimídia, a diferença está na adaptação: chicote correto para o veículo, sem
                corte de fio original, retenção de memória funcionando e microfone posicionado
                onde realmente capta bem a voz. Em rastreadores e alarmes, o trabalho é invisível
                por definição — instalação discreta, sem ruído elétrico e com teste completo de
                acionamento e do aplicativo.
              </p>
              <p>
                Se você não é de Anápolis, o caminho continua sendo a loja: a compra chega em
                qualquer lugar do Brasil e o suporte técnico acompanha por WhatsApp. Quem está na
                região — {GENEROSO.region} — conta ainda com o serviço presencial, com horário
                agendado para não matar o seu dia.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button href={`${storeSite.url}/instalacao`} variant="accent" size="lg">
                  Agendar instalação
                  <CalendarCheck className="h-5 w-5" aria-hidden="true" />
                </Button>
                <Button href="/auto-mobility" variant="outline-light" size="lg">
                  Ver o universo Auto &amp; Mobility
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section ariaLabel="Perguntas frequentes sobre instalação">
        <Container>
          <SectionHeader
            overline="Dúvidas frequentes"
            title="Perguntas sobre instalação em Anápolis"
          />
          <div className="max-w-3xl">
            <Accordion items={faq} />
          </div>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-ink-500">
            As condições completas do serviço estão nos{' '}
            <Link href="/legal/termos-de-instalacao" className="font-semibold text-ahblue-600 underline underline-offset-2 hover:text-ahblue-700">
              Termos de Instalação e Serviço
            </Link>
            .
          </p>
        </Container>
      </Section>
    </>
  );
}
