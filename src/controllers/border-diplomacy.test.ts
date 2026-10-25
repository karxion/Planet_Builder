// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { PackedGraph } from "@/types/PackedGraph";

describe("Border relation map controls", () => {
  beforeEach(async () => {
    vi.resetModules();
    vi.useFakeTimers();
    document.body.innerHTML =
      '<ul id="mapLayers"><li id="toggleBorders">국경</li></ul><svg id="map"><g id="viewbox"><g id="borders"><g id="stateBorders"></g></g></g></svg>';
    vi.stubGlobal("pack", {
      cells: { h: [30, 40], state: [1, 2] },
      vertices: {
        p: [
          [0, 0],
          [10, 0],
          [10, 30]
        ],
        v: [[1], [0, 2], [1]],
        c: [
          [0, 1, -1],
          [0, 1, -1],
          [0, 1, -1]
        ]
      },
      states: [
        { i: 0, name: "중립", diplomacy: [] },
        { i: 1, name: "은빛 왕국", diplomacy: ["x", "x", "Rival"] },
        { i: 2, name: "푸른 공국", diplomacy: ["x", "Rival", "x"] }
      ]
    } as unknown as PackedGraph);
    HTMLDialogElement.prototype.showModal = function () {
      this.open = true;
    };
    HTMLDialogElement.prototype.close = function () {
      this.open = false;
    };
    const { initBorderDiplomacy } = await import("@/controllers/border-diplomacy");
    initBorderDiplomacy();
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });
  const token = () => document.querySelector<SVGGElement>("#diplomacy > g")!;
  it("draws a generated asset at the shared midpoint with an accessible relation label", () => {
    expect(token().dataset.relation).toBe("hostile");
    expect(token().getAttribute("transform")).toBe("translate(10 10) scale(1)");
    expect(token().getAttribute("aria-label")).toContain("은빛 왕국 ↔ 푸른 공국 · 적대 관계");
    expect(token().querySelector("image")!.getAttribute("href")).toContain("images/diplomacy/hostile.png");
  });
  it("opens all seven choices and saves blood alliance reciprocally", () => {
    token().dispatchEvent(new MouseEvent("click", { bubbles: true }));
    const dialog = document.querySelector<HTMLDialogElement>("#fpb-border-relations-dialog")!;
    expect(dialog.open).toBe(true);
    expect(dialog.querySelectorAll('input[name="relation"]')).toHaveLength(7);
    (dialog.querySelector('[value="blood"]') as HTMLInputElement).click();
    dialog.querySelector("form")!.dispatchEvent(new Event("submit", { cancelable: true }));
    expect(pack.states[1].diplomacy![2]).toBe("BloodAlly");
    expect(pack.states[2].diplomacy![1]).toBe("BloodAlly");
    expect(token().dataset.relation).toBe("blood");
  });
  it("allows selecting which country is subordinate", () => {
    token().dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    (document.querySelector('[name="relation"][value="vassal"]') as HTMLInputElement).click();
    expect((document.querySelector(".fpb-border-dependent") as HTMLElement).hidden).toBe(false);
    const select = document.querySelector<HTMLSelectElement>('[name="dependent"]')!;
    expect(select.options).toHaveLength(2);
    select.value = "2";
    document
      .querySelector("#fpb-border-relations-dialog form")!
      .dispatchEvent(new Event("submit", { cancelable: true }));
    expect(pack.states[2].diplomacy![1]).toBe("Vassal");
    expect(token().getAttribute("aria-label")).toContain("푸른 공국 (종속국)");
  });
  it("toggles visibility, redraws without duplicates, and closes stale editors on map load", async () => {
    document.getElementById("toggleDiplomacy")!.click();
    expect((document.getElementById("diplomacy") as unknown as SVGElement).style.display).toBe("none");
    document.getElementById("toggleDiplomacy")!.click();
    token().dispatchEvent(new MouseEvent("click"));
    window.dispatchEvent(new Event("map:loaded"));
    await vi.advanceTimersByTimeAsync(100);
    expect(document.querySelectorAll("#diplomacy")).toHaveLength(1);
    expect(document.querySelector<HTMLDialogElement>("#fpb-border-relations-dialog")!.open).toBe(false);
  });
  it("renders state names as inert text", async () => {
    pack.states[1].name = '<img src=x onerror="alert(1)">';
    window.dispatchEvent(new Event("project:changed"));
    await vi.advanceTimersByTimeAsync(100);
    token().dispatchEvent(new MouseEvent("click"));
    expect(document.querySelector(".fpb-border-pair")!.textContent).toContain("<img");
    expect(document.querySelector(".fpb-border-pair img")).toBeNull();
  });
  it("keeps midpoints fixed while shrinking nearby tokens to leave a gap", async () => {
    const parent = document.querySelector<SVGGElement>("#viewbox")!;
    const other = token().cloneNode(true) as SVGGElement;
    other.dataset.x = "30";
    other.dataset.y = "10";
    document.getElementById("diplomacy")!.append(other);
    const { scaleBorderTokens } = await import("@/renderers/border-diplomacy");
    scaleBorderTokens(parent);
    expect(Number(token().dataset.pixelSize)).toBe(17);
    expect(Number(other.dataset.pixelSize)).toBe(17);
    expect(token().getAttribute("transform")).toContain("translate(10 10)");
    expect(other.getAttribute("transform")).toContain("translate(30 10)");
  });
});
