import Alea from "alea";
import manifest from "@/data/subsurface-image-manifest.json";
import type { WorldSpacesData } from "@/types/world-spaces";
import { getUiLanguage } from "@/services/ui-language";

export type SubsurfaceAssetId = keyof typeof manifest;
const NS = "http://www.w3.org/2000/svg";
export const SUBSURFACE_ASSET_IDS = Object.keys(manifest) as SubsurfaceAssetId[];
export const subsurfaceAssetName = (id: SubsurfaceAssetId): string =>
  manifest[id][getUiLanguage() === "ko" ? "ko" : "en"];
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
  // Reuse the surface relief artwork, copying definitions for independent SVG/PNG export.
  for (const kind of ["mount", "deciduous", "grass"]) {
    const original = document.getElementById(`relief-${kind}-2`);
    if (!original) continue;
    const symbol = original.cloneNode(true) as SVGElement;
    symbol.id = `fpb-hollow-${kind}`;
    if (kind !== "mount") symbol.setAttribute("viewBox", kind === "deciduous" ? "-3 -3 25 25" : "-3 -3 35 35");
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
  const hollow = "activeLevel" in map && map.mode === "hollow";
  for (let tries = 0; tries < 1400 && used.size < (hollow ? 180 : 96); tries++) {
    const i = Math.floor(rng() * cells.length),
      cell = cells[i];
    if (used.has(i) || ("depths" in map ? !map.depths[i] : cell === 0)) continue;
    if (hollow && cell === 2) continue;
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
    const seaMountain = "depths" in map && [5, 9, 10, 11].includes(cell);
    if ((hollow && cell !== 3 && rng() > 0.18) || seaMountain) {
      const kind = seaMountain || cell === 4 ? "mount" : cell === 5 ? "deciduous" : "grass";
      const mark = document.createElementNS(NS, "use");
      mark.setAttribute("href", `#fpb-hollow-${kind}`);
      mark.setAttribute("x", String(x * width - 9));
      mark.setAttribute("y", String(y * height - 12));
      mark.setAttribute("width", cell === 4 ? "24" : "18");
      mark.setAttribute("height", cell === 4 ? "24" : "18");
      mark.setAttribute("pointer-events", "none");
      if (hollow) mark.dataset.hollowRelief = kind;
      else mark.dataset.seafloorRelief = String(cell);
      mark.dataset.spaceLayer = "toggleRelief";
      group.append(mark);
      continue;
    }
    const choices: SubsurfaceAssetId[] = hollow ? ["ur01", "ur06"] : pool;
    const id = choices[Math.floor(rng() * choices.length)],
      mark = document.createElementNS(NS, "g");
    mark.dataset.spaceLayer = /^(sr|ur)/.test(id) ? "toggleGoods" : "toggleRelief";
    mark.dataset.sceneryCell = String(i);
    mark.dataset.sceneryAsset = id;
    mark.dataset.spaceX = String(x);
    mark.dataset.spaceY = String(y);
    mark.setAttribute("role", "button");
    mark.setAttribute("tabindex", "0");
    mark.setAttribute("aria-label", subsurfaceAssetName(id));
    mark.setAttribute("cursor", "pointer");
    const hit = document.createElementNS(NS, "circle");
    hit.setAttribute("cx", String(x * width));
    hit.setAttribute("cy", String(y * height));
    hit.setAttribute("r", "12");
    hit.setAttribute("fill", "transparent");
    hit.setAttribute("pointer-events", "all");
    const title = document.createElementNS(NS, "title");
    title.textContent = subsurfaceAssetName(id);
    mark.append(hit, subsurfaceMarker(id, x * width, y * height, 24), title);
    group.append(mark);
  }
  return group;
}
