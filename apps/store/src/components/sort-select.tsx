'use client';

import { useRouter } from 'next/navigation';
import { ArrowUpDown } from 'lucide-react';
import { Select } from '@autohub360/ui';
import { SORT_OPTIONS, type SortId } from '@/lib/sort';

interface Props {
  basePath: string;
  /** Extra params preserved when sorting changes (e.g. q, universo). */
  keep?: Record<string, string | undefined>;
  current?: string;
}

/** Sort control that rewrites the URL (server re-renders sorted results). */
export function SortSelect({ basePath, keep = {}, current }: Props) {
  const router = useRouter();

  function onChange(sort: string) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(keep)) {
      if (value) params.set(key, value);
    }
    if (sort && sort !== 'relevance') params.set('sort', sort);
    const qs = params.toString();
    router.push(qs ? `${basePath}?${qs}` : basePath, { scroll: false });
  }

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="h-4 w-4 shrink-0 text-ink-500" aria-hidden="true" />
      <label htmlFor="sort-select" className="sr-only">
        Ordenar resultados
      </label>
      <Select
        id="sort-select"
        className="h-10 w-full sm:w-56"
        value={current ?? 'relevance'}
        onChange={(e) => onChange(e.target.value)}
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </Select>
    </div>
  );
}

export type { SortId };
