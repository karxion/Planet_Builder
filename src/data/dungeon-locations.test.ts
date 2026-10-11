import { describe, expect, it } from "vitest";
import { getDungeonUrl, isDungeonLocation } from "./dungeon-locations";

describe("dungeon locations", () => {
  it("includes generated, manually placed and legacy dungeon types", () => {
    expect(isDungeonLocation({ type: "dungeons" })).toBe(true);
    expect(isDungeonLocation({ type: "rpg-dungeon" })).toBe(true);
    expect(isDungeonLocation({ icon: "#rpg-dungeon", type: "custom" })).toBe(true);
  });
  it("does not mistake caves or other landmarks for dungeons", () => {
    expect(isDungeonLocation({ type: "caves", icon: "#rpg-dungeon" })).toBe(false);
    expect(isDungeonLocation({ type: "ruins", icon: "#rpg-ruins" })).toBe(false);
    expect(isDungeonLocation({})).toBe(false);
  });
  it("uses a repeatable numeric seed per world and cell", () => {
    const first = getDungeonUrl("world-한글", 21);
    expect(first).toBe(getDungeonUrl("world-한글", 21));
    expect(first).not.toBe(getDungeonUrl("world-한글", 22));
    expect(first).not.toBe(getDungeonUrl("other", 21));
    expect(new URL(first).searchParams.get("seed")).toMatch(/^\d+$/);
  });
  it("never allows world seeds to inject markup or external URLs", () => {
    const url = new URL(getDungeonUrl('"><script>alert(1)</script>', 0));
    expect(url.origin).toBe("https://watabou.github.io");
    expect(url.pathname).toBe("/one-page-dungeon/");
    expect(url.href.includes("script")).toBe(false);
  });
  it("preserves numeric dungeon seeds used by existing map notes", () => {
    expect(new URL(getDungeonUrl("12345678", 123)).searchParams.get("seed")).toBe("12345678123");
  });
});
