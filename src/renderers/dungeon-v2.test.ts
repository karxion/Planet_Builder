// @vitest-environment jsdom

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { DUNGEON_ASSETS, DUNGEON_IMAGE_MANIFEST } from "@/data/dungeon-assets";
import { createDungeonV2 } from "@/generators/dungeon-layout";
import { publicDungeonV2, renderDungeonSection, renderDungeonV2 } from "./dungeon-v2";

describe("Dungeon assets and public rendering", () => {
  it("registers 32 real PNG modules at about 2/3 original dimensions with valid view crops", () => {
    expect(DUNGEON_ASSETS).toHaveLength(32);
    expect(Object.keys(DUNGEON_IMAGE_MANIFEST)).toHaveLength(32);
    for (const asset of DUNGEON_ASSETS) {
      const m = DUNGEON_IMAGE_MANIFEST[asset.id],
        file = readFileSync(`${process.cwd()}/public/assets/dungeon/${asset.id.toLowerCase()}.png`);
      expect(file.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
      expect(createHash("sha256").update(file).digest("hex")).toBe(m.sha256);
      const original = readFileSync(`${process.cwd()}/${m.original.path}`);
      expect(createHash("sha256").update(original).digest("hex")).toBe(m.original.sha256);
      expect(Math.abs(m.width - (m.original.width * 2) / 3)).toBeLessThanOrEqual(1);
      expect(Math.abs(m.height - (m.original.height * 2) / 3)).toBeLessThanOrEqual(1);
      for (const view of [m.views.battle, m.views.overview]) {
        const [x, y, w, h] = view.crop;
        expect(x).toBeGreaterThanOrEqual(0);
        expect(y).toBeGreaterThanOrEqual(0);
        expect(w).toBeGreaterThan(0);
        expect(h).toBeGreaterThan(0);
        expect(x + w).toBeLessThanOrEqual(m.width);
        expect(y + h).toBeLessThanOrEqual(m.height);
      }
    }
  });
  it("removes hidden floors, devices, secret rooms, notes, target refs and unused image definitions", () => {
    const d = createDungeonV2("privacy", "privacy"),
      f = d.floors[0],
      secret = f.rooms[1];
    secret.secret = true;
    secret.revealed = false;
    secret.note = "NEVER_INCLUDE_SECRET";
    f.note = "NEVER_INCLUDE_FLOOR_NOTE";
    for (const e of f.entities) {
      e.assetId = "D11";
      e.revealed = false;
      if (e.device) e.device.counter = "NEVER_INCLUDE_COUNTER";
    }
    const hidden = d.floors[1];
    hidden.name = "NEVER_INCLUDE_FLOOR";
    hidden.revealed = false;
    const serialized = JSON.stringify(publicDungeonV2(d)),
      markup = renderDungeonV2(d, f.id, { gm: false, roomId: f.rooms[0].id, grid: true });
    for (const value of [
      "NEVER_INCLUDE_SECRET",
      "NEVER_INCLUDE_FLOOR_NOTE",
      "NEVER_INCLUDE_COUNTER",
      "NEVER_INCLUDE_FLOOR",
      secret.id
    ]) {
      expect(serialized).not.toContain(value);
      expect(markup).not.toContain(value);
    }
    expect(markup).not.toContain('id="dv2-D11"');
    expect(markup).not.toContain("data-dv2-entity");
    expect(markup).not.toContain("armed");
    const doc = new DOMParser().parseFromString(markup, "image/svg+xml");
    expect(doc.querySelector("parsererror")).toBeNull();
    expect(renderDungeonV2(d, hidden.id, { gm: false })).toBe("");
    expect(renderDungeonSection(d, false)).not.toContain(hidden.name);
    expect(renderDungeonV2(d, f.id, { gm: true })).toContain('id="dv2-D11"');
  });
  it("keeps battle framing separate from floor geometry, and exports only the selected floor", () => {
    const d = createDungeonV2("framing", "framing"),
      before = JSON.stringify(d),
      f = d.floors[0];
    const svg = renderDungeonV2(d, f.id, { gm: true, tactical: true, grid: true });
    expect(svg).toContain('width="3072" height="1728"');
    expect(svg).not.toContain(d.floors[1].id);
    expect(JSON.stringify(d)).toBe(before);
  });
});
