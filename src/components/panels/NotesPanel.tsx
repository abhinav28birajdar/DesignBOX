import { useNotesStore, NoteItem } from "@/store/notesStore";
import { useCanvasStore } from "@/store/canvasStore";
import Button from "@/components/ui/Button";

const colorStyles: Record<NoteItem["color"], string> = {
  yellow: "bg-yellow-900/60 border-yellow-500/50 text-yellow-100",
  pink: "bg-pink-900/60 border-pink-500/50 text-pink-100",
  blue: "bg-blue-900/60 border-blue-500/50 text-blue-100",
  green: "bg-emerald-900/60 border-emerald-500/50 text-emerald-100",
};

export default function NotesPanel() {
  const notes = useNotesStore((state) => state.notes);
  const updateNote = useNotesStore((state) => state.updateNote);
  const deleteNote = useNotesStore((state) => state.deleteNote);
  const canvas = useCanvasStore((state) => state.canvas);

  const handleNavigate = (note: NoteItem) => {
    if (!canvas) return;
    canvas.setZoom(1);
    canvas.viewportTransform = [1, 0, 0, 1, -note.x + 200, -note.y + 200];
    canvas.renderAll();
  };

  return (
    <div className="flex h-full flex-col bg-slate-900 text-white text-xs">
      <div className="flex items-center justify-between border-b border-slate-700 px-4 py-3">
        <h3 className="font-semibold">💬 Canvas Notes ({notes.length})</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {notes.length === 0 ? (
          <div className="text-center text-slate-500 py-8 space-y-2">
            <p className="text-2xl">📌</p>
            <p>No notes on canvas</p>
            <p className="text-[11px] text-slate-400">Select Notes Tool (N) & click anywhere on canvas</p>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className={`rounded-lg border p-3 space-y-2 shadow-lg transition ${colorStyles[note.color]}`}
            >
              <div className="flex items-center justify-between font-semibold">
                <span className="cursor-pointer hover:underline" onClick={() => handleNavigate(note)}>
                  📍 ({Math.round(note.x)}, {Math.round(note.y)})
                </span>
                <span className="text-[10px] opacity-75">{new Date(note.createdAt).toLocaleTimeString()}</span>
              </div>

              <textarea
                value={note.text}
                onChange={(e) => updateNote(note.id, e.target.value)}
                placeholder="Write a note..."
                className="w-full h-16 rounded bg-slate-950/60 p-2 text-xs border border-white/10 text-white resize-none"
              />

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] opacity-75">By {note.author}</span>
                <Button size="sm" variant="secondary" className="h-6 text-[10px] bg-red-900/60 hover:bg-red-800" onClick={() => deleteNote(note.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
