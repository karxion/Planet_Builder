import { openSpaceContent } from "./space-content";
import {
  ALL_REFERENCE_OPTIONS,
  MAGIC_ITEM_BY_ID,
  MAGIC_ITEM_CATEGORIES,
  optionKey,
  referenceSourceUrl
} from "@/data/magic-item-references";
import { isDungeonLocation } from "@/data/dungeon-locations";
import { isWorldMagicItem } from "@/data/world-item-validation";
import {
  UNIQUE_ITEM_POLICY,
  UNIQUE_ITEM_LIMITS,
  UNIQUE_ITEM_EQUIPMENT,
  UNIQUE_ITEM_CONSUMABLE,
  uniqueItemBonusLines
} from "@/data/unique-item-bonuses";
import { createUniqueItemBonus } from "@/generators/unique-item-bonuses";
import {
  createWorldItem,
  itemImagePrompt,
  itemOwnerLabel,
  ITEM_RARITY_LABELS,
  synchronizeItemLibrary,
  type TreasureItemSeed
} from "@/generators/world-items";
import { t } from "@/services/ui-language";
import { generatedTemplate as gf } from "@/utils/generation-text";
import { EditorDrafts } from "@/services/editor-drafts";
import type { CampaignWorld } from "@/types/campaign-world";
import type { ItemDungeonChoice, WorldMagicItem } from "@/types/world-item";
import { Campaign } from "./campaign-world";
import { mountImageHandoff } from "./image-handoff";
import { mapItemOrigin } from "./item-origin";

let dialog: HTMLDialogElement;
let world: CampaignWorld;
let selected = "";
let page = 0;
let dungeons: ItemDungeonChoice[] = [];
const draftKey = (id: string) => `item:${id}`;
const itemDraftCount = () => EditorDrafts.snapshot().filter(entry => entry.key.startsWith("item:")).length;
const get = <T extends HTMLElement = HTMLElement>(id: string) => dialog.querySelector<T>(`#${id}`)!;
const node = <K extends keyof HTMLElementTagNameMap>(tag: K, label = "") => {
  const element = document.createElement(tag);
  element.textContent = t(label);
  return element;
};
const changed = () => window.dispatchEvent(new Event("project:changed"));

function dungeonChoices(): ItemDungeonChoice[] {
  return (typeof pack === "undefined" ? [] : pack.markers || [])
    .filter(marker => isDungeonLocation(marker) || marker.type === "hostile-settlements" || marker.type === "caves")
    .map(marker => ({
      markerId: marker.i,
      cell: marker.cell,
      x: marker.x,
      y: marker.y,
      name: (
        (typeof notes === "undefined" ? undefined : notes.find(note => note.id === `marker${marker.i}`))?.name ||
        `${t("던전")} ${marker.i + 1}`
      ).slice(0, 200)
    }));
}
const dungeonKey = (value: { markerId: number; cell: number }) => `${value.markerId}:${value.cell}`;

