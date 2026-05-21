import { create } from 'zustand';
import type { Artboard } from '@/utils/artboardUtils';

interface ArtboardsState {
  artboards: Artboard[];
  selectedArtboardId: string | null;
  setArtboards: (artboards: Artboard[]) => void;
  addArtboard: (artboard: Artboard) => void;
  updateArtboard: (id: string, updates: Partial<Artboard>) => void;
  deleteArtboard: (id: string) => void;
  duplicateArtboard: (id: string) => void;
  selectArtboard: (id: string | null) => void;
  getSelectedArtboard: () => Artboard | undefined;
}

export const useArtboardsStore = create<ArtboardsState>((set, get) => ({
  artboards: [
    {
      id: 'artboard-1',
      name: 'Desktop',
      width: 1920,
      height: 1080,
      left: 0,
      top: 0,
      backgroundColor: '#ffffff',
      visible: true,
      locked: false,
    },
  ],
  selectedArtboardId: 'artboard-1',

  setArtboards: (artboards) => set({ artboards }),

  addArtboard: (artboard) =>
    set((state) => ({
      artboards: [...state.artboards, artboard],
      selectedArtboardId: artboard.id,
    })),

  updateArtboard: (id, updates) =>
    set((state) => ({
      artboards: state.artboards.map((ab) =>
        ab.id === id ? { ...ab, ...updates } : ab
      ),
    })),

  deleteArtboard: (id) =>
    set((state) => {
      const filtered = state.artboards.filter((ab) => ab.id !== id);
      return {
        artboards: filtered.length > 0 ? filtered : state.artboards, // Keep at least one
        selectedArtboardId:
          state.selectedArtboardId === id
            ? filtered[0]?.id || null
            : state.selectedArtboardId,
      };
    }),

  duplicateArtboard: (id) =>
    set((state) => {
      const original = state.artboards.find((ab) => ab.id === id);
      if (!original) return state;

      const duplicate: Artboard = {
        ...original,
        id: `artboard-${Date.now()}`,
        name: `${original.name} copy`,
        left: original.left + original.width + 50,
      };

      return {
        artboards: [...state.artboards, duplicate],
        selectedArtboardId: duplicate.id,
      };
    }),

  selectArtboard: (id) => set({ selectedArtboardId: id }),

  getSelectedArtboard: () => {
    const state = get();
    return state.artboards.find((ab) => ab.id === state.selectedArtboardId);
  },
}));
