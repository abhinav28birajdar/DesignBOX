import { useState, useRef } from "react";
import { loadGoogleFont, loadCustomFont } from "@/utils/fontLoader";

interface FontItem {
  name: string;
  category: "sans" | "serif" | "display" | "handwriting" | "mono";
}

const FONTS: FontItem[] = [
  { name: "Inter", category: "sans" },
  { name: "Roboto", category: "sans" },
  { name: "Poppins", category: "sans" },
  { name: "Montserrat", category: "sans" },
  { name: "Open Sans", category: "sans" },
  { name: "Lato", category: "sans" },
  { name: "Raleway", category: "sans" },
  { name: "Playfair Display", category: "serif" },
  { name: "Merriweather", category: "serif" },
  { name: "Lora", category: "serif" },
  { name: "Cinzel", category: "serif" },
  { name: "Oswald", category: "display" },
  { name: "Bebas Neue", category: "display" },
  { name: "Lobster", category: "display" },
  { name: "Orbitron", category: "display" },
  { name: "Pacifico", category: "handwriting" },
  { name: "Dancing Script", category: "handwriting" },
  { name: "Caveat", category: "handwriting" },
  { name: "JetBrains Mono", category: "mono" },
  { name: "Fira Code", category: "mono" },
];

interface FontPickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (font: string) => void;
}

export default function FontPickerModal({ open, onClose, onSelect }: FontPickerModalProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [customFonts, setCustomFonts] = useState<string[]>([]);
  const [loadingFont, setLoadingFont] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!open) return null;

  const handleCustomUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const fontName = await loadCustomFont(file);
      setCustomFonts((prev) => Array.from(new Set([fontName, ...prev])));
      onSelect(fontName);
      onClose();
    } catch (err) {
      alert("Failed to load font: " + String(err));
    }
  };

  const filtered = FONTS.filter((f) => {
    const matchesQuery = f.name.toLowerCase().includes(query.toLowerCase());
    const matchesCat = category === "all" || f.category === category;
    return matchesQuery && matchesCat;
  });

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm p-4">
      <div className="panel w-[480px] max-w-[95vw] rounded-xl p-5 bg-[#111827] border border-[#2D3748] shadow-2xl text-slate-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>✏️</span> Font Browser & Custom Upload
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-base">✕</button>
        </div>

        {/* Search and Category Filter */}
        <div className="space-y-2 mb-3">
          <input
            className="w-full rounded bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            placeholder="Search fonts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <div className="flex gap-1 overflow-x-auto pb-1 text-[11px]">
            {["all", "sans", "serif", "display", "handwriting", "mono"].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`rounded px-2.5 py-1 capitalize transition ${
                  category === cat
                    ? "bg-indigo-600 text-white font-semibold"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Fonts Section */}
        {customFonts.length > 0 && (
          <div className="mb-3">
            <p className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider mb-1">My Uploaded Fonts</p>
            <div className="space-y-1">
              {customFonts.map((f) => (
                <button
                  key={f}
                  style={{ fontFamily: f }}
                  onClick={() => {
                    onSelect(f);
                    onClose();
                  }}
                  className="w-full text-left rounded bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-700/50 px-3 py-2 text-sm text-indigo-200"
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Font List */}
        <div className="max-h-64 space-y-1.5 overflow-y-auto pr-1">
          {filtered.map((item) => (
            <button
              key={item.name}
              className="w-full flex items-center justify-between rounded bg-slate-800/80 hover:bg-indigo-600/30 border border-slate-700/50 hover:border-indigo-500/50 px-3 py-2 text-left transition"
              onClick={async () => {
                setLoadingFont(item.name);
                try {
                  await loadGoogleFont(item.name);
                  onSelect(item.name);
                  onClose();
                } catch {
                  onSelect(item.name);
                  onClose();
                } finally {
                  setLoadingFont(null);
                }
              }}
            >
              <span className="text-sm text-white" style={{ fontFamily: item.name }}>
                {item.name}
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                {loadingFont === item.name ? "Loading..." : item.category}
              </span>
            </button>
          ))}
        </div>

        {/* Upload Custom Font Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 px-3 py-1.5 text-xs transition flex items-center gap-1.5"
          >
            <span>📁</span> Upload TTF / OTF Font
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".ttf,.otf,.woff,.woff2"
            className="hidden"
            onChange={handleCustomUpload}
          />
          <button className="rounded bg-slate-700 hover:bg-slate-600 px-4 py-1.5 text-xs text-white" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
