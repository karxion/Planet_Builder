// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { generateSettlementMap } from "@/generators/settlement-map";
import { renderSettlementMap, settlementImagePrompt } from "./settlement-map";

const input = {
  seed: "test",
  name: '<script>alert("x")</script>',
  capital: true,
  port: false,
  river: false,
  walls: true,
  population: 20
};
describe("settlement SVG", () => {
  it("escapes names and produces an independent complete SVG", () => {
    const map = generateSettlementMap(input);
    const doc = new DOMParser().parseFromString(renderSettlementMap(map), "image/svg+xml");
    expect(doc.querySelector("parsererror")).toBeNull();
    expect(doc.querySelectorAll("script,image,foreignObject")).toHaveLength(0);
    expect(doc.querySelectorAll("[data-building]")).toHaveLength(map.buildings.length);
    expect(doc.documentElement.getAttribute("viewBox")).toBe("0 0 1200 800");
    expect(doc.documentElement.getAttribute("aria-label")).toBe(input.name);
  });
  it.each(["market", "gate", "residential"])("reuses city geometry in the %s tactical district", district => {
    const map = generateSettlementMap(input);
    const overview = new DOMParser().parseFromString(renderSettlementMap(map), "image/svg+xml");
    const battle = new DOMParser().parseFromString(renderSettlementMap(map, true, true, district), "image/svg+xml");
    expect(battle.querySelector("parsererror")).toBeNull();
    expect(battle.querySelector("rect[fill='url(#city-grid)']")).not.toBeNull();
    expect(battle.querySelector("[data-building] polygon:not([transform])")?.getAttribute("points")).toBe(
      overview.querySelector("[data-building] polygon:not([transform])")?.getAttribute("points")
    );
    expect(battle.documentElement.getAttribute("viewBox")?.endsWith("320 220")).toBe(true);
    expect(renderSettlementMap(map, true, false, district)).not.toContain('fill="url(#city-grid)"');
  });
  it("only exports public city information in the AI handoff prompt", () => {
    const prompt = settlementImagePrompt("도시", "왕국", generateSettlementMap(input));
    expect(prompt).toContain("도시");
    expect(prompt).toContain("왕국");
    expect(prompt).toContain("Do not include NPC secrets or GM notes");
  });
});
