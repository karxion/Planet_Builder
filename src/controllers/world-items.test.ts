// @vitest-environment jsdom
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import type { CampaignWorld } from "@/types/campaign-world";
import { prepareNpcPortrait } from "@/services/npc-portrait-image";
import { isItemLibrary } from "@/data/world-item-validation";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const mocks = vi.hoisted(() => ({ get: vi.fn() }));
vi.mock("@/controllers/campaign-world", () => ({ Campaign: { get: mocks.get } }));
vi.mock("@/services/npc-portrait-image", () => ({ prepareNpcPortrait: vi.fn() }));
describe("Item library editor", () => {
  let world: CampaignWorld;
  let open: () => void;
  beforeEach(async () => {
    vi.resetModules();
    document.body.innerHTML = '<div class="fpb-actions"><button id="fpb-world-button">세계·NPC</button></div>';
    world = {
      version: 1,
      ruleset: "srd-5.2.1",
      seed: "items-ui",
      generation: 0,
      units: [{ id: "country:1", level: "country", name: "은빛 왕국", sourceId: 1, stateId: 1, x: 0, y: 0 }],
      npcs: [
        {
          id: "npc:1:0",
          villageId: "village:1",
          name: "기사 아린",
          role: "기사",
          appearance: "",
          personality: "",
          goal: "",
          secret: "",
          notes: "",
          templateId: "guard",
          edited: false
        }
      ]
    };
    mocks.get.mockReturnValue(world);
    vi.stubGlobal("pack", {
      burgs: [],
      markers: [{ i: 7, type: "dungeons", icon: "#rpg-dungeon", cell: 12, x: 10, y: 20 }]
    });
    vi.stubGlobal("notes", [{ id: "marker7", name: "잿빛 탑" }]);
    HTMLDialogElement.prototype.showModal = function () {
      this.open = true;
    };
    HTMLDialogElement.prototype.close = function () {
      this.open = false;
    };
    ({ openItemLibrary: open } = await import("@/controllers/world-items"));
    open();
  });
  afterEach(() => vi.unstubAllGlobals());
  function change(name: string, value: string) {
    const control = document.querySelector<HTMLInputElement | HTMLSelectElement>(`#fpb-item-form [name="${name}"]`)!;
    control.value = value;
    control.dispatchEvent(new Event("change", { bubbles: true }));
  }
  const submit = () =>
    document.getElementById("fpb-item-form")!.dispatchEvent(new Event("submit", { cancelable: true }));
  it("places the top-level item button immediately next to World/NPC", async () => {
    const { initItemLibrary } = await import("@/controllers/item-library-button");
    initItemLibrary();
    initItemLibrary();
    expect(document.getElementById("fpb-world-button")!.nextElementSibling!.id).toBe("fpb-items-button");
    expect(document.querySelectorAll("#fpb-items-button")).toHaveLength(1);
  });
  it("preserves drafts through selector changes and saves current owners independently of dungeon rewards", () => {
    change("name", "용의 인장");
    change("ownerKind", "npc");
    change("ownerId", "npc:1:0");
    change("reward", "7:12");
    submit();
    expect(world.itemLibrary!.items.find(item => item.name === "용의 인장")).toMatchObject({
      owner: { kind: "npc", id: "npc:1:0", label: "기사 아린" },
      reward: { markerId: 7, cell: 12, name: "잿빛 탑" }
    });
    expect(isItemLibrary(world.itemLibrary)).toBe(true);
  });
  it("keeps unsaved notes through selection and closing/reopening", () => {
    change("notes", "아직 저장 안 한 메모");
    document.querySelectorAll<HTMLButtonElement>("[data-item]")[1].click();
    document.querySelectorAll<HTMLButtonElement>("[data-item]")[0].click();
    document.getElementById("fpb-items-close")!.click();
    open();
    expect(document.querySelector<HTMLTextAreaElement>('[name="notes"]')!.value).toBe("아직 저장 안 한 메모");
    expect(world.itemLibrary!.items[0].notes).toBe("");
  });
  it("does not resurrect deleted automatic items after reopening", () => {
    vi.stubGlobal("confirm", () => true);
    const removed = world.itemLibrary!.items[0].id;
    document.querySelector<HTMLButtonElement>('[aria-label="아이템 삭제"]')!.click();
    open();
    expect(world.itemLibrary!.items.some(item => item.id === removed)).toBe(false);
    expect(world.itemLibrary!.deletedIds).toContain(removed);
  });
  it("generates an item-only prompt and registers images without losing text drafts", async () => {
    const portrait = "data:image/jpeg;base64,/9j/2Q==";
    vi.mocked(prepareNpcPortrait).mockResolvedValue(portrait);
    change("appearance", "검은 수정과 은빛 룬");
    change("notes", "GM 비밀");
    document.getElementById("fpb-item-image-generate")!.click();
    const prompt = document.querySelector<HTMLTextAreaElement>(".fpb-npc-portrait-request textarea")!.value;
    expect(prompt).toContain("검은 수정과 은빛 룬");
    expect(prompt).not.toContain("GM 비밀");
    const input = document.querySelector<HTMLInputElement>('#fpb-item-form [type="file"]')!;
    Object.defineProperty(input, "files", { value: [new File(["img"], "item.png", { type: "image/png" })] });
    input.dispatchEvent(new Event("change", { bubbles: true }));
    await new Promise(resolve => setTimeout(resolve, 0));
    submit();
    expect(world.itemLibrary!.items[0]).toMatchObject({ image: portrait, notes: "GM 비밀" });
  });
  it("renders user labels as text, never markup", () => {
    change("name", '<img src=x onerror="alert(1)">');
    submit();
    expect(document.querySelector(".fpb-item-heading img")).toBeNull();
    expect(document.querySelector(".fpb-item-heading")!.textContent).toContain("<img");
  });
  it("opens output with the item filters and excludes unapplied drafts", async () => {
    const committed = world.itemLibrary!.items[0].name;
    change("name", "아직 적용하지 않은 이름");
    const search = document.getElementById("fpb-items-search") as HTMLInputElement;
    search.value = committed;
    search.dispatchEvent(new Event("input"));
    document.getElementById("fpb-items-export")!.click();
    await vi.waitFor(() => expect(document.querySelector<HTMLDialogElement>("#fpb-data-export-dialog")?.open).toBe(true));
    const scope = document.querySelector<HTMLSelectElement>('[data-export="scope"]')!;
    expect(scope.options[0].textContent).toBe("검색 결과 (1)");
    expect(document.querySelector<HTMLElement>('[data-export="drafts"]')!.hidden).toBe(false);
    (document.querySelector('[data-export="preview-button"]') as HTMLButtonElement).click();
    const preview = document.querySelector('[data-export="preview"]')!.textContent;
    expect(preview).toContain(committed);
    expect(preview).not.toContain("아직 적용하지 않은 이름");
  });
  it("keeps select text and the unique checkbox visible despite legacy form styles", () => {
    const style = document.createElement("style");
    style.textContent = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), "../../public/item-library.css"), "utf8") +
      'select { height: 1.6em; padding: 0; } input[type="checkbox"]:not(.native) { display: none; }';
    document.head.append(style);
    const select = document.querySelector<HTMLSelectElement>('#fpb-item-form [name="rarity"]')!;
    expect(getComputedStyle(select).height).toBe("36px");
    expect(getComputedStyle(document.querySelector('#fpb-item-form [name="unique"]')!).display).not.toBe("none");
    style.remove();
  });
});
