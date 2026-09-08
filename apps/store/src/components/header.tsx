'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronRight,
  Headset,
  Heart,
  MapPin,
  Menu,
  Search,
  ShoppingCart,
  Truck,
  User,
  X,
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { LogoHorizontal } from '@autohub360/ui';
import { storeSite, UNIVERSES } from '@autohub360/config';
import { useCart } from '@autohub360/commerce';

function UtilityBar() {
  return (
    <div className="border-b border-white/[0.06] bg-[#020b16] text-slate-300">
      <div className="mx-auto flex h-8 max-w-[1380px] items-center justify-between gap-4 px-4 text-[10.5px] sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-5">
          <span className="inline-flex items-center gap-1.5 truncate">
            <Truck className="h-3.5 w-3.5 text-ahblue-400" aria-hidden="true" />
            Entrega para todo o Brasil
          </span>
          <span className="hidden items-center gap-1.5 sm:inline-flex">
            <MapPin className="h-3.5 w-3.5 text-white" aria-hidden="true" />
            Retirada em Anápolis - GO
          </span>
          <span className="hidden items-center gap-1.5 md:inline-flex">
            <Headset className="h-3.5 w-3.5 text-ahblue-400" aria-hidden="true" />
            Suporte especializado
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/conta" className="inline-flex items-center gap-1.5 hover:text-white">
            <User className="h-3.5 w-3.5" aria-hidden="true" />
            Minha conta
          </Link>
          <Link href="/conta?tab=favoritos" className="hidden items-center gap-1.5 hover:text-white sm:inline-flex">
            <Heart className="h-3.5 w-3.5" aria-hidden="true" />
            Favoritos
          </Link>
          <Link href="/atendimento" className="hidden hover:text-white lg:block">Atendimento</Link>
        </div>
      </div>
    </div>
  );
}

