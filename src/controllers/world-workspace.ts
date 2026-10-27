import { EditorDrafts } from "@/services/editor-drafts";
import { t } from "@/services/ui-language";

const node = <K extends keyof HTMLElementTagNameMap>(tag: K, value = "", className = "") => {
  const element = document.createElement(tag);
  element.textContent = value;
  element.className = className;
  return element;
};
const button = (label: string, run: () => void, className = "") => {
  const element = node("button", t(label), className);
  element.type = "button";
  element.onclick = run;
  return element;
};

export function showWorldRecord(root: HTMLElement): void {
  const dialog = root.closest<HTMLElement>("#fpb-world-dialog");
  if (dialog) dialog.dataset.mobileDetail = "true";
  if (window.matchMedia?.("(max-width: 760px)").matches) {
    const heading = root.querySelector<HTMLElement>("h3");
    if (heading) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
  }
}

interface DetailOptions {
  key: string;
  name: string;
  location: string;
  badge: string;
  sections: { title: string; fields: [string, string][]; fullWidth?: boolean }[];
  focus: () => void;
  canFocus?: boolean;
  refresh: () => void;
  portrait?: string;
}

/** Read and edit share the existing form and draft store; no second copy of world data. */
export function mountWorldDetail(root: HTMLElement, options: DetailOptions): void {
  const found = root.querySelector<HTMLFormElement>("form");
  if (!found) return;
  const form: HTMLFormElement = found;
  const wasEditing = root.dataset.editingKey === options.key;
  const body = node("div", "", "fpb-world-detail-body");
  const heading = node("header", "", "fpb-world-detail-heading");
  const path = node("p", options.location, "fpb-world-location");
  path.dataset.i18nSkip = "";
  const title = node("div", "", "fpb-world-detail-title");
  const name = node("h3", options.name);
  name.dataset.i18nSkip = "";
  const edit = button("편집", () => setEditing(true), "fpb-world-edit");
  title.append(name, edit);
  heading.append(path, title, node("span", options.badge, "fpb-world-badge"));
  const summary = node("div", "", "fpb-world-read-view");
  if (options.portrait) {
    const image = node("img", "", "fpb-world-summary-portrait");
    image.src = options.portrait;
    image.alt = options.name;
    summary.append(image);
  }
  for (const section of options.sections) {
    const container = node("section", "", "fpb-world-read-section");
    container.append(node("h4", t(section.title)));
    const fields = node("dl", "", `fpb-world-read-fields${section.fullWidth ? " fpb-world-read-full" : ""}`);
    for (const [label, value] of section.fields) {
      const pair = node("div");
      pair.append(node("dt", t(label)));
      const data = node("dd", value || t("기록 없음"));
      data.dataset.i18nSkip = "";
      pair.append(data);
      fields.append(pair);
    }
    container.append(fields);
    summary.append(container);
  }
  const stats = form.querySelector(".fpb-npc-stats");
  if (stats) {
    const section = node("section", "", "fpb-world-read-section");
    section.append(node("h4", t("전투 프로필")), stats.cloneNode(true));
    summary.insertBefore(section, summary.children[1] || null);
  }
  body.append(heading, summary, form);
  const footer = node("footer", "", "fpb-world-detail-actions");
  const status = node("span", "", "fpb-world-detail-status");
  status.setAttribute("role", "status");
  const back = button(
    "‹ 목록",
    () => {
      const dialog = root.closest<HTMLElement>("#fpb-world-dialog")!;
      delete dialog.dataset.mobileDetail;
      dialog.querySelector<HTMLElement>("[role=tabpanel]:not([hidden]) .fpb-npc-row.selected")?.focus();
    },
    "fpb-world-back"
  );
  const focus = button("지도에서 보기", options.focus);
  focus.disabled = options.canFocus === false;
  const cancel = button("취소", () => {
    delete root.dataset.editingKey;
    EditorDrafts.clear(options.key);
    options.refresh();
    root.querySelector<HTMLElement>(".fpb-world-edit")?.focus();
  });
  const save = button("변경 적용", () => form.requestSubmit(), "primary");
  footer.append(back, status, focus, cancel, save);
  root.replaceChildren(body, footer);
  function setEditing(editing: boolean) {
    if (editing) root.dataset.editingKey = options.key;
    else delete root.dataset.editingKey;
    root.dataset.editing = String(editing);
    form.hidden = !editing;
    summary.hidden = editing;
    edit.hidden = editing;
    cancel.hidden = save.hidden = !editing;
    status.textContent = t(editing ? "저장하지 않은 변경 사항" : "변경 사항 없음");
    if (editing) form.querySelector<HTMLElement>("input:not([type=hidden]), select, textarea")?.focus();
  }
  // Runs before the original form handler re-renders the successful result.
  form.addEventListener("submit", () => delete root.dataset.editingKey, { capture: true });
  setEditing(wasEditing || Boolean(EditorDrafts.read(options.key)));
}

