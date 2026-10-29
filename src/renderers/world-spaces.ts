import { siteInActiveLevel, undergroundLabel, undergroundLevel, undergroundModeLabel } from "@/data/underground";
import type { SpaceSite, WorldSpace, WorldSpacesData } from "@/types/world-spaces";
import { drawUndergroundTerrain } from "./underground-map";
import { drawUnderwaterTerrain } from "./underwater-map";
import { subsurfaceDefs, subsurfaceMarker, subsurfaceScenery } from "./subsurface-assets";

const NS = "http://www.w3.org/2000/svg";
const element = (name: string, attrs: Record<string, string | number> = {}, text?: string) => {
  const node = document.createElementNS(NS, name);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
  if (text !== undefined) node.textContent = text;
  return node;
};

/** Renders separate records; never writes to the ground map, its cells or world state. */
export function drawWorldSpaces(input: {
  parent: SVGGElement;
  data: WorldSpacesData;
  width: number;
  height: number;
  selected: string;
  labels: Record<WorldSpace, string>;
  landPath?: string;
  landMask?: boolean;
}): void {
  const { parent, data, width, height, selected, labels } = input;
  parent.querySelector("#fpb-world-spaces")?.remove();
  const root = element("g", { id: "fpb-world-spaces", "data-space": data.activeSpace });
  if (data.activeSpace !== "surface") root.append(subsurfaceDefs());
  if (data.activeSpace !== "surface") {
    root.append(element("rect", { width, height, fill: data.activeSpace === "underwater" ? "#102f42" : "#201d2b" }));
    if (input.landMask)
      root.append(
        element("rect", { width, height, fill: "#a8adac", opacity: 0.15, mask: "url(#land)", "pointer-events": "none" })
      );
    if (input.landPath)
      root.append(element("path", { d: input.landPath, fill: "#a8adac", opacity: 0.12, "pointer-events": "none" }));
  }
  const byId = new Map(data.sites.map(site => [site.id, site]));
  const underground = data.activeSpace === "underground" ? data.underground : undefined;
  if (underground) root.append(drawUndergroundTerrain(underground, width, height));
  const underwater = data.activeSpace === "underwater" ? data.underwater : undefined;
  if (underwater) root.append(drawUnderwaterTerrain(underwater, data.factions, width, height));
  const sites = data.sites.filter(s => siteInActiveLevel(s, data));
  const point = (s: SpaceSite) => [s.x * width, s.y * height];
  const labelBounds: { x: number; y: number; width: number; height: number }[] = [];
  const color = (s: SpaceSite) => data.factions.find(f => f.id === s.factionId)?.color || "#d9ca8b";
  for (const site of sites.filter(s => s.kind === "terrain" || s.kind === "territory")) {
    if (underground && site.origin === "underground" && site.kind === "terrain" && !site.edited) continue;
    const [cx, cy] = point(site);
    const fills = {
      plain: "#2b6472",
      reef: "#507e69",
      trench: "#071a31",
      cavern: "#665877",
      lake: "#23596a",
      rock: "#39333d"
    };
    root.append(
      element("ellipse", {
        cx,
        cy,
        rx: site.radius * width,
        ry: site.radius * height,
        fill: site.kind === "terrain" ? fills[site.terrain] : color(site),
        "fill-opacity": site.kind === "terrain" ? 0.7 : 0.2,
        stroke: selected === site.id ? "#fff" : color(site),
        "stroke-width": 1.5,
        "stroke-dasharray": site.kind === "territory" ? "5 3" : "none",
        "vector-effect": "non-scaling-stroke",
        "data-space-site": site.id,
        ...(underground && site.kind === "territory" ? { "clip-path": "url(#fpb-underground-floor)" } : {}),
        ...(underwater && site.kind === "territory" ? { "clip-path": "url(#fpb-sea-water)" } : {})
      })
    );
  }
  for (const link of data.links) {
    const from = byId.get(link.from)!;
    const to = byId.get(link.to)!;
    if (siteInActiveLevel(from, data) && siteInActiveLevel(to, data)) {
      if (underground && underground.mode !== "hollow" && link.origin === "underground") continue;
      const [x1, y1] = point(from);
      const [x2, y2] = point(to);
      const line = element(link.path ? "path" : "line", {
        ...(link.path
          ? { d: link.path.map((p, i) => `${i ? "L" : "M"}${p.x * width},${p.y * height}`).join(" "), fill: "none" }
          : {}),
        x1,
        y1,
        x2,
        y2,
        stroke: link.transport === "water" ? "#9edcd9" : "#bca874",
        "stroke-width": 2,
        "stroke-dasharray": link.transport === "land" ? "none" : "6 4",
        ...(underground?.mode === "hollow" && link.origin === "underground" ? { "data-inner-route": link.id } : {}),
        "vector-effect": "non-scaling-stroke",
        ...(underwater && link.origin === "underwater"
          ? { "clip-path": "url(#fpb-sea-water)", "data-sea-route": link.id }
          : {})
      });
      line.append(element("title", {}, link.name));
      root.append(line);
    } else {
      const origin = siteInActiveLevel(from, data) ? from : siteInActiveLevel(to, data) ? to : undefined;
      if (!origin) continue;
      const target = origin === from ? to : from;
      const [x, y] = point(origin);
      const portal = element(
        "text",
        {
          x: x + 8,
          y: y + 16,
          fill: "#fff0b5",
          "font-size": 11,
          cursor: "pointer",
          "data-space-travel": target.id,
          role: "button",
          tabindex: 0
        },
        `↪ ${target.space === "underground" && data.underground ? (data.underground.mode === "hollow" ? undergroundModeLabel("hollow") : undergroundLabel(undergroundLevel(target.depth))) : labels[target.space]}`
      );
      portal.append(element("title", {}, `${link.name} → ${target.name} (${target.depth} m)`));
      labelBounds.push({
        x: x + 8,
        y: y + 5,
        width: [...(portal.firstChild?.textContent || "")].length * 10,
        height: 14
      });
      root.append(portal);
    }
  }
  const priority = (site: SpaceSite) => (site.kind === "city" ? 0 : site.kind === "gateway" ? 1 : 2);
  // Keep hit areas above the territory fills and below city / gateway controls.
  if (data.activeSpace !== "surface") root.append(subsurfaceScenery(data, width, height));
  for (const site of [...sites].sort((a, b) => priority(a) - priority(b))) {
    if (underground && site.origin === "underground" && site.kind === "territory") continue;
    const [x, y] = point(site);
    const group = element("g", {
      "data-space-site": site.id,
      role: "button",
      tabindex: 0,
      cursor: "pointer",
      "aria-label": site.name
    });
    if (site.kind === "city" || site.kind === "gateway")
      group.append(
        element(
          site.kind === "city" ? "circle" : "rect",
          site.kind === "city"
            ? {
                cx: x,
                cy: y,
                r: 4,
                fill: color(site),
                stroke: selected === site.id ? "white" : "#111",
                "stroke-width": 1.5
              }
            : {
                x: x - 4,
                y: y - 4,
                width: 8,
                height: 8,
                fill: color(site),
                stroke: selected === site.id ? "white" : "#111",
                transform: `rotate(45 ${x} ${y})`
              }
        )
      );
    if (data.activeSpace !== "surface" && (site.kind === "city" || site.kind === "gateway")) {
      group.append(
        subsurfaceMarker(
          site.kind === "gateway" ? "c04" : site.space === "underwater" ? "ss01" : "us01",
          x,
          y - 4,
          site.kind === "city" ? 36 : 28
        )
      );
      if (site.kind === "city") {
        group.append(subsurfaceMarker(site.space === "underwater" ? "ss05" : "us05", x - 14, y + 6, 20));
        group.append(subsurfaceMarker(site.space === "underwater" ? "ss06" : "us06", x + 14, y + 6, 20));
      }
    }
    const labelY = site.kind === "city" ? y + 25 : site.kind === "territory" ? y + 45 : y - 6;
    const bounds = {
      x: site.kind === "city" ? x - [...site.name].length * 3.5 : x + 7,
      y: labelY - 11,
      width: [...site.name].length * 7,
      height: 14
    };
    const overlaps = labelBounds.some(
      other =>
        bounds.x < other.x + other.width + 3 &&
        bounds.x + bounds.width + 3 > other.x &&
        bounds.y < other.y + other.height + 3 &&
        bounds.y + bounds.height + 3 > other.y
    );
    if (!((site.kind === "terrain" || site.kind === "territory") && overlaps)) {
      labelBounds.push(bounds);
      group.append(
        element(
          "text",
          {
            x: site.kind === "city" ? x : x + 7,
            y: labelY,
            "text-anchor": site.kind === "city" ? "middle" : "start",
            "data-space-city-label": site.kind === "city" ? site.id : "",
            "font-family": "Arial, Malgun Gothic, sans-serif",
            "font-weight": site.kind === "city" ? 700 : 400,
            fill: "#f8edca",
            stroke: "#18201e",
            "stroke-width": 3,
            "paint-order": "stroke",
            "font-size": 11
          },
          site.name
        )
      );
    } else group.append(element("circle", { cx: x, cy: y, r: 5, fill: "transparent" }));
    group.append(element("title", {}, `${site.name} · ${site.depth} m${site.residents ? ` · ${site.residents}` : ""}`));
    root.append(group);
  }
  parent.append(root);
}
