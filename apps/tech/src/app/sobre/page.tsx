import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  Compass,
  HandHeart,
  MapPin,
  MessageCircle,
  ShoppingCart,
  Store,
  Wrench,
} from 'lucide-react';
import { Breadcrumbs, breadcrumbJsonLd, Button, Container, Section, SectionHeader } from '@autohub360/ui';
import { BR, EU, storeSite, techSite, whatsappLink } from '@autohub360/config';

export const metadata: Metadata = {
  title: 'Sobre a AutoHub360',
  description:
    'A AutoHub360 nasceu da rotina real de instalação automotiva e hoje conecta conteúdo, loja e serviço em um só ecossistema: tecnologia para o carro, para a casa e para o seu dia.',
  alternates: { canonical: '/sobre' },
  openGraph: {
    title: 'Sobre a AutoHub360',
    description:
      'Conteúdo, tecnologia e orientação especializada — da garagem à sala de casa, com um ecossistema de dois pontos de contato.',
  },
};

const values = [
  {
    icon: Wrench,
    title: 'Experiência antes de opinião',
    description:
      'Só falamos com propriedade do que passou pela bancada. Recomendação técnica vem de quem instala, usa e resolve problema — não de tabela de comissão.',
  },
  {
    icon: BadgeCheck,
    title: 'Curadoria com critério',
    description:
      'Produto aqui é escolhido por especificação, compatibilidade e durabilidade. Preferimos vender uma vez bem do que duas vezes mal.',
  },
  {
    icon: HandHeart,
    title: 'Atendimento de gente',
    description:
      'WhatsApp com especialista, não chatbot. A conversa começa na dúvida e termina no produto certo — mesmo quando a resposta é "isso você não precisa".',
  },
  {
    icon: Compass,
    title: 'Conteúdo que ajuda de verdade',
    description:
      'Guias e análises no Hub escritos para o consumidor decidir melhor, com linguagem direta e sem marketing disfarçado de artigo.',
  },
];

const subBrandIcons: Record<string, typeof Wrench> = {
  auto: Wrench,
  tech: BadgeCheck,
  energy: Compass,
  vision: BadgeCheck,
  pro: Store,
};

