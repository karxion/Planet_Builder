import { MAGIC_ITEM_SOURCES, optionKey } from "@/data/magic-item-references";
import { ALIGNMENTS, DEITY_RANKS, ITEM_RARITIES } from "@/data/realm-heritage";
import { isRealmHeritage } from "@/data/realm-heritage-validation";
import { belongsTo } from "@/generators/campaign-generator";
import { eligibleItemReferences, referencePowerSummary } from "@/generators/magic-item-generator";
import { EditorDrafts } from "@/services/editor-drafts";
import { t } from "@/services/ui-language";
import type { CampaignWorld } from "@/types/campaign-world";
import type { ItemReferenceEdition } from "@/types/magic-item-reference";
import type { RealmReligion, RealmTreasure } from "@/types/realm-heritage";
import { appendItemReferenceFields } from "./item-reference-fields";
import { mountWorldDetail, showWorldRecord } from "./world-workspace";

export type HeritageView = "treasures" | "religions";
interface HeritagePanelContext {
  world: () => CampaignWorld | undefined;
  changed: () => void;
  focus: (unitId: string) => void;
  historyChanged: (stateId: number, age: number) => void;
  referenceEditionChanged: (edition: ItemReferenceEdition) => void;
}

const node = <K extends keyof HTMLElementTagNameMap>(tag: K, text?: string) => {
  const element = document.createElement(tag);
  if (text) element.textContent = t(text);
  return element;
};

