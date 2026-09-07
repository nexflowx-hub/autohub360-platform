import Link from 'next/link';
import { Instagram, Facebook, Youtube, Mail, MessageCircle } from 'lucide-react';
import { CookiePreferencesLink, Container, LogoHorizontal, LogoStacked } from '@autohub360/ui';
import { BR, EU, EMAIL_ALIASES, SOCIAL, UNIVERSES, storeSite, whatsappLink } from '@autohub360/config';

const legalLinks: Array<[string, string]> = [
  ['/legal/termos-de-uso', 'Termos de uso'],
  ['/legal/privacidade-lgpd', 'Privacidade e LGPD'],
  ['/legal/politica-de-cookies', 'Cookies'],
  ['/legal/trocas-devolucoes-arrependimento', 'Trocas e devoluções'],
  ['/legal/garantia', 'Garantia'],
  ['/legal/termos-de-instalacao', 'Termos de instalação'],
  ['/legal/acessibilidade-contato', 'Acessibilidade'],
  ['/legal/eu-mentions-legales', 'Mentions légales (UE)'],
  ['/legal/eu-cgv', 'CGV (UE)'],
  ['/legal/eu-rgpd', 'RGPD (UE)'],
];

const institucionalLinks: Array<[string, string]> = [
  ['/sobre', 'Sobre a AutoHub360'],
  ['/pro', 'AutoHub360 Pro (B2B)'],
  ['/hub', 'Blog / Hub'],
  ['/contato', 'Contato'],
  ['/instalacao-anapolis', 'Instalação em Anápolis'],
  ['/go', 'Links rápidos'],
];

export function Footer() {
  return (
    <footer className="mt-auto bg-navy-950 text-slate-300">
      <Container className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <LogoHorizontal size="md" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
            Conteúdo, tecnologia e orientação especializada para o carro, para a casa e para o seu
            dia. A compra acontece na nossa loja online, com entrega para todo o Brasil e
            instalação especializada em Anápolis - GO.
          </p>
          <div className="mt-5 flex items-center gap-3">
            {SOCIAL.instagram && (
              <a
                href={SOCIAL.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram AutoHub360"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-ahblue-500"
              >
                <Instagram className="h-4.5 w-4.5" aria-hidden="true" />
              </a>
            )}
            {SOCIAL.facebook && (
              <a
                href={SOCIAL.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook AutoHub360"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-ahblue-500"
              >
                <Facebook className="h-4.5 w-4.5" aria-hidden="true" />
              </a>
            )}
            {SOCIAL.youtube && (
              <a
                href={SOCIAL.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube AutoHub360"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-ahblue-500"
              >
                <Youtube className="h-4.5 w-4.5" aria-hidden="true" />
              </a>
            )}
            <a
              href={whatsappLink('general')}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp AutoHub360"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-[#25d366]"
            >
              <MessageCircle className="h-4.5 w-4.5" aria-hidden="true" />
            </a>
          </div>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200">
            <MessageCircle className="h-3.5 w-3.5 text-ahblue-300" aria-hidden="true" />
            {BR.whatsapp}
          </p>
        </div>

        <nav aria-label="Universos na loja">
          <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-white">
            Universos
          </h3>
          <ul className="space-y-2.5 text-sm">
            {UNIVERSES.map((u) => (
              <li key={u.key}>
                <a
                  href={`${storeSite.url}/categoria/${u.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white"
                >
                  {u.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={`${storeSite.url}/ofertas`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-ahorange-400 transition-colors hover:text-ahorange-300"
              >
                Ofertas da loja
              </a>
            </li>
          </ul>
        </nav>

        <nav aria-label="Institucional">
          <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-white">
            Institucional
          </h3>
          <ul className="space-y-2.5 text-sm">
            {institucionalLinks.map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="transition-colors hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={`mailto:${EMAIL_ALIASES.tech.contato}`}
                className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
              >
                <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                {EMAIL_ALIASES.tech.contato}
              </a>
            </li>
          </ul>
        </nav>

        <nav aria-label="Documentos legais">
          <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-white">
            Legal
          </h3>
          <ul className="space-y-2.5 text-sm">
            {legalLinks.map(([href, label]) => (
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
        <Container className="flex flex-col gap-4 py-6 text-xs text-slate-400 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-3">
            <LogoStacked size="md" className="hidden shrink-0 xl:flex" />
            <div className="max-w-3xl space-y-1.5">
              <p>
                <strong className="text-slate-200">{BR.legalName}</strong> — CNPJ {BR.cnpj} ·{' '}
                {BR.address.street}, {BR.address.district}, {BR.address.city} - {BR.address.state},
                CEP {BR.address.zip}, {BR.address.country}.
              </p>
              <p>{EU.operatorWording} SIREN {EU.operator.siren} · RCS {EU.operator.rcs}.</p>
              <p>
                Atendimento: WhatsApp {BR.whatsapp} · <CookiePreferencesLink /> ·{' '}
                <Link href="/contato" className="hover:text-white">
                  Fale conosco
                </Link>
              </p>
              <p className="pt-1 font-medium text-slate-300">
                Tecnologia move melhores caminhos. · © 2026 AutoHub360. Todos os direitos
                reservados.
              </p>
            </div>
          </div>
          <a
            href={storeSite.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-[10px] border border-white/15 px-3.5 py-2 font-display text-xs font-bold text-white transition-colors hover:bg-white/10"
          >
            Comprar na loja → autohub360.store
          </a>
        </Container>
      </div>
    </footer>
  );
}
