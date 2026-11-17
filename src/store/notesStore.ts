import { create } from "zustand";

export interface NoteItem {
  id: string;
  x: number;
  y: number;
  author: string;
  text: string;
  color: "yellow" | "pink" | "blue" | "green";
  createdAt: number;
}

interface NotesState {
  notes: NoteItem[];
  addNote: (note: Omit<NoteItem, "id" | "createdAt">) => void;
  updateNote: (id: string, text: string) => void;
  deleteNote: (id: string) => void;
  clearAll: () => void;
}

export const useNotesStore = create<NotesState>((set) => ({
  notes: [],

  addNote: (note) =>
    set((state) => ({
      notes: [
        ...state.notes,
        {
          ...note,
          id: crypto.randomUUID(),
          createdAt: Date.now(),
        },
      ],
    })),

  updateNote: (id, text) =>
    set((state) => ({
      notes: state.notes.map((n) => (n.id === id ? { ...n, text } : n)),
    })),

  deleteNote: (id) =>
    set((state) => ({
      notes: state.notes.filter((n) => n.id !== id),
    })),

  clearAll: () => set({ notes: [] }),
}));
