'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Menu,
  Search,
  ShoppingCart,
  User,
  Heart,
  X,
  ChevronRight,
  Truck,
  MapPin,
  Headset,
} from 'lucide-react';
import { LogoHorizontal } from '@autohub360/ui';
import { storeSite, UNIVERSES } from '@autohub360/config';
import { useCart } from '@autohub360/commerce';
import * as Dialog from '@radix-ui/react-dialog';

function UtilityBar() {
  return (
    <div className="bg-navy-950 text-slate-300">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-between gap-4 px-4 text-xs sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-5">
          <span className="inline-flex items-center gap-1.5 truncate">
            <Truck className="h-3.5 w-3.5 text-ahblue-400" aria-hidden="true" />
            Entrega para todo o Brasil
          </span>
          <span className="hidden items-center gap-1.5 sm:inline-flex">
            <MapPin className="h-3.5 w-3.5 text-ahorange-400" aria-hidden="true" />
            Retirada em Anápolis - GO
          </span>
          <span className="hidden items-center gap-1.5 md:inline-flex">
            <Headset className="h-3.5 w-3.5 text-ahblue-400" aria-hidden="true" />
            Suporte especializado
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/conta" className="inline-flex items-center gap-1.5 transition-colors hover:text-white">
            <User className="h-3.5 w-3.5" aria-hidden="true" />
            Minha conta
          </Link>
          <Link href="/conta?tab=favoritos" className="hidden items-center gap-1.5 transition-colors hover:text-white sm:inline-flex">
            <Heart className="h-3.5 w-3.5" aria-hidden="true" />
            Favoritos
          </Link>
          <Link href="/atendimento" className="hidden items-center gap-1.5 transition-colors hover:text-white lg:inline-flex">
            Atendimento
          </Link>
        </div>
      </div>
    </div>
  );
}

function SearchBar() {
  const router = useRouter();
  const [q, setQ] = useState('');

  return (
    <form
      role="search"
      className="hidden flex-1 md:flex"
      onSubmit={(e) => {
        e.preventDefault();
        if (q.trim()) router.push(`/buscar?q=${encodeURIComponent(q.trim())}`);
      }}
    >
      <label htmlFor="site-search" className="sr-only">
        O que você procura para o seu veículo ou para a sua casa?
      </label>
      <input
        id="site-search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="O que você procura para o seu veículo ou para a sua casa?"
        className="h-11 w-full rounded-l-[10px] border-2 border-r-0 border-surface-300 bg-white px-4 text-[15px] focus:border-ahblue-500 focus:outline-none"
      />
      <button
        type="submit"
        aria-label="Buscar"
        className="flex h-11 w-12 items-center justify-center rounded-r-[10px] bg-ahblue-500 text-white transition-colors hover:bg-ahblue-600"
      >
        <Search className="h-5 w-5" aria-hidden="true" />
      </button>
    </form>
  );
}