function SearchBar({ mobile = false, onDone }: { mobile?: boolean; onDone?: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState('');

  return (
    <form
      role="search"
      className={mobile ? 'flex w-full' : 'hidden min-w-0 flex-1 md:flex'}
      onSubmit={(e) => {
        e.preventDefault();
        if (q.trim()) {
          router.push(`/buscar?q=${encodeURIComponent(q.trim())}`);
          onDone?.();
        }
      }}
    >
      <label htmlFor={mobile ? 'site-search-mobile' : 'site-search'} className="sr-only">
        O que você procura para o seu veículo ou para a sua casa?
      </label>
      <input
        id={mobile ? 'site-search-mobile' : 'site-search'}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="O que você procura para o seu veículo ou para sua casa?"
        autoFocus={mobile}
        className="h-10 min-w-0 flex-1 rounded-l-[7px] border border-r-0 border-slate-300 bg-white px-4 text-[12px] text-slate-800 shadow-[0_5px_20px_rgba(0,0,0,.12)] placeholder:text-slate-500 focus:border-ahblue-500 focus:outline-none sm:h-11 sm:text-[13px]"
      />
      <button
        type="submit"
        aria-label="Buscar"
        className="ah-button flex h-10 w-11 items-center justify-center rounded-r-[7px] bg-ahblue-500 text-white transition-colors hover:bg-ahblue-600 sm:h-11 sm:w-12"
      >
        <Search className="h-[18px] w-[18px]" aria-hidden="true" />
      </button>
    </form>
  );
}

function CategoryNav({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <nav aria-label="Categorias da loja" className="hidden border-t border-white/[0.07] bg-[#06172a] lg:block">
      <div className="mx-auto flex h-9 max-w-[1380px] items-center gap-1 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onOpenMenu}
          className="inline-flex items-center gap-2 rounded-md px-2.5 py-1 text-[11px] font-semibold text-slate-200 transition-colors hover:bg-white/[0.07] hover:text-white"
          aria-label="Abrir todas as categorias"
        >
          Todas as categorias
          <ChevronRight className="h-3 w-3 rotate-90" aria-hidden="true" />
        </button>
        <span className="mx-1.5 h-4 w-px bg-white/10" aria-hidden="true" />
        {storeSite.nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={
              item.highlight
                ? 'rounded-md px-2.5 py-1 text-[11px] font-bold text-ahorange-400 hover:bg-ahorange-500/10'
                : 'rounded-md px-2.5 py-1 text-[11px] font-medium text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white'
            }
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const itemsCount = useCart((s) => s.lines.reduce((acc, l) => acc + l.quantity, 0));
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      <UtilityBar />
      <header className="ah-site-header sticky top-0 z-40 border-b border-white/10 bg-[#041326]/95 text-white shadow-[0_12px_32px_rgba(0,0,0,.22)] backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] max-w-[1380px] items-center gap-3 px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-100 hover:bg-white/10 lg:hidden"
            aria-label="Abrir menu"
          >
            <Menu className="h-5.5 w-5.5" aria-hidden="true" />
          </button>

          <Link href="/" aria-label="AutoHub360 Store — início" className="shrink-0">
            <LogoHorizontal size="md" tagline tone="light" />
          </Link>

          <div className="hidden h-8 w-px bg-white/10 md:block" aria-hidden="true" />
          <SearchBar />

          <div className="ml-auto flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-200 hover:bg-white/10 md:hidden"
              aria-label="Buscar"
            >
              <Search className="h-[19px] w-[19px]" aria-hidden="true" />
            </button>
            <Link
              href="/conta"
              className="hidden h-10 items-center gap-1.5 rounded-lg px-2.5 text-[11px] font-medium text-slate-200 hover:bg-white/[0.07] hover:text-white sm:flex"
            >
              <User className="h-[18px] w-[18px]" aria-hidden="true" />
              <span className="hidden xl:inline">Minha conta</span>
            </Link>
            <Link
              href="/conta?tab=favoritos"
              className="hidden h-10 w-10 items-center justify-center rounded-lg text-slate-200 hover:bg-white/[0.07] hover:text-white lg:flex"
              aria-label="Favoritos"
            >
              <Heart className="h-[18px] w-[18px]" aria-hidden="true" />
            </Link>
            <Link
              href="/carrinho"
              className="relative flex h-10 items-center gap-1.5 rounded-lg px-2.5 text-[11px] font-medium text-slate-100 hover:bg-white/[0.07]"
              aria-label={`Carrinho com ${itemsCount} itens`}
            >
              <ShoppingCart className="h-[19px] w-[19px]" aria-hidden="true" />
              <span className="hidden xl:inline">Carrinho</span>
              {mounted && itemsCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-ahorange-500 px-1 text-[9px] font-bold text-white">
                  {itemsCount}
                </span>
              )}
            </Link>
          </div>
        </div>
        <CategoryNav onOpenMenu={() => setMenuOpen(true)} />
      </header>

      <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-[#020912]/80 backdrop-blur-sm" />
          <Dialog.Content className="fixed inset-y-0 left-0 z-50 flex w-[88%] max-w-sm flex-col border-r border-white/10 bg-[#06182d] text-white shadow-2xl focus:outline-none">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
              <LogoHorizontal size="sm" tagline tone="light" />
              <Dialog.Close className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10" aria-label="Fechar menu">
                <X className="h-5 w-5" />
              </Dialog.Close>
            </div>
            <div className="ah-scroll-slim flex-1 overflow-y-auto p-4">
              <Dialog.Title className="sr-only">Categorias AutoHub360</Dialog.Title>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-ahblue-300">Universos</p>
              <ul className="grid grid-cols-2 gap-1.5">
                {UNIVERSES.map((u) => (
                  <li key={u.key}>
                    <Link
                      href={`/categoria/${u.slug}`}
                      onClick={() => setMenuOpen(false)}
                      className="flex min-h-11 items-center justify-between rounded-lg border border-white/8 bg-white/[0.035] px-3 py-2 text-[12px] font-medium text-slate-200 hover:border-ahblue-400/30 hover:bg-white/[0.07]"
                    >
                      {u.shortLabel}
                      <ChevronRight className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
                <li className="col-span-2">
                  <Link
                    href="/ofertas"
                    onClick={() => setMenuOpen(false)}
                    className="mt-1 flex items-center justify-between rounded-lg border border-ahorange-500/20 bg-ahorange-500/10 px-3 py-3 text-[12px] font-bold text-ahorange-300"
                  >
                    Ofertas da semana
                    <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </li>
              </ul>

              <p className="mb-2 mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Serviços</p>
              <ul className="space-y-0.5">
                {[
                  { href: '/kits', label: 'Kits e Combos' },
                  { href: '/veiculo', label: 'Buscar por veículo' },
                  { href: '/instalacao', label: 'Instalação em Anápolis' },
                  { href: '/atendimento', label: 'Atendimento' },
                  { href: '/conta', label: 'Minha conta' },
                  { href: 'https://autohub360.tech', label: 'Conheça AutoHub360.tech', ext: true },
                ].map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      {...('ext' in l && l.ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between rounded-lg px-3 py-2.5 text-[13px] text-slate-200 hover:bg-white/[0.06]"
                    >
                      {l.label}
                      <ChevronRight className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={searchOpen} onOpenChange={setSearchOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-[#020912]/80 backdrop-blur-md" />
          <Dialog.Content className="fixed left-1/2 top-5 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 rounded-2xl border border-white/10 bg-[#06182d] p-4 shadow-2xl focus:outline-none">
            <div className="mb-3 flex items-center justify-between">
              <Dialog.Title className="font-display text-sm font-bold text-white">Buscar na AutoHub360</Dialog.Title>
              <Dialog.Close className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white" aria-label="Fechar busca">
                <X className="h-4 w-4" />
              </Dialog.Close>
            </div>
            <SearchBar mobile onDone={() => setSearchOpen(false)} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
