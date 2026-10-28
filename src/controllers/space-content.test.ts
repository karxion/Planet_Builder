// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from "vitest";
import { WorldSpaces } from "@/services/world-spaces/state";
import { EditorDrafts } from "@/services/editor-drafts";
import { openSpaceContent } from "./space-content";

let events: MockInstance<typeof window.addEventListener>;
beforeEach(() => {
  events = vi.spyOn(window, "addEventListener");
  document.body.innerHTML = "";
  WorldSpaces.restore();
  EditorDrafts.clear();
  HTMLDialogElement.prototype.showModal = function () {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function () {
    this.open = false;
  };
});
afterEach(() => {
  for (const [type, handler, options] of events.mock.calls) window.removeEventListener(type, handler, options);
  vi.restoreAllMocks();
});
const setSpace = (space: "surface" | "underwater" | "underground") =>
  WorldSpaces.update(d => {
    d.activeSpace = space;
  });
describe("Isolated space NPC / item lists", () => {
  it("retains unapplied NPC notes when moving between spaces", () => {
    WorldSpaces.addSite("underwater", "city", 0.25, 0.5);
    WorldSpaces.addSite("underground", "city", 0.5, 0.5);
    setSpace("underwater");
    openSpaceContent();
    const notes = document.querySelector<HTMLTextAreaElement>('[name="notes"]')!;
    notes.value = "작성 중인 교류 메모";
    notes.dispatchEvent(new Event("input", { bubbles: true }));
    setSpace("underground");
    openSpaceContent();
    expect(document.querySelector<HTMLTextAreaElement>('[name="notes"]')!.value).toBe("");
    setSpace("underwater");
    openSpaceContent();
    expect(document.querySelector<HTMLTextAreaElement>('[name="notes"]')!.value).toBe("작성 중인 교류 메모");
    expect(WorldSpaces.snapshot().content!.npcs[0].notes).toBe("");
  });
  it("opens only the current space and never exposes them in the surface lists", () => {
    const sea = WorldSpaces.addSite("underwater", "city", 0.25, 0.5),
      cave = WorldSpaces.addSite("underground", "city", 0.5, 0.5);
    WorldSpaces.update(d => {
      d.content!.npcs.find(n => n.siteId === sea.id)!.name = "SEA ONLY";
      d.content!.npcs.find(n => n.siteId === cave.id)!.name = "CAVE ONLY";
    });
    expect(openSpaceContent()).toBe(false);
    setSpace("underwater");
    expect(openSpaceContent()).toBe(true);
    expect(document.querySelector("[data-list]")!.textContent).toContain("SEA ONLY");
    expect(document.querySelector("[data-list]")!.textContent).not.toContain("CAVE ONLY");
    setSpace("underground");
    openSpaceContent();
    expect(document.querySelector("[data-list]")!.textContent).toContain("CAVE ONLY");
    expect(document.querySelector("[data-list]")!.textContent).not.toContain("SEA ONLY");
    setSpace("surface");
    expect(document.querySelector<HTMLDialogElement>("dialog")!.open).toBe(false);
    expect(openSpaceContent("items")).toBe(false);
  });
  it("supports trade interaction, city-local inventory and persistent manual notes", () => {
    const city = WorldSpaces.addSite("underwater", "city", 0.5, 0.5);
    setSpace("underwater");
    openSpaceContent("npcs", city.id);
    document.querySelector<HTMLButtonElement>("[data-interact]")!.click();
    expect(document.querySelectorAll("[data-record]")).toHaveLength(3);
    const form = document.querySelector<HTMLFormElement>("form")!;
    form.querySelector<HTMLInputElement>('[name="name"]')!.value = "<script>alert(1)</script>";
    form.querySelector<HTMLTextAreaElement>('[name="notes"]')!.value = "구매 약속";
    form.dispatchEvent(new Event("submit", { cancelable: true }));
    const saved = WorldSpaces.snapshot();
    expect(saved.content!.items[0].notes).toBe("구매 약속");
    expect(saved.content!.items[0].edited).toBe(true);
    expect(document.querySelector("[data-detail] script")).toBeNull();
    expect(saved.sites.find(site => site.id === city.id)!.name).toBe(city.name);
    document.querySelector<HTMLButtonElement>("[data-focus]")!.click();
    expect(document.querySelector<HTMLDialogElement>("dialog")!.open).toBe(false);
  });
});
