import { create } from "zustand";
import type { ProjectTab } from "@/types";

interface ProjectState {
  tabs: ProjectTab[];
  activeTabId: string | null;
  setTabs: (tabs: ProjectTab[]) => void;
  openTab: (tab: ProjectTab) => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  markModified: (id: string, modified: boolean) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  tabs: [],
  activeTabId: null,
  setTabs: (tabs) => set({ tabs }),
  openTab: (tab) =>
    set((state) => {
      const tabs = [...state.tabs, tab];
      return { tabs, activeTabId: tab.id };
    }),
  closeTab: (id) =>
    set((state) => {
      const tabs = state.tabs.filter((tab) => tab.id !== id);
      return {
        tabs,
        activeTabId: state.activeTabId === id ? tabs[0]?.id ?? null : state.activeTabId,
      };
    }),
  setActiveTab: (id) => set({ activeTabId: id }),
  markModified: (id, modified) =>
    set((state) => ({ tabs: state.tabs.map((tab) => (tab.id === id ? { ...tab, modified } : tab)) })),
}));
