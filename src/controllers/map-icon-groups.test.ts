// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});
it("bounds the layout delay during continuous zoom / restoration mutations", async () => {
  vi.resetModules();
  vi.useFakeTimers();
  document.body.innerHTML = '<svg id="map"><g id="viewbox"></g></svg>';
  document.querySelector<SVGGElement>("#viewbox")!.getScreenCTM = () => null;
  const events = vi.spyOn(window, "addEventListener");
  let mutate!: (records: Partial<MutationRecord>[]) => void;
  const observe = vi.fn();
  vi.stubGlobal(
    "MutationObserver",
    class {
      constructor(callback: (records: Partial<MutationRecord>[]) => void) {
        mutate = callback;
      }
      observe = observe;
      disconnect = vi.fn();
    }
  );
  vi.stubGlobal("pack", { cells: { burg: [] }, burgs: [], markers: [] });
  vi.stubGlobal("customization", 0);
  vi.stubGlobal("elSelected", null);
  const { initMapIconGroups } = await import("./map-icon-groups");
  try {
    initMapIconGroups();
    expect(observe).toHaveBeenCalledOnce();
    for (let index = 0; index < 36; index++) {
      mutate([{ target: document.getElementById("viewbox")!, attributeName: "class" }]);
      await vi.advanceTimersByTimeAsync(10);
    }
    expect(observe.mock.calls.length).toBeGreaterThanOrEqual(4);
    const beforePan = observe.mock.calls.length;
    for (let index = 0; index < 36; index++) {
      mutate([{ target: document.getElementById("viewbox")!, attributeName: "transform" }]);
      await vi.advanceTimersByTimeAsync(10);
    }
    expect(observe.mock.calls.length).toBe(beforePan);
    document.body.classList.add("fpb-map-interacting");
    window.dispatchEvent(new Event("map:interaction-start"));
    mutate([{ target: document.getElementById("viewbox")!, attributeName: "class" }]);
    await vi.advanceTimersByTimeAsync(1000);
    expect(observe.mock.calls.length).toBe(beforePan);
    document.body.classList.remove("fpb-map-interacting");
    window.dispatchEvent(new Event("map:interaction-end"));
    await vi.advanceTimersByTimeAsync(125);
    expect(observe.mock.calls.length).toBe(beforePan + 1);
  } finally {
    for (const [name, handler, options] of events.mock.calls) window.removeEventListener(name, handler, options);
    vi.clearAllTimers();
  }
});
