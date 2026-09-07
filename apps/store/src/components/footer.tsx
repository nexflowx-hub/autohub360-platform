import Link from 'next/link';
import {
  Truck,
  MapPin,
  ShieldCheck,
  Headset,
  Instagram,
  Facebook,
  Youtube,
  Mail,
  MessageCircle,
} from 'lucide-react';
import {
  LogoHorizontal,
  LogoStacked,
  PaymentMethods,
  Container,
} from '@autohub360/ui';
import { BR, MARKETS, UNIVERSES, paymentsConfig, SOCIAL, whatsappLink } from '@autohub360/config';
import { CookiePreferencesLink } from '@autohub360/ui';

const trust = [
  { icon: Truck, title: 'Entrega nacional', sub: 'Para todo o Brasil' },
  { icon: MapPin, title: 'Retirada local', sub: 'Em Anápolis - GO' },
  { icon: ShieldCheck, title: 'Compra segura', sub: 'Seus dados protegidos' },
  { icon: Headset, title: 'Suporte especializado', sub: 'Antes e depois da compra' },
];

export function Footer() {
  const market = MARKETS.BR;
  const payCfg = paymentsConfig({ PAYMENT_PROVIDER: process.env.PAYMENT_PROVIDER });

  return (
    <footer className="mt-auto bg-navy-950 text-slate-300">
      {/* Trust strip */}
      <div className="border-b border-white/10">
        <Container className="grid grid-cols-2 gap-5 py-7 lg:grid-cols-4">
          {trust.map((t) => (
            <div key={t.title} className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/8 text-ahblue-300">
                <t.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{t.title}</p>
                <p className="truncate text-xs text-slate-400">{t.sub}</p>
              </div>
            </div>
          ))}
        </Container>
      </div>

      <Container className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <LogoHorizontal size="md" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
            Tecnologia para o carro, para a casa e para o seu dia. Peças, acessórios, eletrônicos,
            segurança e soluções inteligentes com instalação especializada.
          </p>
          <div className="mt-5 flex items-center gap-3">
            {SOCIAL.instagram && (
              <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram AutoHub360" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-ahblue-500">
                <Instagram className="h-4.5 w-4.5" aria-hidden="true" />
              </a>
            )}
            {SOCIAL.facebook && (
              <a href={SOCIAL.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook AutoHub360" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-ahblue-500">
                <Facebook className="h-4.5 w-4.5" aria-hidden="true" />
              </a>
            )}
            {SOCIAL.youtube && (
              <a href={SOCIAL.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube AutoHub360" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-ahblue-500">
                <Youtube className="h-4.5 w-4.5" aria-hidden="true" />
              </a>
            )}
            <a href={whatsappLink('support')} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp AutoHub360" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-[#25d366]">
              <MessageCircle className="h-4.5 w-4.5" aria-hidden="true" />
            </a>
          </div>
          <div className="mt-6">
            <PaymentMethods config={payCfg} market="BR" />
          </div>
        </div>

        <nav aria-label="Categorias">
          <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-white">Categorias</h3>
          <ul className="space-y-2.5 text-sm">
            {UNIVERSES.map((u) => (
              <li key={u.key}>
                <Link href={`/categoria/${u.slug}`} className="transition-colors hover:text-white">
                  {u.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/ofertas" className="font-semibold text-ahorange-400 transition-colors hover:text-ahorange-300">
                Ofertas
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Ajuda e suporte">
          <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-white">Ajuda e suporte</h3>
          <ul className="space-y-2.5 text-sm">
            {[
              ['/atendimento', 'Atendimento'],
              ['/instalacao', 'Instalação em Anápolis'],
              ['/kits', 'Kits e combos'],
              ['/conta/pedidos', 'Meus pedidos'],
              ['/legal/trocas-devolucoes-arrependimento', 'Trocas e devoluções'],
              ['/legal/garantia', 'Garantia'],
              ['/legal/entrega-e-frete', 'Entrega e frete'],
              ['/legal/pagamentos-e-seguranca', 'Pagamentos e segurança'],
              ['/canal-de-reclamacoes', 'Canal de reclamações'],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="transition-colors hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Institucional">
          <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-white">Institucional</h3>
          <ul className="space-y-2.5 text-sm">
            {[
              ['https://autohub360.tech/sobre', 'Sobre a AutoHub360'],
              ['https://autohub360.tech/pro', 'AutoHub360 Pro (B2B)'],
              ['https://autohub360.tech/hub', 'Blog / Hub'],
              ['/legal/termos-de-uso', 'Termos de uso'],
              ['/legal/termos-e-condicoes-de-venda', 'Termos de venda'],
              ['/legal/privacidade-lgpd', 'Privacidade e LGPD'],
              ['/legal/politica-de-cookies', 'Cookies'],
              ['/legal/termos-de-instalacao', 'Termos de instalação'],
              ['/legal/acessibilidade-contato', 'Acessibilidade'],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="transition-colors hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>

      {/* Legal bar */}
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-4 py-6 text-xs text-slate-400 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <LogoStacked size="md" className="hidden xl:flex" />
            <div className="max-w-3xl space-y-1.5">
              <p>
                <strong className="text-slate-200">{BR.legalName}</strong> — CNPJ {BR.cnpj} ·{' '}
                {BR.address.street}, {BR.address.district}, {BR.address.city} - {BR.address.state}, CEP{' '}
                {BR.address.zip}, {BR.address.country}.
              </p>
              <p>
                Atendimento: WhatsApp {BR.whatsapp} ·{' '}
                <a href="mailto:suporte@autohub360.store" className="inline-flex items-center gap-1 hover:text-white">
                  <Mail className="h-3 w-3" aria-hidden="true" />
                  suporte@autohub360.store
                </a>{' '}
                · Preços e condições exclusivos para o site. Fotos meramente ilustrativas.
              </p>
              <p>
                Mercado ativo: <strong className="text-slate-200">{market.name}</strong> ·{' '}
                <CookiePreferencesLink /> ·{' '}
                <Link href="https://autohub360.tech" className="hover:text-white">
                  autohub360.tech
                </Link>{' '}
                · Tecnologia move melhores caminhos.
              </p>
            </div>
          </div>
          <p className="shrink-0">© 2026 AutoHub360. Todos os direitos reservados.</p>
        </Container>
      </div>
    </footer>
  );
}
