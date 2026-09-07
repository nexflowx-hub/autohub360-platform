import type { Metadata } from 'next';
import {
  ShoppingCart,
  Percent,
  Wrench,
  MessageCircle,
  Briefcase,
  Info,
  Instagram,
  Facebook,
  Youtube,
} from 'lucide-react';
import { LogoStacked } from '@autohub360/ui';
import { BRAND, SOCIAL, whatsappLink } from '@autohub360/config';

export const metadata: Metadata = {
  title: 'AutoHub360 — Links',
  description:
    'Todos os links oficiais da AutoHub360: loja, ofertas, instalação em Anápolis, WhatsApp e Pro.',
};

const LINKS = [
  {
    icon: ShoppingCart,
    label: 'Comprar na loja',
    desc: 'autohub360.store',
    href: 'https://autohub360.store',
    accent: 'bg-ahblue-500',
  },
  {
    icon: Percent,
    label: 'Ofertas da semana',
    desc: 'descontos de verdade',
    href: 'https://autohub360.store/ofertas',
    accent: 'bg-ahorange-500',
  },
  {
    icon: Wrench,
    label: 'Instalação em Anápolis',
    desc: 'agende com nosso parceiro oficial',
    href: 'https://autohub360.store/instalacao',
    accent: 'bg-ahblue-600',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    desc: '+55 (62) 99190-3462',
    href: whatsappLink('general'),
    accent: 'bg-[#25d366]',
  },
  {
    icon: Briefcase,
    label: 'AutoHub360 Pro',
    desc: 'soluções para empresas',
    href: '/contato?assunto=pro',
    accent: 'bg-navy-700',
  },
  {
    icon: Info,
    label: 'Sobre a AutoHub360',
    desc: 'quem somos e como funciona',
    href: '/sobre',
    accent: 'bg-navy-600',
  },
];

export default function GoPage() {
  return (
    <div className="ah-dark min-h-screen bg-navy-950">
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center px-5 py-12">
        <LogoStacked size="lg" className="mb-3" />
        <p className="text-center text-sm text-slate-400">
          {BRAND.proposition}
        </p>

        <ul className="mt-9 flex w-full flex-col gap-3">
          {LINKS.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                {...(l.href.startsWith('http')
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
                className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.06] p-4 transition-all hover:border-ahblue-400/50 hover:bg-white/10 active:scale-[0.99]"
              >
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-white ${l.accent}`}
                >
                  <l.icon className="h-5.5 w-5.5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-[15px] font-bold text-white">
                    {l.label}
                  </span>
                  <span className="block truncate text-xs text-slate-400">{l.desc}</span>
                </span>
                <span
                  aria-hidden="true"
                  className="text-slate-500 transition-transform group-hover:translate-x-0.5"
                >
                  →
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-9 flex items-center gap-3">
          {SOCIAL.instagram && (
            <a
              href={SOCIAL.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-slate-300 transition-colors hover:bg-ahblue-500 hover:text-white"
            >
              <Instagram className="h-5 w-5" aria-hidden="true" />
            </a>
          )}
          {SOCIAL.facebook && (
            <a
              href={SOCIAL.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-slate-300 transition-colors hover:bg-ahblue-500 hover:text-white"
            >
              <Facebook className="h-5 w-5" aria-hidden="true" />
            </a>
          )}
          {SOCIAL.youtube && (
            <a
              href={SOCIAL.youtube}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-slate-300 transition-colors hover:bg-ahblue-500 hover:text-white"
            >
              <Youtube className="h-5 w-5" aria-hidden="true" />
            </a>
          )}
        </div>

        <p className="mt-10 text-center text-xs italic text-slate-500">
          Tecnologia move melhores caminhos.
        </p>
      </div>
    </div>
  );
}
