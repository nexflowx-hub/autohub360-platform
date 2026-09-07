'use client';

import { useState } from 'react';
import { Check, Link2 } from 'lucide-react';

export function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-ahblue-600 transition-colors hover:text-ahblue-700"
      aria-label="Copiar link do artigo"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-emerald-500" aria-hidden="true" />
          Link copiado!
        </>
      ) : (
        <>
          <Link2 className="h-4 w-4" aria-hidden="true" />
          Copiar link
        </>
      )}
    </button>
  );
}