function createDialog(): void {
  dialog = document.createElement("dialog");
  dialog.id = "fpb-items-dialog";
  dialog.innerHTML = `<header class="fpb-items-header"><div><h2></h2><small id="fpb-items-summary"></small></div><button id="fpb-item-add" type="button" class="icon-plus"></button><button id="fpb-items-export" type="button" class="icon-download"></button><button id="fpb-items-close" type="button" class="icon-cancel"></button></header>
    <div class="fpb-items-toolbar"><input id="fpb-items-search" type="search"><select id="fpb-items-rarity"></select><select id="fpb-items-source"></select></div>
    <div class="fpb-items-layout"><section class="fpb-items-results"><div id="fpb-items-list"></div><nav><button id="fpb-items-prev" type="button" class="icon-left-open"></button><span id="fpb-items-page"></span><button id="fpb-items-next" type="button" class="icon-right-open"></button></nav></section><section id="fpb-item-detail"></section></div>`;
  document.body.append(dialog);
  get("fpb-items-close").onclick = () => dialog.close();
  get("fpb-item-add").onclick = () => {
    const item = createWorldItem(world.seed, `item:manual:${crypto.randomUUID()}`, t("새 아이템"));
    item.name = t("새 매직 아이템");
    item.edited = true;
    world.itemLibrary!.items.push(item);
    selected = item.id;
    page = Math.floor((world.itemLibrary!.items.length - 1) / 40);
    get<HTMLInputElement>("fpb-items-search").value = "";
    get<HTMLSelectElement>("fpb-items-rarity").value = "";
    get<HTMLSelectElement>("fpb-items-source").value = "";
    changed();
    renderList();
  };
  for (const id of ["fpb-items-search", "fpb-items-rarity", "fpb-items-source"])
    get(id).addEventListener(id.endsWith("search") ? "input" : "change", () => {
      page = 0;
      renderList();
    });
  get("fpb-items-prev").onclick = () => {
    page--;
    renderList();
  };
  get("fpb-items-next").onclick = () => {
    page++;
    renderList();
  };
  get("fpb-items-export").onclick = async () => {
    const current = world;
    const filtered = filteredItems();
    const chosen = current.itemLibrary!.items.filter(item => item.id === selected);
    const { openWorldDataExport } = await import("./world-data-export");
    if (Campaign.get() !== current) return;
    openWorldDataExport({
      kind: "items",
      world: current,
      all: current.itemLibrary!.items,
      filtered,
      selected: chosen,
      hasDrafts: itemDraftCount() > 0
    });
  };
  window.addEventListener("ui:language-changed", () => {
    if (dialog.open) {
      translateChrome();
      renderList();
    }
  });
  for (const event of ["map:generated", "map:loaded"])
    window.addEventListener(event, () => {
      dialog.close();
    });
}

function translateChrome(): void {
  dialog.querySelector("h2")!.textContent = t("세계의 매직 아이템");
  get("fpb-item-add").textContent = ` ${t("아이템 추가")}`;
  get("fpb-items-export").textContent = ` ${t("데이터 출력")}`;
  for (const [id, label] of [
    ["fpb-items-close", "닫기"],
    ["fpb-items-export", "아이템 데이터 출력"],
    ["fpb-items-prev", "이전 페이지"],
    ["fpb-items-next", "다음 페이지"]
  ]) {
    get(id).title = t(label);
    get(id).setAttribute("aria-label", t(label));
  }
  get<HTMLInputElement>("fpb-items-search").placeholder = t("아이템·소유주·던전 검색");
  get("fpb-items-search").setAttribute("aria-label", t("아이템·소유주·던전 검색"));
  const rarity = get<HTMLSelectElement>("fpb-items-rarity");
  const old = rarity.value;
  rarity.replaceChildren(
    new Option(t("전체 희귀도"), ""),
    ...Object.entries(ITEM_RARITY_LABELS).map(([key, label]) => new Option(t(label), key))
  );
  rarity.value = old;
  rarity.setAttribute("aria-label", t("희귀도"));
  const source = get<HTMLSelectElement>("fpb-items-source");
  const previous = source.value;
  source.replaceChildren(
    new Option(t("전체 아이템"), ""),
    new Option(t("던전 보상"), "dungeon"),
    new Option(t("소유주 지정됨"), "owned"),
    new Option(t("소유주 없음"), "unowned")
  );
  source.value = previous;
  source.setAttribute("aria-label", t("아이템 분류"));
}

export function openItemLibrary(): void {
  if (openSpaceContent("items")) return;
  const current = Campaign.get();
  if (!current) return;
  if (current !== world) {
    world = current;
    selected = "";
    page = 0;
  }
  dungeons = dungeonChoices();
  const legacy = world as CampaignWorld & { heritage?: { treasures: TreasureItemSeed[] } };
  const capitals = (typeof pack === "undefined" ? [] : pack.burgs || [])
    .filter(burg => burg.i && !burg.removed && burg.capital)
    .map(burg => `village:${burg.i}`);
  if (synchronizeItemLibrary(world, dungeons, legacy.heritage?.treasures, capitals, item => mapItemOrigin(world, item)))
    changed();
  if (!dialog?.isConnected) createDialog();
  translateChrome();
  renderList();
  if (!dialog.open) dialog.showModal();
}

