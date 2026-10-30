import type { ZoomBehavior } from "d3";
import { getUiLanguage } from "@/services/ui-language";
import { getMapViewport } from "@/utils/mapViewport";

declare global {
  var zoom: ZoomBehavior<SVGSVGElement, unknown>;
  interface Window {
    scheduleMapViewportFit?: () => void;
  }
}

/** Touch-sized navigation works with the existing D3 map in every world space. */
export function initMapNavigation(): void {
  if (document.getElementById("fpb-map-navigation")) return;
  const navigation = document.createElement("nav");
  navigation.id = "fpb-map-navigation";
  navigation.dataset.i18nSkip = "";
  const definitions = [
    { id: "in", ko: "확대", en: "Zoom in", path: "M12 5v14M5 12h14", factor: 1.5 },
    { id: "out", ko: "축소", en: "Zoom out", path: "M5 12h14", factor: 1 / 1.5 },
    { id: "fit", ko: "지도 화면 맞춤", en: "Fit map to screen", path: "M9 4H4v5m11-5h5v5M4 15v5h5m6 0h5v-5", factor: 0 }
  ];
  for (const definition of definitions) {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.mapZoom = definition.id;
    button.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false"><path d="${definition.path}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    button.onclick = () => {
      if (typeof svg === "undefined" || typeof zoom === "undefined") return;
      if (definition.factor) svg.interrupt().call(zoom.scaleBy, definition.factor);
      else fitMapToScreen(true);
    };
    navigation.append(button);
  }
  const labels = () => {
    navigation.setAttribute("aria-label", getUiLanguage() === "ko" ? "지도 확대·축소" : "Map navigation");
    definitions.forEach((definition, index) => {
      const label = getUiLanguage() === "ko" ? definition.ko : definition.en;
      navigation.children[index].setAttribute("aria-label", label);
      navigation.children[index].setAttribute("title", label);
    });
  };
  labels();
  document.body.append(navigation);
  window.addEventListener("ui:language-changed", labels);

  let frame = 0;
  let lastSize = "";
  let lastMap: Element | null = null;
  const fit = () => {
    frame = 0;
    const map = document.getElementById("map");
    const shell = document.getElementById("fpb-shell");
    if (!map || !shell) return;
    const shellHeight = shell.getBoundingClientRect().height;
    const layoutHeight = document.documentElement.clientHeight || innerHeight;
    const size = getMapViewport(
      document.documentElement.clientWidth || innerWidth,
      layoutHeight,
      shellHeight,
      window.visualViewport
    );
    const key = `${size.width}:${size.height}`;
    navigation.dataset.compact = String(size.height < 250);
    document.documentElement.style.setProperty(
      "--fpb-visible-height",
      `${Math.min(layoutHeight, size.height + shellHeight)}px`
    );
    document.documentElement.style.setProperty(
      "--fpb-viewport-bottom-gap",
      `${Math.max(0, layoutHeight - size.height - shellHeight)}px`
    );
    if (lastMap === map && lastSize === key) return;
    lastMap = map;
    lastSize = key;
    if (typeof fitMapToScreen === "function") fitMapToScreen();
    window.dispatchEvent(new Event("map:viewport-resized"));
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(fit);
  };
  window.scheduleMapViewportFit = schedule;
  window.addEventListener("resize", schedule);
  window.visualViewport?.addEventListener("resize", schedule);
  const shell = document.getElementById("fpb-shell");
  if (shell && typeof ResizeObserver !== "undefined") new ResizeObserver(schedule).observe(shell);
  for (const name of ["map:loaded", "map:generated"]) window.addEventListener(name, schedule);
  schedule();
}
