// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/generators/administration-policy", () => ({ removeLegacyDivisions: () => [] }));
vi.mock("@/generators/korean-world-names", async importOriginal => ({
  ...(await importOriginal<typeof import("@/generators/korean-world-names")>()),
  koreanizeWorldNames: () => false
}));
vi.mock("@/renderers/administration-renderer", () => ({ drawAdministration: vi.fn() }));

describe("NPC progression controls", () => {
  let Campaign: typeof import("./campaign-world").Campaign;
  beforeEach(async () => {
    vi.resetModules();
    document.body.innerHTML = '<div class="fpb-actions"></div><button id="fpb-map-view"></button>';
    vi.stubGlobal("pack", {
      burgs: [{ i: 1, name: "수도", x: 10, y: 20, state: 1, cell: 0, capital: 1, population: 20 }],
      cells: { i: [], province: [0], p: [[10, 20]], f: [1] },
      states: [{ i: 1, name: "나라", fullName: "나라 왕국", form: "Monarchy", center: 0 }],
      provinces: [],
      features: [{}, { group: "continent" }]
    });
    vi.stubGlobal("seed", "ui-world");
    vi.stubGlobal("notes", []);
    vi.stubGlobal("options", { military: [] });
    vi.stubGlobal("graphWidth", 100);
    vi.stubGlobal("graphHeight", 50);
    vi.stubGlobal("layerIsOn", () => true);
    for (const name of ["toggleStates", "toggleProvinces", "toggleBurgIcons", "toggleLabels"])
      vi.stubGlobal(name, vi.fn());
    ({ Campaign } = await import("./campaign-world"));
    Campaign.init();
    const dialog = document.getElementById("fpb-world-dialog") as HTMLDialogElement;
    dialog.showModal = () => {
      dialog.open = true;
    };
    document.getElementById("fpb-world-button")!.click();
  });
  afterEach(() => vi.unstubAllGlobals());

  const change = (name: string, value: string) => {
    const control = document.querySelector<HTMLInputElement | HTMLSelectElement>(`#fpb-npc-form [name="${name}"]`)!;
    control.value = value;
    control.dispatchEvent(new Event("change", { bubbles: true }));
  };

  it("switches between NPC, treasure and religion lists with accessible tabs", () => {
    document.getElementById("fpb-tab-treasures")!.click();
    expect(document.getElementById("fpb-npc-panel")!.hidden).toBe(true);
    expect(document.getElementById("fpb-heritage-panel")!.hidden).toBe(false);
    expect(document.getElementById("fpb-tab-treasures")!.getAttribute("aria-selected")).toBe("true");
    expect(document.getElementById("fpb-heritage-list")!.textContent).toContain("국가 보물");
    document.getElementById("fpb-tab-religions")!.click();
    expect(document.querySelector('#fpb-heritage-form [name="deityRank"]')).not.toBeNull();
    document.getElementById("fpb-tab-npcs")!.click();
    expect(document.getElementById("fpb-npc-panel")!.hidden).toBe(false);
  });

  it("links the selected NPC class to the matching Wikidot reference without changing its generated profile", () => {
    change("classId", "wizard");
    const link = document.querySelector<HTMLAnchorElement>('#fpb-npc-form [data-reference="class"]')!;
    expect(link.href).toBe("https://dnd2024.wikidot.com/wizard:main");
    const before = structuredClone(Campaign.get());
    const reference = document.querySelector<HTMLSelectElement>("#fpb-npc-form .fpb-rules-references select")!;
    reference.value = "2014";
    reference.dispatchEvent(new Event("change"));
    expect(document.querySelector<HTMLAnchorElement>('#fpb-npc-form [data-reference="class"]')!.href).toBe(
      "https://dnd5e.wikidot.com/wizard"
    );
    expect(Campaign.get()).toEqual(before);
    expect(document.querySelector<HTMLSelectElement>('#fpb-npc-form [name="classId"]')!.value).toBe("wizard");
  });

  it("saves country history and adds national treasures without removing existing items", () => {
    const country = document.getElementById("fpb-filter-country") as HTMLSelectElement;
    country.value = "country:1";
    country.dispatchEvent(new Event("change"));
    document.getElementById("fpb-tab-treasures")!.click();
    const age = document.getElementById("fpb-history-age") as HTMLInputElement;
    expect(age.disabled).toBe(false);
    age.value = "10000";
    document.getElementById("fpb-history-form")!.dispatchEvent(new Event("submit", { cancelable: true }));
    const world = Campaign.get()!;
    expect(world.heritage!.nations[0].ageYears).toBe(10000);
    expect(world.heritage!.treasures.filter(item => item.ownerType === "country")).toHaveLength(12);
    age.value = "0";
    document.getElementById("fpb-history-form")!.dispatchEvent(new Event("submit", { cancelable: true }));
    expect(world.heritage!.treasures.filter(item => item.ownerType === "country")).toHaveLength(12);
  });

  it("edits religion symbols, alignments, deity ranks and headquarters without interpreting HTML", () => {
    document.getElementById("fpb-tab-religions")!.click();
    const religion = Campaign.get()!.heritage!.religions[0];
    const form = document.getElementById("fpb-heritage-form") as HTMLFormElement;
    (form.elements.namedItem("symbol") as HTMLTextAreaElement).value = '<img src=x onerror="alert(1)">';
    (form.elements.namedItem("alignment") as HTMLSelectElement).value = "CE";
    (form.elements.namedItem("deityRank") as HTMLSelectElement).value = "greater";
    (form.elements.namedItem("deityName") as HTMLInputElement).value = "붉은 별의 신";
    (form.elements.namedItem("headquartersId") as HTMLSelectElement).value = "country:1";
    form.dispatchEvent(new Event("submit", { cancelable: true }));
    expect(religion).toMatchObject({
      alignment: "CE",
      deityRank: "greater",
      deityName: "붉은 별의 신",
      headquartersId: "country:1",
      edited: true
    });
    expect(document.querySelector("#fpb-heritage-panel img")).toBeNull();
    expect(document.getElementById("fpb-heritage-list")!.textContent).toContain("대신격");
    const show = document.getElementById("fpb-show-headquarters") as HTMLInputElement;
    show.checked = false;
    show.dispatchEvent(new Event("change"));
    expect(Campaign.get()!.heritage!.showHeadquarters).toBe(false);
  });

  it("preserves treasure edits and enforces the national rarity floor", () => {
    document.getElementById("fpb-tab-treasures")!.click();
    const item = Campaign.get()!.heritage!.treasures[0];
    const form = document.getElementById("fpb-heritage-form") as HTMLFormElement;
    const rarity = form.elements.namedItem("rarity") as HTMLSelectElement;
    expect([...rarity.options].map(option => option.value)).toEqual(["veryRare", "legendary"]);
    rarity.value = "legendary";
    rarity.dispatchEvent(new Event("change"));
    (form.elements.namedItem("rpEffect") as HTMLTextAreaElement).value = "왕위 계승의 정통성을 증명하는 인장";
    form.dispatchEvent(new Event("submit", { cancelable: true }));
    expect(item).toMatchObject({ rarity: "legendary", rpEffect: "왕위 계승의 정통성을 증명하는 인장", edited: true });
    Campaign.restore(Campaign.get());
    expect(Campaign.get()!.heritage!.treasures[0]).toEqual(item);
  });

  it("opens the selected religion when its map marker is activated", () => {
    const religion = Campaign.get()!.heritage!.religions.at(-1)!;
    window.dispatchEvent(new CustomEvent("realm:religion-selected", { detail: religion.id }));
    expect(document.getElementById("fpb-tab-religions")!.getAttribute("aria-selected")).toBe("true");
    expect(document.querySelector<HTMLFormElement>("#fpb-heritage-form")!.dataset.record).toBe(religion.id);
  });

  it("updates generated reference editions and refreshes details while preserving saved manual creations", () => {
    vi.stubGlobal(
      "confirm",
      vi.fn(() => true)
    );
    document.getElementById("fpb-tab-treasures")!.click();
    const heritage = Campaign.get()!.heritage!;
    const edited = heritage.treasures.at(-1)!;
    edited.edited = true;
    edited.power = "Manual effect";
    const before = structuredClone(edited);
    const edition = document.getElementById("fpb-item-edition") as HTMLSelectElement;
    edition.value = "2014";
    edition.dispatchEvent(new Event("change"));
    expect(heritage.itemReferenceEdition).toBe("2014");
    expect(heritage.treasures.filter(item => !item.edited).every(item => item.design?.edition === "2014")).toBe(true);
    expect(edited).toEqual(before);
    const referenceEdition = document.querySelector<HTMLSelectElement>('[name="referenceEdition"]')!;
    expect(referenceEdition.value).toBe("2014");
    const form = document.getElementById("fpb-heritage-form") as HTMLFormElement;
    (form.elements.namedItem("power") as HTMLTextAreaElement).value = "A custom power";
    form.dispatchEvent(new Event("submit", { cancelable: true }));
    expect(heritage.treasures[0].design?.method).toBe("inspired");
    expect(heritage.treasures[0].edited).toBe(true);
  });

  it("does not change references or unsaved drafts when a global edition change is canceled", () => {
    vi.stubGlobal(
      "confirm",
      vi.fn(() => false)
    );
    document.getElementById("fpb-tab-treasures")!.click();
    const before = structuredClone(Campaign.get()!.heritage);
    const name = document.querySelector<HTMLInputElement>('#fpb-heritage-form [name="name"]')!;
    name.value = "Pending name";
    const edition = document.getElementById("fpb-item-edition") as HTMLSelectElement;
    edition.value = "2024";
    edition.dispatchEvent(new Event("change"));
    expect(Campaign.get()!.heritage).toEqual(before);
    expect(edition.value).toBe("mixed");
    expect(name.value).toBe("Pending name");
  });

  it("disables country settings until a country is selected and applies its archetype", () => {
    const profile = document.getElementById("fpb-country-archetype") as HTMLSelectElement;
    expect(profile.disabled).toBe(true);
    const country = document.getElementById("fpb-filter-country") as HTMLSelectElement;
    country.value = "country:1";
    country.dispatchEvent(new Event("change"));
    expect(profile.disabled).toBe(false);
    profile.value = "nature";
    profile.dispatchEvent(new Event("change"));
    expect(Campaign.get()?.npcProfiles).toEqual([{ stateId: 1, archetype: "nature" }]);
    expect(Campaign.get()?.npcs.every(npc => npc.progression?.archetype === "nature")).toBe(true);
  });

  it("saves edited levels and classes while distinguishing simplified stats from reference CR", () => {
    const npc = Campaign.get()!.npcs[0];
    change("classId", "wizard");
    change("level", "15");
    change("scope", "country");
    change("rank", "noble");
    const form = document.getElementById("fpb-npc-form") as HTMLFormElement;
    (form.elements.namedItem("notes") as HTMLTextAreaElement).value = "private story";
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    expect(npc).toMatchObject({
      edited: true,
      notes: "private story",
      progression: { level: 15, classId: "wizard", scope: "country", rank: "noble" }
    });
    const detail = document.getElementById("fpb-npc-detail")!;
    expect(detail.textContent).toContain("공식 CR 아님");
    expect(detail.querySelector("details summary")?.textContent).toContain("레벨 미반영");
    expect(document.getElementById("fpb-npc-list")!.textContent).toContain("Lv.15 · T4");
  });

  it("does not save invalid levels and resets non-adventurers to level one", () => {
    const npc = Campaign.get()!.npcs[0];
    const previous = structuredClone(npc);
    change("level", "0");
    document.getElementById("fpb-npc-form")!.dispatchEvent(new Event("submit", { cancelable: true }));
    expect(npc).toEqual(previous);
    change("classId", "none");
    expect((document.querySelector('[name="level"]') as HTMLInputElement).value).toBe("1");
    document.getElementById("fpb-npc-form")!.dispatchEvent(new Event("submit", { cancelable: true }));
    expect(npc.progression).toMatchObject({ level: 1, classId: "none", rank: "common" });
  });

  it.each([17, 20, 21, 40])("saves manual level %i with the corrected tier and no invented epic stats", level => {
    const npc = Campaign.get()!.npcs[0];
    change("classId", "wizard");
    change("level", String(level));
    const form = document.getElementById("fpb-npc-form") as HTMLFormElement;
    (form.elements.namedItem("notes") as HTMLTextAreaElement).value = "manual high-level lore";
    form.dispatchEvent(new Event("submit", { cancelable: true }));
    expect(npc).toMatchObject({ edited: true, notes: "manual high-level lore", progression: { level } });
    const detail = document.getElementById("fpb-npc-detail")!;
    const list = document.getElementById("fpb-npc-list")!;
    if (level <= 20) {
      expect(list.textContent).toContain(`Lv.${level} · T5`);
      expect(detail.textContent).toContain("레벨 기반 간이 프로필");
    } else {
      expect(list.textContent).toContain(`Lv.${level} · 에픽`);
      expect(detail.textContent).toContain("간이 전투 수치 미제공");
      expect(detail.textContent).not.toContain("레벨 기반 간이 프로필");
      expect(detail.querySelector("details")!.open).toBe(false);
    }
    Campaign.restore(Campaign.get());
    expect(Campaign.get()!.npcs[0].progression!.level).toBe(level);
  });

  it("edits and saves fractional commoner CR without displaying fractional character levels", () => {
    const npc = Campaign.get()!.npcs[0];
    change("classId", "none");
    change("commonerCr", "1/4");
    expect(document.querySelector('[name="level"]')?.getAttribute("type")).toBe("hidden");
    expect(document.querySelectorAll('[name="commonerCr"] option')).toHaveLength(4);
    const detail = document.getElementById("fpb-npc-detail")!;
    expect(detail.textContent).toContain("추정치");
    expect(detail.textContent).toContain("18");
    document.getElementById("fpb-npc-form")!.dispatchEvent(new Event("submit", { cancelable: true }));
    expect(npc.progression).toMatchObject({ classId: "none", level: 1, commonerCr: "1/4" });
    expect(document.getElementById("fpb-npc-list")!.textContent).toContain("비모험가 · CR 1/4");
    const restored = structuredClone(Campaign.get()!);
    Campaign.restore(restored);
    expect(Campaign.get()!.npcs[0].progression?.commonerCr).toBe("1/4");
  });

  it("clears commoner CR when switching to an adventuring class and keeps notes through the switch", () => {
    const npc = Campaign.get()!.npcs[0];
    change("classId", "none");
    change("commonerCr", "1/2");
    (document.querySelector('[name="notes"]') as HTMLTextAreaElement).value = "my commoner story";
    change("classId", "fighter");
    expect(document.querySelector('[name="commonerCr"]')).toBeNull();
    change("level", "3");
    document.getElementById("fpb-npc-form")!.dispatchEvent(new Event("submit", { cancelable: true }));
    expect(npc.progression).toMatchObject({ classId: "fighter", level: 3 });
    expect(npc.progression).not.toHaveProperty("commonerCr");
    expect(npc.notes).toBe("my commoner story");
  });

  it("restores saved country settings and preserves edited NPCs on profile changes", () => {
    const world = structuredClone(Campaign.get()!);
    world.npcProfiles = [{ stateId: 1, archetype: "arcane" }];
    world.npcs[0].edited = true;
    const preserved = structuredClone(world.npcs[0]);
    Campaign.restore(world);
    const country = document.getElementById("fpb-filter-country") as HTMLSelectElement;
    country.value = "country:1";
    country.dispatchEvent(new Event("change"));
    const profile = document.getElementById("fpb-country-archetype") as HTMLSelectElement;
    expect(profile.value).toBe("arcane");
    profile.value = "theocratic";
    profile.dispatchEvent(new Event("change"));
    expect(Campaign.get()!.npcs[0]).toEqual(preserved);
  });
});