function filteredItems(): WorldMagicItem[] {
  const query = get<HTMLInputElement>("fpb-items-search").value.trim().toLocaleLowerCase();
  const rarity = get<HTMLSelectElement>("fpb-items-rarity").value;
  const source = get<HTMLSelectElement>("fpb-items-source").value;
  return world.itemLibrary!.items.filter(
    item =>
      (!rarity || item.rarity === rarity) &&
      (!source ||
        (source === "dungeon" && item.reward) ||
        (source === "owned" && item.owner.kind !== "none") ||
        (source === "unowned" && item.owner.kind === "none")) &&
      [item.name, itemOwnerLabel(item, world), item.reward?.name || ""].join(" ").toLocaleLowerCase().includes(query)
  );
}

function renderList(): void {
  const items = filteredItems();
  page = Math.max(0, Math.min(page, Math.ceil(items.length / 40) - 1));
  if (!items.slice(page * 40, page * 40 + 40).some(item => item.id === selected)) selected = items[page * 40]?.id || "";
  const list = get("fpb-items-list");
  list.replaceChildren();
  for (const item of items.slice(page * 40, page * 40 + 40)) {
    const button = node("button");
    button.type = "button";
    button.className = "fpb-item-row";
    button.dataset.item = item.id;
    button.setAttribute("aria-pressed", String(selected === item.id));
    const name = node("strong");
    name.textContent = item.name;
    const info = node("span", `${t(ITEM_RARITY_LABELS[item.rarity])}${item.unique ? ` · ${t("유니크")}` : ""}`);
    const owner = node("small");
    owner.textContent = t(itemOwnerLabel(item, world));
    button.append(name, info, owner);
    if (item.reward) {
      const reward = node("small");
      reward.textContent = `${t("던전 보상")}: ${item.reward.name} · #${item.reward.markerId}`;
      button.append(reward);
    }
    button.onclick = () => {
      selected = item.id;
      renderList();
    };
    list.append(button);
  }
  if (!items.length) list.append(node("p", "조건에 맞는 아이템이 없습니다"));
  get("fpb-items-summary").textContent = `${items.length} / ${world.itemLibrary!.items.length}`;
  get("fpb-items-page").textContent = `${page + 1} / ${Math.max(1, Math.ceil(items.length / 40))}`;
  get<HTMLButtonElement>("fpb-items-prev").disabled = page === 0;
  get<HTMLButtonElement>("fpb-items-next").disabled = (page + 1) * 40 >= items.length;
  renderDetail();
}

function field(
  form: HTMLFormElement,
  label: string,
  name: string,
  value: string,
  choices?: [string, string][],
  multiline = false
) {
  const wrapper = node("label", label);
  const input = choices ? node("select") : multiline ? node("textarea") : node("input");
  input.name = name;
  if (input instanceof HTMLSelectElement) for (const [id, text] of choices!) input.add(new Option(text, id));
  else {
    input.maxLength = multiline ? 4000 : 200;
    if (input instanceof HTMLTextAreaElement) input.rows = 3;
  }
  input.value = value;
  wrapper.append(input);
  form.append(wrapper);
  return input;
}

function readItem(form: HTMLFormElement, item: WorldMagicItem): WorldMagicItem {
  const values = Object.fromEntries([...new FormData(form)].map(([key, value]) => [key, String(value)]));
  values.unique = String(form.querySelector<HTMLInputElement>('[name="unique"]')!.checked);
  return readItemValues(values, item);
}