interface WorkspaceControls {
  history: HTMLFormElement;
  edition: HTMLLabelElement;
  headquarters: HTMLElement;
}

export function mountWorldWorkspace(dialog: HTMLDialogElement, controls: WorkspaceControls): void {
  const get = <T extends HTMLElement>(id: string) => dialog.querySelector<T>(`#${id}`)!;
  const aside = get<HTMLElement>("fpb-filter-country").closest<HTMLElement>("aside")!;
  const heading = node("div", "", "fpb-world-filter-heading");
  heading.append(
    node("h3", t("탐색 범위")),
    button("초기화", () => {
      for (const level of ["country", "region", "fief", "village"])
        get<HTMLSelectElement>(`fpb-filter-${level}`).value = "";
      get<HTMLSelectElement>("fpb-filter-country").dispatchEvent(new Event("change"));
    })
  );
  aside.prepend(heading);
  const mapControls = node("div", "", "fpb-world-map-controls");
  const mapFocus = get<HTMLButtonElement>("fpb-unit-focus");
  mapFocus.title = mapFocus.ariaLabel = t("지도에서 보기");
  const mapLevel = get("fpb-admin-level").closest("label")!;
  mapLevel.before(mapControls);
  mapControls.append(mapLevel, mapFocus);
  const sources = node("div");
  sources.hidden = true;
  sources.id = "fpb-world-setting-sources";
  dialog.append(sources);
  sources.append(get("fpb-country-archetype").closest("label")!, controls.history, controls.edition);
  controls.headquarters.classList.add("fpb-world-headquarters-switch");
  aside.insertBefore(controls.headquarters, aside.querySelector("a"));
  dialog.querySelector<HTMLElement>(".fpb-heritage-options")!.hidden = true;

  const settings = node("dialog", "", "fpb-world-settings");
  settings.id = "fpb-world-settings";
  settings.setAttribute("aria-labelledby", "fpb-world-settings-title");
  const header = node("header");
  const settingsTitle = node("h2", t("세계 설정"));
  settingsTitle.id = "fpb-world-settings-title";
  const close = () => settings.close();
  header.append(settingsTitle, button("닫기", close));
  const settingsForm = node("form");
  settingsForm.id = "fpb-world-settings-form";
  const fields = node("div", "", "fpb-world-settings-fields");
  fields.append(node("h3", t("국가 설정")));
  const staged: Record<string, HTMLInputElement | HTMLSelectElement> = {};
  for (const [id, sourceId, label] of [
    ["archetype", "fpb-country-archetype", "국가 성향"],
    ["age", "fpb-history-age", "건국 경과 (년)"],
    ["edition", "fpb-item-edition", "자동 생성 판본"]
  ]) {
    const source = get<HTMLInputElement | HTMLSelectElement>(sourceId);
    const control = source.cloneNode(true) as typeof source;
    control.id = `fpb-settings-${id}`;
    control.removeAttribute("name");
    const wrapper = node("label", t(label));
    wrapper.append(control);
    fields.append(wrapper);
    staged[id] = control;
  }
  fields.append(node("p", t("판본을 바꿔도 직접 편집한 보물과 작성 중인 초안은 유지됩니다.")));
  const management = node("section", "", "fpb-world-management");
  management.append(node("h3", t("관리 작업")), get("fpb-npc-regenerate"), get("fpb-korean-names"));
  const rebalance = button("티어 재분배", () => window.dispatchEvent(new Event("world:rebalance")));
  management.append(rebalance);
  fields.append(management);
  const attribution = aside.querySelector("a");
  if (attribution) fields.append(attribution);
  const footer = node("footer");
  const apply = node("button", t("설정 적용"), "primary");
  apply.type = "submit";
  footer.append(button("취소", close), apply);
  settingsForm.append(fields, footer);
  settings.append(header, settingsForm);
  dialog.append(settings);
  settingsForm.onsubmit = event => {
    event.preventDefault();
    if (!settingsForm.reportValidity()) return;
    const planned = Object.fromEntries(Object.entries(staged).map(([k, v]) => [k, v.value]));
    const edition = get<HTMLSelectElement>("fpb-item-edition");
    if (planned.edition !== edition.value) {
      edition.value = planned.edition;
      edition.dispatchEvent(new Event("change"));
      if (edition.value !== planned.edition) return;
    }
    const archetype = get<HTMLSelectElement>("fpb-country-archetype");
    if (!archetype.disabled && archetype.value !== planned.archetype) {
      archetype.value = planned.archetype;
      archetype.dispatchEvent(new Event("change"));
    }
    const age = get<HTMLInputElement>("fpb-history-age");
    if (!age.disabled && age.value !== planned.age) {
      age.value = planned.age;
      controls.history.requestSubmit();
    }
    close();
  };
  const openSettings = button(
    "세계 설정",
    () => {
      for (const [id, sourceId] of [
        ["archetype", "fpb-country-archetype"],
        ["age", "fpb-history-age"],
        ["edition", "fpb-item-edition"]
      ]) {
        const source = get<HTMLInputElement | HTMLSelectElement>(sourceId);
        staged[id].value = source.value;
        staged[id].disabled = source.disabled;
      }
      settings.showModal();
    },
    "fpb-world-settings-open"
  );
  aside.insertBefore(openSettings, aside.querySelector("a"));
  const main = dialog.querySelector<HTMLElement>(".fpb-npc-main")!;
  const scope = button(
    "탐색 범위",
    () => {
      const open = dialog.dataset.filtersOpen !== "true";
      dialog.dataset.filtersOpen = String(open);
      scope.setAttribute("aria-expanded", String(open));
      if (open) get("fpb-filter-country").focus();
    },
    "fpb-world-mobile-scope"
  );
  scope.id = "fpb-world-mobile-scope";
  scope.setAttribute("aria-expanded", "false");
  scope.setAttribute("aria-controls", "fpb-world-filter-panel");
  aside.id = "fpb-world-filter-panel";
  main.insertBefore(scope, main.children[1]);
  for (const id of ["fpb-npc-export", "fpb-heritage-export"]) get(id).textContent = t("데이터 내보내기");
  for (const kind of ["npcs", "treasures", "religions"]) {
    const count = node("small");
    count.id = `fpb-tab-count-${kind}`;
    get(`fpb-tab-${kind}`).append(count);
  }
  for (const [kind, countId, listId] of [
    ["npc", "fpb-npc-count", "fpb-npc-list"],
    ["heritage", "fpb-heritage-count", "fpb-heritage-list"]
  ]) {
    const list = get<HTMLElement>(listId);
    const bar = node("div", "", "fpb-world-list-heading");
    const sort = node("select");
    sort.id = `fpb-${kind}-sort`;
    sort.setAttribute("aria-label", t("목록 정렬"));
    sort.append(new Option(t("기본순"), "default"), new Option(t("이름순"), "name"));
    sort.onchange = () =>
      get<HTMLInputElement>(kind === "npc" ? "fpb-npc-search" : "fpb-heritage-search").dispatchEvent(
        new Event("input")
      );
    bar.append(get(countId), sort);
    list.before(bar);
  }
  const back = button("‹ 목록", () => delete dialog.dataset.mobileDetail, "fpb-world-mobile-back");
  dialog.querySelector(".fpb-world-header")!.prepend(back);
}
