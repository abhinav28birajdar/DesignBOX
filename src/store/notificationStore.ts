import { create } from "zustand";

export type ToastType = "success" | "error" | "warning" | "info" | "loading";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number; // ms, 0 = manual close
  actionLabel?: string;
  onAction?: () => void;
  createdAt: number;
}

interface NotificationState {
  toasts: Toast[];
  addToast: (
    message: string,
    type?: ToastType,
    duration?: number,
    actionLabel?: string,
    onAction?: () => void
  ) => string;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  toasts: [],

  addToast: (message, type = "info", duration = 3000, actionLabel, onAction) => {
    const id = crypto.randomUUID();
    const defaultDurations: Record<ToastType, number> = {
      success: 2000,
      info: 3000,
      warning: 4000,
      error: 5000,
      loading: 0,
    };
    const effectiveDuration = duration !== undefined ? duration : defaultDurations[type];

    set((state) => ({
      toasts: [
        ...state.toasts.slice(-4),
        { id, type, message, duration: effectiveDuration, actionLabel, onAction, createdAt: Date.now() },
      ],
    }));

    if (effectiveDuration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, effectiveDuration);
    }

    return id;
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  clearAll: () => set({ toasts: [] }),
}));
