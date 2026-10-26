// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { generateDungeonInterior } from "@/generators/dungeon-interior";
import { renderDungeonMap, renderDungeonRoom } from "./dungeon-interior";

describe("Dungeon map projection", () => {
  it("renders room controls and readable GM features, never inserts script", () => {
    const dungeon = generateDungeonInterior("render", "wizard-tower", "mage", "hell");
    document.body.innerHTML = renderDungeonMap(dungeon, "ko", true, 0);
    expect(document.querySelectorAll("[data-room]")).toHaveLength(dungeon.rooms.length);
    expect(document.querySelectorAll("[data-feature]")).toHaveLength(dungeon.features.length);
    expect(
      Math.max(...Array.from(document.querySelectorAll("path[d]"), path => path.getAttribute("d")!.length))
    ).toBeGreaterThan(1000);
    expect(document.querySelector("script")).toBeNull();
    expect(renderDungeonRoom(dungeon, dungeon.bossRoomId, "ko", true)).toContain("3라운드 주기");
  });
  it("excludes secret geometry, room selectors and all monsters/traps/loot from the player SVG and detail", () => {
    const dungeon = generateDungeonInterior("render", "wizard-tower", "mage", "hell");
    const gm = renderDungeonMap(dungeon, "en", true, 0);
    const player = renderDungeonMap(dungeon, "en", false, 0);
    document.body.innerHTML = player;
    expect(player).not.toContain("data-feature");
    expect(player).not.toContain("Boss chamber");
    for (const room of dungeon.rooms.filter(room => room.secret)) {
      expect(document.querySelector(`[data-room="${room.id}"]`)).toBeNull();
      expect(renderDungeonRoom(dungeon, room.id, "en", false)).toBe("");
    }
    expect(gm).not.toBe(player);
    expect(renderDungeonRoom(dungeon, dungeon.bossRoomId, "en", false)).not.toContain("SRD");
  });
  it("escapes imported item variant text in details", () => {
    const dungeon = generateDungeonInterior("render", "wizard-tower", "mage");
    const chest = dungeon.features.find(feature => feature.kind === "chest")!;
    if (chest.kind === "chest") chest.variant = '<img src=x onerror="alert(1)">';
    const html = renderDungeonRoom(dungeon, chest.roomId, "en", true);
    expect(html).toContain("&lt;img");
    document.body.innerHTML = html;
    expect(document.querySelector("img")).toBeNull();
  });
});

it("renders a sized room encounter without resizing the dungeon or exposing player secrets", () => {
 const dungeon=generateDungeonInterior("battle-size","wizard-tower","mage","hell");
 const before=structuredClone(dungeon);
 const doc=new DOMParser().parseFromString(renderDungeonMap(dungeon,"ko",false,dungeon.entranceRoomId,{columns:48,rows:27,cellPixels:64}),"image/svg+xml");
 expect(doc.documentElement.getAttribute("width")).toBe("3072");expect(doc.documentElement.getAttribute("height")).toBe("1728");
 expect(doc.documentElement.getAttribute("viewBox")?.endsWith("864 486")).toBe(true);
 expect(doc.querySelector("[data-feature]")).toBeNull();
 expect(doc.querySelector('[data-scene-asset]')).not.toBeNull();expect(dungeon).toEqual(before);
});
