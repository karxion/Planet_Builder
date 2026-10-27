// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { createCampaign } from "@/generators/campaign-generator";
import { createHeadquartersDetails } from "./headquarters-details";

function setup() {
  document.body.innerHTML = '<button id="origin">Open</button>';
  const world = createCampaign(
    {
      states: [{ id: 1, name: "빛 왕국", x: 100, y: 100, area: 100 }],
      fiefs: [],
      villages: [{ id: 1, name: "수도", stateId: 1, fiefId: 0, x: 100, y: 100, capital: true, port: false }]
    },
    "map"
  );
  const controller = createHeadquartersDetails(() => world);
  const panel = document.getElementById("fpb-headquarters-panel")!;
  return { world, controller, panel };
}

describe("Headquarters details", () => {
  it("shows all colocated faiths, full names, settlement and country without changing saved data", () => {
    const { world, controller, panel } = setup();
    world.heritage!.religions[0].name = "<img src=x> 아주 긴 교단의 이름이 끝까지 표시됩니다";
    const before = structuredClone(world);
    controller.open("village:1");
    expect(panel.hidden).toBe(false);
    expect(panel.textContent).toContain("소재 도시: 수도");
    expect(panel.textContent).toContain("국가: 빛 왕국");
    expect(panel.querySelectorAll("li")).toHaveLength(world.heritage!.religions.length);
    expect(panel.textContent).toContain(world.heritage!.religions[0].name);
    expect(panel.querySelector("img")).toBeNull();
    expect(world).toEqual(before);
  });

  it("closes with Escape and restores focus, or opens exactly the chosen religion", () => {
    const { world, controller, panel } = setup();
    const origin = document.getElementById("origin")!;
    origin.focus();
    controller.open("village:1");
    expect(document.activeElement).toBe(panel.querySelector("header button"));
    panel.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    expect(panel.hidden).toBe(true);
    expect(document.activeElement).toBe(origin);
    controller.open("village:1");
    const listener = vi.fn();
    window.addEventListener("realm:religion-selected", listener);
    panel.querySelectorAll<HTMLButtonElement>("[data-religion]")[1].click();
    expect((listener.mock.calls[0][0] as CustomEvent).detail).toBe(world.heritage!.religions[1].id);
    expect(panel.hidden).toBe(true);
    window.removeEventListener("realm:religion-selected", listener);
  });

  it("labels country-center assignments accurately and ignores unknown or disabled locations", () => {
    const { world, controller, panel } = setup();
    world.heritage!.religions[0].headquartersId = "country:1";
    controller.open("country:1");
    expect(panel.textContent).toContain("국가 중심: 빛 왕국");
    expect(panel.querySelectorAll("li")).toHaveLength(1);
    controller.close();
    controller.open("missing");
    expect(panel.hidden).toBe(true);
    world.heritage!.showHeadquarters = false;
    controller.open("village:1");
    expect(panel.hidden).toBe(true);
  });
});
