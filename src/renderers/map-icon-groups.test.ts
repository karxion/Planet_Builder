import { afterEach, describe, expect, it, vi } from "vitest";
import { groupMapIcons } from "@/utils/mapIconGroups";
import { clearMapIconGroups, type MapIconItem, renderMapIconGroups } from "./map-icon-groups";

afterEach(() => vi.unstubAllGlobals());

class SvgNode {
  id = "";
  innerHTML = "";
  textContent = "";
  namespaceURI = "http://www.w3.org/2000/svg";
  attributes = new Map<string, string>();
  children: SvgNode[] = [];
  listeners = new Map<string, (event: Event) => void>();
  setAttribute(key: string, value: string) {
    this.attributes.set(key, value);
  }
  append(node: SvgNode) {
    this.children.push(node);
  }
  addEventListener(name: string, callback: (event: Event) => void) {
    this.listeners.set(name, callback);
  }
}

describe("transient map grouping state", () => {
  it("removes badges and restores every source item before saving or full-map export", () => {
    const remove = vi.fn();
    const items = [0, 1, 2].map(() => ({ removeAttribute: vi.fn() }));
    const root = { querySelector: () => ({ remove }), querySelectorAll: () => items };
    clearMapIconGroups(root as unknown as ParentNode);
    expect(remove).toHaveBeenCalledOnce();
    for (const item of items) expect(item.removeAttribute).toHaveBeenCalledWith("data-fpb-clustered");
  });
  it("also handles maps without grouping", () => {
    const root = { querySelector: () => null, querySelectorAll: () => [] };
    expect(() => clearMapIconGroups(root as unknown as ParentNode)).not.toThrow();
  });

  it("renders map-space badges, hides originals, and routes click/keyboard without triggering the map editor", () => {
    vi.stubGlobal("document", { createElementNS: () => new SvgNode() });
    vi.stubGlobal(
      "DOMPoint",
      class {
        constructor(
          public x: number,
          public y: number
        ) {}
        matrixTransform() {
          return { x: (this.x - 100) / 2, y: (this.y - 50) / 2 };
        }
      }
    );
    const sourceA = new SvgNode(),
      sourceB = new SvgNode(),
      anchor = new SvgNode(),
      fog = new SvgNode();
    const view = {
      getScreenCTM: () => ({ a: 2, b: 0, inverse: () => ({}) }),
      querySelector: (selector: string) => (selector === "#fogging-cont" ? fog : anchor),
      insertBefore: vi.fn()
    };
    const items = [sourceA, sourceB].map((source, i) => ({
      key: `burg${i}`,
      kind: "settlement",
      entityId: i,
      name: `Village ${i}`,
      icon: "#rpg-village",
      element: source,
      x: 200 + i * 5,
      y: 100,
      width: 10,
      height: 10
    })) as unknown as MapIconItem[];
    const open = vi.fn();
    items[1].icon = "#rpg-city";
    items[1].population = 12;
    const groups = groupMapIcons(items);
    renderMapIconGroups(view as unknown as SVGGElement, groups, count => `${count} locations`, open);
    const layer = view.insertBefore.mock.calls[0][0] as SvgNode;
    expect(view.insertBefore.mock.calls[0][1]).toBe(fog);
    const badge = layer.children.find(node => node.attributes.get("role") === "button")!;
    expect(badge.attributes.get("data-count")).toBe("2");
    expect(badge.attributes.get("tabindex")).toBe("0");
    expect(badge.attributes.get("transform")?.includes("scale(0.5)")).toBe(true);
    expect(sourceA.attributes.get("data-fpb-clustered")).toBe("true");
    expect(sourceB.attributes.get("data-fpb-clustered")).toBe("true");
    expect(anchor.attributes.get("data-fpb-clustered")).toBe("true");
    const event = { preventDefault: vi.fn(), stopPropagation: vi.fn(), key: "Enter" };
    badge.listeners.get("click")!(event as unknown as Event);
    expect(event.stopPropagation).toHaveBeenCalledOnce();
    expect(open).toHaveBeenCalledWith(groups[0], badge);
    badge.listeners.get("keydown")!(event as unknown as Event);
    expect(open).toHaveBeenCalledTimes(2);
    expect(badge.innerHTML.includes('href="#rpg-city"')).toBe(true);
    expect(layer.children[0].textContent.includes("visibility:hidden")).toBe(true);
  });
});
