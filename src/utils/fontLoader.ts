import opentype from "opentype.js";

export const loadGoogleFont = async (family: string): Promise<void> => {
  const id = `font-${family.replace(/\s+/g, "-").toLowerCase()}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@300;400;500;700&display=swap`;
  document.head.appendChild(link);
  await document.fonts.ready;
};

export const loadCustomFont = async (file: File): Promise<string> => {
  const fontName = file.name.replace(/\.[^/.]+$/, "");
  const arrayBuffer = await file.arrayBuffer();
  const parsed = opentype.parse(arrayBuffer);
  if (!parsed.names.fontFamily) {
    throw new Error("Invalid font file");
  }
  const blob = new Blob([arrayBuffer], { type: file.type || "font/ttf" });
  const url = URL.createObjectURL(blob);
  const face = new FontFace(fontName, `url(${url})`);
  await face.load();
  document.fonts.add(face);
  return fontName;
};
