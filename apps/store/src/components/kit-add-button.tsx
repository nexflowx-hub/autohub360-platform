'use client';

import { useState } from 'react';
import { Check, ShoppingCart } from 'lucide-react';
import { Button } from '@autohub360/ui';
import { useCart, type CartLine } from '@autohub360/commerce';

export interface KitLineInput {
  productId: string;
  slug: string;
  title: string;
  sku: string;
  imageKey: string;
  unitPriceCents: number;
  compareAtCents?: number;
  installable: boolean;
  universal: boolean;
  maxStock: number;
}

/** Adds every product of a kit to the cart in one action. */
export function KitAddButton({
  kitTitle,
  lines,
  disabled,
}: {
  kitTitle: string;
  lines: KitLineInput[];
  disabled?: boolean;
}) {
  const add = useCart((s) => s.add);
  const [added, setAdded] = useState(false);

  function onAdd() {
    for (const line of lines) {
      add(line as Omit<CartLine, 'quantity'>, 1);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  return (
    <Button size="lg" variant="primary" onClick={onAdd} disabled={disabled || lines.length === 0}>
      {added ? (
        <>
          <Check className="h-5 w-5" aria-hidden="true" />
          Kit adicionado!
        </>
      ) : (
        <>
          <ShoppingCart className="h-5 w-5" aria-hidden="true" />
          Adicionar kit ao carrinho
        </>
      )}
      <span className="sr-only">{kitTitle}</span>
    </Button>
  );
}
