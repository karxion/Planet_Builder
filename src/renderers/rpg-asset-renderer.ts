import { getRpgAsset, RPG_MAP_ASSETS } from "@/data/rpg-map-assets";

export function installRpgAssetDefinitions(): void {
  const defs = document.querySelector("#map > defs");
  if (!defs) return;
  const existing = defs.querySelector("#fpb-rpg-assets");
  if (existing?.getAttribute("data-version") === "5") return;
  const group = existing || document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.id = "fpb-rpg-assets";
  group.setAttribute("data-version", "5");
  group.innerHTML = RPG_MAP_ASSETS.map(
    asset => `<symbol id="${asset.id}" viewBox="${asset.viewBox}" overflow="visible">${asset.body}</symbol>`
  ).join("");
  defs.append(group);
}

export function rpgIconPreview(icon: string): string {
  const asset = getRpgAsset(icon);
  if (asset) return `<svg viewBox="${asset.viewBox}" class="fpb-asset-preview" aria-hidden="true">${asset.body}</svg>`;
  if (icon.startsWith("http") || icon.startsWith("data:image")) {
    return `<img class="fpb-asset-preview" src="${escapeAttribute(icon)}" alt=""/>`;
  }
  return escapeAttribute(icon);
}

export function escapeAttribute(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
