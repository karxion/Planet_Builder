import { describe, expect, it, vi } from "vitest";

vi.mock("@/utils", () => ({ findClosestCell: vi.fn() }));

import { restoreIndividualMapIcons } from "./individual-map-icons";

describe("individual icon presentation", () => {
  it.each([
    "",
    "translate(-3 -4)"
  ])("restores icon/label offsets and duplicate visibility idempotently: %s", original => {
    const attributes = new Map(
      Object.entries({
        transform: `translate(10 12) ${original}`,
        "data-fpb-individual-transform": original,
        "data-fpb-individual-unresolved": "true",
        "data-fpb-duplicate-of": "burg4"
      })
    );
    const element = {
      getAttribute: (key: string) => attributes.get(key),
      setAttribute: (key: string, value: string) => {
        attributes.set(key, value);
      },
      removeAttribute: (key: string) => {
        attributes.delete(key);
      }
    };
    const remove = vi.fn();
    const view = {
      querySelector: () => ({ remove }),
      querySelectorAll: (selector: string) => (attributes.has(selector.slice(1, -1)) ? [element] : [])
    };
    restoreIndividualMapIcons(view as unknown as ParentNode);
    restoreIndividualMapIcons(view as unknown as ParentNode);
    expect(attributes.get("transform")).toBe(original || undefined);
    expect(attributes.has("data-fpb-individual-transform")).toBe(false);
    expect(attributes.has("data-fpb-individual-unresolved")).toBe(false);
    expect(attributes.has("data-fpb-duplicate-of")).toBe(false);
    expect(remove).toHaveBeenCalled();
  });
});
