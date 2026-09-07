'use client';

import { useState } from 'react';
import { Check, Share2, Link2 } from 'lucide-react';

export function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // user canceled — fall through to copy
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex items-center gap-2 rounded-[10px] border border-surface-300 px-4 py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:border-ahblue-400 hover:text-ahblue-600"
    >
      {copied ? (
        <>
          <Check className="h-4.5 w-4.5 text-emerald-500" aria-hidden="true" />
          Link copiado!
        </>
      ) : (
        <>
          <Share2 className="h-4.5 w-4.5" aria-hidden="true" />
          Compartilhar produto
          <Link2 className="h-3.5 w-3.5 opacity-50" aria-hidden="true" />
        </>
      )}
    </button>
  );
}
