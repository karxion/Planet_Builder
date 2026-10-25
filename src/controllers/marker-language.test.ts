// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { setUiLanguage } from "@/services/ui-language";

const code = readFileSync(resolve(process.cwd(), "public/modules/ui/markers-editor.js"), "utf8");

function fixture() {
  document.body.innerHTML = `<svg id="marker1"></svg><div id="notesEditor"></div><div id="markerEditor"></div>
    <select id="markerPin"><option value="no">No</option></select>
    ${["markerType", "markerIconSize", "markerIconShiftX", "markerIconShiftY", "markerSize", "markerFill", "markerStroke"].map(id => `<input id="${id}">`).join("")}
    ${["markerIcon", "markerIconSelect", "markerNotes", "markerLock", "addMarker", "markerAdd", "markerRemove"].map(id => `<button id="${id}"></button>`).join("")}`;
  setUiLanguage("ko");
  const marker = { i: 1, type: "statues", icon: "#rpg-monument" };
  const chain = { raise: () => chain, call: () => chain, classed: () => chain };
  Object.assign(window, { rpgIconPreview: () => "" });
  let close = () => {};
  const listen = (element: EventTarget, type: string, callback: EventListener) => {
    if (element === window) throw new Error("Legacy listen only supports Nodes");
    element.addEventListener(type, callback);
    return () => element.removeEventListener(type, callback);
  };
  const open = new Function(
    "window",
    "document",
    "customization",
    "closeDialogs",
    "ensureEl",
    "d3",
    "elSelected",
    "pack",
    "Markers",
    "$",
    "listen",
    "unselect",
    "restoreDefaultEvents",
    "clearMainTip",
    `${code}\nreturn editMarker;`
  )(
    window,
    document,
    false,
    vi.fn(),
    (id: string) => document.getElementById(id),
    { select: () => chain, drag: () => ({ on: vi.fn() }) },
    null,
    { markers: [marker] },
    { getConfig: () => [{ type: "statues" }, { type: "caves" }] },
    () => ({
      dialog: (options: { close: () => void }) => {
        close = options.close;
      }
    }),
    listen,
    vi.fn(),
    vi.fn(),
    vi.fn()
  );
  open(1);
  return { marker, close: () => close(), input: document.getElementById("markerType") as HTMLInputElement };
}

describe("marker type language", () => {
  it("opens without passing Window to the legacy Node listener and switches visible values", () => {
    const { marker, input, close } = fixture();
    expect(input.value).toBe("석상·비석");
    setUiLanguage("en");
    expect(input.value).toBe("statues");
    expect(marker.type).toBe("statues");
    setUiLanguage("ko");
    expect(input.value).toBe("석상·비석");
    close();
  });

  it("keeps machine IDs canonical when changing translated types and preserves custom types", () => {
    const { marker, input, close } = fixture();
    input.value = "동굴";
    input.dispatchEvent(new Event("change"));
    expect(marker.type).toBe("caves");
    input.value = "우리 캠페인의 장소";
    input.dispatchEvent(new Event("change"));
    expect(marker.type).toBe("우리 캠페인의 장소");
    close();
  });
});
