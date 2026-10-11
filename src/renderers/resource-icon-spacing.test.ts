import { describe, expect, it, vi } from "vitest";

vi.mock("@/utils", () => ({ findClosestCell: vi.fn() }));

import { restoreResourceIconSpacing } from "./resource-icon-spacing";

const element = (initial: Record<string, string>) => {
  const attributes = new Map(Object.entries(initial));
  return {
    attributes,
    getAttribute: (key: string) => attributes.get(key),
    setAttribute: (key: string, value: string) => {
      attributes.set(key, value);
    },
    removeAttribute: (key: string) => {
      attributes.delete(key);
    }
  };
};

describe("resource presentation restoration", () => {
  it.each(["", "rotate(20)"])("restores the original transform without accumulating offsets: %s", original => {
    const resource = element({
      transform: `translate(12 10) ${original}`,
      "data-fpb-resource-transform": original,
      "data-fpb-resource-unresolved": "true"
    });
    const terrain = element({ "data-fpb-terrain-clearance": "true" });
    const remove = vi.fn();
    const view = {
      querySelector: () => ({ remove }),
      querySelectorAll: (selector: string) => {
        const key = selector.slice(1, -1);
        return [resource, terrain].filter(item => item.attributes.has(key));
      }
    };
    restoreResourceIconSpacing(view as unknown as ParentNode);
    restoreResourceIconSpacing(view as unknown as ParentNode);
    expect(resource.attributes.get("transform")).toBe(original || undefined);
    expect(resource.attributes.has("data-fpb-resource-transform")).toBe(false);
    expect(resource.attributes.has("data-fpb-resource-unresolved")).toBe(false);
    expect(terrain.attributes.has("data-fpb-terrain-clearance")).toBe(false);
    expect(remove).toHaveBeenCalled();
  });
});