function CategoryNav({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <nav aria-label="Categorias da loja" className="hidden border-t border-surface-200 bg-white lg:block">
      <div className="mx-auto flex h-11 max-w-7xl items-center gap-1 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onOpenMenu}
          className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-display font-bold text-ink-900 transition-colors hover:bg-surface-100"
          aria-label="Abrir todas as categorias"
        >
          <Menu className="h-4 w-4" aria-hidden="true" />
          Todas as categorias
        </button>
        <span className="mx-2 h-5 w-px bg-surface-200" aria-hidden="true" />
        {storeSite.nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={
              item.highlight
                ? 'rounded-md px-3 py-1.5 text-sm font-display font-bold text-ahorange-500 transition-colors hover:bg-ahorange-500/10'
                : 'rounded-md px-3 py-1.5 text-sm font-medium text-ink-700 transition-colors hover:bg-surface-100 hover:text-ahblue-600'
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

      <header className="sticky top-0 z-40 border-b border-surface-200 bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:h-[72px] sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-ink-900 hover:bg-surface-100 lg:hidden"
            aria-label="Abrir menu"
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>

          <Link href="/" aria-label="AutoHub360 Store — início" className="shrink-0">
            <LogoHorizontal size="md" tagline={false} />
          </Link>

          <SearchBar />

          <div className="ml-auto flex items-center gap-1">
            <Link
              href="/conta"
              className="hidden h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium text-ink-700 hover:bg-surface-100 sm:flex"
            >
              <User className="h-5 w-5" aria-hidden="true" />
              <span className="hidden xl:inline">Minha conta</span>
            </Link>
            <Link
              href="/carrinho"
              className="relative flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium text-ink-700 hover:bg-surface-100"
              aria-label={`Carrinho com ${itemsCount} itens`}
            >
              <ShoppingCart className="h-5 w-5" aria-hidden="true" />
              <span className="hidden lg:inline">Carrinho</span>
              {mounted && itemsCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-ahorange-500 px-1 text-[11px] font-bold text-white">
                  {itemsCount}
                </span>
              )}
            </Link>
          </div>
        </div>
        <CategoryNav onOpenMenu={() => setMenuOpen(true)} />

        {/* Mobile sticky search trigger */}
        <div className="border-t border-surface-200 px-4 py-2 lg:hidden">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex h-10 w-full items-center gap-2 rounded-[10px] border border-surface-300 bg-surface-50 px-3 text-sm text-ink-500"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            O que você procura?
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm" />
          <Dialog.Content className="fixed inset-y-0 left-0 z-50 flex w-[86%] max-w-sm flex-col bg-white shadow-2xl focus:outline-none">
            <div className="flex items-center justify-between border-b border-surface-200 px-4 py-4">
              <LogoHorizontal size="sm" tagline={false} />
              <Dialog.Close
                className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-500 hover:bg-surface-100"
                aria-label="Fechar menu"
              >
                <X className="h-5 w-5" />
              </Dialog.Close>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-ink-500">Universos</p>
              <ul className="flex flex-col">
                {UNIVERSES.map((u) => (
                  <li key={u.key}>
                    <Link
                      href={`/categoria/${u.slug}`}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between rounded-lg px-3 py-3 text-[15px] font-medium text-ink-900 hover:bg-surface-100"
                    >
                      {u.label}
                      <ChevronRight className="h-4 w-4 text-ink-300" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/ofertas"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between rounded-lg px-3 py-3 text-[15px] font-display font-bold text-ahorange-500 hover:bg-ahorange-500/10"
                  >
                    Ofertas
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </li>
              </ul>
              <p className="mb-2 mt-6 text-xs font-bold uppercase tracking-wider text-ink-500">Institucional</p>
              <ul className="flex flex-col">
                {[
                  { href: '/kits', label: 'Kits e Combos' },
                  { href: '/veiculo', label: 'Buscar por veículo' },
                  { href: '/instalacao', label: 'Instalação em Anápolis' },
                  { href: '/atendimento', label: 'Atendimento' },
                  { href: '/conta', label: 'Minha conta' },
                  { href: 'https://autohub360.tech', label: 'AutoHub360.tech', ext: true },
                ].map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      {...('ext' in l && l.ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between rounded-lg px-3 py-3 text-[15px] font-medium text-ink-900 hover:bg-surface-100"
                    >
                      {l.label}
                      <ChevronRight className="h-4 w-4 text-ink-300" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Mobile search dialog */}
      <Dialog.Root open={searchOpen} onOpenChange={setSearchOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm" />
          <Dialog.Content className="fixed inset-x-0 top-0 z-50 bg-white p-4 shadow-2xl focus:outline-none">
            <Dialog.Title className="sr-only">Buscar produtos</Dialog.Title>
            <MobileSearch onDone={() => setSearchOpen(false)} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

function MobileSearch({ onDone }: { onDone: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState('');
  return (
    <form
      role="search"
      className="flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (q.trim()) {
          onDone();
          router.push(`/buscar?q=${encodeURIComponent(q.trim())}`);
        }
      }}
    >
      <label htmlFor="mobile-search" className="sr-only">
        Buscar produtos
      </label>
      <input
        id="mobile-search"
        autoFocus
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="O que você procura?"
        className="h-11 flex-1 rounded-[10px] border-2 border-surface-300 px-4 text-[15px] focus:border-ahblue-500 focus:outline-none"
      />
      <button
        type="submit"
        className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-ahblue-500 text-white"
        aria-label="Buscar"
      >
        <Search className="h-5 w-5" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={onDone}
        className="flex h-11 w-11 items-center justify-center rounded-[10px] text-ink-500 hover:bg-surface-100"
        aria-label="Fechar busca"
      >
        <X className="h-5 w-5" aria-hidden="true" />
      </button>
    </form>
  );
}
