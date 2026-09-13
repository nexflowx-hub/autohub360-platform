import Link from 'next/link';
import { Facebook, Headset, Instagram, Mail, MapPin, MessageCircle, ShieldCheck, Truck, Youtube } from 'lucide-react';
import { Container, CookiePreferencesLink, LogoHorizontal, LogoStacked, PaymentMethods } from '@autohub360/ui';
import { BR, EU, MARKETS, SOCIAL, UNIVERSES, paymentsConfig, whatsappLink, type MarketCode } from '@autohub360/config';

const SUPPORT_LINKS = [
  { href: '/rastrear', label: 'Rastrear pedido' },
  { href: '/pos-venda', label: 'Pós-venda e assistência' },
  { href: '/atendimento', label: 'Atendimento' },
  { href: '/instalacao', label: 'Instalação em Anápolis' },
  { href: '/kits', label: 'Kits e combos' },
  { href: '/conta/pedidos', label: 'Meus pedidos' },
  { href: '/legal/trocas-devolucoes-arrependimento', label: 'Trocas e devoluções' },
  { href: '/legal/garantia', label: 'Garantia' },
  { href: '/legal/entrega-e-frete', label: 'Entrega e frete' },
  { href: '/legal/pagamentos-e-seguranca', label: 'Pagamentos e segurança' },
  { href: '/canal-de-reclamacoes', label: 'Canal de reclamações' },
] as const;

const INSTITUTIONAL_LINKS = [
  { href: 'https://autohub360.tech/sobre', label: 'Sobre a AutoHub360' },
  { href: 'https://autohub360.tech/pro', label: 'AutoHub360 Pro (B2B)' },
  { href: 'https://autohub360.tech/hub', label: 'Blog / Hub' },
  { href: '/legal/termos-de-uso', label: 'Termos de uso' },
  { href: '/legal/termos-e-condicoes-de-venda', label: 'Termos de venda' },
  { href: '/legal/privacidade-lgpd', label: 'Privacidade e LGPD' },
  { href: '/legal/politica-de-cookies', label: 'Cookies' },
  { href: '/legal/termos-de-instalacao', label: 'Termos de instalação' },
  { href: '/legal/acessibilidade-contato', label: 'Acessibilidade' },
] as const;

export function Footer({ market: marketCode = 'BR' }: { market?: MarketCode }) {
  const market = MARKETS[marketCode];
  const payCfg = paymentsConfig({ PAYMENT_PROVIDER: process.env.PAYMENT_PROVIDER });
  const trust = marketCode === 'BR'
    ? [
        { icon: Truck, title: 'Entrega nacional', sub: 'Para todo o Brasil' },
        { icon: MapPin, title: 'Retirada local', sub: 'Em Anápolis - GO' },
        { icon: ShieldCheck, title: 'Compra segura', sub: 'Seus dados protegidos' },
        { icon: Headset, title: 'Suporte especializado', sub: 'Antes e depois da compra' },
      ]
    : [
        { icon: Truck, title: 'Europa', sub: 'Logística em homologação' },
        { icon: MapPin, title: 'Catálogo em EUR', sub: 'Ofertas por mercado' },
        { icon: ShieldCheck, title: 'Privacidade', sub: 'Arquitetura preparada para UE' },
        { icon: Headset, title: 'Suporte', sub: 'Humano + IA supervisionada' },
      ];
  const instagram = SOCIAL.instagram;
  const facebook = SOCIAL.facebook;
  const youtube = SOCIAL.youtube;

  return <footer className="mt-auto bg-navy-950 text-slate-300">
    <div className="border-b border-white/10"><Container className="grid grid-cols-2 gap-5 py-7 lg:grid-cols-4">{trust.map((t)=><div key={t.title} className="flex items-center gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/8 text-ahblue-300"><t.icon className="h-5 w-5" aria-hidden="true"/></span><div className="min-w-0"><p className="truncate text-sm font-semibold text-white">{t.title}</p><p className="truncate text-xs text-slate-400">{t.sub}</p></div></div>)}</Container></div>
    <Container className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-5">
      <div className="lg:col-span-2"><LogoHorizontal size="md"/><p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">Tecnologia para o carro, para a casa e para o seu dia. Peças, acessórios, eletrônicos, segurança e soluções inteligentes com uma operação preparada para Brasil e Europa.</p><div className="mt-5 flex items-center gap-3">{instagram?<a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram AutoHub360" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-ahblue-500"><Instagram className="h-4.5 w-4.5"/></a>:null}{facebook?<a href={facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook AutoHub360" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-ahblue-500"><Facebook className="h-4.5 w-4.5"/></a>:null}{youtube?<a href={youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube AutoHub360" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-ahblue-500"><Youtube className="h-4.5 w-4.5"/></a>:null}<a href={whatsappLink('support')} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp AutoHub360" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-[#25d366]"><MessageCircle className="h-4.5 w-4.5"/></a></div><div className="mt-6"><PaymentMethods config={payCfg} market={marketCode}/></div></div>
      <nav aria-label="Categorias"><h3 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-white">Categorias</h3><ul className="space-y-2.5 text-sm">{UNIVERSES.map((u)=><li key={u.key}><Link href={`/categoria/${u.slug}`} className="hover:text-white">{u.label}</Link></li>)}<li><Link href="/ofertas" className="font-semibold text-ahorange-400 hover:text-ahorange-300">Ofertas</Link></li></ul></nav>
      <nav aria-label="Ajuda e suporte"><h3 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-white">Ajuda e suporte</h3><ul className="space-y-2.5 text-sm">{SUPPORT_LINKS.map(({href,label})=><li key={href}><Link href={href} className="hover:text-white">{label}</Link></li>)}</ul></nav>
      <nav aria-label="Institucional"><h3 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-white">Institucional</h3><ul className="space-y-2.5 text-sm">{INSTITUTIONAL_LINKS.map(({href,label})=><li key={href}><Link href={href} className="hover:text-white">{label}</Link></li>)}</ul></nav>
    </Container>
    <div className="border-t border-white/10"><Container className="flex flex-col gap-4 py-6 text-xs text-slate-400 lg:flex-row lg:items-center lg:justify-between"><div className="flex items-start gap-3"><LogoStacked size="md" className="hidden xl:flex"/><div className="max-w-3xl space-y-1.5"><p><strong className="text-slate-200">{BR.legalName}</strong> — CNPJ {BR.cnpj}.</p><p>{EU.operatorWording} SIREN {EU.operator.siren} · RCS {EU.operator.rcs}.</p><p>Atendimento: WhatsApp {BR.whatsapp} · <a href="mailto:suporte@autohub360.store" className="inline-flex items-center gap-1 hover:text-white"><Mail className="h-3 w-3"/>suporte@autohub360.store</a> · Preços e condições exclusivos para o site.</p><p>Mercado selecionado: <strong className="text-slate-200">{market.name}</strong> · moeda {market.currency} · <CookiePreferencesLink/> · <Link href="https://autohub360.tech" className="hover:text-white">autohub360.tech</Link>.</p></div></div><p className="shrink-0">© 2026 AutoHub360. Todos os direitos reservados.</p></Container></div>
  </footer>;
}
