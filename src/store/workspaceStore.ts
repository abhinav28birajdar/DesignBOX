import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PanelConfig, WorkspaceConfig, Persona } from "@/types";

interface WorkspaceState {
  // Workspace Management
  currentWorkspace: string;
  workspaces: Record<string, WorkspaceConfig>;
  currentPersona: Persona;

  // Panel States
  panels: Record<string, PanelConfig>;
  fullscreen: boolean;
  presentation: boolean;

  // Actions
  createWorkspace: (name: string, config: WorkspaceConfig) => void;
  loadWorkspace: (name: string) => void;
  deleteWorkspace: (name: string) => void;
  updateWorkspace: (name: string, config: Partial<WorkspaceConfig>) => void;

  updatePanelState: (panelId: string, changes: Partial<PanelConfig>) => void;
  togglePanel: (panelId: string) => void;
  showPanel: (panelId: string) => void;
  hidePanel: (panelId: string) => void;

  setPersona: (persona: Persona) => void;
  toggleFullscreen: () => void;
  togglePresentation: () => void;

  // Persistence
  saveCurrentWorkspace: () => void;
}

// Default panel configurations
const DEFAULT_PANELS: Record<string, PanelConfig> = {
  layers: {
    id: "layers",
    title: "Layers",
    visible: true,
    position: "right",
    width: 300,
    docked: true,
    tabGroup: "right-panels",
  },
  properties: {
    id: "properties",
    title: "Properties",
    visible: true,
    position: "right",
    width: 300,
    docked: true,
    tabGroup: "right-panels",
  },
  color: {
    id: "color",
    title: "Color",
    visible: true,
    position: "right",
    width: 280,
    docked: true,
    tabGroup: "right-panels",
  },
  swatches: {
    id: "swatches",
    title: "Swatches",
    visible: false,
    position: "right",
    width: 280,
    docked: true,
    tabGroup: "right-panels",
  },
  history: {
    id: "history",
    title: "History",
    visible: false,
    position: "right",
    width: 280,
    docked: true,
    tabGroup: "right-panels",
  },
  navigator: {
    id: "navigator",
    title: "Navigator",
    visible: false,
    position: "right",
    width: 280,
    docked: true,
    tabGroup: "right-panels",
  },
  inspector: {
    id: "inspector",
    title: "Inspector",
    visible: true,
    position: "right",
    width: 300,
    docked: true,
    tabGroup: "right-panels",
  },
};

// Default workspace configurations
const DEFAULT_WORKSPACES: Record<string, WorkspaceConfig> = {
  design: {
    name: "Design",
    theme: "dark",
    fullscreen: false,
    presentation: false,
    panels: [
      DEFAULT_PANELS.layers,
      DEFAULT_PANELS.properties,
      DEFAULT_PANELS.color,
      DEFAULT_PANELS.inspector,
    ],
  },
  photo: {
    name: "Photo",
    theme: "dark",
    fullscreen: false,
    presentation: false,
    panels: [
      DEFAULT_PANELS.layers,
      DEFAULT_PANELS.history,
      DEFAULT_PANELS.color,
      DEFAULT_PANELS.properties,
    ],
  },
  web: {
    name: "Web",
    theme: "light",
    fullscreen: false,
    presentation: false,
    panels: [
      DEFAULT_PANELS.layers,
      DEFAULT_PANELS.inspector,
      DEFAULT_PANELS.color,
      DEFAULT_PANELS.properties,
    ],
  },
};

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentWorkspace: "design",
      workspaces: DEFAULT_WORKSPACES,
      currentPersona: "affinity-designer",
      panels: DEFAULT_PANELS,
      fullscreen: false,
      presentation: false,

      // Workspace actions
      createWorkspace: (name, config) =>
        set((state) => ({
          workspaces: {
            ...state.workspaces,
            [name]: config,
          },
        })),

      loadWorkspace: (name) => {
        const workspaces = get().workspaces;
        if (workspaces[name]) {
          const config = workspaces[name];
          const panelMap: Record<string, PanelConfig> = {};
          config.panels.forEach((panel) => {
            panelMap[panel.id] = panel;
          });
          set({
            currentWorkspace: name,
            panels: panelMap,
            fullscreen: config.fullscreen,
            presentation: config.presentation,
          });
        }
      },

      deleteWorkspace: (name) => {
        set((state) => {
          const { [name]: _, ...rest } = state.workspaces;
          return {
            workspaces: rest,
            currentWorkspace: state.currentWorkspace === name ? "design" : state.currentWorkspace,
          };
        });
      },

      updateWorkspace: (name, config) =>
        set((state) => ({
          workspaces: {
            ...state.workspaces,
            [name]: {
              ...state.workspaces[name],
              ...config,
            },
          },
        })),

      // Panel actions
      updatePanelState: (panelId, changes) =>
        set((state) => ({
          panels: {
            ...state.panels,
            [panelId]: {
              ...state.panels[panelId],
              ...changes,
            },
          },
        })),

      togglePanel: (panelId) => {
        const panels = get().panels;
        set((state) => ({
          panels: {
            ...state.panels,
            [panelId]: {
              ...state.panels[panelId],
              visible: !panels[panelId]?.visible,
            },
          },
        }));
      },

      showPanel: (panelId) =>
        set((state) => ({
          panels: {
            ...state.panels,
            [panelId]: {
              ...state.panels[panelId],
              visible: true,
            },
          },
        })),

      hidePanel: (panelId) =>
        set((state) => ({
          panels: {
            ...state.panels,
            [panelId]: {
              ...state.panels[panelId],
              visible: false,
            },
          },
        })),

      // View modes
      setPersona: (persona) => set({ currentPersona: persona }),

      toggleFullscreen: () => set((state) => ({ fullscreen: !state.fullscreen })),

      togglePresentation: () => set((state) => ({ presentation: !state.presentation })),

      // Save current workspace
      saveCurrentWorkspace: () => {
        const state = get();
        const currentConfig = state.workspaces[state.currentWorkspace];
        if (currentConfig) {
          state.updateWorkspace(state.currentWorkspace, {
            ...currentConfig,
            fullscreen: state.fullscreen,
            presentation: state.presentation,
            panels: Object.values(state.panels),
          });
        }
      },
    }),
    {
      name: "designbox-workspace",
      version: 1,
    }
  )
);