export function createHeritagePanel(host: HTMLElement, context: HeritagePanelContext) {
  host.innerHTML = `<div class="fpb-npc-toolbar"><input type="search" id="fpb-heritage-search" aria-label="보물·종교 검색" placeholder="보물·종교 검색"><span id="fpb-heritage-count" role="status"></span><button type="button" id="fpb-heritage-export" class="icon-download" aria-label="세계관 JSON 내보내기" title="세계관 JSON 내보내기"></button></div>
    <div class="fpb-heritage-options"><form id="fpb-history-form"><label>건국 경과 (년)<input id="fpb-history-age" name="age" type="number" min="0" max="10000" step="1" required disabled></label><button type="submit" class="icon-ok" title="역사 저장" aria-label="역사 저장" disabled></button></form><label class="fpb-headquarters-toggle"><input id="fpb-show-headquarters" type="checkbox">총본산 지도 표시</label></div>
    <div class="fpb-npc-columns"><section class="fpb-npc-results"><div id="fpb-heritage-list"></div><nav class="fpb-npc-pagination"><button id="fpb-heritage-prev" type="button" class="icon-left-open" title="이전 페이지" aria-label="이전 페이지"></button><span id="fpb-heritage-page"></span><button id="fpb-heritage-next" type="button" class="icon-right-open" title="다음 페이지" aria-label="다음 페이지"></button></nav></section><section id="fpb-heritage-detail"></section></div>`;
  const get = <T extends HTMLElement = HTMLElement>(id: string) =>
    (host.querySelector<T>(`#${id}`) || document.getElementById(id)) as T;
  let view: HeritageView = "treasures";
  let scope = "";
  let selected = "";
  let page = 0;
  let visible: (RealmTreasure | RealmReligion)[] = [];
  const search = get<HTMLInputElement>("fpb-heritage-search");
  const age = get<HTMLInputElement>("fpb-history-age");
  const show = get<HTMLInputElement>("fpb-show-headquarters");
  const headquartersHint = node(
    "p",
    "지도를 확대하면 총본산 배지가 나타납니다. 선택하면 소재지와 교단 목록을 볼 수 있습니다."
  );
  headquartersHint.className = "fpb-headquarters-hint";
  host.querySelector(".fpb-heritage-options")!.append(headquartersHint);
  const editionLabel = node("label", "자동 생성 판본");
  const edition = node("select");
  edition.id = "fpb-item-edition";
  for (const value of ["mixed", "2014", "2024"])
    edition.add(new Option(value === "mixed" ? "2014 + 2024" : value, value));
  editionLabel.append(edition);
  host.querySelector(".fpb-heritage-options")!.append(editionLabel);
  edition.onchange = () => {
    if (!confirm(t("자동 생성 보물의 참고 판본을 변경할까요? 적용한 수동 편집과 적용 전 초안은 유지됩니다."))) {
      edition.value = context.world()?.heritage?.itemReferenceEdition || "mixed";
      return;
    }
    context.referenceEditionChanged(edition.value as ItemReferenceEdition);
    render(view, scope, selected);
  };

  function selectedCountry() {
    return context.world()?.units.find(unit => unit.id === scope)?.stateId;
  }

  function records() {
    const world = context.world();
    if (!world?.heritage) return [];
    const unit = world.units.find(unit => unit.id === scope);
    const query = search.value.trim().toLocaleLowerCase();
    const all = view === "treasures" ? world.heritage.treasures : world.heritage.religions;
    const filtered = all.filter(record => {
      let matches = !unit || record.stateId === unit.stateId;
      if (unit && unit.level !== "country") {
        const location = "headquartersId" in record ? record.headquartersId : record.settlementId;
        if (location) matches &&= belongsTo(location, scope, world.units);
      }
      return (
        matches &&
        Object.values(record)
          .filter(value => typeof value === "string")
          .join(" ")
          .toLocaleLowerCase()
          .includes(query)
      );
    });
    return get<HTMLSelectElement>("fpb-heritage-sort")?.value === "name"
      ? filtered.sort((a, b) => a.name.localeCompare(b.name))
      : filtered;
  }

  function field(
    form: HTMLFormElement,
    label: string,
    name: string,
    value: string,
    options?: Record<string, string>,
    multiline = false
  ) {
    const wrapper = node("label", label);
    const control = options ? node("select") : multiline ? node("textarea") : node("input");
    control.name = name;
    if (control instanceof HTMLSelectElement) {
      for (const [key, label] of Object.entries(options!)) control.add(new Option(t(label), key));
    } else {
      control.maxLength = multiline ? 4000 : 200;
      control.required = name !== "notes";
      if (control instanceof HTMLTextAreaElement) control.rows = 3;
    }
    control.value = value;
    wrapper.append(control);
    form.append(wrapper);
  }

  function readDraft(
    record: RealmTreasure | RealmReligion,
    values?: Record<string, string>
  ): RealmTreasure | RealmReligion {
    const form = host.querySelector<HTMLFormElement>("#fpb-heritage-form");
    if (!values && (!form || form.dataset.record !== record.id)) return { ...record };
    const draft = { ...record };
    const data = values ? new Map(Object.entries(values)) : new FormData(form!);
    for (const [key, value] of data)
      if (key in draft && typeof value === "string") Object.assign(draft, { [key]: value.trim() });
    if ("rarity" in draft && data.has("referenceId")) {
      const selected = String(data.get("referenceId") || "");
      if (!selected) delete draft.design;
      else {
        const option = eligibleItemReferences(
          draft.rarity,
          String(data.get("referenceEdition")) as ItemReferenceEdition
        ).find(option => optionKey(option) === selected);
        if (option)
          draft.design = {
            version: 1,
            referenceId: option.reference.id,
            edition: option.reference.edition,
            method: draft.power === referencePowerSummary(option) ? "reskin" : "inspired",
            ...(option.variant ? { variant: option.variant } : {})
          };
      }
    }
    return draft;
  }

  function detail(record?: RealmTreasure | RealmReligion, draft?: RealmTreasure | RealmReligion) {
    const root = get("fpb-heritage-detail");
    root.replaceChildren();
    if (!record) {
      root.append(node("p", "조건에 맞는 기록이 없습니다."));
      return;
    }
    const key = `heritage:${record.id}`;
    const values = EditorDrafts.read(key);
    const value = draft || (values ? readDraft(record, values) : record);
    const form = node("form");
    form.id = "fpb-heritage-form";
    form.dataset.record = record.id;
    form.append(node("h3", value.name));
    field(form, "이름", "name", value.name);
    let location: string;
    if ("rarity" in value) {
      const owner = context.world()?.units.find(unit => unit.id === (value.settlementId || `country:${value.stateId}`));
      form.append(
        node(
          "p",
          `${t(value.ownerType === "country" ? "국가 보물" : "도시 상징품")} · ${owner?.name || t("소속 없음")}`
        )
      );
      field(
        form,
        "희귀도",
        "rarity",
        value.rarity,
        value.ownerType === "country"
          ? { veryRare: ITEM_RARITIES.veryRare, legendary: ITEM_RARITIES.legendary }
          : ITEM_RARITIES
      );
      if (value.unique) form.append(node("p", "유니크 · 상징적 유일성"));
      for (const [key, label] of [
        ["symbolism", "상징성"],
        ["rpEffect", "RP 영향"],
        ["power", "효능 개요"],
        ["history", "유래"],
        ["notes", "GM 메모"]
      ] as const)
        field(form, label, key, value[key], undefined, true);
      appendItemReferenceFields(form, value, context.world()!.heritage?.itemReferenceEdition || "mixed");
      form.append(node("p", "창작 아이템 · 희귀도는 성능 범위이며 RP 효과는 GM이 판정합니다."));
      location = value.settlementId || `country:${value.stateId}`;
    } else {
      field(form, "종교 상징", "symbol", value.symbol, undefined, true);
      field(form, "성향", "alignment", value.alignment, ALIGNMENTS);
      field(form, "신격 이름", "deityName", value.deityName);
      field(form, "신격 등급", "deityRank", value.deityRank, DEITY_RANKS);
      field(form, "교리", "doctrine", value.doctrine, undefined, true);
      const units = context
        .world()!
        .units.filter(unit => (unit.level === "village" || unit.level === "country") && unit.stateId === value.stateId);
      const locations = Object.fromEntries(
        units.map(unit => [unit.id, unit.level === "country" ? `${unit.name} (${t("국가 중심")})` : unit.name])
      );
      if (!(value.headquartersId in locations)) locations[value.headquartersId] = t("위치 없음 · 재지정 필요");
      field(form, "총본산", "headquartersId", value.headquartersId, locations);
      field(form, "GM 메모", "notes", value.notes, undefined, true);
      location = value.headquartersId;
    }
    const actions = node("div");
    actions.className = "fpb-npc-edit-actions";
    const save = node("button", "변경 적용");
    save.type = "submit";
    save.className = "primary";
    const focus = node("button");
    focus.type = "button";
    focus.className = "icon-target";
    focus.title = t("지도에서 보기");
    focus.setAttribute("aria-label", t("지도에서 보기"));
    focus.disabled = !context.world()?.units.some(unit => unit.id === location);
    focus.onclick = () => context.focus(location);
    const status = node("span");
    status.setAttribute("role", "status");
    actions.append(save, focus, status);
    form.append(actions);
    form.onsubmit = event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const candidate = { ...readDraft(record), edited: true };
      const heritage = context.world()!.heritage!;
      const valid = isRealmHeritage({
        ...heritage,
        treasures:
          "rarity" in candidate
            ? heritage.treasures.map(item => (item.id === candidate.id ? candidate : item))
            : heritage.treasures,
        religions:
          "deityName" in candidate
            ? heritage.religions.map(item => (item.id === candidate.id ? candidate : item))
            : heritage.religions
      });
      if (!valid) {
        status.textContent = t("올바른 값을 입력하세요.");
        return;
      }
      Object.assign(record, candidate);
      EditorDrafts.clear(key);
      context.changed();
      render(view, scope);
      get("fpb-heritage-detail").querySelector(".fpb-world-detail-status")!.textContent = t("프로젝트에 적용됨");
    };
    root.append(form);
    EditorDrafts.bind(form, key, () => render(view, scope, selected), !draft);
    const world = context.world()!;
    const place = world.units.find(unit => unit.id === location);
    const country = world.units.find(unit => unit.level === "country" && unit.stateId === value.stateId);
    mountWorldDetail(root, {
      key,
      name: value.name,
      location: [country?.name, place?.id !== country?.id ? place?.name : ""].filter(Boolean).join(" / "),
      badge:
        "rarity" in value
          ? t(ITEM_RARITIES[value.rarity])
          : `${t(DEITY_RANKS[value.deityRank])} · ${t(ALIGNMENTS[value.alignment])}`,
      sections:
        "rarity" in value
          ? [
              {
                title: "보물 정보",
                fields: [
                  ["소재지", place?.name || ""],
                  ["상징성", value.symbolism]
                ]
              },
              {
                title: "전승과 특징",
                fields: [
                  ["RP 영향", value.rpEffect],
                  ["효능 개요", value.power],
                  ["유래", value.history],
                  ["GM 메모", value.notes]
                ]
              },
              {
                title: "규칙·출전",
                fields: [
                  ["참고 판본", value.design?.edition || t("세계관 창작 기록")],
                  ["규칙 안내", t("창작 아이템 · 희귀도는 성능 범위이며 RP 효과는 GM이 판정합니다.")]
                ]
              }
            ]
          : [
              {
                title: "신앙과 상징",
                fields: [
                  ["신앙 대상", value.deityName],
                  ["성향", t(ALIGNMENTS[value.alignment])],
                  ["종교 상징", value.symbol]
                ]
              },
              { title: "총본산", fields: [["소재지", place?.name || t("위치 없음 · 재지정 필요")]] },
              {
                title: "교단 기록",
                fields: [
                  ["교리", value.doctrine],
                  ["GM 메모", value.notes]
                ]
              }
            ],
      focus: () => context.focus(location),
      canFocus: Boolean(place),
      refresh: () => render(view, scope, selected)
    });
  }

  function render(nextView: HeritageView, nextScope: string, selectId?: string) {
    if (nextView !== view || nextScope !== scope) {
      page = 0;
      selected = "";
    }
    view = nextView;
    scope = nextScope;
    visible = records();
    for (const kind of ["treasures", "religions"] as const) {
      const counter = document.getElementById(`fpb-tab-count-${kind}`);
      if (counter) counter.textContent = ` ${context.world()?.heritage?.[kind].length || 0}`;
    }
    if (selectId) {
      const index = visible.findIndex(record => record.id === selectId);
      if (index >= 0) {
        selected = selectId;
        page = Math.floor(index / 30);
      }
    }
    page = Math.max(0, Math.min(page, Math.ceil(visible.length / 30) - 1));
    const shown = visible.slice(page * 30, (page + 1) * 30);
    if (!shown.some(record => record.id === selected)) selected = shown[0]?.id || "";
    const list = get("fpb-heritage-list");
    list.replaceChildren();
    for (const record of shown) {
      const button = node("button");
      button.type = "button";
      button.className = `fpb-npc-row ${record.id === selected ? "selected" : ""}`;
      button.dataset.record = record.id;
      const name = node("strong", record.name);
      name.setAttribute("data-i18n-skip", "");
      button.append(name);
      if ("rarity" in record)
        button.append(
          node(
            "span",
            `${t(record.ownerType === "country" ? "국가 보물" : "도시 상징품")} · ${t(ITEM_RARITIES[record.rarity])}${record.unique ? ` · ${t("유니크")}` : ""}`
          ),
          node("small", record.symbolism)
        );
      else
        button.append(
          node("span", `${t(ALIGNMENTS[record.alignment])} · ${t(DEITY_RANKS[record.deityRank])}`),
          node("small", record.deityName),
          node("small", record.symbol)
        );
      button.onclick = () => {
        selected = record.id;
        render(view, scope, selected);
        showWorldRecord(get("fpb-heritage-detail"));
      };
      list.append(button);
    }
    get("fpb-heritage-count").textContent = String(visible.length);
    get("fpb-heritage-page").textContent = `${page + 1} / ${Math.max(1, Math.ceil(visible.length / 30))}`;
    get<HTMLButtonElement>("fpb-heritage-prev").disabled = page === 0;
    get<HTMLButtonElement>("fpb-heritage-next").disabled = (page + 1) * 30 >= visible.length;
    const nation = context.world()?.heritage?.nations.find(nation => nation.stateId === selectedCountry());
    age.disabled = !nation;
    get<HTMLButtonElement>("fpb-history-form").querySelector("button")!.disabled = !nation;
    age.value = nation ? String(nation.ageYears) : "";
    const historyForm = get<HTMLFormElement>("fpb-history-form");
    const historyKey = `history:${nation?.stateId || "none"}`;
    historyForm.onsubmit = event => {
      event.preventDefault();
      const value = Number(age.value);
      if (!nation || !historyForm.reportValidity() || !Number.isInteger(value)) return;
      context.historyChanged(nation.stateId, value);
      EditorDrafts.clear(historyKey);
      render(view, scope, selected);
    };
    EditorDrafts.bind(historyForm, historyKey, () => render(view, scope, selected));
    show.checked = context.world()?.heritage?.showHeadquarters ?? true;
    edition.value = context.world()?.heritage?.itemReferenceEdition || "mixed";
    editionLabel.hidden = false;
    show.closest("label")!.hidden = false;
    headquartersHint.hidden = view !== "religions";
    detail(shown.find(record => record.id === selected));
  }

  search.oninput = () => {
    page = 0;
    render(view, scope);
  };
  get("fpb-heritage-prev").onclick = () => {
    page--;
    render(view, scope);
  };
  get("fpb-heritage-next").onclick = () => {
    page++;
    render(view, scope);
  };
  show.onchange = () => {
    const heritage = context.world()?.heritage;
    if (!heritage) return;
    heritage.showHeadquarters = show.checked;
    context.changed();
  };
  get("fpb-heritage-export").onclick = () => {
    const world = context.world();
    if (!world) return;
    const url = URL.createObjectURL(
      new Blob(
        [
          JSON.stringify(
            {
              format: "fpb-realm-heritage",
              seed: world.seed,
              nations: world.heritage?.nations,
              records: visible,
              kind: view,
              itemReferenceEdition: world.heritage?.itemReferenceEdition || "mixed",
              itemSources: MAGIC_ITEM_SOURCES,
              rules:
                "FPB original setting lore; item mechanics reference CC BY 4.0 SRD 5.1 / 5.2.1. See legal/srd.html. Not official D&D stat blocks."
            },
            null,
            2
          )
        ],
        { type: "application/json" }
      )
    );
    const link = node("a");
    link.href = url;
    link.download = `realm-${view}.json`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 5000);
  };
  return {
    render,
    controls: {
      history: get<HTMLFormElement>("fpb-history-form"),
      edition: editionLabel,
      headquarters: show.closest<HTMLElement>("label")!
    }
  };
}
