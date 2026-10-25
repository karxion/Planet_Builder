// @vitest-environment jsdom
/// <reference types="node" />
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, expect, it, vi } from "vitest";

const { get, openNpc } = vi.hoisted(() => ({ get: vi.fn(), openNpc: vi.fn() }));
vi.mock("@/controllers/campaign-world", () => ({ Campaign: { get, openNpc } }));

import { initLocalEncounters } from "./local-encounters";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});
it("cleans restored frames and opens local NPCs only for encounter markers", () => {
  const notes = [
    {
      id: "marker7",
      name: "내 기록",
      legend: '<p>내용</p><iframe src="https://deorum.vercel.app/encounter/1"></iframe>'
    }
  ];
  vi.stubGlobal("notes", notes);
  vi.stubGlobal("pack", {
    markers: [
      { i: 7, type: "encounters", x: 1, y: 1, cell: 0 },
      { i: 8, type: "dungeon" }
    ],
    cells: { state: [1] },
    burgs: [{ i: 1, state: 1, x: 2, y: 2 }]
  });
  get.mockReturnValue({ npcs: [{ id: "npc:1:0:0", villageId: "village:1" }] });
  initLocalEncounters();
  initLocalEncounters();
  expect(notes[0].legend).toBe("<p>내용</p>");
  expect(window.openLocalEncounter(7)).toBe(true);
  expect(openNpc).toHaveBeenCalledWith("npc:1:0:0");
  expect(window.openLocalEncounter(8)).toBe(false);
  expect(window.openLocalEncounter(99)).toBe(false);
  get.mockReturnValue({ npcs: [] });
  expect(window.openLocalEncounter(7)).toBe(false);
});

it("routes marker clicks internally and preserves Shift-click editing", () => {
  const root = process.env.FPB_DEORUM_TEST_ROOT || resolve(dirname(fileURLToPath(import.meta.url)), "../..");
  const file = readFileSync(resolve(root, "public/modules/ui/editors.js"), "utf8");
  const source = file.slice(0, file.indexOf("// clear elSelected"));
  document.body.innerHTML =
    '<svg id="map"><g id="viewbox"><g id="markers"><svg id="marker7"><g><text>x</text></g></svg></g></g></svg>';
  const target = document.querySelector("text");
  const local = vi.fn(() => true),
    edit = vi.fn();
  const invoke = (shiftKey: boolean) =>
    new Function("modules", "d3", "window", "editMarker", `${source}\nclicked();`)(
      {},
      { event: { target, shiftKey } },
      { openLocalEncounter: local },
      edit
    );
  invoke(false);
  expect(local).toHaveBeenCalledWith(7);
  expect(edit).not.toHaveBeenCalled();
  invoke(true);
  expect(edit).toHaveBeenCalledOnce();
});
