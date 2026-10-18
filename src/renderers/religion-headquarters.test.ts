// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { createCampaign } from "@/generators/campaign-generator";
import { boundsOverlap } from "@/utils/mapIconGroups";
import { drawReligionHeadquarters } from "./religion-headquarters";

vi.mock("./rpg-asset-renderer", () => ({ installRpgAssetDefinitions: vi.fn() }));

function world() {
  document.body.innerHTML = '<svg id="map" width="1000" height="600"><defs></defs><g id="viewbox"></g></svg>';
  return createCampaign(
    {
      states: [{ id: 1, name: "빛 왕국", x: 100, y: 100, area: 100 }],
      fiefs: [],
      villages: [{ id: 1, name: "수도", stateId: 1, fiefId: 0, x: 100, y: 100, capital: true, port: false }]
    },
    "map"
  );
}

describe("Religion headquarters map overlay", () => {
  it("draws one linked, keyboard-accessible individual marker for every religion and is idempotent", () => {
    const campaign = world();
    const before = structuredClone(campaign);
    drawReligionHeadquarters(campaign);
    const count = campaign.heritage!.religions.length;
    expect(document.querySelectorAll("#fpb-headquarters [data-religion]")).toHaveLength(count);
    expect(document.querySelectorAll('#fpb-headquarters use[href="#rpg-monument"]')).toHaveLength(count);
    expect(document.querySelector('#fpb-headquarters [role="button"]')?.getAttribute("tabindex")).toBe("0");
    expect(document.querySelector("#fpb-headquarters line")?.getAttribute("x1")).toBe("100");
    expect(document.querySelector("#fpb-headquarters text")?.getAttribute("paint-order")).toBe("stroke");
    const boxes = [...document.querySelectorAll("#fpb-headquarters [data-religion] > rect")].map(element => ({
      x: Number(element.getAttribute("x")),
      y: Number(element.getAttribute("y")),
      width: Number(element.getAttribute("width")),
      height: Number(element.getAttribute("height"))
    }));
    for (let i = 0; i < boxes.length; i++) {
      expect(boundsOverlap(boxes[i], { x: 90, y: 90, width: 20, height: 20 })).toBe(false);
      for (let j = 0; j < i; j++) expect(boundsOverlap(boxes[i], boxes[j])).toBe(false);
    }
    drawReligionHeadquarters(campaign);
    expect(document.querySelectorAll("#fpb-headquarters")).toHaveLength(1);
    expect(campaign).toEqual(before);
  });

  it("opens the correct religion on click and keyboard activation", () => {
    const campaign = world();
    drawReligionHeadquarters(campaign);
    const listener = vi.fn();
    window.addEventListener("realm:religion-selected", listener);
    const marker = document.querySelector("#fpb-headquarters [data-religion]")!;
    marker.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    marker.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    expect(listener).toHaveBeenCalledTimes(2);
    expect((listener.mock.calls[0][0] as CustomEvent).detail).toBe(marker.getAttribute("data-religion"));
    window.removeEventListener("realm:religion-selected", listener);
  });

  it("hides the overlay when disabled or the headquarters is missing and treats names as text", () => {
    const campaign = world();
    campaign.heritage!.religions[0].name = '<img src=x onerror="alert(1)">';
    drawReligionHeadquarters(campaign);
    expect(document.querySelector("#fpb-headquarters img")).toBeNull();
    expect(document.querySelector("#fpb-headquarters title")?.textContent).toContain("<img");
    campaign.heritage!.showHeadquarters = false;
    drawReligionHeadquarters(campaign);
    expect(document.querySelector("#fpb-headquarters")).toBeNull();
    campaign.heritage!.showHeadquarters = true;
    campaign.heritage!.religions.forEach(religion => {
      religion.headquartersId = "village:9999";
    });
    drawReligionHeadquarters(campaign);
    expect(document.querySelector("#fpb-headquarters")).toBeNull();
  });
});
