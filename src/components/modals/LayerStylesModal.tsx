import { LayerStylesPanel } from "@/components/panels/LayerStylesPanel";

interface LayerStylesModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LayerStylesModal({ open, onClose }: LayerStylesModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm p-4">
      <div className="panel w-full max-w-xl max-h-[85vh] flex flex-col rounded-xl bg-[#111827] border border-[#2D3748] shadow-2xl overflow-hidden text-slate-200">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#2D3748] bg-[#0A0F1E]">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>✨</span> Layer Styles & Effects
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-base leading-none p-1"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <LayerStylesPanel />
        </div>

        <div className="flex justify-end px-5 py-3 border-t border-[#2D3748] bg-[#0A0F1E]">
          <button
            onClick={onClose}
            className="rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-1.5 text-xs transition shadow-md shadow-indigo-600/30"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
