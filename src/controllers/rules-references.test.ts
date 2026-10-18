// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { createRulesReferences } from "./rules-references";

describe("External rules reference controls", () => {
  afterEach(() => {
    document.body.replaceChildren();
    vi.unstubAllGlobals();
  });

  it("opens matching class, spell and feat references in separate tabs without fetching or changing the form data", () => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    const form = document.createElement("form");
    const input = document.createElement("input");
    input.name = "classId";
    input.value = "wizard";
    form.append(input);
    const reference = createRulesReferences("character", "2024", "wizard");
    form.append(reference.element);
    document.body.append(form);
    expect(reference.element.open).toBe(false);
    expect(reference.element.querySelector<HTMLAnchorElement>('[data-reference="class"]')!.href).toBe(
      "https://dnd2024.wikidot.com/wizard:main"
    );
    const select = reference.element.querySelector("select")!;
    select.value = "2014";
    select.dispatchEvent(new Event("change"));
    expect(reference.element.querySelector<HTMLAnchorElement>('[data-reference="class"]')!.href).toBe(
      "https://dnd5e.wikidot.com/wizard"
    );
    expect([...new FormData(form)]).toEqual([["classId", "wizard"]]);
    expect(fetch).not.toHaveBeenCalled();
    for (const anchor of reference.element.querySelectorAll("a")) {
      expect(anchor.target).toBe("_blank");
      expect(anchor.relList.contains("noopener")).toBe(true);
      expect(anchor.relList.contains("noreferrer")).toBe(true);
    }
  });

  it("updates item reference navigation when the source edition changes without adding character controls", () => {
    const reference = createRulesReferences("item", "2014");
    reference.setEdition("2024");
    expect(reference.element.querySelector("select")!.value).toBe("2024");
    expect(reference.element.querySelector<HTMLAnchorElement>('[data-reference="items"]')!.href).toBe(
      "https://dnd2024.wikidot.com/magic-item:all"
    );
    expect(reference.element.querySelector('[data-reference="class"]')).toBeNull();
    expect(reference.element.textContent).toContain("자동 적용 안 됨");
  });
});
