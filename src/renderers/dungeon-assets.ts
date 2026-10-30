import { DUNGEON_IMAGE_MANIFEST, dungeonAssetUrl } from "@/data/dungeon-assets";
import type { DungeonAssetId } from "@/types/dungeon-v2";

export function dungeonAssetDefs(
  ids: DungeonAssetId[],
  view: "battle" | "overview" = "battle",
  prefix = "dv2"
): string {
  return [...new Set(ids)]
    .map(id => {
      const meta = DUNGEON_IMAGE_MANIFEST[id];
      if (!meta) return "";
      const [x, y, w, h] = meta.views[view].crop;
      return `<symbol id="${prefix}-${id}" viewBox="0 0 ${w} ${h}" overflow="hidden"><image data-dungeon-module="${id}" href="${dungeonAssetUrl(id)}" x="${-x}" y="${-y}" width="${meta.width}" height="${meta.height}"/></symbol>`;
    })
    .join("");
}
export function dungeonAsset(
  id: DungeonAssetId,
  x: number,
  y: number,
  width: number,
  height: number,
  rotation = 0,
  prefix = "dv2"
): string {
  return `<use data-dungeon-asset="${id}" href="#${prefix}-${id}" x="${x}" y="${y}" width="${width}" height="${height}" transform="rotate(${rotation} ${x + width / 2} ${y + height / 2})"/>`;
}
