'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ChevronRight, Menu, Search, ShoppingCart, X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { LogoHorizontal } from '@autohub360/ui';
import { storeSite, techSite, UNIVERSES } from '@autohub360/config';

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#041326]/95 text-white shadow-[0_12px_32px_rgba(0,0,0,.24)] backdrop-blur-xl">
      <div className="mx-auto flex h-[70px] max-w-[1380px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-100 transition-colors hover:bg-white/10 lg:hidden"
          aria-label="Abrir menu"
        >
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>

        <Link href="/" aria-label="AutoHub360 — página inicial" className="shrink-0">
          <LogoHorizontal size="md" tagline tone="light" />
        </Link>

        <nav aria-label="Navegação principal" className="ml-auto hidden h-full lg:block">
          <ul className="flex h-full items-stretch">
            {techSite.nav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href} className="flex items-stretch">
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={`relative flex items-center px-2.5 text-[12px] font-medium tracking-[-0.01em] transition-colors xl:px-3 xl:text-[13px] ${
                      active ? 'text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {item.label}
                    {active && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-2.5 bottom-0 h-[3px] rounded-t-full bg-ahblue-500 shadow-[0_-4px_12px_rgba(30,111,235,.55)] xl:inset-x-3"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1 lg:ml-2">
          <Link
            href="/hub"
            aria-label="Pesquisar no Hub AutoHub360"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Search className="h-[19px] w-[19px]" aria-hidden="true" />
          </Link>
          <a
            href={storeSite.url}
            aria-label="Ir para a loja AutoHub360"
            className="flex h-10 items-center gap-2 rounded-lg border border-white/10 px-2.5 text-slate-100 transition-all hover:border-ahblue-400/50 hover:bg-ahblue-500/10 sm:px-3"
          >
            <ShoppingCart className="h-[19px] w-[19px]" aria-hidden="true" />
            <span className="hidden text-xs font-semibold xl:inline">Loja</span>
          </a>
        </div>
      </div>

      <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-[#020912]/80 backdrop-blur-sm" />
          <Dialog.Content className="fixed inset-y-0 left-0 z-50 flex w-[88%] max-w-sm flex-col border-r border-white/10 bg-[#06182d] text-white shadow-2xl focus:outline-none">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
              <LogoHorizontal size="sm" tagline tone="light" />
              <Dialog.Close
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10 hover:text-white"
                aria-label="Fechar menu"
              >
                <X className="h-5 w-5" />
              </Dialog.Close>
            </div>
            <div className="ah-scroll-slim flex-1 overflow-y-auto p-4">
              <Dialog.Title className="sr-only">Menu de navegação</Dialog.Title>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-ahblue-300">Navegação</p>
              <ul className="flex flex-col gap-0.5">
                {techSite.nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      aria-current={isActive(pathname, item.href) ? 'page' : undefined}
                      className={`flex items-center justify-between rounded-lg px-3 py-3 text-[14px] font-medium transition-colors ${
                        isActive(pathname, item.href)
                          ? 'bg-ahblue-500/15 text-ahblue-300'
                          : 'text-slate-200 hover:bg-white/7 hover:text-white'
                      }`}
                    >
                      {item.label}
                      <ChevronRight className="h-4 w-4 text-slate-500" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>

              <p className="mb-2 mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-ahblue-300">Universos</p>
              <ul className="grid grid-cols-2 gap-1.5">
                {UNIVERSES.map((u) => (
                  <li key={u.key}>
                    <a
                      href={`${storeSite.url}/categoria/${u.slug}`}
                      onClick={() => setMenuOpen(false)}
                      className="flex min-h-11 items-center justify-between rounded-lg border border-white/8 bg-white/[0.035] px-3 py-2 text-[12px] font-medium text-slate-200 hover:border-ahblue-400/30 hover:bg-white/[0.07]"
                    >
                      {u.shortLabel}
                      <ChevronRight className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>

              <a
                href={storeSite.url}
                onClick={() => setMenuOpen(false)}
                className="mt-6 flex h-12 items-center justify-center gap-2 rounded-[9px] bg-ahblue-500 font-display text-[14px] font-bold text-white shadow-[0_8px_22px_rgba(30,111,235,.28)] hover:bg-ahblue-600"
              >
                <ShoppingCart className="h-4.5 w-4.5" aria-hidden="true" />
                Comprar na AutoHub360.store
              </a>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </header>
  );
}
