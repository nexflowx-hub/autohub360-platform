'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Selection } from '@autohub360/catalog';

export interface GarageVehicle extends Selection {
  id: string;
  label: string;
  savedAt: string;
}

interface FitmentState {
  /** Vehicle actively used for fitment checks (persisted locally). */
  selected: Selection;
  /** Saved vehicles ("garage") — synced to profile when authenticated. */
  garage: GarageVehicle[];
  setVehicle: (s: Selection, label?: string) => void;
  clearVehicle: () => void;
  saveToGarage: (label: string) => void;
  removeFromGarage: (id: string) => void;
}

export const useFitmentStore = create<FitmentState>()(
  persist(
    (set, get) => ({
      selected: {},
      garage: [],
      setVehicle: (s) => set({ selected: s }),
      clearVehicle: () => set({ selected: {} }),
      saveToGarage: (label) => {
        const { selected, garage } = get();
        if (!selected.versionId) return;
        const exists = garage.some((g) => g.versionId === selected.versionId);
        if (exists) return;
        set({
          garage: [
            ...garage,
            {
              id: `gar-${selected.versionId}`,
              label,
              savedAt: new Date().toISOString(),
              ...selected,
            },
          ],
        });
      },
      removeFromGarage: (id) => set({ garage: get().garage.filter((g) => g.id !== id) }),
    }),
    { name: 'autohub360.fitment' },
  ),
);

export type { Selection };
