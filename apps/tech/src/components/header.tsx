'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ChevronRight, Menu, ShoppingCart, X } from 'lucide-react';
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
    <header className="sticky top-0 z-40 border-b border-surface-200 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:h-[72px] sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-ink-900 hover:bg-surface-100 lg:hidden"
          aria-label="Abrir menu"
        >
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>

        <Link href="/" aria-label="AutoHub360 — página inicial" className="shrink-0">
          <LogoHorizontal size="md" tagline={false} />
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
                    className={`relative flex items-center px-2.5 text-[13px] font-medium transition-colors hover:text-ahblue-600 xl:px-3 xl:text-sm ${
                      active ? 'text-ahblue-600' : 'text-ink-700'
                    }`}
                  >
                    {item.label}
                    {active && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-ahblue-500 xl:inset-x-3"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-3">
          <a
            href={storeSite.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-[10px] bg-ahblue-500 px-3.5 font-display text-sm font-bold text-white shadow-[0_4px_14px_rgb(30_111_235/0.35)] transition-colors hover:bg-ahblue-600 sm:px-4"
          >
            <ShoppingCart className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Comprar na loja</span>
            <span className="sr-only sm:hidden">Comprar na loja AutoHub360</span>
          </a>
        </div>
      </div>

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
            <div className="ah-scroll-slim flex-1 overflow-y-auto p-4">
              <Dialog.Title className="sr-only">Menu de navegação</Dialog.Title>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-ink-500">Navegação</p>
              <ul className="flex flex-col">
                {techSite.nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      aria-current={isActive(pathname, item.href) ? 'page' : undefined}
                      className={`flex items-center justify-between rounded-lg px-3 py-3 text-[15px] font-medium hover:bg-surface-100 ${
                        isActive(pathname, item.href) ? 'text-ahblue-600' : 'text-ink-900'
                      }`}
                    >
                      {item.label}
                      <ChevronRight className="h-4 w-4 text-ink-300" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>

              <p className="mb-2 mt-6 text-xs font-bold uppercase tracking-wider text-ink-500">
                Universos na loja
              </p>
              <ul className="flex flex-col">
                {UNIVERSES.map((u) => (
                  <li key={u.key}>
                    <a
                      href={`${storeSite.url}/categoria/${u.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between rounded-lg px-3 py-3 text-[15px] font-medium text-ink-900 hover:bg-surface-100"
                    >
                      {u.label}
                      <ChevronRight className="h-4 w-4 text-ink-300" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>

              <a
                href={storeSite.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="mt-6 flex h-12 items-center justify-center gap-2 rounded-[10px] bg-ahblue-500 font-display text-[15px] font-bold text-white shadow-[0_4px_14px_rgb(30_111_235/0.35)] transition-colors hover:bg-ahblue-600"
              >
                <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                Comprar na loja
              </a>
              <p className="mt-4 text-center text-xs text-ink-500">
                autohub360.tech — conteúdo e tecnologia. Compra com entrega para todo o Brasil em
                autohub360.store.
              </p>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </header>
  );
}
