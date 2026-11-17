import { motion, AnimatePresence } from "framer-motion";
import { useNotificationStore, Toast } from "@/store/notificationStore";

const icons: Record<Toast["type"], string> = {
  success: "✅",
  info: "ℹ️",
  warning: "⚠️",
  error: "❌",
  loading: "⏳",
};

const borderColors: Record<Toast["type"], string> = {
  success: "border-emerald-500/40 bg-emerald-950/80 text-emerald-100",
  info: "border-sky-500/40 bg-sky-950/80 text-sky-100",
  warning: "border-amber-500/40 bg-amber-950/80 text-amber-100",
  error: "border-rose-500/40 bg-rose-950/80 text-rose-100",
  loading: "border-indigo-500/40 bg-indigo-950/80 text-indigo-100",
};

export default function ToastContainer() {
  const toasts = useNotificationStore((state) => state.toasts);
  const removeToast = useNotificationStore((state) => state.removeToast);

  return (
    <div className="fixed bottom-12 right-6 z-[100] flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 30, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={`pointer-events-auto flex items-center justify-between gap-3 rounded-lg border px-4 py-3 shadow-xl backdrop-blur-md text-xs font-medium ${
              borderColors[toast.type]
            }`}
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <span className="text-base leading-none">{icons[toast.type]}</span>
              <span className="truncate">{toast.message}</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {toast.actionLabel && toast.onAction && (
                <button
                  onClick={() => {
                    toast.onAction?.();
                    removeToast(toast.id);
                  }}
                  className="rounded bg-white/20 px-2 py-1 text-[10px] font-bold hover:bg-white/30 transition"
                >
                  {toast.actionLabel}
                </button>
              )}
              <button
                onClick={() => removeToast(toast.id)}
                className="opacity-60 hover:opacity-100 transition text-sm leading-none px-1"
                title="Dismiss"
              >
                ✕
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
