import { useEffect, useState } from "react";
import { fabric } from "fabric";
import { useCanvasStore } from "@/store/canvasStore";
import { useLayersStore } from "@/store/layersStore";

interface MenuState {
  x: number;
  y: number;
  kind: "empty" | "object" | "text" | "shape";
}

export default function ContextMenu() {
  const canvas = useCanvasStore((state) => state.canvas);
  const addGuide = useCanvasStore((state) => state.addGuide);
  const syncFromCanvas = useLayersStore((state) => state.syncFromCanvas);

  const [menu, setMenu] = useState<MenuState | null>(null);
  const [clipboard, setClipboard] = useState<fabric.Object | null>(null);

  useEffect(() => {
    if (!canvas) return;

    const element = canvas.getSelectionElement();
    const handler = (event: MouseEvent) => {
      event.preventDefault();
      const target = canvas.findTarget(event, true);
      let kind: MenuState["kind"] = "empty";
      if (target) {
        if (target.type === "textbox" || target.type === "text") kind = "text";
        else if (["rect", "ellipse", "line", "polygon", "polyline", "path"].includes(target.type || "")) kind = "shape";
        else kind = "object";
        canvas.setActiveObject(target);
        canvas.renderAll();
      }
      setMenu({ x: event.clientX, y: event.clientY, kind });
    };

    const close = () => setMenu(null);
    element.addEventListener("contextmenu", handler);
    window.addEventListener("click", close);
    window.addEventListener("keydown", close);

    return () => {
      element.removeEventListener("contextmenu", handler);
      window.removeEventListener("click", close);
      window.removeEventListener("keydown", close);
    };
  }, [canvas]);

  if (!menu || !canvas) return null;

  const active = canvas.getActiveObject();

  const paste = () => {
    if (!clipboard) return;
    clipboard.clone((cloned: fabric.Object) => {
      cloned.set({ left: (cloned.left || 0) + 16, top: (cloned.top || 0) + 16 });
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.renderAll();
      syncFromCanvas(canvas);
    });
  };

  const menuItemClass = "w-full rounded px-2 py-1 text-left text-xs text-slate-200 hover:bg-slate-700";

  return (
    <div className="fixed z-[60]" style={{ left: `${menu.x}px`, top: `${menu.y}px` }}>
      <div className="surface min-w-48 rounded-md p-1 shadow-xl">
        <button className={menuItemClass} onClick={paste}>Paste</button>
        {menu.kind === "empty" ? (
          <>
            <button className={menuItemClass} onClick={() => { canvas.setActiveObject(new fabric.ActiveSelection(canvas.getObjects(), { canvas })); canvas.renderAll(); }}>Select All</button>
            <button className={menuItemClass} onClick={() => { canvas.discardActiveObject(); canvas.renderAll(); }}>Deselect All</button>
            <button className={menuItemClass} onClick={() => addGuide("v", canvas.getWidth() / 2)}>New Vertical Guide</button>
            <button className={menuItemClass} onClick={() => addGuide("h", canvas.getHeight() / 2)}>New Horizontal Guide</button>
          </>
        ) : null}

        {menu.kind !== "empty" && active ? (
          <>
            <button className={menuItemClass} onClick={() => { active.clone((cloned: fabric.Object) => { cloned.set({ left: (active.left || 0) + 12, top: (active.top || 0) + 12 }); canvas.add(cloned); canvas.setActiveObject(cloned); canvas.renderAll(); syncFromCanvas(canvas); }); }}>Duplicate Layer</button>
            <button className={menuItemClass} onClick={() => { setClipboard(active); }}>Copy</button>
            <button className={menuItemClass} onClick={() => { setClipboard(active); canvas.remove(active); canvas.discardActiveObject(); canvas.renderAll(); syncFromCanvas(canvas); }}>Cut</button>
            <button className={menuItemClass} onClick={() => { canvas.remove(active); canvas.discardActiveObject(); canvas.renderAll(); syncFromCanvas(canvas); }}>Delete Layer</button>
            <button className={menuItemClass} onClick={() => { active.bringToFront(); canvas.renderAll(); syncFromCanvas(canvas); }}>Bring To Front</button>
            <button className={menuItemClass} onClick={() => { active.sendToBack(); canvas.renderAll(); syncFromCanvas(canvas); }}>Send To Back</button>
            <button className={menuItemClass} onClick={() => { active.set({ flipX: !active.flipX }); canvas.renderAll(); syncFromCanvas(canvas); }}>Flip Horizontal</button>
            <button className={menuItemClass} onClick={() => { active.set({ flipY: !active.flipY }); canvas.renderAll(); syncFromCanvas(canvas); }}>Flip Vertical</button>
            <button className={menuItemClass} onClick={() => { active.rotate((active.angle || 0) + 90); active.setCoords(); canvas.renderAll(); syncFromCanvas(canvas); }}>Rotate 90 CW</button>
            <button className={menuItemClass} onClick={() => { active.rotate((active.angle || 0) - 90); active.setCoords(); canvas.renderAll(); syncFromCanvas(canvas); }}>Rotate 90 CCW</button>
            {menu.kind === "text" ? (
              <button className={menuItemClass} onClick={() => { if (active.type === "textbox") (active as fabric.Textbox).enterEditing(); canvas.renderAll(); }}>Edit Text</button>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
}
