import { EditorDrafts } from "@/services/editor-drafts";
import { getUiLanguage, t } from "@/services/ui-language";
import { NPC_CLASSES } from "@/data/npc-progression";
import { WorldSpaces } from "@/services/world-spaces/state";
import type { SpaceItem, SpaceNpc } from "@/types/world-spaces";

const text = (ko: string, en: string) => (getUiLanguage() === "ko" ? ko : en);
const esc = (value: string) =>
  value.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
let dialog: HTMLDialogElement,
  kind: "npcs" | "items" = "npcs",
  selected = "",
  query = "",
  cityFilter = "";
let openedSpace = "";

/** Returns false only for the surface, where the original world/item dialogs remain authoritative. */
export function openSpaceContent(next: "npcs" | "items" = "npcs", siteId = ""): boolean {
  const data = WorldSpaces.snapshot();
  if (data.activeSpace === "surface") return false;
  if (!dialog?.isConnected) {
    dialog = document.createElement("dialog");
    dialog.id = "fpb-space-content";
    dialog.dataset.i18nSkip = "";
    dialog.setAttribute("aria-labelledby", "fpb-space-content-title");
    document.body.append(dialog);
    window.addEventListener("project:changed", () => {
      if (dialog.open) render();
    });
    window.addEventListener("ui:language-changed", () => {
      if (dialog.open) render();
    });
    window.addEventListener("world-spaces:restored", () => dialog.close());
  }
  openedSpace = data.activeSpace;
  kind = next;
  selected = "";
  query = "";
  cityFilter = siteId;
  render();
  if (!dialog.open) dialog.showModal();
  return true;
}

