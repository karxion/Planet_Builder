// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { generateUnderwater } from "@/generators/underwater";
import { generateUnderground } from "@/generators/underground";
import { setUiLanguage } from "@/services/ui-language";
import { emptyWorldSpaces } from "./model";
import { spaceLocation } from "./location";

afterEach(() => setUiLanguage("ko"));
const surface = { columns: 32, rows: 24, heights: Array.from({ length: 768 }, (_, i) => (i % 32 < 9 ? 50 : 8)) };
describe("Active space location names", () => {
  it("uses exact underwater cell ownership in every map view, without claiming land", () => {
    const data = generateUnderwater(emptyWorldSpaces(), "hover-sea", surface);
    const map = data.underwater!;
    const index = map.owners.findIndex(id => id > 0);
    const x = ((index % map.columns) + 0.5) / map.columns;
    const y = (Math.floor(index / map.columns) + 0.5) / map.rows;
    const owner = data.factions.find(f => f.id === map.factionIds[map.owners[index] - 1])!;
    for (const view of ["combined", "terrain", "political"] as const) {
      map.view = view;
      expect(spaceLocation(data, x, y)).toContain(owner.name);
      expect(spaceLocation(data, x, y)).toContain(`${map.depths[index]} m`);
    }
    const land = map.depths.findIndex(d => d === 0);
    expect(
      spaceLocation(data, ((land % map.columns) + 0.5) / map.columns, (Math.floor(land / map.columns) + 0.5) / map.rows)
    ).not.toContain(owner.name);
  });

  it("isolates underground territories by depth and hides them over hollow-world water", () => {
    const data = generateUnderground(emptyWorldSpaces(), { seed: "hover-cave", chambers: 12 });
    const site = data.sites.find(s => s.kind === "territory" && s.depth === 300)!;
    expect(spaceLocation(data, site.x, site.y)).toContain(site.name);
    data.underground!.activeLevel = "deep";
    expect(spaceLocation(data, site.x, site.y)).not.toContain(site.name);
    expect(spaceLocation(data, site.x, site.y)).toContain("심층 지저");
    data.underground!.mode = "hollow";
    data.underground!.activeLevel = "upper";
    data.underground!.levels[0].cells.fill(2);
    expect(spaceLocation(data, site.x, site.y)).not.toContain(site.name);
    expect(spaceLocation(data, site.x, site.y)).toContain("지하호수");
  });

  it("uses the selected UI language and restores the surface tooltip path", () => {
    const data = generateUnderground(emptyWorldSpaces(), { seed: "locale", chambers: 12 });
    setUiLanguage("en");
    expect(spaceLocation(data, 0.1, 0.1)).toContain("Underground");
    expect(spaceLocation(data, NaN, 0)).toBe("Underground");
    data.activeSpace = "surface";
    expect(spaceLocation(data, 0.1, 0.1)).toBeUndefined();
  });
});
