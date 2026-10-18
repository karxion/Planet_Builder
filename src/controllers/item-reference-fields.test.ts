// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { optionKey } from "@/data/magic-item-references";
import {
  applyItemReference,
  chooseItemReference,
  eligibleItemReferences,
  referencePowerSummary
} from "@/generators/magic-item-generator";
import type { RealmTreasure } from "@/types/realm-heritage";
import { appendItemReferenceFields } from "./item-reference-fields";

describe("Item reference fields", () => {
  let form: HTMLFormElement;
  let item: RealmTreasure;
  const control = (name: string) => form.elements.namedItem(name) as HTMLSelectElement;
  const change = (name: string, value: string) => {
    control(name).value = value;
    control(name).dispatchEvent(new Event("change"));
  };
  beforeEach(() => {
    vi.stubGlobal(
      "confirm",
      vi.fn(() => true)
    );
    item = {
      id: "test",
      stateId: 1,
      ownerType: "city",
      settlementId: "village:1",
      name: "별의 유산",
      rarity: "rare",
      unique: true,
      power: "custom",
      symbolism: "promise",
      rpEffect: "legacy",
      history: "history",
      notes: "private",
      edited: true
    };
    document.body.innerHTML =
      '<form><select name="rarity"><option>rare</option><option>veryRare</option><option>legendary</option></select><textarea name="power"></textarea></form>';
    form = document.querySelector("form")!;
    (form.elements.namedItem("power") as HTMLTextAreaElement).value = item.power;
  });
  afterEach(() => vi.unstubAllGlobals());

  it("leaves an unreferenced manual creation intact and filters choices by rarity and edition", () => {
    appendItemReferenceFields(form, item, "2014");
    expect(control("referenceId").value).toBe("");
    expect(control("power").value).toBe("custom");
    expect(control("referenceId").options.length).toBe(eligibleItemReferences("rare", "2014").length + 1);
    change("referenceEdition", "2024");
    expect([...control("referenceId").options].slice(1).every(option => option.text.startsWith("2024"))).toBe(true);
    expect(control("power").value).toBe("custom");
  });

  it("synchronizes external wiki navigation with the selected SRD edition", () => {
    appendItemReferenceFields(form, item, "mixed");
    change("referenceEdition", "2014");
    change("referenceId", optionKey(chooseItemReference("wiki", item.id, "rare", "2014")));
    expect(form.querySelector<HTMLAnchorElement>('[data-reference="items"]')!.href).toBe(
      "https://dnd5e.wikidot.com/wondrous-items"
    );
    change("referenceEdition", "2024");
    change("referenceId", optionKey(chooseItemReference("wiki", item.id, "rare", "2024")));
    expect(form.querySelector<HTMLAnchorElement>('[data-reference="items"]')!.href).toBe(
      "https://dnd2024.wikidot.com/magic-item:all"
    );
    expect(new FormData(form).has("externalEdition")).toBe(false);
  });

  it("shows the source rules and link, replaces only power and marks GM changes", () => {
    const before = structuredClone(item);
    appendItemReferenceFields(form, item, "2024");
    const option = chooseItemReference("ui", item.id, "rare", "2024");
    change("referenceId", optionKey(option));
    expect(control("power").value).toBe(referencePowerSummary(option));
    expect(form.querySelector("[lang=en]")!.textContent).toContain(option.reference.rules);
    expect(form.querySelector("a")!.href).toContain(`#page=${option.reference.page}`);
    expect(form.textContent).toContain("원본 효과 유지");
    expect(item).toEqual(before);
    control("power").value = "GM edited";
    control("power").dispatchEvent(new Event("input"));
    expect(form.textContent).toContain("GM이 수정한 효과");
  });

  it("restores the most recently accepted selection on cancel rather than the originally loaded one", () => {
    applyItemReference(item, chooseItemReference("ui", item.id, "rare", "2024"));
    control("power").value = item.power;
    appendItemReferenceFields(form, item, "2024");
    const alternatives = eligibleItemReferences("rare", "2024").filter(
      option => optionKey(option) !== control("referenceId").value
    );
    change("referenceId", optionKey(alternatives[0]));
    const acceptedPower = control("power").value;
    vi.mocked(confirm).mockReturnValue(false);
    change("referenceId", optionKey(alternatives[1]));
    expect(control("referenceId").value).toBe(optionKey(alternatives[0]));
    expect(control("power").value).toBe(acceptedPower);
  });

  it("treats rule text as text rather than executable HTML", () => {
    const option = chooseItemReference("html", item.id, "rare", "2024");
    const original = option.reference.rules;
    try {
      option.reference.rules = '<img src=x onerror="alert(1)">';
      appendItemReferenceFields(form, item, "2024");
      change("referenceId", optionKey(option));
      expect(form.querySelector("[lang=en]")!.textContent).toContain("<img");
      expect(form.querySelector("img")).toBeNull();
    } finally {
      option.reference.rules = original;
    }
  });

  it("removes incompatible references after rarity changes without overwriting custom text", () => {
    applyItemReference(item, chooseItemReference("ui", item.id, "rare", "2014"));
    appendItemReferenceFields(form, item, "2014");
    change("rarity", "legendary");
    expect(control("referenceId").value).toBe("");
    expect(form.querySelector("a")!.hasAttribute("href")).toBe(false);
    expect(form.querySelector("a")!.textContent).toBe("");
    expect(control("power").value).toBe("custom");
    expect(control("referenceId").options.length).toBe(eligibleItemReferences("legendary", "2014").length + 1);
  });
});
