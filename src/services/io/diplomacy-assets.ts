import { BORDER_RELATIONS, relationAsset } from "@/data/border-diplomacy";
import type { BorderRelation } from "@/types/border-diplomacy";

const embedded = new Map<BorderRelation, Promise<string>>();
const NS = "http://www.w3.org/2000/svg";

async function imageData(kind: BorderRelation): Promise<string> {
  const response = await fetch(relationAsset(kind));
  if (!response.ok) throw new Error(`Diplomacy asset unavailable: ${kind}`);
  const buffer = await response.arrayBuffer();
  // Keep full-resolution originals for the app; standalone map output uses an 8x token-resolution copy.
  if (typeof createImageBitmap === "function") {
    const bitmap = await createImageBitmap(new Blob([buffer], { type: "image/png" }));
    try {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 256;
      const context = canvas.getContext("2d");
      if (context) {
        context.imageSmoothingQuality = "high";
        context.drawImage(bitmap, 0, 0, 256, 256);
        return canvas.toDataURL("image/png");
      }
    } finally {
      bitmap.close();
    }
  }
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 16384) binary += String.fromCharCode(...bytes.subarray(i, i + 16384));
  return `data:image/png;base64,${btoa(binary)}`;
}

export async function inlineDiplomacyAssets(svg: SVGSVGElement): Promise<void> {
  const images = svg.querySelectorAll<SVGImageElement>("#diplomacy [data-relation] > image");
  const kinds = new Set<BorderRelation>();
  for (const image of images) {
    const kind = image.parentElement?.dataset.relation as BorderRelation;
    if (Object.hasOwn(BORDER_RELATIONS, kind)) kinds.add(kind);
    else image.remove();
  }
  if (!kinds.size) return;
  let defs = svg.querySelector<SVGDefsElement>(":scope > defs");
  if (!defs) {
    defs = document.createElementNS(NS, "defs");
    svg.prepend(defs);
  }
  await Promise.all(
    [...kinds].map(async kind => {
      if (!embedded.has(kind))
        embedded.set(
          kind,
          imageData(kind).catch(error => {
            embedded.delete(kind);
            throw error;
          })
        );
      const id = `fpb-border-asset-${kind}`;
      defs!.querySelector(`#${id}`)?.remove();
      const definition = document.createElementNS(NS, "image");
      definition.id = id;
      definition.setAttribute("x", "-16");
      definition.setAttribute("y", "-16");
      definition.setAttribute("width", "32");
      definition.setAttribute("height", "32");
      definition.setAttribute("href", await embedded.get(kind)!);
      defs!.append(definition);
      for (const image of images)
        if (image.parentElement?.dataset.relation === kind) {
          const use = document.createElementNS(NS, "use");
          use.setAttribute("href", `#${id}`);
          image.replaceWith(use);
        }
    })
  );
}
