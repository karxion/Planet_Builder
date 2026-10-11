import { isRpgAsset, SETTLEMENT_ASSETS } from "@/data/rpg-map-assets";
import type { Burg } from "../generators/burgs-generator";
import { settlementTokenAppearance } from "../utils/settlementTokens";
import { installRpgAssetDefinitions } from "./rpg-asset-renderer";

declare global {
  var drawBurgIcons: () => void;
  var drawBurgIcon: (burg: Burg) => void;
  var removeBurgIcon: (burgId: number) => void;
}

const burgIconsRenderer = (): void => {
  TIME && console.time("drawBurgIcons");
  installRpgAssetDefinitions();
  createIconGroups();

  for (const { name } of options.burgs.groups) {
    const burgsInGroup = pack.burgs.filter(b => b.group === name && !b.removed);
    if (!burgsInGroup.length) continue;

    const iconsGroup = document.querySelector<SVGGElement>(`#burgIcons > g#${name}`);
    if (!iconsGroup) continue;

    const icon = iconsGroup.dataset.icon || "#icon-circle";
    iconsGroup.innerHTML = burgsInGroup
      .map(b => burgIconMarkup(b, icon, iconsGroup.getAttribute("font-size")))
      .join("");

    const portsInGroup = burgsInGroup.filter(b => b.port);
    if (!portsInGroup.length) continue;

    const portGroup = document.querySelector<SVGGElement>(`#anchors > g#${name}`);
    if (!portGroup) continue;

    portGroup.innerHTML = portsInGroup
      .map(b => `<use id="anchor${b.i}" data-id="${b.i}" href="#icon-anchor" x="${b.x}" y="${b.y}"></use>`)
      .join("");
  }

  TIME && console.timeEnd("drawBurgIcons");
};

const drawBurgIconRenderer = (burg: Burg): void => {
  const iconGroup = burgIcons.select<SVGGElement>(`#${burg.group}`);
  if (iconGroup.empty()) {
    drawBurgIcons();
    return; // redraw all icons if group is missing
  }

  removeBurgIconRenderer(burg.i!);
  const icon = iconGroup.attr("data-icon") || "#icon-circle";
  installRpgAssetDefinitions();
  iconGroup.node()!.insertAdjacentHTML("beforeend", burgIconMarkup(burg, icon, iconGroup.attr("font-size")));

  if (burg.port) {
    anchors
      .select(`#${burg.group}`)
      .append("use")
      .attr("href", "#icon-anchor")
      .attr("id", `anchor${burg.i}`)
      .attr("data-id", burg.i!)
      .attr("x", burg.x)
      .attr("y", burg.y);
  }
};

function burgIconMarkup(burg: Burg, icon: string, fontSize: string | null): string {
  const appearance = settlementTokenAppearance(
    burg.population,
    burg.capital,
    icon,
    Number.parseFloat(fontSize || "6") || 6,
    icon === `#rpg-${SETTLEMENT_ASSETS[burg.group || ""]}`
  );
  const size = appearance.size;
  icon = appearance.icon;
  const geometry = isRpgAsset(icon)
    ? `width="${size}" height="${size}" transform="translate(${-size / 2} ${-size * 0.85})"`
    : "";
  return `<use id="burg${burg.i}" data-id="${burg.i}" href="${icon}" x="${burg.x}" y="${burg.y}" ${geometry}></use>`;
}

const removeBurgIconRenderer = (burgId: number): void => {
  document.querySelectorAll(`#burgIcons [id="burg${burgId}"]`).forEach(icon => void icon.remove());

  document.querySelectorAll(`#anchors [id="anchor${burgId}"]`).forEach(anchor => void anchor.remove());
};

function createIconGroups(): void {
  // save existing styles and remove all groups
  document.querySelectorAll("g#burgIcons > g").forEach(group => {
    style.burgIcons[group.id] = Array.from(group.attributes).reduce((acc: { [key: string]: string }, attribute) => {
      acc[attribute.name] = attribute.value;
      return acc;
    }, {});
    group.remove();
  });

  document.querySelectorAll("g#anchors > g").forEach(group => {
    style.anchors[group.id] = Array.from(group.attributes).reduce((acc: { [key: string]: string }, attribute) => {
      acc[attribute.name] = attribute.value;
      return acc;
    }, {});
    group.remove();
  });

  // create groups for each burg group and apply stored or default style
  const defaultIconStyle = style.burgIcons.town || Object.values(style.burgIcons)[0] || {};
  const defaultAnchorStyle = style.anchors.town || Object.values(style.anchors)[0] || {};
  const sortedGroups = [...options.burgs.groups].sort((a, b) => a.order - b.order);
  for (const { name } of sortedGroups) {
    const burgGroup = burgIcons.append("g");
    const iconStyles = style.burgIcons[name] || defaultIconStyle;
    Object.entries(iconStyles).forEach(([key, value]) => {
      burgGroup.attr(key, value);
    });
    burgGroup.attr("id", name);

    const anchorGroup = anchors.append("g");
    const anchorStyles = style.anchors[name] || defaultAnchorStyle;
    Object.entries(anchorStyles).forEach(([key, value]) => {
      anchorGroup.attr(key, value);
    });
    anchorGroup.attr("id", name);
  }
}

window.drawBurgIcons = burgIconsRenderer;
window.drawBurgIcon = drawBurgIconRenderer;
window.removeBurgIcon = removeBurgIconRenderer;
