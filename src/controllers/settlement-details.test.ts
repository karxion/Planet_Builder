// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Burg } from "@/generators/burgs-generator";

const { get, openNpc, rebalance } = vi.hoisted(() => ({ get: vi.fn(), openNpc: vi.fn(), rebalance: vi.fn() }));
vi.mock("@/controllers/campaign-world", () => ({ Campaign: { get, openNpc, rebalance } }));

import { initSettlementTools, mountSettlementDetails, openSettlementMap, settlementRecord } from "./settlement-details";

let burg: Burg;
beforeEach(() => {
  document.body.innerHTML =
    '<div id="burgEditor"><div id="burgPreviewSection"></div></div><button id="fpb-npc-regenerate"></button>';
  vi.stubGlobal("seed", "world");
  vi.stubGlobal("pack", {
    states: [{ name: "무소속" }, { fullName: "테스트 왕국" }],
    provinces: [null, { name: "동쪽 영지" }],
    cells: { province: [1], r: [1] }
  });
  Object.defineProperties(HTMLDialogElement.prototype, {
    showModal: {
      configurable: true,
      value: function (this: HTMLDialogElement) {
        this.open = true;
      }
    },
    close: {
      configurable: true,
      value: function (this: HTMLDialogElement) {
        this.open = false;
      }
    }
  });
  burg = { i: 1, cell: 0, x: 0, y: 0, name: "수도", state: 1, capital: 1, port: 1, population: 50, walls: 1 };
  get.mockReturnValue({
    npcs: [
      {
        id: "npc:1:0:0",
        villageId: "village:1",
        name: "주요 인물",
        role: "기사",
        templateId: "guard",
        progression: { classId: "fighter", level: 10, rank: "elite", scope: "country", archetype: "military" }
      },
      { id: "npc:2:0:0", villageId: "village:2", name: "다른 도시", role: "평민", templateId: "commoner" }
    ]
  });
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe("city details and map tools", () => {
  it("shows the actual country, capital, local NPCs and a working NPC link", () => {
    mountSettlementDetails(burg);
    const host = document.getElementById("fpb-burg-details")!;
    expect(host.textContent).toContain("테스트 왕국");
    expect(host.textContent).toContain("수도");
    expect(host.textContent).toContain("Lv.10 · T3");
    expect(host.textContent).not.toContain("다른 도시");
    host.querySelector<HTMLButtonElement>("li button")!.click();
    expect(openNpc).toHaveBeenCalledWith("npc:1:0:0");
    mountSettlementDetails(burg);
    expect(document.querySelectorAll("#fpb-burg-details")).toHaveLength(1);
  });
  it("switches tactical view and persists a chosen seed without changing the city's position", () => {
    openSettlementMap(burg);
    const dialog = document.querySelector<HTMLDialogElement>("#fpb-city-map-dialog")!;
    const buttons = [...dialog.querySelectorAll<HTMLButtonElement>("button")];
    buttons.find(button => button.textContent === "전투 지도")!.click();
    expect(dialog.querySelector("svg")?.getAttribute("viewBox")).toBe("510 340 250 140");
    const select = dialog.querySelector("select")!;
    expect(select.disabled).toBe(false);
    select.value = "gate";
    select.dispatchEvent(new Event("change"));
    expect(dialog.querySelector("svg")?.getAttribute("viewBox")).toBe("470 110 250 140");
    const seed = dialog.querySelector<HTMLInputElement>('input:not([type="checkbox"])')!;
    seed.value = "saved-city";
    buttons.find(button => button.textContent === "생성")!.click();
    expect(burg.settlement?.seed).toBe("saved-city");
    expect([burg.x, burg.y]).toEqual([0, 0]);
    openSettlementMap(burg);
    expect(document.querySelector<HTMLInputElement>('#fpb-city-map-dialog input:not([type="checkbox"])')!.value).toBe(
      "saved-city"
    );
  });
  it("uses a safe explicit external AI handoff and does not expose NPC secrets", () => {
    openSettlementMap(burg);
    const link = document.querySelector<HTMLAnchorElement>('#fpb-city-map-dialog a[href="https://chatgpt.com/"]')!;
    expect(link.href).toBe("https://chatgpt.com/");
    expect(link.rel).toContain("noopener");
    const text = document.querySelector<HTMLTextAreaElement>("#fpb-city-map-dialog textarea")!.value;
    expect(text).toContain("수도");
    expect(text).not.toContain("주요 인물");
    expect(text).toContain("Do not include NPC secrets");
  });
  it("requires confirmation before redistributing levels", () => {
    initSettlementTools();
    initSettlementTools();
    expect(document.querySelectorAll("#fpb-npc-rebalance")).toHaveLength(1);
    const confirm = vi.spyOn(window, "confirm").mockReturnValue(false);
    document.getElementById("fpb-npc-rebalance")!.click();
    expect(rebalance).not.toHaveBeenCalled();
    confirm.mockReturnValue(true);
    document.getElementById("fpb-npc-rebalance")!.click();
    expect(rebalance).toHaveBeenCalledOnce();
  });
  it("ignores malformed stored city records", () => {
    burg.settlement = { version: 1, seed: "x".repeat(200), history: "bad" };
    expect(settlementRecord(burg).seed).toBe("world:city:1");
  });
});

it("persists manual tactical dimensions across reopen and rejects invalid pixel budgets", () => {
 openSettlementMap(burg);
 const dialog=document.querySelector<HTMLDialogElement>('#fpb-city-map-dialog')!;
 [...dialog.querySelectorAll('button')].find(b=>b.textContent==='전투 지도')!.click();
 const preset=dialog.querySelector<HTMLSelectElement>('[data-battle-preset]')!;preset.value='large';preset.dispatchEvent(new Event('change'));
 dialog.querySelector<HTMLFormElement>('.fpb-battle-size')!.dispatchEvent(new Event('submit',{cancelable:true}));
 expect(burg.settlement?.battleMap).toEqual({columns:72,rows:41,cellPixels:64});
 openSettlementMap(burg);
 expect(document.querySelector<HTMLInputElement>('[data-battle-columns]')!.value).toBe('72');
});
