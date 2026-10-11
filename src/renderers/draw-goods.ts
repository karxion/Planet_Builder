import { getRpgResourceIcon, type ResourceSite, selectResourceSites } from "@/data/rpg-map-assets";
import { RESOURCE_SITE_SPACING, RESOURCE_TOKEN_SIZE } from "@/utils/resourceTokenLayout";
import { rn } from "../utils";
import { escapeAttribute, installRpgAssetDefinitions } from "./rpg-asset-renderer";

const SUBGROUPS = ["goodsCells", "goodsIcons", "goodsBurgs"] as const;

export function toggleGoods(event?: MouseEvent) {
  if (!layerIsOn("toggleGoods")) {
    turnButtonOn("toggleGoods");
    drawGoods();
    if (event && isCtrlClick(event)) editStyle("goodsIcons");
  } else {
    if (event && isCtrlClick(event)) return editStyle("goodsIcons");
    SUBGROUPS.forEach(id => void goods.select(`#${id}`).html(""));
    turnButtonOff("toggleGoods");
  }
}

export function drawGoods() {
  TIME && console.time("drawGoods");
  installRpgAssetDefinitions();
  for (const id of SUBGROUPS) {
    if (goods.select(`#${id}`).empty()) goods.append("g").attr("id", id);
  }
  // Resources are map sites, not cell heatmaps or settlement production plates.
  goods.select("#goodsCells").html("");
  goods.select("#goodsBurgs").html("");
  const icons = goods.select("#goodsIcons");
  const siteSpacing = Number(icons.attr("data-site-spacing")) || RESOURCE_SITE_SPACING;
  const iconSize = Number(icons.attr("data-size")) || RESOURCE_TOKEN_SIZE;
  icons.attr("data-display-size", iconSize);
  const half = iconSize / 2;
  const visible = new Set(pack.goods.filter(good => good.visible).map(good => good.i));
  const sites: ResourceSite[] = [];
  if (pack.cells.good) {
    for (const cell of pack.cells.i) {
      const good = pack.cells.good[cell];
      if (!good || !visible.has(good)) continue;
      const [x, y] = pack.cells.p[cell];
      sites.push({ cell, good, x, y });
    }
  }
  icons.html(
    selectResourceSites(sites, siteSpacing)
      .map(site => {
        const good = Goods.get(site.good);
        if (!good) return "";
        const name = escapeAttribute(good.name);
        return `<g data-i="${good.i}" data-cell="${site.cell}" role="img" aria-label="${name}">
      <title>${name}</title><use href="${escapeAttribute(getRpgResourceIcon(good.icon))}" x="${rn(site.x - half, 2)}" y="${rn(site.y - half, 2)}" width="${iconSize}" height="${iconSize}"/></g>`;
      })
      .join("")
  );
  goods.style("display", null);
  TIME && console.timeEnd("drawGoods");
}

declare global {
  interface Window {
    toggleGoods: typeof toggleGoods;
    drawGoods: typeof drawGoods;
  }
}

window.toggleGoods = toggleGoods;
window.drawGoods = drawGoods;
