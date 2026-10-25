// @vitest-environment jsdom
import { expect, it, vi } from "vitest";
import { initMapTransportStyle } from "./map-transport-style";

it("initializes once and migrates a replacement SVG on load and generation", () => {
  const insertMap = () => {
    document.body.innerHTML = `<select id="stylePreset"><option value="default">Default</option></select><svg id="map"><g id="rivers" fill="black"/><g id="roads"/><g id="trails"/></svg>`;
  };
  insertMap();
  const listener = vi.spyOn(window, "addEventListener");
  initMapTransportStyle();
  initMapTransportStyle();
  expect(listener.mock.calls.filter(([name]) => name === "map:loaded")).toHaveLength(1);
  expect(document.querySelector("#rivers")?.getAttribute("fill")).toBe("#278fc4");
  for (const event of ["map:loaded", "map:generated"]) {
    insertMap();
    window.dispatchEvent(new Event(event));
    expect(document.querySelector("#roads")?.getAttribute("stroke-width")).toBe("1.1");
    expect(document.querySelector("#rivers")?.getAttribute("fill")).toBe("#278fc4");
  }
  listener.mockRestore();
});
