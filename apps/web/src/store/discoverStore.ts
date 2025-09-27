import { create } from 'zustand';
import type { Farm } from '@harvestlink/shared';

interface DiscoverState {
  postalCode: string;
  farms: Farm[];
  origin: { postalCode: string; lat: number; lng: number } | null;
  setResults: (payload: { postalCode: string; farms: Farm[]; origin: DiscoverState['origin'] }) => void;
}

export const useDiscoverStore = create<DiscoverState>((set) => ({
  postalCode: '',
  farms: [],
  origin: null,
  setResults: ({ postalCode, farms, origin }) => set({ postalCode, farms, origin }),
}));
