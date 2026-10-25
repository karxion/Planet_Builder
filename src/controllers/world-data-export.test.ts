// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { CampaignWorld, WorldNpc } from "@/types/campaign-world";
import type { WorldDataExportSource } from "@/types/world-data-export";

describe("World data output dialog", () => {
  let source: WorldDataExportSource;
  let open: (value: WorldDataExportSource) => void;
  const get = <T extends HTMLElement>(key: string) => document.querySelector<T>(`[data-export=${key}]`)!;
  beforeEach(async () => {
    vi.resetModules();
    document.body.innerHTML = "";
    const npc: WorldNpc = {
      id: "npc:1",
      villageId: "village:1",
      name: '<img src=x onerror="alert(1)">',
      role: "기사",
      templateId: "guard",
      appearance: "은빛 갑옷",
      personality: "신중함",
      goal: "수호",
      secret: "왕의 비밀",
      notes: "GM 노트",
      edited: false
    };
    const world: CampaignWorld = {
      version: 1,
      ruleset: "srd-5.2.1",
      seed: "export",
      generation: 0,
      units: [],
      npcs: [npc]
    };
    source = { kind: "npcs", world, all: world.npcs, filtered: world.npcs, selected: world.npcs, hasDrafts: true };
    HTMLDialogElement.prototype.showModal = function () {
      this.open = true;
    };
    HTMLDialogElement.prototype.close = function () {
      this.open = false;
      this.dispatchEvent(new Event("close"));
    };
    vi.stubGlobal("print", vi.fn());
    vi.stubGlobal(
      "URL",
      class extends URL {
        static createObjectURL = vi.fn(() => "blob:export-test");
        static revokeObjectURL = vi.fn();
      }
    );
    ({ openWorldDataExport: open } = await import("@/controllers/world-data-export"));
    open(source);
  });
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });
  it("defaults to filtered records with private information off and a draft warning", () => {
    expect(get<HTMLSelectElement>("scope").value).toBe("filtered");
    expect(get<HTMLInputElement>("private").checked).toBe(false);
    expect(get("drafts").hidden).toBe(false);
    expect(get("status").textContent).toBe("1개 항목 출력 가능");
  });
  it("renders safe text, never executable markup, and toggles private output", () => {
    get("preview-button").click();
    expect(get("preview").textContent).toContain('<img src=x onerror="alert(1)">');
    expect(get("preview").querySelector("img")).toBeNull();
    expect(get("preview").textContent).not.toContain("왕의 비밀");
    get<HTMLInputElement>("private").click();
    expect(get("preview").hidden).toBe(true);
    get("preview-button").click();
    expect(get("preview").textContent).toContain("왕의 비밀");
    expect(get("preview").textContent).toContain("GM 노트");
  });
  it("creates JSON and CSV downloads with the selected range and declared media type", () => {
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    get<HTMLSelectElement>("scope").value = "selected";
    get("download").click();
    expect((click.mock.instances[0] as HTMLAnchorElement).download).toBe("world-npcs-selected.json");
    expect((vi.mocked(URL.createObjectURL).mock.calls[0][0] as Blob).type).toContain("application/json");
    get<HTMLSelectElement>("format").value = "csv";
    get("download").click();
    expect((click.mock.instances[1] as HTMLAnchorElement).download).toBe("world-npcs-selected.csv");
    expect((vi.mocked(URL.createObjectURL).mock.calls[1][0] as Blob).type).toContain("text/csv");
  });
  it("prepares print content and restores the normal page after printing", async () => {
    const print = vi.mocked(window.print).mockImplementation(() => {
      expect(document.body.classList.contains("fpb-print-data")).toBe(true);
      expect(get("preview").hidden).toBe(false);
    });
    get("print").click();
    await vi.waitFor(() => expect(print).toHaveBeenCalledOnce());
    expect(document.body.classList.contains("fpb-print-data")).toBe(false);
  });
  it("cancels pending printing when options change or the map changes", async () => {
    get("print").click();
    get<HTMLInputElement>("private").click();
    await Promise.resolve();
    expect(window.print).not.toHaveBeenCalled();
    window.dispatchEvent(new Event("map:loaded"));
    expect(document.querySelector<HTMLDialogElement>("#fpb-data-export-dialog")!.open).toBe(false);
  });
  it("disables empty scopes and resets privacy when reopened", () => {
    get<HTMLInputElement>("private").checked = true;
    open({ ...source, selected: [] });
    expect(get<HTMLInputElement>("private").checked).toBe(false);
    expect(get<HTMLSelectElement>("scope").querySelector<HTMLOptionElement>('[value="selected"]')!.disabled).toBe(true);
  });
});
