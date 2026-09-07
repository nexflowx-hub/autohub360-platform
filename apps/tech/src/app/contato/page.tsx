import type { Metadata } from 'next';
import { Mail, MessageCircle, MapPin, Handshake, Briefcase, Headset } from 'lucide-react';
import { Card, Container, Section } from '@autohub360/ui';
import { BR, EMAIL_ALIASES, whatsappLink } from '@autohub360/config';
import { ContactForm } from '@/components/contact-form';

interface Props {
  searchParams: Promise<{ assunto?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { assunto } = await searchParams;
  const isPro = assunto === 'pro';
  return {
    title: isPro ? 'AutoHub360 Pro — Fale com o time B2B' : 'Contato — AutoHub360',
    description: isPro
      ? 'Fale com o time AutoHub360 Pro: soluções para oficinas, frotas, revendas e instaladores.'
      : 'Fale com a AutoHub360: contato geral, comercial, parcerias e suporte. WhatsApp, e-mail e formulário.',
  };
}

const CHANNELS = [
  {
    icon: Headset,
    title: 'Atendimento geral',
    email: EMAIL_ALIASES.tech.contato,
    desc: 'Dúvidas institucionais, imprensa e informações gerais.',
  },
  {
    icon: Briefcase,
    title: 'Comercial',
    email: EMAIL_ALIASES.tech.comercial,
    desc: 'Cotações, condições para revenda e grande volume.',
  },
  {
    icon: Handshake,
    title: 'Parcerias',
    email: EMAIL_ALIASES.tech.parcerias,
    desc: 'Instaladores, oficinas e parceiros de serviço.',
  },
  {
    icon: Mail,
    title: 'AutoHub360 Pro',
    email: EMAIL_ALIASES.tech.pro,
    desc: 'Projetos B2B para frotas e profissionais.',
  },
];

export default async function ContatoPage({ searchParams }: Props) {
  const { assunto } = await searchParams;

  return (
    <>
      <section className="ah-hero-glow relative overflow-hidden text-white">
        <Container className="relative py-12 sm:py-16">
          <p className="mb-3 text-xs font-display font-bold uppercase tracking-[0.2em] text-ahblue-300">
            Fale com a gente
          </p>
          <h1 className="max-w-2xl font-display text-3xl font-extrabold leading-tight sm:text-5xl">
            {assunto === 'pro'
              ? 'AutoHub360 Pro — soluções para o seu negócio'
              : 'Vamos conversar sobre tecnologia'}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
            {assunto === 'pro'
              ? 'Oficinas, frotas, revendas e instaladores: conte seu cenário e montamos a solução certa — produtos, telemetria e instalação.'
              : 'Tire dúvidas, peça orçamentos ou proponha uma parceria. Respondemos em até 1 dia útil.'}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-300">
            <a
              href={whatsappLink(assunto === 'pro' ? 'pro' : 'general')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#25d366] px-4 py-2 font-semibold text-white transition-transform hover:scale-105"
            >
              <MessageCircle className="h-4.5 w-4.5" aria-hidden="true" />
              WhatsApp {BR.whatsapp}
            </a>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-ahblue-300" aria-hidden="true" />
              {BR.address.city} - {BR.address.state}, Brasil
            </span>
          </div>
        </Container>
      </section>

      <Section ariaLabel="Canais e formulário de contato" className="bg-surface-50">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="flex flex-col gap-4">
              {CHANNELS.map((c) => (
                <Card key={c.title} className="flex items-start gap-4 p-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-ahblue-500/10 text-ahblue-600">
                    <c.icon className="h-5.5 w-5.5" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="font-display text-base font-bold text-ink-900">{c.title}</h2>
                    <a
                      href={`mailto:${c.email}`}
                      className="text-sm font-semibold text-ahblue-600 hover:underline"
                    >
                      {c.email}
                    </a>
                    <p className="mt-1 text-[13px] leading-relaxed text-ink-500">{c.desc}</p>
                  </div>
                </Card>
              ))}
              <Card className="p-5">
                <h2 className="font-display text-base font-bold text-ink-900">
                  Horário de atendimento
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-500">
                  Segunda a sábado, horário comercial. Fora do horário, deixe sua mensagem pelo
                  formulário ou WhatsApp e retornaremos no próximo dia útil.
                </p>
              </Card>
            </div>

            <Card className="p-6 sm:p-8">
              <h2 className="mb-5 font-display text-xl font-extrabold text-ink-900">
                Formulário de contato
              </h2>
              <ContactForm initialDepartment={assunto} />
            </Card>
          </div>
        </Container>
      </Section>
    </>
  );
}
