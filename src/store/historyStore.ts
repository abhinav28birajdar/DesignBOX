import { create } from "zustand";

export interface HistoryEntry {
  id: string;
  label: string;
  json: string;
  createdAt: number;
}

interface HistoryState {
  past: HistoryEntry[];
  future: HistoryEntry[];
  push: (json: string, label: string) => void;
  jumpTo: (id: string) => HistoryEntry | null;
  undo: () => HistoryEntry | null;
  redo: () => HistoryEntry | null;
  clear: () => void;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  past: [],
  future: [],
  push: (json, label) =>
    set((state) => {
      const entry: HistoryEntry = {
        id: crypto.randomUUID(),
        label,
        json,
        createdAt: Date.now(),
      };
      const capped = [...state.past, entry].slice(-50);
      return { past: capped, future: [] };
    }),
  jumpTo: (id) => {
    const state = get();
    const targetIndex = state.past.findIndex((entry) => entry.id === id);
    if (targetIndex < 0) return null;

    const target = state.past[targetIndex];
    const nextPast = state.past.slice(0, targetIndex + 1);
    const movedToFuture = state.past.slice(targetIndex + 1);

    set({
      past: nextPast,
      future: [...movedToFuture.reverse(), ...state.future],
    });

    return target;
  },
  undo: () => {
    const state = get();
    if (state.past.length < 2) return null;
    const current = state.past[state.past.length - 1];
    const previous = state.past[state.past.length - 2];
    set({
      past: state.past.slice(0, -1),
      future: [current, ...state.future],
    });
    return previous;
  },
  redo: () => {
    const state = get();
    if (state.future.length === 0) return null;
    const next = state.future[0];
    set({
      past: [...state.past, next].slice(-50),
      future: state.future.slice(1),
    });
    return next;
  },
  clear: () => set({ past: [], future: [] }),
}));
