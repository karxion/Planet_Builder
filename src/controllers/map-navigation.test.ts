// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { initMapNavigation } from "./map-navigation";

vi.mock("@/services/ui-language", () => ({ getUiLanguage: () => "ko" }));
let events: ReturnType<typeof vi.spyOn>;
let viewport: EventTarget & { width: number; height: number; scale: number };
let refit: ReturnType<typeof vi.fn>;
let zoomCall: ReturnType<typeof vi.fn>;
beforeEach(() => {
  vi.useFakeTimers();
  events = vi.spyOn(window, "addEventListener");
  document.body.innerHTML = '<header id="fpb-shell"></header><svg id="map"></svg>';
  document.getElementById("fpb-shell")!.getBoundingClientRect = () => ({ height: 100 }) as DOMRect;
  viewport = Object.assign(new EventTarget(), { width: 390, height: 744, scale: 1 });
  vi.stubGlobal("visualViewport", viewport);
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => window.setTimeout(() => callback(0), 16));
  refit = vi.fn();
  zoomCall = vi.fn();
  vi.stubGlobal("fitMapToScreen", refit);
  vi.stubGlobal("zoom", { scaleBy: vi.fn() });
  vi.stubGlobal("svg", { interrupt: () => ({ call: zoomCall }) });
});
afterEach(() => {
  for (const [name, handler, options] of events.mock.calls) window.removeEventListener(name, handler, options);
  delete window.scheduleMapViewportFit;
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

it("provides accessible zoom and fit controls using the map rather than browser page zoom", () => {
  initMapNavigation();
  initMapNavigation();
  expect(document.querySelectorAll("#fpb-map-navigation")).toHaveLength(1);
  document.querySelector<HTMLButtonElement>('[data-map-zoom="in"]')!.click();
  document.querySelector<HTMLButtonElement>('[data-map-zoom="out"]')!.click();
  expect(zoomCall.mock.calls.map(call => call[1])).toEqual([1.5, 1 / 1.5]);
  const fit = document.querySelector<HTMLButtonElement>('[data-map-zoom="fit"]')!;
  expect(fit.getAttribute("aria-label")).toBe("지도 화면 맞춤");
  fit.click();
  expect(refit).toHaveBeenCalledWith(true);
});

it("coalesces browser-chrome resize events, skips unchanged size and fits a replacement SVG", async () => {
  initMapNavigation();
  await vi.advanceTimersByTimeAsync(16);
  expect(refit).toHaveBeenCalledTimes(1);
  for (let n = 0; n < 20; n++) viewport.dispatchEvent(new Event("resize"));
  await vi.advanceTimersByTimeAsync(16);
  expect(refit).toHaveBeenCalledTimes(1);
  viewport.height = 500;
  for (let n = 0; n < 20; n++) viewport.dispatchEvent(new Event("resize"));
  await vi.advanceTimersByTimeAsync(16);
  expect(refit).toHaveBeenCalledTimes(2);
  const replacement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  replacement.id = "map";
  document.getElementById("map")!.replaceWith(replacement);
  window.dispatchEvent(new Event("map:loaded"));
  await vi.advanceTimersByTimeAsync(16);
  expect(refit).toHaveBeenCalledTimes(3);
});
