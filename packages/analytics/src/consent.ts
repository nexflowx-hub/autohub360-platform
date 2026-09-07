'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ConsentCategory = 'necessary' | 'analytics' | 'marketing' | 'personalization';

export interface ConsentPrefs {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
  decidedAt: string;
}

interface ConsentState {
  consent: ConsentPrefs | null;
  setConsent: (p: Omit<ConsentPrefs, 'necessary' | 'decidedAt'>) => void;
  acceptAll: () => void;
  rejectAll: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
}

export const useConsent = create<ConsentState>()(
  persist(
    (set) => ({
      consent: null,
      open: false,
      setOpen: (v) => set({ open: v }),
      setConsent: (p) =>
        set({
          consent: { ...p, necessary: true, decidedAt: new Date().toISOString() },
          open: false,
        }),
      acceptAll: () =>
        set({
          consent: {
            necessary: true,
            analytics: true,
            marketing: true,
            personalization: true,
            decidedAt: new Date().toISOString(),
          },
          open: false,
        }),
      rejectAll: () =>
        set({
          consent: {
            necessary: true,
            analytics: false,
            marketing: false,
            personalization: false,
            decidedAt: new Date().toISOString(),
          },
          open: false,
        }),
    }),
    { name: 'autohub360.consent' },
  ),
);