function readItemValues(data: Record<string, string>, item: WorldMagicItem): WorldMagicItem {
  const draft = { ...item, edited: true };
  for (const key of ["name", "appearance", "power", "history", "notes"] as const) draft[key] = data[key] || "";
  draft.category = data.category as WorldMagicItem["category"];
  draft.rarity = data.rarity as WorldMagicItem["rarity"];
  draft.unique = data.unique === "true";
  const kind = data.ownerKind;
  const id = data.ownerId || "";
  if (kind === "none") draft.owner = { kind: "none" };
  else if (kind === "custom") draft.owner = { kind: "custom", label: (data.ownerLabel || "").trim() };
  else {
    const found =
      kind === "npc" ? world.npcs.find(value => value.id === id) : world.units.find(value => value.id === id);
    const old = item.owner;
    draft.owner = { kind: kind as "npc" | "unit", id, label: found?.name || (old.kind !== "none" ? old.label : "") };
  }
  const reward = data.reward || "";
  if (!reward) delete draft.reward;
  else {
    const found = dungeons.find(value => dungeonKey(value) === reward);
    if (found) draft.reward = { markerId: found.markerId, cell: found.cell, name: found.name };
  }
  const reference = ALL_REFERENCE_OPTIONS.find(option => optionKey(option) === data.reference);
  if (reference) {
    draft.referenceId = reference.reference.id;
    draft.variant = reference.variant;
  } else {
    delete draft.referenceId;
    delete draft.variant;
  }
  draft.origin ||= mapItemOrigin(world, draft);
  draft.uniqueBonus = createUniqueItemBonus(world.seed, draft);
  return draft;
}

