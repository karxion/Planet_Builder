import { applyMapTransportStyle } from "@/renderers/map-transport-style";

let initialized = false;

export function initMapTransportStyle(): void {
  if (initialized) return;
  initialized = true;
  const refresh = () => {
    const map = document.querySelector<SVGSVGElement>("svg#map");
    const preset = document.querySelector<HTMLSelectElement>("#stylePreset")?.value;
    if (map) applyMapTransportStyle(map, preset);
  };
  for (const event of ["map:loaded", "map:generated"]) window.addEventListener(event, refresh);
  refresh();
}