function render(): void {
  const data = WorldSpaces.snapshot();
  if (data.activeSpace === "surface" || data.activeSpace !== openedSpace) {
    dialog.close();
    return;
  }
  const cities = data.sites.filter(site => site.kind === "city" && site.space === data.activeSpace);
  const homes = new Set(cities.map(site => site.id));
  const npcs = (data.content?.npcs || []).filter(npc => homes.has(npc.siteId));
  const items = (data.content?.items || []).filter(item => homes.has(item.siteId));
  const list: (SpaceNpc | SpaceItem)[] = (kind === "npcs" ? npcs : items).filter(
    record =>
      (!cityFilter || record.siteId === cityFilter) &&
      (!query ||
        Object.values(record)
          .flat()
          .filter(v => typeof v === "string")
          .join(" ")
          .toLocaleLowerCase()
          .includes(query.toLocaleLowerCase()))
  );
  if (!list.some(record => record.id === selected)) selected = list[0]?.id || "";
  const emptyMessage = cities.length
    ? text("검색 조건에 맞는 기록이 없습니다.", "No records match your filters.")
    : text(
        "이 공간에 도시가 없습니다. 공간 편집에서 지도를 생성하거나 도시를 추가하세요.",
        "No cities in this space. Generate the map or add a city in Edit spaces."
      );
  const space = data.activeSpace === "underwater" ? text("해저", "Underwater") : text("지저", "Underground");
  const home = (id: string) => cities.find(city => city.id === id);
  dialog.innerHTML = `<header><div><small>${space} · ${text("공간 전용 기록", "Space-specific records")}</small><h2 id="fpb-space-content-title">${text("주민과 유물", "Residents & relics")}</h2></div><button type="button" data-close aria-label="${text("닫기", "Close")}">×</button></header>
    <nav><button type="button" data-kind="npcs" aria-pressed="${kind === "npcs"}">NPC · ${npcs.length}</button><button type="button" data-kind="items" aria-pressed="${kind === "items"}">${text("아이템", "Items")} · ${items.length}</button></nav>
    <div class="fpb-space-content-filters"><label>${text("도시", "City")}<select data-city><option value="">${text("전체 도시", "All cities")}</option>${cities.map(city => `<option value="${esc(city.id)}" ${city.id === cityFilter ? "selected" : ""}>${esc(city.name)} · ${city.depth}m</option>`).join("")}</select></label><label>${text("검색", "Search")}<input data-search type="search" value="${esc(query)}"></label></div>
    <div class="fpb-space-content-layout"><section data-list aria-label="${text("기록 목록", "Record list")}">${list.map(record => `<button type="button" data-record="${esc(record.id)}" aria-pressed="${record.id === selected}"><strong>${esc(record.name)}</strong><small>${esc("role" in record ? `${record.role} · ${record.people}` : `${record.category} · ${rarityLabel(record.rarity)}`)}</small><small>${esc(home(record.siteId)?.name || "")} · ${home(record.siteId)?.depth || 0}m</small></button>`).join("") || `<p>${emptyMessage}</p>`}</section><section data-detail></section></div>`;
  dialog.querySelector<HTMLButtonElement>("[data-close]")!.onclick = () => dialog.close();
  dialog.querySelectorAll<HTMLButtonElement>("[data-kind]").forEach(
    button =>
      (button.onclick = () => {
        kind = button.dataset.kind as typeof kind;
        selected = "";
        render();
      })
  );
  dialog.querySelector<HTMLSelectElement>("[data-city]")!.onchange = event => {
    cityFilter = (event.target as HTMLSelectElement).value;
    render();
  };
  const search = dialog.querySelector<HTMLInputElement>("[data-search]")!;
  search.oninput = () => {
    query = search.value;
    const cursor = search.selectionStart;
    render();
    const next = dialog.querySelector<HTMLInputElement>("[data-search]")!;
    next.focus();
    next.setSelectionRange(cursor, cursor);
  };
  dialog.querySelectorAll<HTMLButtonElement>("[data-record]").forEach(
    button =>
      (button.onclick = () => {
        selected = button.dataset.record!;
        render();
      })
  );
  const record = list.find(record => record.id === selected),
    detail = dialog.querySelector<HTMLElement>("[data-detail]")!;
  if (!record) return;
  const city = home(record.siteId)!;
  detail.innerHTML = `<small>${esc(city.name)} · ${city.depth}m</small><h3>${esc(record.name)}</h3>${
    "role" in record
      ? `<p>${esc(record.role)} · ${esc(record.people)}</p><blockquote>${esc(record.greeting)}</blockquote><p>${esc(record.offer)}</p><button type="button" data-interact>${text("교류하기", "Interact")}</button><p data-interaction role="status"></p>`
      : `<p>${esc(record.category)} · ${rarityLabel(record.rarity)}</p><ul>${record.effects.map(effect => `<li>${esc(effect)}</li>`).join("")}</ul><p>${esc(record.history)}</p><p>${text("교역 담당", "Trader")}: ${esc(npcs.find(npc => npc.id === record.npcId)?.name || "")}</p><small>${text("환경에 맞춘 창작 아이템 효과", "Original setting-specific item effects")}</small>`
  }
    <button type="button" data-focus>${text("지도에서 보기", "Show on map")}</button>
    <form data-fpb-draft><label>${text("이름", "Name")}<input name="name" maxlength="200" required value="${esc(record.name)}"></label>${"offer" in record ? `<label>${text("교류·의뢰", "Interaction / request")}<textarea name="offer" maxlength="2000">${esc(record.offer)}</textarea></label>` : ""}<label>${text("GM 메모", "GM notes")}<textarea name="notes" maxlength="4000">${esc(record.notes)}</textarea></label><button type="submit">${text("변경 적용", "Apply changes")}</button></form>`;
  const form = detail.querySelector<HTMLFormElement>("form")!,
    draftKey = `space-${kind === "npcs" ? "npc" : "item"}:${record.id}`;
  EditorDrafts.bind(form, draftKey, render);
  form.onsubmit = event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    WorldSpaces.update(draft => {
      const current = (kind === "npcs" ? draft.content!.npcs : draft.content!.items).find(
        item => item.id === record.id
      )!;
      current.name = String(values.get("name")).trim();
      current.notes = String(values.get("notes"));
      current.edited = true;
      if ("offer" in current) current.offer = String(values.get("offer"));
      const anchor = draft.sites.find(site => site.id === record.siteId)!;
      if (anchor.origin) anchor.edited = true;
    });
    EditorDrafts.clear(draftKey);
    render();
  };
  detail.querySelector<HTMLButtonElement>("[data-focus]")!.onclick = () => {
    dialog.close();
    window.dispatchEvent(new CustomEvent("space:focus-site", { detail: city.id }));
  };
  const interact = detail.querySelector<HTMLButtonElement>("[data-interact]");
  if (interact && "offer" in record)
    interact.onclick = () => {
      detail.querySelector<HTMLElement>("[data-interaction]")!.textContent = `${record.name}: ${record.offer}`;
      if (record.interaction === "trade") {
        kind = "items";
        cityFilter = record.siteId;
        selected = "";
        render();
      }
    };
  if ("progression" in record && record.progression) {
    const profile = document.createElement("p");
    profile.textContent =
      record.progression.classId === "none"
        ? `${t(NPC_CLASSES.none)} · CR ${record.progression.commonerCr || "0"}`
        : `${t(NPC_CLASSES[record.progression.classId])} · Lv ${record.progression.level} · T${Math.ceil(record.progression.level / 4)}`;
    detail.querySelector("h3")!.after(profile);
  }
}

function rarityLabel(value: SpaceItem["rarity"]): string {
  return value === "rare"
    ? text("레어", "Rare")
    : value === "veryRare"
      ? text("베리 레어", "Very rare")
      : text("레젠더리", "Legendary");
}
