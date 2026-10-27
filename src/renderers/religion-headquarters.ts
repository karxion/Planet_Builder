import { t } from "@/services/ui-language";
import type { CampaignWorld } from "@/types/campaign-world";
import type { RealmReligion } from "@/types/realm-heritage";

const SVG_NS = "http://www.w3.org/2000/svg";
const svg = (tag: string, attributes: Record<string, string | number> = {}) => {
  const element = document.createElementNS(SVG_NS, tag);
  for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, String(value));
  return element;
};
let stopWatching = () => {};

/** A badge belongs to its recorded location. Never displace it to avoid other map content. */
export function drawReligionHeadquarters(world?: CampaignWorld, dimensions?: { width: number; height: number }): void {
  stopWatching();
  document.getElementById("fpb-headquarters")?.remove();
  const view = document.querySelector<SVGGElement>("#map #viewbox");
  if (!view || !world?.heritage?.showHeadquarters) return;
  const homes = new Map(world.units.map(unit => [unit.id, unit]));
  const locations = new Map<string, RealmReligion[]>();
  for (const religion of [...world.heritage.religions].sort((a, b) => a.id.localeCompare(b.id))) {
    const home = homes.get(religion.headquartersId);
    if (!home || !Number.isFinite(home.x) || !Number.isFinite(home.y)) continue;
    const records = locations.get(home.id) || [];
    records.push(religion);
    locations.set(home.id, records);
  }
  if (!locations.size) return;
  const layer = svg("g", { id: "fpb-headquarters" });
  for (const [locationId, religions] of locations) {
    const home = homes.get(locationId)!;
    const label = `${home.name} · ${t("총본산")} (${religions.length})`;
    const group = svg("g", {
      "data-headquarters": locationId,
      transform: `translate(${home.x} ${home.y})`,
      role: "button",
      tabindex: 0,
      "aria-label": label,
      "aria-haspopup": "dialog",
      "aria-controls": "fpb-headquarters-panel",
      "aria-pressed": String(document.getElementById("fpb-headquarters-panel")?.dataset.location === locationId),
      cursor: "pointer"
    });
    const title = svg("title");
    title.textContent = `${label}\n${religions.map(religion => religion.name).join("\n")}`;
    const badge = svg("g", { "data-badge": "" });
    // A 44px touch target; the visible ring stays centered on the settlement beneath it.
    badge.append(
      svg("circle", { r: 22, fill: "transparent", stroke: "none" }),
      svg("circle", { r: 10, fill: "none", stroke: "#28352a", "stroke-width": 4, "pointer-events": "none" }),
      svg("circle", {
        r: 10,
        fill: "none",
        stroke: "#efd88b",
        "stroke-width": 2,
        class: "fpb-hq-ring",
        "pointer-events": "none"
      }),
      svg("circle", {
        cx: 9,
        cy: -9,
        r: 7,
        fill: "#28352a",
        stroke: "#efd88b",
        "stroke-width": 1,
        "pointer-events": "none"
      })
    );
    const count = svg("text", {
      x: 9,
      y: -8.5,
      fill: "#fff2bb",
      "text-anchor": "middle",
      "dominant-baseline": "middle",
      "font-size": religions.length > 99 ? 6 : 9,
      "font-family": "Arial, sans-serif",
      "font-weight": "bold",
      "pointer-events": "none"
    });
    count.textContent = religions.length === 1 ? "✦" : religions.length > 99 ? "99+" : String(religions.length);
    badge.append(count);
    group.append(title, badge);
    const open = () => {
      for (const marker of layer.querySelectorAll("[data-headquarters]"))
        marker.setAttribute("aria-pressed", String(marker === group));
      window.dispatchEvent(new CustomEvent("realm:headquarters-selected", { detail: locationId }));
    };
    group.addEventListener("click", event => {
      event.stopPropagation();
      open();
    });
    group.addEventListener("keydown", event => {
      if (event instanceof KeyboardEvent && ["Enter", " "].includes(event.key)) {
        event.preventDefault();
        event.stopPropagation();
        open();
      }
    });
    layer.append(group);
  }
  view.append(layer);

  const map = view.ownerSVGElement!;
  const syncZoom = () => {
    const matrix = view.getCTM?.();
    const scale = matrix ? Math.hypot(matrix.a, matrix.b) : 1;
    const viewport = map.getBoundingClientRect();
    const width = dimensions?.width ?? Number(map.getAttribute("width"));
    const height = dimensions?.height ?? Number(map.getAttribute("height"));
    const fit =
      viewport.width && viewport.height && width && height
        ? Math.min(viewport.width / width, viewport.height / height)
        : 1;
    const visible = scale >= fit * 1.8;
    layer.style.display = visible ? "" : "none";
    layer.setAttribute("aria-hidden", String(!visible));
    for (const badge of layer.querySelectorAll("[data-badge]")) badge.setAttribute("transform", `scale(${1 / scale})`);
    for (const marker of layer.querySelectorAll("[data-headquarters]"))
      marker.setAttribute("tabindex", visible ? "0" : "-1");
  };
  syncZoom();
  const observer = new MutationObserver(syncZoom);
  observer.observe(view, { attributes: true, attributeFilter: ["transform"] });
  window.addEventListener("resize", syncZoom);
  stopWatching = () => {
    observer.disconnect();
    window.removeEventListener("resize", syncZoom);
  };
}
