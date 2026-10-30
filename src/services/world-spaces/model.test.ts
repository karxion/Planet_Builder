import { describe, expect, it, vi } from "vitest";
import { createDraftRecovery, readDraftRecovery } from "@/services/planet/draft-recovery";
import { createPlanetProject, decodePlanetProject, encodePlanetProject } from "@/services/planet/project-codec";
import { isPlanetProject } from "@/services/planet/project-validation";
import { DEFAULT_PLANET_SETTINGS } from "@/types/planet-project";
import { emptyWorldSpaces, isWorldSpaces, WorldSpaceStore } from "./model";

function populated() {
  const store = new WorldSpaceStore();
  const a = store.addSite("underwater", "city", 0.4, 0.6);
  const b = store.addSite("underground", "gateway", 0.4, 0.6);
  store.update(d => {
    d.factions.push({ id: "sea-kingdom", name: "해저 왕국", color: "#3487ab", notes: "" });
    d.sites[0].factionId = "sea-kingdom";
    d.links.push({ id: "passage", name: "침수 동굴", from: a.id, to: b.id });
    d.activeSpace = "underwater";
  });
  return { store, a, b };
}
const project = () =>
  createPlanetProject({
    mapPayload: `1.135|test\r\n${"x".repeat(150)}`,
    settings: DEFAULT_PLANET_SETTINGS,
    fmgVersion: "1.135",
    upstreamCommit: "test"
  });

describe("shared-coordinate world spaces", () => {
  it("roundtrips independent layer visibility and order without changing geography", async () => {
    const { store } = populated(),
      p = project();
    const before = store.snapshot();
    store.update(d => {
      d.layers = {
        underwater: { visible: { toggleRelief: false, toggleStates: true }, order: ["toggleLabels", "toggleRelief"] },
        underground: { visible: { toggleHeight: true, toggleLabels: false } }
      };
    });
    p.worldSpaces = store.snapshot();
    expect((await decodePlanetProject(await encodePlanetProject(p))).worldSpaces).toEqual(p.worldSpaces);
    expect(p.worldSpaces.sites).toEqual(before.sites);
    for (const invalid of [
      { surface: {} },
      { underwater: { visible: { toggleRelief: "yes" } } },
      { underwater: { order: ["toggleLabels", "toggleLabels"] } },
      { underwater: { visible: { unknown: true } } }
    ])
      expect(isWorldSpaces({ ...p.worldSpaces, layers: invalid })).toBe(false);
  });
  it("marks old-file content backfill dirty so recovery never reuses the pre-migration blob", () => {
    const legacy = populated().store.snapshot();
    delete legacy.content;
    const notify = vi.fn(),
      store = new WorldSpaceStore(notify);
    store.restore(legacy);
    expect(notify).toHaveBeenCalledOnce();
    expect(store.snapshot().content!.npcs).toHaveLength(4);
    notify.mockClear();
    store.restore(store.snapshot());
    expect(notify).not.toHaveBeenCalled();
  });
  it("supports overlapping cities at different depths and spaces without sharing IDs", () => {
    const { store, a, b } = populated();
    expect(a.id).not.toBe(b.id);
    expect(store.snapshot().sites.map(s => [s.x, s.y])).toEqual([
      [0.4, 0.6],
      [0.4, 0.6]
    ]);
    expect(isWorldSpaces(store.snapshot())).toBe(true);
  });
  it("returns detached snapshots and restores without sharing project objects", () => {
    const { store } = populated();
    const snapshot = store.snapshot();
    store.restore(snapshot);
    snapshot.sites[0].name = "changed externally";
    expect(store.snapshot().sites[0].name).not.toBe("changed externally");
  });
  it("removes a place with its passages but preserves other spaces and factions", () => {
    const { store, a, b } = populated();
    store.removeSite(a.id);
    expect(store.snapshot().links).toEqual([]);
    expect(store.snapshot().sites.map(s => s.id)).toEqual([b.id]);
    expect(store.snapshot().factions).toHaveLength(1);
  });
  it("removes faction membership without deleting places or passages", () => {
    const { store } = populated();
    store.removeFaction("sea-kingdom");
    expect(store.snapshot().sites).toHaveLength(2);
    expect(store.snapshot().sites[0].factionId).toBeUndefined();
    expect(store.snapshot().links).toHaveLength(1);
  });
  it.each([
    "duplicate",
    "dangling",
    "self",
    "bad-coordinate",
    "bad-depth",
    "bad-color",
    "bad-space",
    "bad-population",
    "sparse"
  ])("rejects %s transaction atomically", variant => {
    const notify = vi.fn();
    const store = new WorldSpaceStore(notify);
    store.restore(populated().store.snapshot());
    const before = store.snapshot();
    expect(() =>
      store.update(d => {
        if (variant === "sparse") d.sites = new Array(1);
        if (variant === "duplicate") d.sites.push({ ...d.sites[0] });
        if (variant === "dangling") d.links[0].to = "missing";
        if (variant === "self") d.links[0].to = d.links[0].from;
        if (variant === "bad-coordinate") d.sites[0].x = NaN;
        if (variant === "bad-depth") d.sites[0].depth = -100;
        if (variant === "bad-color") d.factions[0].color = "url(javascript:x)";
        if (variant === "bad-space") Object.assign(d, { activeSpace: "unknown" });
        if (variant === "bad-population") d.sites[0].population = Infinity;
      })
    ).toThrow();
    expect(store.snapshot()).toEqual(before);
    expect(notify).not.toHaveBeenCalled();
  });
  it("accepts old FPB files with no extra spaces and rejects corrupt extra data", () => {
    const old = project();
    expect(isPlanetProject(old)).toBe(true);
    expect(isPlanetProject({ ...old, worldSpaces: null })).toBe(false);
    const store = new WorldSpaceStore();
    store.restore(old.worldSpaces);
    expect(store.snapshot()).toEqual(emptyWorldSpaces());
  });
  it("roundtrips places, factions, passages and the active space inside compressed FPB", async () => {
    const data = project();
    data.worldSpaces = populated().store.snapshot();
    const decoded = await decodePlanetProject(await encodePlanetProject(data));
    expect(decoded.worldSpaces).toEqual(data.worldSpaces);
    expect(decoded.mapPayload).toBe(data.mapPayload);
  });
  it("recovers place drafts only when the owning project contains the place", () => {
    const { store, a } = populated();
    const data = project();
    data.worldSpaces = store.snapshot();
    const values = { name: "未適用 도시", depth: "100" };
    const owner = { id: "snapshot", projectId: "planet" };
    const recovery = createDraftRecovery(
      [{ key: `space-site:${a.id}`, baseline: { name: "새 도시", depth: "100" }, values }],
      owner
    );
    expect(readDraftRecovery(recovery.drafts, owner, data).entries[0].values).toEqual(values);
    delete data.worldSpaces;
    expect(readDraftRecovery(recovery.drafts, owner, data).rejected).toBe(true);
  });
});
