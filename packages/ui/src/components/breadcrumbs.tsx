import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../lib/cn';

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Trilha de navegação" className={cn('flex flex-wrap items-center gap-1 text-[13px]', className)}>
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-ink-500 transition-colors hover:text-ahblue-600"
      >
        <Home className="h-3.5 w-3.5" aria-hidden="true" />
        <span>Início</span>
      </Link>
      {items.map((item, i) => (
        <span key={`${item.label}-${i}`} className="inline-flex items-center gap-1">
          <ChevronRight className="h-3.5 w-3.5 text-ink-300" aria-hidden="true" />
          {item.href && i < items.length - 1 ? (
            <Link href={item.href} className="text-ink-500 transition-colors hover:text-ahblue-600">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-ink-900" aria-current="page">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}

/** JSON-LD helper for breadcrumbs (rendered from server components). */
export function breadcrumbJsonLd(items: Crumb[], baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: baseUrl },
      ...items.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name: c.label,
        ...(c.href ? { item: `${baseUrl}${c.href}` } : {}),
      })),
    ],
  };
}
