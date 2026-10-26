// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { round } from "@/utils/stringUtils";

function statistics() {
  const source = readFileSync(resolve(process.cwd(), "public/main.js"), "utf8");
  const code = source.slice(source.indexOf("function showStatistics("), source.indexOf("const regenerateMap ="));
  const environment = { ensureEl: () => ({ value: "continents" }), heightmapTemplates: {}, locked: () => true,
    seed: "seed", graphWidth: 100, graphHeight: 50, grid: { points: [] },
    pack: { cells: { i: [] }, states: [], provinces: [], burgs: [], religions: [], cultures: [] },
    mapSizeOutput: { value: 100 }, culturesSet: { value: "all" }, mapId: 123, window, mapHistory: [], INFO: false, CustomEvent };
  const run = new Function(...Object.keys(environment), `${code}; return { showStatistics, mapId: () => mapId };`)(...Object.values(environment));
  return { run, history: environment.mapHistory };
}
describe("Restored map lifecycle", () => {
  it("does not regenerate the project session or map identity after an import", () => {
    const { run, history } = statistics();
    const generated = vi.fn();
    window.addEventListener("map:generated", generated);
    try {
      run.showStatistics(false);
      expect(run.mapId()).toBe(123);
      expect(history).toHaveLength(1);
      expect(generated).not.toHaveBeenCalled();
      expect(readFileSync(resolve(process.cwd(), "src/services/io/load.ts"), "utf8")).toContain("showStatistics(false)");
    } finally { window.removeEventListener("map:generated", generated); }
  });
  it("still signals a genuinely new map", () => {
    const { run } = statistics();
    const generated = vi.fn();
    window.addEventListener("map:generated", generated);
    try { run.showStatistics(); expect(generated).toHaveBeenCalledOnce(); }
    finally { window.removeEventListener("map:generated", generated); }
  });
  it("accepts the empty path returned by a clipped D3 coordinate grid", () => {
    expect(round(null)).toBe("");
    expect(round("M1.234,5.678")).toBe("M1.2,5.7");
  });
});