export default function SobrePage() {
  const breadcrumbJsonLdData = breadcrumbJsonLd([{ label: 'Sobre', href: '/sobre' }], techSite.url);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLdData) }}
      />

      <Container className="py-4">
        <Breadcrumbs items={[{ label: 'Sobre', href: '/sobre' }]} />
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
          className="pointer-events-none absolute -right-24 top-10 h-96 w-96 rounded-full bg-ahblue-500/25 blur-[110px]"
        />
        <Container className="relative py-14 sm:py-20">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-ahblue-300">
            <span className="h-1.5 w-1.5 rounded-full bg-ahorange-500" aria-hidden="true" />
            Sobre a AutoHub360
          </p>
          <h1 className="max-w-3xl font-display text-3xl font-extrabold leading-[1.08] tracking-tight sm:text-4xl lg:text-5xl">
            Tecnologia que nasceu na{' '}
            <span className="bg-gradient-to-r from-ahblue-300 to-ahblue-500 bg-clip-text text-transparent">
              bancada de instalação
            </span>
            .
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            A AutoHub360 é um ecossistema brasileiro de tecnologia automotiva e residencial —
            construído por quem passou anos instalando eletrônica em veículos e viu de perto o
            que funciona (e o que só parece funcionar).
          </p>
        </Container>
      </section>

      {/* Story */}
      <Section ariaLabel="Nossa história">
        <Container>
          <div className="max-w-3xl space-y-5 text-[15px] leading-relaxed text-ink-700 sm:text-base">
            <p>
              A AutoHub360 não começou num escritório — começou num carro, com chicote aberto e
              central multimídia na bancada. Anos de instalação de elétrica e eletrônica automotiva
              em Anápolis criaram um acúmulo raro: saber exatamente quais produtos duram, quais
              instalações seguram o padrão de fábrica e quais promessas de embalagem não
              sobrevivem ao primeiro verão.
            </p>
            <p>
              Essa experiência virou método. Quando decidimos levar o conhecimento além do
              balcão, o desenho foi claro: um ecossistema com duas portas de entrada. O
              autohub360.tech é a casa do conteúdo, da orientação técnica e das informações de
              serviço — onde você aprende, compara e decide. A autohub360.store é onde a compra
              acontece, com catálogo curado, busca por veículo, entrega nacional e checkout seguro.
              Mesma equipe, mesmos padrões, duas frentes que se conversam.
            </p>
            <p>
              A terceira pata é a instalação: porque produto bem escolhido pode ser estragado por
              uma instalação ruim. Em Anápolis - GO, nosso parceiro oficial, o Generoso Auto
              Center, executa com o padrão que a gente exigiria para o próprio carro — e é essa
              triangulação (conteúdo + loja + serviço) que define a marca.
            </p>
            <p>
              Hoje o ecossistema cobre do automóvel à casa inteligente, da energia portátil à
              segurança eletrônica, do consumidor final à oficina e à frota. O nome diz a
              ambição: 360 graus de tecnologia para quem dirige, para quem mora e para quem
              trabalha com isso.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: Store,
                title: 'Loja',
                description: 'autohub360.store — catálogo, ofertas e checkout com entrega nacional.',
                href: storeSite.url,
                external: true,
              },
              {
                icon: Wrench,
                title: 'Serviço',
                description: 'Instalação especializada com parceiro oficial em Anápolis - GO.',
                href: '/instalacao-anapolis',
              },
              {
                icon: MessageCircle,
                title: 'Especialista',
                description: 'WhatsApp com a equipe: compatibilidade, orçamento e orientação.',
                href: whatsappLink('general'),
                external: true,
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-xl border border-surface-200 bg-white p-5 shadow-[var(--ah-shadow-card)]"
              >
                <card.icon className="mb-3 h-6 w-6 text-ahblue-600" aria-hidden="true" />
                <h3 className="font-display text-base font-extrabold text-ink-900">{card.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{card.description}</p>
                {card.href && (
                  <Link
                    href={card.href}
                    {...('external' in card && card.external
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                    className="mt-3 inline-flex items-center gap-1.5 font-display text-sm font-bold text-ahblue-600 hover:text-ahblue-700"
                  >
                    Acessar
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Sub-brands */}
      <Section ariaLabel="Sub-marcas" className="bg-surface-50">
        <Container>
          <SectionHeader
            overline="Estrutura da marca"
            title="Cinco sub-marcas, um mesmo padrão"
            subtitle="Cada frente tem especialidade própria — e todas compartilham a mesma curadoria e o mesmo jeito de atender."
          />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { key: 'auto', name: 'AutoHub360 Auto', description: 'Peças, acessórios e desempenho automotivo, do filtro ao kit LED.' },
              { key: 'tech', name: 'AutoHub360 Tech', description: 'Eletrônicos, gadgets e inovação para a rotina conectada.' },
              { key: 'energy', name: 'AutoHub360 Energy', description: 'Energia portátil e solar para um futuro com menos apagão.' },
              { key: 'vision', name: 'AutoHub360 Vision', description: 'Segurança e monitoramento para o carro e para a casa.' },
              { key: 'pro', name: 'AutoHub360 Pro', description: 'Soluções para oficinas, frotas, revendas e instaladores.' },
            ].map((sub) => {
              const Icon = subBrandIcons[sub.key] ?? BadgeCheck;
              return (
                <li
                  key={sub.key}
                  className="rounded-xl border border-surface-200 bg-white p-5 shadow-[var(--ah-shadow-card)]"
                >
                  <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-ahblue-500/15 to-ahblue-500/5 text-ahblue-600">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="font-display text-sm font-extrabold text-ink-900">{sub.name}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-ink-500">{sub.description}</p>
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>

      {/* Values */}
      <Section ariaLabel="Nossos valores">
        <Container>
          <SectionHeader overline="Como a gente trabalha" title="Valores que aparecem na prática" />
          <ul className="grid gap-4 sm:grid-cols-2">
            {values.map((value) => (
              <li
                key={value.title}
                className="flex items-start gap-4 rounded-xl border border-surface-200 bg-white p-5 shadow-[var(--ah-shadow-card)]"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ahblue-500/10 text-ahblue-600">
                  <value.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-display text-base font-extrabold text-ink-900">{value.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{value.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Institutional data */}
      <Section ariaLabel="Dados institucionais" className="bg-surface-50">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <SectionHeader
                overline="Transparência"
                title="Dados institucionais"
                subtitle="Quem está por trás da marca — informação no site, não no SAC."
              />
              <div className="rounded-xl border border-surface-200 bg-white p-6 shadow-[var(--ah-shadow-card)]">
                <p className="font-display text-base font-extrabold text-ink-900">{BR.legalName}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-700">
                  CNPJ {BR.cnpj}
                  <br />
                  {BR.address.street}, {BR.address.district}
                  <br />
                  {BR.address.city} - {BR.address.state}, CEP {BR.address.zip}
                  <br />
                  {BR.address.country}
                </p>
                <p className="mt-3 text-sm text-ink-700">Atendimento: WhatsApp {BR.whatsapp}</p>
                <hr className="my-4 border-surface-200" />
                <p className="text-sm leading-relaxed text-ink-700">
                  <strong>{EU.brandName}</strong> — {EU.operatorWording} SIREN {EU.operator.siren} ·
                  RCS {EU.operator.rcs}.
                </p>
                <p className="mt-3 text-xs leading-relaxed text-ink-500">
                  Documentos legais completos na seção{' '}
                  <Link href="/legal/termos-de-uso" className="font-semibold text-ahblue-600 underline underline-offset-2 hover:text-ahblue-700">
                    Legal
                  </Link>
                  .
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-center rounded-2xl bg-navy-950 p-6 text-white sm:p-8">
              <p className="font-display text-xl font-extrabold">
                Vem construir isso com a gente.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Seja para comprar com confiança, agendar uma instalação, resolver a operação da
                sua frota ou simplesmente tirar uma dúvida técnica — as portas do ecossistema
                estão abertas.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button href={storeSite.url} variant="primary" size="lg">
                  <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                  Conhecer a loja
                </Button>
                <Button href="/contato" variant="outline-light" size="lg">
                  Falar com a AutoHub360
                </Button>
              </div>
              <p className="mt-6 flex items-center gap-2 text-xs text-slate-400">
                <MapPin className="h-3.5 w-3.5 text-ahorange-400" aria-hidden="true" />
                Goiânia - GO (matriz) · Anápolis - GO (instalação)
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
