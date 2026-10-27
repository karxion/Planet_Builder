// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { createCampaign } from "@/generators/campaign-generator";
import { drawReligionHeadquarters } from "./religion-headquarters";

function world() {
  document.body.innerHTML = '<svg id="map" width="1000" height="600"><defs></defs><g id="viewbox"></g></svg>';
  const view = document.getElementById("viewbox")!;
  Object.assign(view, { getCTM: () => ({ a: 2, b: 0 }) });
  return createCampaign(
    {
      states: [{ id: 1, name: "빛 왕국", x: 100, y: 100, area: 100 }],
      fiefs: [],
      villages: [{ id: 1, name: "수도", stateId: 1, fiefId: 0, x: 100, y: 100, capital: true, port: false }]
    },
    "map"
  );
}

afterEach(() => drawReligionHeadquarters());

describe("Religion headquarters map overlay", () => {
  it("groups colocated faiths at their exact recorded location without leader lines or displaced labels", () => {
    const campaign = world();
    const before = structuredClone(campaign);
    drawReligionHeadquarters(campaign);
    const markers = document.querySelectorAll("#fpb-headquarters [data-headquarters]");
    expect(markers).toHaveLength(1);
    expect(markers[0].getAttribute("transform")).toBe("translate(100 100)");
    expect(markers[0].getAttribute("tabindex")).toBe("0");
    expect(document.querySelector("#fpb-headquarters text")?.textContent).toBe(
      String(campaign.heritage!.religions.length)
    );
    expect(
      document.querySelector("#fpb-headquarters line, #fpb-headquarters use, #fpb-headquarters [textLength]")
    ).toBeNull();
    drawReligionHeadquarters(campaign);
    expect(document.querySelectorAll("#fpb-headquarters")).toHaveLength(1);
    expect(campaign).toEqual(before);
  });

  it("keeps adjacent/coastal locations fixed even when the map is crowded", () => {
    const campaign = world();
    campaign.units.push({ ...campaign.units.find(unit => unit.level === "village")!, id: "village:2", x: 1, y: 1 });
    campaign.heritage!.religions[0].headquartersId = "village:2";
    drawReligionHeadquarters(campaign);
    expect(document.querySelector('[data-headquarters="village:2"]')?.getAttribute("transform")).toBe("translate(1 1)");
    expect(document.querySelector('[data-headquarters="village:1"]')?.getAttribute("transform")).toBe(
      "translate(100 100)"
    );
  });

  it("opens the complete location group on click, Enter and Space", () => {
    const campaign = world();
    drawReligionHeadquarters(campaign);
    const listener = vi.fn();
    window.addEventListener("realm:headquarters-selected", listener);
    const marker = document.querySelector("#fpb-headquarters [data-headquarters]")!;
    marker.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    for (const key of ["Enter", " "]) marker.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
    expect(listener).toHaveBeenCalledTimes(3);
    expect((listener.mock.calls[0][0] as CustomEvent).detail).toBe("village:1");
    expect(marker.getAttribute("aria-pressed")).toBe("true");
    window.removeEventListener("realm:headquarters-selected", listener);
  });

  it("hides at world scale and maintains a fixed screen size when zoom changes without redrawing", async () => {
    const campaign = world();
    const view = document.getElementById("viewbox")!;
    let scale = 1;
    Object.assign(view, { getCTM: () => ({ a: scale, b: 0 }) });
    drawReligionHeadquarters(campaign);
    const layer = document.getElementById("fpb-headquarters")!;
    expect(layer.style.display).toBe("none");
    expect(layer.querySelector("[data-headquarters]")?.getAttribute("tabindex")).toBe("-1");
    scale = 4;
    view.setAttribute("transform", "scale(4)");
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(layer.style.display).toBe("");
    expect(layer.getAttribute("aria-hidden")).toBe("false");
    expect(layer.querySelector("[data-badge]")?.getAttribute("transform")).toBe("scale(0.25)");
    expect(layer.querySelector("[data-headquarters]")?.getAttribute("tabindex")).toBe("0");
    // Removing the layer disconnects its transform/resize observers.
    drawReligionHeadquarters();
    scale = 1;
    window.dispatchEvent(new Event("resize"));
    expect(layer.style.display).toBe("");
  });

  it("hides disabled/missing headquarters and treats long names as text", () => {
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
