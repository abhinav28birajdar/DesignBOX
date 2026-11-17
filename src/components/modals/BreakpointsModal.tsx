import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { useCanvasStore } from "@/store/canvasStore";
import { useProjectStore } from "@/store/projectStore";
import { useNotificationStore } from "@/store/notificationStore";

interface Breakpoint {
  id: string;
  name: string;
  width: number;
  height: number;
  icon: string;
}

const DEFAULT_BREAKPOINTS: Breakpoint[] = [
  { id: "mobile", name: "Mobile", width: 375, height: 812, icon: "📱" },
  { id: "tablet", name: "Tablet", width: 768, height: 1024, icon: "📟" },
  { id: "laptop", name: "Laptop", width: 1280, height: 800, icon: "💻" },
  { id: "desktop", name: "Desktop", width: 1920, height: 1080, icon: "🖥" },
];

interface BreakpointsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function BreakpointsModal({ open, onClose }: BreakpointsModalProps) {
  const canvas = useCanvasStore((state) => state.canvas);
  const activeTabId = useProjectStore((state) => state.activeTabId);
  const addToast = useNotificationStore((state) => state.addToast);

  const [activeBreakpoint, setActiveBreakpoint] = useState<string>("desktop");

  if (!open) return null;

  const handleApplyBreakpoint = (bp: Breakpoint) => {
    setActiveBreakpoint(bp.id);
    if (!canvas) return;

    canvas.setWidth(bp.width);
    canvas.setHeight(bp.height);
    canvas.renderAll();

    useProjectStore.setState((state) => ({
      tabs: state.tabs.map((tab) =>
        tab.id === activeTabId ? { ...tab, width: bp.width, height: bp.height } : tab
      ),
    }));

    addToast(`Switched viewport to ${bp.name} (${bp.width}px x ${bp.height}px)`, "info");
    onClose();
  };

  return (
    <Modal isOpen={open} onClose={onClose} title="📱 Responsive Design Breakpoints">
      <div className="flex flex-col gap-4 p-4 text-xs text-white max-w-md w-full">
        <p className="text-slate-400">
          Select a target viewport breakpoint to test and adapt your design for various screen sizes.
        </p>

        <div className="grid grid-cols-2 gap-3">
          {DEFAULT_BREAKPOINTS.map((bp) => (
            <div
              key={bp.id}
              onClick={() => handleApplyBreakpoint(bp)}
              className={`flex flex-col p-4 rounded-lg border cursor-pointer transition ${
                activeBreakpoint === bp.id
                  ? "bg-indigo-900/60 border-indigo-500 shadow-lg shadow-indigo-500/20"
                  : "bg-slate-800 border-slate-700 hover:bg-slate-750"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{bp.icon}</span>
                <span className="text-[10px] font-mono bg-slate-900 px-2 py-0.5 rounded text-indigo-300">
                  {bp.width} × {bp.height}
                </span>
              </div>
              <div className="font-bold text-sm text-white">{bp.name}</div>
              <div className="text-[11px] text-slate-400 mt-1">Width: {bp.width}px</div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
