import Alea from "alea";
import manifest from "@/data/subsurface-image-manifest.json";
import type { WorldSpacesData } from "@/types/world-spaces";

export type SubsurfaceAssetId = keyof typeof manifest;
const NS = "http://www.w3.org/2000/svg";
export const SUBSURFACE_ASSET_IDS = Object.keys(manifest) as SubsurfaceAssetId[];
export function subsurfaceAssetUrl(id: SubsurfaceAssetId): string {
  return `${import.meta.env.BASE_URL || "/"}assets/subsurface/${manifest[id].file}?v=${manifest[id].sha256.slice(0, 12)}`;
}
export function subsurfaceDefs(): SVGDefsElement {
  const defs = document.createElementNS(NS, "defs");
  for (const id of SUBSURFACE_ASSET_IDS) {
    const asset = manifest[id],
      symbol = document.createElementNS(NS, "symbol"),
      image = document.createElementNS(NS, "image");
    symbol.id = `fpb-subsurface-${id}`;
    symbol.setAttribute("viewBox", `0 0 ${asset.width / 2} ${asset.height}`);
    symbol.setAttribute("preserveAspectRatio", "xMidYMid meet");
    symbol.setAttribute("overflow", "hidden");
    image.dataset.subsurfaceModule = id;
    image.setAttribute("href", subsurfaceAssetUrl(id));
    image.setAttribute("width", String(asset.width));
    image.setAttribute("height", String(asset.height));
    symbol.append(image);
    defs.append(symbol);
  }
  return defs;
}
export function subsurfaceMarker(id: SubsurfaceAssetId, x: number, y: number, size = 30): SVGUseElement {
  const use = document.createElementNS(NS, "use");
  use.setAttribute("href", `#fpb-subsurface-${id}`);
  use.setAttribute("x", String(x - size / 2));
  use.setAttribute("y", String(y - size / 2));
  use.setAttribute("width", String(size));
  use.setAttribute("height", String(size));
  use.dataset.subsurfaceAsset = id;
  return use;
}
/** Decorative objects are sampled only on their own space's valid floor/water cells. */
export function subsurfaceScenery(data: WorldSpacesData, width: number, height: number): SVGGElement {
  const group = document.createElementNS(NS, "g");
  group.dataset.subsurfaceScenery = data.activeSpace;
  group.setAttribute("pointer-events", "none");
  const map =
    data.activeSpace === "underwater"
      ? data.underwater
      : data.activeSpace === "underground"
        ? data.underground
        : undefined;
  if (!map) return group;
  const rng = Alea(`${map.seed}:subsurface-scenery:${"activeLevel" in map ? map.activeLevel : "sea"}`);
  const cells = "depths" in map ? map.terrain : map.levels.find(level => level.id === map.activeLevel)!.cells;
  const used = new Set<number>();
  for (let tries = 0; tries < 700 && used.size < 64; tries++) {
    const i = Math.floor(rng() * cells.length),
      cell = cells[i];
    if (used.has(i) || ("depths" in map ? !map.depths[i] : cell === 0)) continue;
    const pool: SubsurfaceAssetId[] =
      "depths" in map
        ? cell === 6
          ? ["st01", "sr01"]
          : [5, 9].includes(cell)
            ? ["st06", "sr03"]
            : [1, 2].includes(cell)
              ? ["st03", "sr01"]
              : ["sr02"]
        : cell === 3
          ? ["ut10"]
          : cell === 2
            ? ["ut11", "c01"]
            : ["ut01", "ut02", "ut05", "ut09", "ur01", "ur04", "ur06", "c02"];
    used.add(i);
    const x = ((i % map.columns) + 0.5) / map.columns,
      y = (Math.floor(i / map.columns) + 0.5) / map.rows;
    // Keep the settlement names and silhouettes clear.
    if (
      data.sites.some(
        site => site.space === data.activeSpace && site.kind === "city" && Math.hypot(site.x - x, site.y - y) < 0.025
      )
    )
      continue;
    const marker = subsurfaceMarker(pool[Math.floor(rng() * pool.length)], x * width, y * height, 24);
    marker.dataset.sceneryCell = String(i);
    group.append(marker);
  }
  return group;
}
