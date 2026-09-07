'use client';

import { useEffect, useRef } from 'react';
import { track } from '@autohub360/analytics';

/** Fires the typed 'search' event once per mounted query/result combination. */
export function SearchTracker({ q, resultCount }: { q: string; resultCount: number }) {
  const fired = useRef('');
  useEffect(() => {
    const key = `${q}::${resultCount}`;
    if (fired.current === key) return;
    fired.current = key;
    track('search', { search_term: q, result_count: resultCount });
  }, [q, resultCount]);
  return null;
}
