/** Small cartographic relief, drawn in the same outline-and-wash idiom as surface hills and forests. */
export const SEABED_GLYPHS: Record<string, { outline: string; wash: string }> = {
  shelf: { outline: "M2 5h13l5 3h10M2 8h11l5 3h12M3 14h7m4 0h7m4 0h5", wash: "M2 5h13l5 3h10v3H18l-5-3H2Z" },
  slope: { outline: "M2 3h8l14 10h6M6 3l14 10M10 3l14 10M14 5l10 7M2 15h7m4 0h8m4 0h5", wash: "M10 3l14 10h-4L6 3Z" },
  plain: { outline: "M2 8h8m4 0h5m4 0h7M5 11h6m5 0h10M2 14h5m5 0h9m4 0h5", wash: "M3 7h26v1H3Z" },
  trench: { outline: "M2 4l7 2 7 8 7-8 7-2M2 8l6 1 8 7 8-7 6-1M9 6l3-1m8 0l3 1", wash: "M9 6l7 8 7-8-5 3-2 3-2-3Z" },
  ridge: {
    outline: "M1 13l6-8 4 4 6-8 6 9 3-3 5 6M7 5l1 6m9-10l-2 7 4-2 4 4M3 16h6m4 0h6m4 0h6",
    wash: "M7 5l4 4-3 2ZM17 1l6 9-4-4-4 2Z"
  },
  reef: {
    outline: "M7 14V6m0 4L3 7V4m4 3l4-3V2m-4 9l5-2V6m8 9V7l-4-3V2m4 8l5-4V3m-5 9l7-1V8M3 16h9m4 0h12",
    wash: "M5 15l2-3 4 3Zm13 0l2-4 5 4Z"
  },
  rise: {
    outline: "M2 3h5c7 0 6 6 12 7l11 3M6 3c5 2 5 7 13 9l10 2M3 16h7m4 0h7m4 0h5",
    wash: "M7 3c7 0 6 6 12 7l11 3v1l-11-2C11 10 11 5 7 3Z"
  },
  canyon: {
    outline: "M15 2l-3 4 4 3-3 6M20 2l-3 4 4 3-3 6M12 6L6 4 3 5m13 4l-7 1-4 3m16-4l6-4m-9 10l9-2",
    wash: "M15 2l-3 4 4 3-3 6 5 0 3-6-4-3 3-4Z"
  },
  rift: {
    outline: "M1 12l6-9 5 7 4-5 5 5 5-7 5 9M12 10l4 6 5-6M7 3l1 6m18-6l-3 7M2 16h5m19 0h4",
    wash: "M12 10l4 6 5-6-5 2ZM7 3l5 7-4-1Z"
  },
  seamount: { outline: "M3 14L15 2l13 12M15 2l-1 6 4-1 3 5M1 16h7m4 0h8m4 0h7", wash: "M15 2l13 12h-7l-3-7-4 1Z" },
  guyot: { outline: "M3 14l8-10h10l8 10M11 4l2 3h6l2-3M19 7l3 7M1 16h7m4 0h8m4 0h7", wash: "M21 4l8 10h-7l-3-7Z" },
  fan: {
    outline: "M15 2L2 14q13 4 28 0L18 2M16 4L8 14m9-9l-1 10m2-10l7 9M5 11q11 5 22 0",
    wash: "M16 4L8 14q4 1 8 1Z"
  },
  hills: {
    outline: "M1 10q6-9 13 0m-7 4q7-10 15 0m-4-5q6-8 13 0M1 16h6m4 0h7m4 0h9",
    wash: "M1 10q6-9 13 0l-7-2ZM7 14q7-10 15 0l-7-3Z"
  },
  deep: { outline: "M3 6q12-8 26 0l-5 6q-8 7-16 0ZM8 7q8-4 16 0l-8 7ZM3 15h4m18 0h5", wash: "M8 7q8-4 16 0l-8 7Z" },
  fracture: {
    outline: "M2 6h9l3-3h7l3 3h6M2 11h7l4-3h7l4 3h6M11 6l-2 5m12-8l-1 5m4-2v5M3 15h8m4 0h6m4 0h5",
    wash: "M11 6l3-3h7l-1 5h-7l-4 3Z"
  },
  dunes: {
    outline: "M2 6q5-6 10 0t10 0 9 0M2 10q5-6 10 0t10 0 9 0M2 14q5-6 10 0t10 0 9 0",
    wash: "M2 6q5-6 10 0Q7 4 2 6Zm10 4q5 6 10 0q-5 3-10 0ZM2 14q5-6 10 0q-5-2-10 0Z"
  }
};

const NS = "http://www.w3.org/2000/svg";
export function seabedGlyph(id: string): SVGGElement {
  const glyph = SEABED_GLYPHS[id];
  if (!glyph) throw new Error("Unknown seabed glyph");
  const group = document.createElementNS(NS, "g");
  group.setAttribute("fill", "none");
  group.setAttribute("stroke", "#315668");
  group.setAttribute("stroke-width", "0.85");
  group.setAttribute("stroke-linecap", "round");
  group.setAttribute("stroke-linejoin", "round");
  const wash = document.createElementNS(NS, "path");
  wash.setAttribute("d", glyph.wash);
  wash.setAttribute("fill", "#48768b");
  wash.setAttribute("fill-opacity", "0.26");
  wash.setAttribute("stroke", "none");
  const line = document.createElementNS(NS, "path");
  line.setAttribute("d", glyph.outline);
  group.append(wash, line);
  return group;
}

export function seabedGlyphPreview(id: string): SVGSVGElement {
  const image = document.createElementNS(NS, "svg");
  image.setAttribute("viewBox", "0 0 32 18");
  image.setAttribute("width", "48");
  image.setAttribute("height", "30");
  image.setAttribute("aria-hidden", "true");
  image.append(seabedGlyph(id));
  return image;
}
