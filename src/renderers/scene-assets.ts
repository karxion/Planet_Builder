import { scenePngSize } from "@/data/battle-map";
import manifest from "@/data/scene-image-manifest.json";

export type SceneAssetView = "overview" | "battle";
export type SceneAssetId = "house" | "keep" | "wall" | "gate" | "well" | "barn" | "paving" | "tree";
export const SCENE_ASSET_IDS = Object.keys(manifest) as SceneAssetId[];
const base = () => import.meta.env.BASE_URL || "/";
export const sceneAssetUrl = (id: SceneAssetId) => `${base()}assets/scene-maps/${id}.png`;
/** Each original PNG stores two isolated views; SVG viewports select a half without editing the image. */
export function sceneAssetDefs(view: SceneAssetView, prefix = "scene", ids: SceneAssetId[] = SCENE_ASSET_IDS): string {
  return ids
    .map(id => {
      const { width, height } = manifest[id];
      const half = width / 2;
      const inset = view === "battle" ? manifest[id].battleInset : 0;
      return `<symbol id="${prefix}-${id}" viewBox="${inset} 0 ${half - inset} ${height}" preserveAspectRatio="xMidYMid meet" overflow="hidden"><image data-generated-module="${id}" href="${sceneAssetUrl(id)}" x="${view === "battle" ? -half : 0}" y="0" width="${width}" height="${height}"/></symbol>`;
    })
    .join("");
}
export function sceneAsset(
  id: SceneAssetId,
  x: number,
  y: number,
  width: number,
  prefix = "scene",
  height = width
): string {
  return `<use data-scene-asset="${id}" href="#${prefix}-${id}" x="${x - width / 2}" y="${y - height / 2}" width="${width}" height="${height}"/>`;
}

const embedded = new Map<string, Promise<string>>();
/** Embed local PNG bytes so exported SVG/PNG never depends on local file URLs or third-party hosts. */
export async function inlineSceneImages(markup: string): Promise<string> {
  const root = new DOMParser().parseFromString(markup, "image/svg+xml");
  if (root.querySelector("parsererror")) throw new Error("Invalid scene SVG");
  await Promise.all(
    [...root.querySelectorAll<SVGImageElement>("image[data-generated-module]")].map(async image => {
      const id = image.dataset.generatedModule as SceneAssetId;
      if (!SCENE_ASSET_IDS.includes(id)) throw new Error("Unknown scene module");
      const url = new URL(sceneAssetUrl(id), location.href);
      if (url.origin !== location.origin) throw new Error("Scene assets must be local");
      if (!embedded.has(id))
        embedded.set(
          id,
          (async () => {
            const response = await fetch(url.href);
            if (!response.ok) throw new Error(`Scene image unavailable (${response.status})`);
            const blob = await response.blob();
            if (blob.size > 16 * 1024 * 1024 || !blob.type.startsWith("image/png"))
              throw new Error("Invalid scene image");
            return new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(String(reader.result));
              reader.onerror = () => reject(new Error("Scene image read failed"));
              reader.readAsDataURL(blob);
            });
          })().catch(error => {
            embedded.delete(id);
            throw error;
          })
        );
      image.setAttribute("href", await embedded.get(id)!);
    })
  );
  return new XMLSerializer().serializeToString(root.documentElement);
}

export async function scenePng(markup: string): Promise<Blob> {
  const svg = await inlineSceneImages(markup);
  const parsed = new DOMParser().parseFromString(svg, "image/svg+xml");
  const root = parsed.documentElement;
  const size = scenePngSize(Number(root.getAttribute("width")), Number(root.getAttribute("height")));
  root.setAttribute("width", String(size.width));
  root.setAttribute("height", String(size.height));
  const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(root)], { type: "image/svg+xml" }));
  try {
    const image = new Image();
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Image decode failed"));
      image.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas unavailable");
    context.drawImage(image, 0, 0);
    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve));
    if (!blob) throw new Error("PNG encode failed");
    return blob;
  } finally {
    URL.revokeObjectURL(url);
  }
}
