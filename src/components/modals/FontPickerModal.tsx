import { useState } from "react";
import { loadGoogleFont } from "@/utils/fontLoader";

const fonts = [
  "Inter",
  "Roboto",
  "Poppins",
  "Montserrat",
  "Open Sans",
  "Lato",
  "Playfair Display",
  "Merriweather",
  "Oswald",
  "Raleway",
];

interface FontPickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (font: string) => void;
}

export default function FontPickerModal({ open, onClose, onSelect }: FontPickerModalProps) {
  const [query, setQuery] = useState("");

  if (!open) return null;

  const filtered = fonts.filter((font) => font.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60">
      <div className="panel w-[420px] rounded-md p-4">
        <h2 className="mb-3 text-lg font-semibold">Font Picker</h2>
        <input className="surface mb-3 w-full rounded px-2 py-1" placeholder="Search fonts" value={query} onChange={(e) => setQuery(e.target.value)} />
        <div className="max-h-64 space-y-1 overflow-auto">
          {filtered.map((font) => (
            <button
              key={font}
              className="surface w-full rounded px-3 py-2 text-left"
              style={{ fontFamily: font }}
              onClick={async () => {
                await loadGoogleFont(font);
                onSelect(font);
                onClose();
              }}
            >
              {font}
            </button>
          ))}
        </div>
        <div className="mt-3 flex justify-end">
          <button className="rounded bg-slate-700 px-3 py-1" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
