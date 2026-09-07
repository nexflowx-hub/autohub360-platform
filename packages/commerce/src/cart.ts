'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { track } from '@autohub360/analytics';
import { INSTALLATION_FEE_CENTS } from './pricing';

export interface CartLine {
  productId: string;
  slug: string;
  title: string;
  sku: string;
  imageKey: string;
  unitPriceCents: number;
  compareAtCents?: number;
  quantity: number;
  installation: boolean;
  installable: boolean;
  universal: boolean;
  maxStock: number;
}

interface CartState {
  lines: CartLine[];
  add: (line: Omit<CartLine, 'quantity'>, qty?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  setInstallation: (productId: string, on: boolean) => void;
  clear: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      add: (line, qty = 1) => {
        const lines = [...get().lines];
        const idx = lines.findIndex((l) => l.productId === line.productId);
        if (idx >= 0) {
          const cur = lines[idx]!;
          lines[idx] = { ...cur, quantity: Math.min(cur.quantity + qty, cur.maxStock || 99) };
        } else {
          lines.push({ ...line, quantity: qty });
        }
        set({ lines });
        track('add_to_cart', {
          item_id: line.productId,
          item_name: line.title,
          sku: line.sku,
          value: line.unitPriceCents / 100,
          quantity: qty,
        });
      },
      remove: (productId) => set({ lines: get().lines.filter((l) => l.productId !== productId) }),
      setQty: (productId, qty) => {
        const lines = get()
          .lines.map((l) =>
            l.productId === productId
              ? { ...l, quantity: Math.max(1, Math.min(qty, l.maxStock || 99)) }
              : l,
          )
          .filter((l) => l.quantity > 0);
        set({ lines });
      },
      setInstallation: (productId, on) => {
        const lines = get().lines.map((l) =>
          l.productId === productId ? { ...l, installation: on && l.installable } : l,
        );
        set({ lines });
      },
      clear: () => set({ lines: [] }),
    }),
    { name: 'autohub360.cart' },
  ),
);

export function cartTotals(lines: CartLine[]) {
  const subtotalCents = lines.reduce((s, l) => s + l.unitPriceCents * l.quantity, 0);
  const installationCents = lines.reduce(
    (s, l) => (l.installation ? s + INSTALLATION_FEE_CENTS * l.quantity : s),
    0,
  );
  const itemsCount = lines.reduce((s, l) => s + l.quantity, 0);
  return { subtotalCents, installationCents, itemsCount, discountCents: 0, shippingCents: 0 };
}
