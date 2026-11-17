import { motion } from "framer-motion";

interface AboutModalProps {
  open: boolean;
  onClose: () => void;
  onOpenShortcuts?: () => void;
}

export default function AboutModal({ open, onClose, onOpenShortcuts }: AboutModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        className="panel w-full max-w-lg rounded-xl p-6 bg-[#111827] border border-[#2D3748] shadow-2xl text-slate-200"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-500/30">
            DB
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              DesignBox
            </h2>
            <p className="text-xs font-medium text-indigo-400 tracking-wider uppercase">
              Design Without Limits
            </p>
            <span className="inline-block mt-1 text-[11px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400">
              v1.0.0 • Client-Side Edition
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          DesignBox is a browser-based photo & graphic design editor combining the power of
          Photoshop, Canva Pro, and Figma. Built with zero backend, 100% in-browser offline capabilities,
          IndexedDB project management, and high-performance Fabric.js canvas architecture.
        </p>

        <div className="grid grid-cols-2 gap-2 text-xs mb-5 bg-[#0A0F1E] p-3 rounded-lg border border-slate-800">
          <div>
            <strong className="text-indigo-300">Canvas Engine:</strong>
            <p className="text-slate-400">Fabric.js v5 with infinite zoom</p>
          </div>
          <div>
            <strong className="text-indigo-300">Storage:</strong>
            <p className="text-slate-400">IndexedDB & localStorage</p>
          </div>
          <div>
            <strong className="text-indigo-300">Typography:</strong>
            <p className="text-slate-400">Google Fonts + Custom TTF/OTF</p>
          </div>
          <div>
            <strong className="text-indigo-300">Export:</strong>
            <p className="text-slate-400">PNG, JPG, WebP, SVG, PDF</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          {onOpenShortcuts ? (
            <button
              onClick={() => {
                onClose();
                onOpenShortcuts();
              }}
              className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline"
            >
              View Keyboard Shortcuts ⌨
            </button>
          ) : (
            <span />
          )}

          <button
            onClick={onClose}
            className="rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 text-xs transition shadow-md shadow-indigo-600/30"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