function renderDetail(): void {
  const host = get("fpb-item-detail");
  host.replaceChildren();
  const stored = world.itemLibrary!.items.find(item => item.id === selected);
  if (!stored) {
    host.append(node("p", "아이템을 추가하거나 선택해주세요"));
    return;
  }
  const pending = EditorDrafts.read(draftKey(stored.id));
  const item = pending ? readItemValues(pending, stored) : { ...stored };
  const activeWorld = world;
  const form = node("form");
  form.id = "fpb-item-form";
  const heading = node("div");
  heading.className = "fpb-item-heading";
  const title = node("h3");
  title.textContent = item.name;
  heading.append(title);
  form.append(heading);
  field(form, "아이템 이름", "name", item.name).required = true;
  field(
    form,
    "아이템 유형",
    "category",
    item.category,
    Object.entries(MAGIC_ITEM_CATEGORIES).map(([id, name]) => [id, t(name)])
  );
  field(
    form,
    "희귀도",
    "rarity",
    item.rarity,
    Object.entries(ITEM_RARITY_LABELS).map(([id, name]) => [id, t(name)])
  );
  const uniqueLabel = node("label", "유니크 · 상징적 유일성");
  uniqueLabel.className = "fpb-item-checkbox";
  const unique = node("input");
  unique.type = "checkbox";
  unique.name = "unique";
  unique.checked = item.unique;
  uniqueLabel.prepend(unique);
  form.append(uniqueLabel);
  if (item.uniqueBonus) {
    const bonus = node("section");
    bonus.id = "fpb-item-unique-bonus";
    bonus.className = "fpb-item-unique-bonus";
    bonus.append(node("h4", "유니크 추가 특성"), node("small", UNIQUE_ITEM_POLICY));
    const list = node("ul");
    for (const line of uniqueItemBonusLines(item.uniqueBonus, t, item.rarity)) list.append(node("li", line));
    bonus.append(
      list,
      node(
        "p",
        item.category === "potion" || item.category === "scroll" ? UNIQUE_ITEM_CONSUMABLE : UNIQUE_ITEM_EQUIPMENT
      ),
      node("p", UNIQUE_ITEM_LIMITS)
    );
    form.append(bonus);
  }
  field(form, "소유주 유형", "ownerKind", item.owner.kind, [
    ["none", t("소유주 없음")],
    ["npc", "NPC"],
    ["unit", t("국가·지역·영지·마을")],
    ["custom", t("직접 입력")]
  ]);
  if (item.owner.kind === "custom") field(form, "소유주", "ownerLabel", item.owner.label).required = true;
  if (item.owner.kind === "npc" || item.owner.kind === "unit") {
    const owner = item.owner;
    const search = field(form, "소유주 검색", "ownerSearch", "") as HTMLInputElement;
    search.dataset.fpbPreference = "";
    const selector = field(form, "소유주", "ownerId", owner.id, []) as HTMLSelectElement;
    selector.required = true;
    const unitNames = new Map(world.units.map(unit => [unit.id, unit.name]));
    const choices =
      owner.kind === "npc"
        ? world.npcs.map(npc => ({
            id: npc.id,
            name: npc.name,
            context: unitNames.get(npc.villageId) || ""
          }))
        : world.units.map(unit => ({
            id: unit.id,
            name: unit.name,
            context: t({ country: "국가", region: "지역", fief: "영지", village: "마을" }[unit.level])
          }));
    const update = () => {
      const selected = selector.value || owner.id;
      const query = search.value.trim().toLocaleLowerCase();
      const visible = choices
        .filter(
          choice =>
            choice.id === selected ||
            `${choice.name} ${choice.context} ${choice.id}`.toLocaleLowerCase().includes(query)
        )
        .slice(0, 100);
      const current = choices.find(choice => choice.id === selected);
      if (current && !visible.includes(current)) visible.unshift(current);
      selector.replaceChildren(
        new Option(t("소유주 선택"), ""),
        ...visible.map(choice => new Option(`${choice.name} · ${choice.context} · ${choice.id}`, choice.id))
      );
      if (selected && !current) selector.add(new Option(`${owner.label} (${t("연결 대상 없음")})`, selected));
      selector.value = selected;
    };
    update();
    search.addEventListener("input", event => {
      event.stopPropagation();
      update();
    });
  }
  const rewards: [string, string][] = [
    ["", t("보상 출처 없음")],
    ...dungeons.map(
      dungeon =>
        [dungeonKey(dungeon), `${dungeon.name} · #${dungeon.markerId} · ${dungeon.x}, ${dungeon.y}`] as [string, string]
    )
  ];
  const key = item.reward ? dungeonKey(item.reward) : "";
  if (item.reward && !dungeons.some(dungeon => dungeonKey(dungeon) === key))
    rewards.push([key, `${item.reward.name} (${t("연결 대상 없음")})`]);
  field(form, "던전 보상 출처", "reward", key, rewards);
  if (item.reward) {
    const focus = node("button", "던전 위치 보기");
    focus.type = "button";
    focus.className = "icon-location";
    const dungeon = dungeons.find(dungeon => dungeonKey(dungeon) === key);
    focus.disabled = !dungeon;
    focus.onclick = () => {
      if (dungeon) {
        dialog.close();
        document.getElementById("fpb-map-view")?.click();
        zoomTo(dungeon.x, dungeon.y, 6, 600);
      }
    };
    form.append(focus);
  }
  for (const [key, label] of [
    ["appearance", "아이템 외형"],
    ["power", "효능 개요"],
    ["history", "유래"],
    ["notes", "GM 메모"]
  ] as const)
    field(form, label, key, item[key], undefined, true);
  const reference = item.referenceId && MAGIC_ITEM_BY_ID.get(item.referenceId);
  const referenceChoices = ALL_REFERENCE_OPTIONS.filter(
    option => option.rarity === item.rarity && option.reference.category === item.category
  );
  const currentReference =
    reference &&
    ALL_REFERENCE_OPTIONS.find(option => option.reference.id === reference.id && option.variant === item.variant);
  if (currentReference && !referenceChoices.includes(currentReference)) referenceChoices.unshift(currentReference);
  const selectedReference = currentReference ? optionKey(currentReference) : "";
  field(form, "원본 레퍼런스", "reference", selectedReference, [
    ["", t("창작 아이템")],
    ...referenceChoices.map(
      option =>
        [
          optionKey(option),
          `${option.reference.edition} · ${option.reference.name}${option.variant ? ` · ${option.variant}` : ""}`
        ] as [string, string]
    )
  ]);
  if (reference) {
    const details = node("details");
    details.append(node("summary", "SRD 원본 규칙"));
    const rules = node("p");
    rules.className = "fpb-item-rules";
    rules.textContent = reference.rules;
    const link = node("a", `${reference.edition} · p.${reference.page}`);
    link.href = referenceSourceUrl(reference);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    details.append(rules, link);
    form.append(details);
  }
  const status = node("p", pending ? "적용 전 변경사항" : "");
  status.id = "fpb-item-status";
  status.setAttribute("role", "status");
  form.append(status);
  const actions = node("div");
  actions.className = "fpb-item-edit-actions";
  const save = node("button", "변경 저장");
  save.type = "submit";
  save.className = "primary";
  const remove = node("button");
  remove.type = "button";
  remove.className = "icon-trash";
  remove.title = t("아이템 삭제");
  remove.setAttribute("aria-label", remove.title);
  actions.append(save, remove);
  form.append(actions);
  host.append(form);
  form.oninput = event => {
    if (
      !(event.target as HTMLInputElement).name ||
      (event.target as HTMLElement).closest(".fpb-npc-portrait-request, [name=ownerSearch]")
    )
      return;
    status.textContent = EditorDrafts.read(draftKey(item.id)) ? t("적용 전 변경사항") : "";
  };
  form.onchange = event => {
    const name = (event.target as HTMLInputElement).name;
    if (!name || name === "ownerSearch") return;
    if (["rarity", "category"].includes(name)) {
      form.querySelector<HTMLSelectElement>('[name="reference"]')!.value = "";
    }
    if (name === "reference") {
      const value = new FormData(form).get("reference");
      const option = ALL_REFERENCE_OPTIONS.find(option => optionKey(option) === value);
      if (option) {
        form.querySelector<HTMLTextAreaElement>('[name="power"]')!.value = gf(
          "{reference} · SRD {edition} 원본 규칙 참조",
          "{reference} · See the original SRD {edition} rules",
          {
            reference: `${option.reference.name}${option.variant ? ` · ${option.variant}` : ""}`,
            edition: option.reference.edition
          }
        );
      }
    }
    form.dispatchEvent(new Event("input", { bubbles: true }));
    if (["unique", "ownerKind", "rarity", "category", "reference", "reward"].includes(name)) renderDetail();
  };
  form.onsubmit = event => {
    event.preventDefault();
    const draft = readItem(form, stored);
    draft.name = draft.name.trim();
    if (!isWorldMagicItem(draft)) {
      status.textContent = t("이름·소유주 등 입력값을 확인해주세요");
      return;
    }
    Object.assign(stored, draft);
    for (const key of ["referenceId", "variant", "reward", "uniqueBonus"] as const)
      if (draft[key] === undefined) delete stored[key];
    EditorDrafts.clear(draftKey(item.id));
    changed();
    renderList();
  };
  remove.onclick = () => {
    if (!confirm(t("이 아이템을 목록에서 삭제할까요?"))) return;
    const library = world.itemLibrary!;
    library.items = library.items.filter(value => value.id !== item.id);
    if (!library.deletedIds.includes(item.id)) library.deletedIds.push(item.id);
    EditorDrafts.clear(draftKey(item.id));
    selected = "";
    changed();
    renderList();
  };
  mountImageHandoff({
    form,
    image: stored.image,
    idPrefix: "fpb-item-image",
    subject: "아이템 이미지",
    deleteQuestion: "등록된 아이템 이미지를 삭제할까요?",
    actionsSelector: ".fpb-item-edit-actions",
    headingSelector: ".fpb-item-heading",
    getPrompt: () => itemImagePrompt(readItem(form, item)),
    onChange: image => {
      if (Campaign.get() !== activeWorld || !activeWorld.itemLibrary?.items.includes(stored)) return false;
      stored.image = item.image = image;
      stored.edited = true;
      changed();
      return true;
    }
  });
  EditorDrafts.bind(form, draftKey(item.id), renderDetail);
}
