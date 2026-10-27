import { isNpcProgression } from "@/data/campaign-validation";
import { COMMONER_CR_PROFILES, COUNTRY_ARCHETYPES, NPC_CLASSES, NPC_RANKS, NPC_SCOPES } from "@/data/npc-progression";
import { abilityModifier, NPC_STAT_BLOCKS, SRD_URL } from "@/data/npc-stat-blocks";
import { removeLegacyDivisions } from "@/generators/administration-policy";
import {
  type AdministrativeSnapshot,
  belongsTo,
  buildAdministration,
  createCampaign,
  generateVillageNpcs,
  regenerateCampaignNpcs,
  remainingNpcContexts,
  synchronizeNpcPlaceNames,
  updateNpcProgressions
} from "@/generators/campaign-generator";
import { koreanizeWorldNames } from "@/generators/korean-world-names";
import { applyItemReference, chooseItemReference, designOption } from "@/generators/magic-item-generator";
import { inferCountryArchetype, npcCombatProfile, npcCommonerProfile, npcTier } from "@/generators/npc-progression";
import { rebalanceCampaignNpcs } from "@/generators/npc-rebalance";
import { synchronizeHeritage } from "@/generators/realm-heritage";
import { drawAdministration } from "@/renderers/administration-renderer";
import { drawReligionHeadquarters } from "@/renderers/religion-headquarters";
import { EditorDrafts } from "@/services/editor-drafts";
import { t } from "@/services/ui-language";
import type {
  AdministrationLevel,
  CampaignWorld,
  CommonerCr,
  CountryArchetype,
  NpcClassId,
  NpcRank,
  NpcScope,
  NpcTemplateId,
  WorldNpc
} from "@/types/campaign-world";
import { createHeadquartersDetails } from "./headquarters-details";
import { mountNpcPortrait } from "./npc-portrait";
import { createHeritagePanel, type HeritageView } from "./realm-heritage";
import { createRulesReferences } from "./rules-references";
import { mountWorldDetail, mountWorldWorkspace, showWorldRecord } from "./world-workspace";
import { geographyFromTerrain } from "@/generators/unique-item-bonuses";

let campaign: CampaignWorld | undefined;
let selectedNpc = "";
let mapLevel: AdministrationLevel = "country";
let page = 0;
let worldView: "npcs" | HeritageView = "npcs";
let heritagePanel: ReturnType<typeof createHeritagePanel>;
let headquartersPanel: ReturnType<typeof createHeadquartersDetails> | undefined;
const levels: AdministrationLevel[] = ["country", "region", "fief", "village"];
const labels = { country: "국가", region: "지역", fief: "영지", village: "마을" };
const el = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const escapeHtml = (value: string) => {
  const span = document.createElement("span");
  span.textContent = value;
  return span.innerHTML.replaceAll('"', "&quot;");
};
const changed = () => window.dispatchEvent(new Event("project:changed"));
const tierText = (level: number, compact = false): string => {
  const tier = npcTier(level);
  return tier === "epic" ? t("에픽") : compact ? `T${tier}` : `${t("티어")} ${tier}`;
};

function snapshot(): AdministrativeSnapshot {
  const geography = (cell: number) =>
    !Number.isFinite(pack.cells.h?.[cell])
      ? ("unknown" as const)
      : geographyFromTerrain(
          pack.cells.h[cell],
          pack.cells.biome?.[cell] || 0,
          Boolean(pack.cells.c?.[cell]?.some(neighbor => pack.cells.h[neighbor] < 20))
        );
  const villages = pack.burgs
    .filter(b => b.i && !b.removed)
    .map(b => ({
      id: b.i,
      name: b.name || `마을 ${b.i}`,
      stateId: b.state || 0,
      fiefId: pack.cells.province[b.cell] || 0,
      x: b.x,
      y: b.y,
      capital: Boolean(b.capital),
      port: Boolean(b.port),
      geography: geography(b.cell),
      population: b.population,
      continentId: pack.features[pack.cells.f[b.cell]]?.group === "continent" ? pack.cells.f[b.cell] : undefined
    }));
  const adjacent = new Map<number, Set<number>>();
  const areas = new Map<number, number>();
  for (const cell of pack.cells.i) {
    if (pack.cells.h[cell] >= 20) {
      const state = pack.cells.state[cell];
      areas.set(state, (areas.get(state) || 0) + (pack.cells.area[cell] || 1));
    }
    const a = pack.cells.province[cell];
    if (!a) continue;
    if (!adjacent.has(a)) adjacent.set(a, new Set());
    for (const neighbor of pack.cells.c[cell]) {
      const b = pack.cells.province[neighbor];
      if (b && a !== b && pack.cells.state[cell] === pack.cells.state[neighbor]) adjacent.get(a)!.add(b);
    }
  }
  return {
    villages,
    states: pack.states
      .filter(s => s && !s.removed && (s.i || villages.some(v => v.stateId === 0)))
      .map(s => {
        const [x, y] = pack.cells.p[s.center] || [graphWidth / 2, graphHeight / 2];
        return {
          id: s.i,
          name: s.i ? s.fullName || s.name : "무소속",
          x,
          y,
          government: `${s.form || ""} ${s.formName || ""} ${s.fullName || ""}`,
          geography: geography(s.center),
          area: areas.get(s.i) ?? s.area ?? 0
        };
      }),
    fiefs: pack.provinces
      .filter(p => p?.i && !p.removed)
      .map(p => {
        const [x, y] = pack.cells.p[p.center] || [0, 0];
        return { id: p.i, stateId: p.state, name: `${p.name} 영지`, x, y, neighbors: [...(adjacent.get(p.i) || [])] };
      })
  };
}

function refresh(): void {
  if (!pack.burgs?.length || !pack.states?.length) return;
  const removedMarkers = new Set(removeLegacyDivisions(pack));
  notes = notes.filter(note => !removedMarkers.has(note.id));
  removedMarkers.forEach(id => void el(id)?.remove());
  for (const unit of options.military || []) {
    delete unit.cultures;
    delete unit.religions;
  }
  const input = snapshot();
  let referencesChanged = false;
  if (!campaign) campaign = createCampaign(input, String(seed));
  else {
    const synchronized = synchronizeNpcPlaceNames(campaign.npcs, campaign.units, input.villages);
    referencesChanged = synchronized.some((npc, index) => npc !== campaign!.npcs[index]);
    campaign.npcs = synchronized;
    const oldVillages = new Set(campaign.units.filter(u => u.level === "village").map(u => u.sourceId));
    campaign.units = buildAdministration(input);
    const contexts = remainingNpcContexts(input, campaign);
    campaign.npcs.push(
      ...input.villages
        .filter(v => !oldVillages.has(v.id))
        .flatMap(v => generateVillageNpcs(campaign!.seed, v, campaign!.generation, contexts.get(v.id)))
    );
    referencesChanged = updateNpcProgressions(campaign, input) || referencesChanged;
  }
  referencesChanged = synchronizeHeritage(campaign, input) || referencesChanged;
  removeObsoleteUi();
  drawAdministration(campaign.units, mapLevel);
  drawReligionHeadquarters(campaign, { width: graphWidth, height: graphHeight });
  if (referencesChanged) changed();
}

function reset(): void {
  headquartersPanel?.close(false);
  EditorDrafts.clear();
  campaign = undefined;
  selectedNpc = "";
  mapLevel = "country";
  const renamed = applyKoreanNames();
  refresh();
  applyClassification();
  if (el<HTMLDialogElement>("fpb-world-dialog")?.open) renderFilters();
  if (renamed) changed();
}

function applyKoreanNames(): boolean {
  if (!pack.burgs?.length || !pack.states?.length || !koreanizeWorldNames(pack, String(seed))) return false;
  for (const burg of pack.burgs) {
    const label = el(`burgLabel${burg.i}`);
    if (label && burg.name) label.textContent = burg.name;
  }
  for (const province of pack.provinces) {
    const label = el(`provinceLabel${province.i}`);
    if (label && province.name) label.textContent = province.name;
  }
  drawStateLabels();
  return true;
}

function applyClassification(): void {
  if (!campaign) return;
  campaign.mapLevel = mapLevel;
  el<HTMLSelectElement>("fpb-admin-level").value = mapLevel;
  if (layerIsOn("toggleStates") !== (mapLevel === "country")) toggleStates();
  if (layerIsOn("toggleProvinces")) toggleProvinces();
  if (!layerIsOn("toggleBurgIcons")) toggleBurgIcons();
  if (!layerIsOn("toggleLabels")) toggleLabels();
  if (el("states")) el("states").style.display = mapLevel === "country" ? "" : "none";
  drawAdministration(campaign.units, mapLevel);
}

function removeObsoleteUi(): void {
  for (const id of ["cults", "relig", "zones"]) el(id)?.replaceChildren();
  for (const id of [
    "toggleCultures",
    "toggleReligions",
    "toggleZones",
    "editCulturesButton",
    "editReligions",
    "editZonesButton",
    "regenerateCultures",
    "regenerateReligions",
    "regenerateZones"
  ]) {
    const target = el(id);
    if (target) {
      target.hidden = true;
      target.setAttribute("aria-hidden", "true");
    }
  }
  for (const id of [
    "culturesInput",
    "culturesSet",
    "religionsNumber",
    "provinceCultureDisplay",
    "burgCulture",
    "burgsFilterCulture"
  ]) {
    const target = el(id);
    const row = target?.closest("tr");
    if (row) row.hidden = true;
    else if (target) {
      (target.closest("label") || target).hidden = true;
    }
  }
  document
    .querySelectorAll<HTMLOptionElement>(
      'option[value="cultural"], option[value="religions"], #styleElementSelect option[value="cults"], #styleElementSelect option[value="relig"], #styleElementSelect option[value="zones"]'
    )
    .forEach(option => void option.remove());
  document.querySelectorAll<HTMLElement>('#burgsHeader [data-sortby="culture"]').forEach(target => {
    target.hidden = true;
  });
  if (el("burgCulture")?.parentElement) el("burgCulture").parentElement!.hidden = true;
  for (const id of [
    "provinceCultureName",
    "burgTemple",
    "stateNameEditorShortCulture",
    "provinceNameEditorShortCulture",
    "lakeNameCulture",
    "battleNameCulture"
  ]) {
    if (el(id)) el(id).hidden = true;
  }
  for (const id of ["infoCulture", "infoReligion"]) {
    if (el(id)?.parentElement) el(id).parentElement!.hidden = true;
  }
  el("burgsHeader")?.style.setProperty("grid-template-columns", "9em 7em 7.5em 6.5em 8em 6.5em 6.5em 5.5em 6em");
  for (const [id, name] of Object.entries({
    toggleStates: "국가",
    toggleProvinces: "영지",
    overviewBurgsButton: "마을",
    editProvincesButton: "영지",
    editStatesButton: "국가"
  })) {
    if (el(id)) el(id).textContent = t(name);
  }
}

function init(): void {
  headquartersPanel = createHeadquartersDetails(() => campaign);
  window.addEventListener("realm:headquarters-selected", event => {
    const id = (event as CustomEvent<unknown>).detail;
    if (typeof id === "string") headquartersPanel?.open(id);
  });
  const button = document.createElement("button");
  button.id = "fpb-world-button";
  button.type = "button";
  button.title = "세계 분류 및 NPC";
  button.innerHTML = '<span class="icon-users" aria-hidden="true"></span>세계·NPC';
  document.querySelector(".fpb-actions")?.prepend(button);
  button.addEventListener("click", open);
  const dialog = document.createElement("dialog");
  dialog.id = "fpb-world-dialog";
  dialog.innerHTML = `<header class="fpb-world-header"><span class="fpb-world-crest icon-shield-alt" aria-hidden="true"></span><div><h2>세계와 NPC</h2><span id="fpb-world-summary"></span></div><select class="fpb-dialog-language" data-fpb-language data-fpb-preference aria-label="언어 / Language"><option value="ko">한국어</option><option value="en">English</option></select><button id="fpb-world-close" type="button" title="닫기" aria-label="닫기" class="fpb-icon-button icon-cancel"></button></header>
    <div class="fpb-world-layout"><aside class="fpb-world-filters">${levels.map(level => `<label>${labels[level]}<select id="fpb-filter-${level}"><option value="">전체</option></select></label>`).join("")}
    <label>지도 구획<select id="fpb-admin-level">${levels.map(level => `<option value="${level}">${labels[level]}</option>`).join("")}</select></label>
    <label>국가 성향<select id="fpb-country-archetype" disabled>${Object.entries(COUNTRY_ARCHETYPES)
      .map(([id, name]) => `<option value="${id}">${name}</option>`)
      .join("")}</select></label>
    <button id="fpb-unit-focus" type="button"><span class="icon-target" aria-hidden="true"></span>지도에서 보기</button>
    <button id="fpb-npc-regenerate" type="button"><span class="icon-cw" aria-hidden="true"></span>범위 내 NPC 재생성</button>
    <button id="fpb-korean-names" type="button"><span class="icon-cw" aria-hidden="true"></span>지명 한글화</button>
    <a href="legal/srd.html" target="_blank" rel="noopener">SRD 5.1 / 5.2.1 · CC BY 4.0</a></aside>
    <main class="fpb-npc-main"><div class="fpb-npc-toolbar"><input id="fpb-npc-search" type="search" aria-label="NPC 검색" placeholder="이름 또는 역할 검색"><span id="fpb-npc-count" role="status"></span><button id="fpb-npc-export" title="NPC 데이터 출력" aria-label="NPC 데이터 출력" class="icon-download" type="button">데이터 출력</button></div>
    <div class="fpb-npc-columns"><section class="fpb-npc-results" aria-label="NPC 목록"><div id="fpb-npc-list"></div><nav class="fpb-npc-pagination"><button id="fpb-npc-prev" type="button" class="icon-left-open" aria-label="이전 페이지" title="이전 페이지"></button><span id="fpb-npc-page"></span><button id="fpb-npc-next" type="button" class="icon-right-open" aria-label="다음 페이지" title="다음 페이지"></button></nav></section><section id="fpb-npc-detail" aria-label="NPC 상세"></section></div></main></div>`;
  document.body.append(dialog);
  const main = dialog.querySelector<HTMLElement>(".fpb-npc-main")!;
  const npcPanel = document.createElement("section");
  npcPanel.id = "fpb-npc-panel";
  npcPanel.append(...main.childNodes);
  const heritageHost = document.createElement("section");
  heritageHost.id = "fpb-heritage-panel";
  heritageHost.hidden = true;
  const tabs = document.createElement("nav");
  tabs.className = "fpb-world-tabs";
  tabs.setAttribute("role", "tablist");
  for (const [view, label, icon] of [
    ["npcs", "NPC", "users"],
    ["treasures", "보물", "star"],
    ["religions", "종교", "bank"]
  ] as const) {
    const tab = document.createElement("button");
    tab.id = `fpb-tab-${view}`;
    tab.type = "button";
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-controls", view === "npcs" ? npcPanel.id : heritageHost.id);
    tab.setAttribute("aria-selected", String(view === worldView));
    tab.innerHTML = `<span class="icon-${icon}" aria-hidden="true"></span>${label}`;
    tab.onclick = () => switchWorldView(view);
    tab.onkeydown = event => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const buttons = [...tabs.querySelectorAll<HTMLButtonElement>("button")];
      const index = buttons.indexOf(tab);
      const next =
        event.key === "Home" ? 0 : event.key === "End" ? 2 : (index + (event.key === "ArrowRight" ? 1 : 2)) % 3;
      buttons[next].click();
      buttons[next].focus();
    };
    tabs.append(tab);
  }
  main.append(tabs, npcPanel, heritageHost);
  npcPanel.setAttribute("role", "tabpanel");
  heritageHost.setAttribute("role", "tabpanel");
  heritagePanel = createHeritagePanel(heritageHost, {
    world: () => campaign,
    focus: focusUnit,
    changed: () => {
      headquartersPanel?.close(false);
      drawReligionHeadquarters(campaign, { width: graphWidth, height: graphHeight });
      changed();
    },
    historyChanged: (stateId, age) => {
      const nation = campaign?.heritage?.nations.find(nation => nation.stateId === stateId);
      if (!nation || !campaign) return;
      nation.ageYears = age;
      synchronizeHeritage(campaign, snapshot());
      drawReligionHeadquarters(campaign, { width: graphWidth, height: graphHeight });
      changed();
    },
    referenceEditionChanged: edition => {
      if (!campaign?.heritage) return;
      campaign.heritage.itemReferenceEdition = edition;
      const input = snapshot();
      for (const item of campaign.heritage.treasures) {
        if (item.edited) continue;
        const state = input.states.find(state => state.id === item.stateId);
        const archetype =
          campaign.npcProfiles?.find(profile => profile.stateId === item.stateId)?.archetype ||
          inferCountryArchetype(state?.government || "");
        const category = designOption(item)?.reference.category;
        applyItemReference(
          item,
          chooseItemReference(campaign.seed, item.id, item.rarity, edition, archetype, category)
        );
      }
      changed();
    }
  });
  mountWorldWorkspace(dialog, heritagePanel.controls);
  window.addEventListener("world:rebalance", () => Campaign.rebalance());
  window.addEventListener("map:icons-laid-out", () =>
    drawReligionHeadquarters(campaign, { width: graphWidth, height: graphHeight })
  );
  window.addEventListener("realm:religion-selected", event => {
    const id = (event as CustomEvent<unknown>).detail;
    if (typeof id !== "string" || !campaign?.heritage?.religions.some(religion => religion.id === id)) return;
    for (const level of levels) el<HTMLSelectElement>(`fpb-filter-${level}`).value = "";
    open();
    el<HTMLInputElement>("fpb-heritage-search").value = "";
    switchWorldView("religions", id);
    showWorldRecord(el("fpb-heritage-detail"));
  });
  el("fpb-world-close").onclick = () => dialog.close();
  for (const level of levels)
    el(`fpb-filter-${level}`).onchange = () => {
      for (const next of levels.slice(levels.indexOf(level) + 1))
        el<HTMLSelectElement>(`fpb-filter-${next}`).value = "";
      page = 0;
      renderFilters();
    };
  el("fpb-npc-search").oninput = () => {
    page = 0;
    renderNpcs();
  };
  el("fpb-npc-prev").onclick = () => {
    page--;
    renderNpcs();
  };
  el("fpb-npc-next").onclick = () => {
    page++;
    renderNpcs();
  };
  el("fpb-admin-level").onchange = () => {
    mapLevel = el<HTMLSelectElement>("fpb-admin-level").value as AdministrationLevel;
    applyClassification();
    changed();
  };
  el("fpb-unit-focus").onclick = () => focusUnit(selectedScope());
  el("fpb-npc-regenerate").onclick = regenerate;
  el("fpb-country-archetype").onchange = () => {
    if (!campaign) return;
    const country = campaign.units.find(unit => unit.id === el<HTMLSelectElement>("fpb-filter-country").value);
    if (!country) return;
    const archetype = el<HTMLSelectElement>("fpb-country-archetype").value as CountryArchetype;
    campaign.npcProfiles = [
      ...(campaign.npcProfiles || []).filter(profile => profile.stateId !== country.stateId),
      { stateId: country.stateId, archetype }
    ];
    const input = snapshot();
    updateNpcProgressions(
      campaign,
      { ...input, villages: input.villages.filter(village => village.stateId === country.stateId) },
      true
    );
    changed();
    renderNpcs();
  };
  el("fpb-npc-export").onclick = exportNpcs;
  el("fpb-korean-names").onclick = () => {
    if (!confirm(t("잠기지 않은 영어 지명을 새 한글 이름으로 바꿀까요? 한글 지명과 잠긴 항목은 유지됩니다."))) return;
    if (!applyKoreanNames()) return;
    refresh();
    renderFilters();
    changed();
  };
  window.addEventListener("map:generated", reset);
  window.addEventListener("map:loaded", reset);
  window.addEventListener("ui:language-changed", () => {
    const draft = collectNpcDraft();
    removeObsoleteUi();
    if (dialog.open) {
      renderFilters();
      if (draft) renderDetail(draft);
    }
  });
  // Block obsolete keyboard entry points as well as hidden buttons.
  window.addEventListener(
    "keydown",
    event => {
      const target = event.target as HTMLElement;
      if (target.closest("input, textarea, select, [contenteditable]")) return;
      if (event.shiftKey && !event.ctrlKey && !event.metaKey && ["c", "r", "z"].includes(event.key.toLowerCase())) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true
  );
  const renamed = applyKoreanNames();
  refresh();
  if (renamed) changed();
}

function open(): void {
  headquartersPanel?.close(false);
  refresh();
  renderFilters();
  el<HTMLDialogElement>("fpb-world-dialog").showModal();
}

function switchWorldView(view: "npcs" | HeritageView, selectedId?: string): void {
  worldView = view;
  el("fpb-npc-panel").hidden = view !== "npcs";
  el("fpb-heritage-panel").hidden = view === "npcs";
  el(view === "npcs" ? "fpb-npc-panel" : "fpb-heritage-panel").setAttribute("aria-labelledby", `fpb-tab-${view}`);
  delete el("fpb-world-dialog").dataset.mobileDetail;
  for (const name of ["npcs", "treasures", "religions"]) {
    const tab = el<HTMLButtonElement>(`fpb-tab-${name}`);
    tab.setAttribute("aria-selected", String(name === view));
    tab.tabIndex = name === view ? 0 : -1;
  }
  heritagePanel.render(view === "npcs" ? "treasures" : view, selectedScope(), selectedId);
  const scope = campaign?.units.find(unit => unit.id === selectedScope())?.name || t("전체 세계");
  el("fpb-world-mobile-scope").textContent = `${t("탐색 범위")} · ${scope}`;
}

function selectedScope(): string {
  return (
    [...levels]
      .reverse()
      .map(level => el<HTMLSelectElement>(`fpb-filter-${level}`).value)
      .find(Boolean) || ""
  );
}

function renderFilters(): void {
  if (!campaign) return;
  for (const [kind, count] of [
    ["npcs", campaign.npcs.length],
    ["treasures", campaign.heritage?.treasures.length || 0],
    ["religions", campaign.heritage?.religions.length || 0]
  ] as const)
    el(`fpb-tab-count-${kind}`).textContent = ` ${count}`;
  let parent = "";
  for (const level of levels) {
    const select = el<HTMLSelectElement>(`fpb-filter-${level}`);
    const previous = select.value;
    const units = campaign.units.filter(
      u => u.level === level && (!parent || belongsTo(u.id, parent, campaign!.units))
    );
    select.replaceChildren(new Option(t(`전체 ${labels[level]}`), ""), ...units.map(u => new Option(u.name, u.id)));
    if (units.some(u => u.id === previous)) select.value = previous;
    if (select.value) parent = select.value;
  }
  el("fpb-world-summary").textContent = levels
    .map(level => `${t(labels[level])} ${campaign!.units.filter(u => u.level === level).length}`)
    .join(" · ");
  const selectedCountry = campaign.units.find(unit => unit.id === el<HTMLSelectElement>("fpb-filter-country").value);
  const archetypeSelect = el<HTMLSelectElement>("fpb-country-archetype");
  archetypeSelect.disabled = !selectedCountry;
  const countryState = selectedCountry && snapshot().states.find(state => state.id === selectedCountry.stateId);
  archetypeSelect.value = selectedCountry
    ? campaign.npcProfiles?.find(profile => profile.stateId === selectedCountry.stateId)?.archetype ||
      inferCountryArchetype(countryState?.government || "")
    : "balanced";
  renderNpcs();
  switchWorldView(worldView);
}

function filteredNpcs(): WorldNpc[] {
  if (!campaign) return [];
  const scope = selectedScope();
  const villages = new Set(
    campaign.units
      .filter(u => u.level === "village" && (!scope || belongsTo(u.id, scope, campaign!.units)))
      .map(u => u.id)
  );
  const query = el<HTMLInputElement>("fpb-npc-search").value.trim().toLocaleLowerCase();
  const filtered = campaign.npcs.filter(
    npc =>
      (!scope || villages.has(npc.villageId)) &&
      `${npc.name} ${npc.role} ${npc.progression ? t(NPC_CLASSES[npc.progression.classId]) : ""}`
        .toLocaleLowerCase()
        .includes(query)
  );
  return el<HTMLSelectElement>("fpb-npc-sort")?.value === "name"
    ? filtered.sort((a, b) => a.name.localeCompare(b.name))
    : filtered;
}

function renderNpcs(): void {
  const npcs = filteredNpcs();
  const total = el("fpb-tab-count-npcs");
  if (total) total.textContent = ` ${campaign?.npcs.length || 0}`;
  page = Math.max(0, Math.min(page, Math.ceil(npcs.length / 30) - 1));
  const shown = npcs.slice(page * 30, (page + 1) * 30);
  el("fpb-npc-count").textContent = t("{count}명", { count: npcs.length });
  el("fpb-npc-page").textContent = `${page + 1} / ${Math.max(1, Math.ceil(npcs.length / 30))}`;
  el<HTMLButtonElement>("fpb-npc-prev").disabled = page === 0;
  el<HTMLButtonElement>("fpb-npc-next").disabled = (page + 1) * 30 >= npcs.length;
  if (!shown.some(npc => npc.id === selectedNpc)) selectedNpc = shown[0]?.id || "";
  el("fpb-npc-list").innerHTML =
    shown
      .map(
        npc =>
          `<button type="button" class="fpb-npc-row ${npc.id === selectedNpc ? "selected" : ""}" data-npc="${escapeHtml(npc.id)}"><strong data-i18n-skip>${escapeHtml(npc.name)}</strong><span><span data-i18n-skip>${escapeHtml(npc.role)}</span> · ${npc.progression ? (npc.progression.classId === "none" ? `${t("비모험가")} · CR ${npc.progression.commonerCr || "0"}` : `${t(NPC_CLASSES[npc.progression.classId])} Lv.${npc.progression.level} · ${tierText(npc.progression.level, true)}`) : `CR ${NPC_STAT_BLOCKS[npc.templateId].cr}`}${npc.edited ? ` · ${t("수정됨")}` : ""}</span><small data-i18n-skip>${escapeHtml(campaign!.units.find(u => u.id === npc.villageId)?.name || t("소속 마을 없음"))}</small></button>`
      )
      .join("") || '<p class="fpb-npc-empty">조건에 맞는 NPC가 없습니다.</p>';
  el("fpb-npc-list")
    .querySelectorAll<HTMLButtonElement>("[data-npc]")
    .forEach(button => {
      button.onclick = () => {
        selectedNpc = button.dataset.npc!;
        renderNpcs();
        showWorldRecord(el("fpb-npc-detail"));
      };
    });
  renderDetail();
}

function renderDetail(preview?: WorldNpc): void {
  const storedNpc = campaign?.npcs.find(n => n.id === selectedNpc);
  const key = `npc:${selectedNpc}`;
  const values = EditorDrafts.read(key);
  const npc = preview || (values && storedNpc ? collectNpcDraft(storedNpc, values) : storedNpc);
  if (!npc) {
    el("fpb-npc-detail").replaceChildren();
    return;
  }
  const stats = NPC_STAT_BLOCKS[npc.templateId];
  const validProgression = !npc.progression || isNpcProgression(npc.progression);
  const combat = validProgression ? npcCombatProfile(npc) : undefined;
  const commoner = validProgression ? npcCommonerProfile(npc) : undefined;
  const progression = npc.progression;
  const epic =
    validProgression &&
    progression?.classId !== "none" &&
    progression !== undefined &&
    npcTier(progression.level) === "epic";
  const choices = (items: Record<string, string>, selected: string) =>
    Object.entries(items)
      .map(([id, name]) => `<option value="${id}" ${id === selected ? "selected" : ""}>${t(name)}</option>`)
      .join("");
  const signed = (n: number) => (n < 0 ? String(n) : `+${n}`);
  el("fpb-npc-detail").innerHTML =
    `<form id="fpb-npc-form"><div class="fpb-npc-heading"><h3 data-i18n-skip>${escapeHtml(npc.name)}</h3><button id="fpb-npc-focus" class="icon-target" type="button" title="거주 마을 보기" aria-label="거주 마을 보기"></button></div>
    <label>이름<input name="name" value="${escapeHtml(npc.name)}" maxlength="80" required></label><label>역할<input name="role" value="${escapeHtml(npc.role)}" maxlength="80" required></label>
    ${
      progression
        ? `<label>직업<select name="classId">${choices(NPC_CLASSES, progression.classId)}</select></label>${
            progression.classId === "none"
              ? `<input name="level" type="hidden" value="1"><label>${t("도전 지수 (CR)")}<select name="commonerCr">${Object.keys(
                  COMMONER_CR_PROFILES
                )
                  .map(
                    cr =>
                      `<option value="${cr}" ${cr === (progression.commonerCr || "0") ? "selected" : ""}>CR ${cr}</option>`
                  )
                  .join("")}</select></label>`
              : `<label>레벨<input name="level" type="number" min="1" max="${Number.MAX_SAFE_INTEGER}" step="1" value="${progression.level}" required></label>`
          }<label>지위<select name="rank">${choices(NPC_RANKS, progression.rank)}</select></label><label>활동 범위<select name="scope">${choices(NPC_SCOPES, progression.scope)}</select></label><p>${!validProgression ? t("입력값 확인 필요") : progression.classId === "none" ? t("비모험가") : tierText(progression.level)} · ${t(COUNTRY_ARCHETYPES[progression.archetype])}</p>`
        : ""
    }
    ${commoner ? `<h4>${t("커머너 프로필")}</h4><div class="fpb-npc-stats"><span>CR <b>${commoner.cr}</b> · ${commoner.xp} XP</span><span>AC <b>${commoner.ac}</b></span><span>HP <b>${commoner.hp}</b></span><span>${t("명중")} +${commoner.attackBonus}</span><span>${t("근접 타격 피해")} ${commoner.damage}</span></div>${commoner.cr !== "0" ? `<p class="fpb-npc-rule">${t("앱 변형 커머너 · 지정 CR은 추정치")}</p>` : ""}` : ""}
    ${combat ? `<h4>${t("레벨 기반 간이 프로필")}</h4><div class="fpb-npc-stats"><span>AC <b>${combat.ac}</b></span><span>HP <b>${combat.hp}</b></span><span>${t("숙련")} +${combat.proficiency}</span><span>${t("명중")} +${combat.attackBonus}</span>${combat.spellSaveDc ? `<span>${t("주문 DC")} ${combat.spellSaveDc}</span>` : ""}</div><table class="fpb-ability-table"><thead><tr>${["근력", "민첩", "건강", "지능", "지혜", "매력"].map(a => `<th>${t(a)}</th>`).join("")}</tr></thead><tbody><tr>${combat.abilities.map(a => `<td>${a}<small>${signed(abilityModifier(a))}</small></td>`).join("")}</tr></tbody></table><p class="fpb-npc-rule">${t("간이 수치 · 클래스 특성·주문·특기는 미포함 · 공식 CR 아님")}</p>` : ""}
    ${epic ? `<p class="fpb-npc-rule">${t("에픽 · 서사 레벨만 기록 · 21레벨 이상 간이 전투 수치 미제공")}</p>` : ""}
    <details ${combat || commoner || epic ? "" : "open"}><summary>${t("SRD 기본 참고 능력치 (레벨 미반영)")}</summary><label>능력치 유형<select name="templateId">${Object.entries(
      NPC_STAT_BLOCKS
    )
      .map(([id, block]) => `<option value="${id}" ${id === npc.templateId ? "selected" : ""}>${block.name}</option>`)
      .join("")}</select></label>
    <div class="fpb-npc-stats"><span>AC <b>${stats.ac}</b></span><span>HP <b>${stats.hp}</b> (${stats.hitDice})</span><span>CR <b>${stats.cr}</b> · ${stats.xp} XP</span><span>이동 30ft · 숙련 +2</span><span>${t("우선권")} ${signed(abilityModifier(stats.abilities[1]))} (${10 + abilityModifier(stats.abilities[1])})</span></div>
    <table class="fpb-ability-table"><thead><tr>${["근력", "민첩", "건강", "지능", "지혜", "매력"].map(a => `<th>${a}</th>`).join("")}</tr></thead><tbody><tr>${stats.abilities.map(a => `<td>${a}<small>${signed(abilityModifier(a))}</small></td>`).join("")}</tr></tbody></table>
    <p class="fpb-npc-rule">중형 또는 소형 인간형 · 중립<br>내성: 위 능력 수정치와 동일<br>${t(stats.skills)}<br>${t("수동 지각")} ${stats.passivePerception}<br>${t("언어")}: ${t(stats.languages)}<br>${t("장비")}: ${t(stats.gear)}</p>
    ${[...stats.traits, ...stats.actions, ...stats.reactions].map(text => `<p class="fpb-npc-rule">${text}</p>`).join("")}
    </details>
    ${(
      [
        ["appearance", "외형"],
        ["personality", "성격"],
        ["goal", "목표"],
        ["secret", "비밀"],
        ["notes", "GM 메모"]
      ] as const
    )
      .map(
        ([key, label]) =>
          `<label>${label}<textarea name="${key}" maxlength="4000" rows="2">${escapeHtml(npc[key])}</textarea></label>`
      )
      .join("")}
    <div class="fpb-npc-edit-actions"><button type="submit" class="primary">변경 적용</button><button id="fpb-npc-delete" type="button" class="icon-trash" title="NPC 삭제" aria-label="NPC 삭제"></button><a href="${SRD_URL}#page=${stats.page}" target="_blank" rel="noopener">${t("규칙 원문 p.{page}", { page: stats.page })}</a></div></form>`;
  const form = el<HTMLFormElement>("fpb-npc-form");
  mountNpcPortrait({
    form,
    npc,
    getDraft: () => collectNpcDraft(npc),
    onChange: portrait => {
      if (!storedNpc || !campaign?.npcs.includes(storedNpc)) return false;
      storedNpc.portrait = npc.portrait = portrait;
      storedNpc.edited = npc.edited = true;
      changed();
      return true;
    }
  });
  form.insertBefore(
    createRulesReferences("character", "2024", progression?.classId).element,
    form.querySelector(".fpb-npc-edit-actions")
  );
  el("fpb-npc-focus").onclick = () => focusUnit(npc.villageId);
  el<HTMLFormElement>("fpb-npc-form")
    .querySelectorAll("[name=templateId], [name=classId], [name=level], [name=rank], [name=scope], [name=commonerCr]")
    .forEach(control => {
      control.addEventListener("change", () => {
        const draft = collectNpcDraft(npc);
        if (draft?.progression?.classId === "none")
          draft.progression = { ...draft.progression, level: 1, rank: "common", scope: "settlement" };
        if (draft && (!draft.progression || isNpcProgression(draft.progression))) renderDetail(draft);
      });
    });
  el<HTMLFormElement>("fpb-npc-form").onsubmit = event => {
    event.preventDefault();
    const draft = collectNpcDraft(npc);
    if (!draft || (draft.progression && !isNpcProgression(draft.progression))) return;
    for (const key of ["name", "role", "appearance", "personality", "goal", "secret", "notes"] as const)
      draft[key] = draft[key].trim();
    draft.edited = true;
    Object.assign(storedNpc!, draft);
    EditorDrafts.clear(key);
    changed();
    renderNpcs();
  };
  el("fpb-npc-delete").onclick = () => {
    if (!confirm(t("{name} NPC를 삭제할까요?", { name: npc.name }))) return;
    campaign!.npcs = campaign!.npcs.filter(n => n.id !== npc.id);
    EditorDrafts.clear(key);
    changed();
    renderNpcs();
  };
  EditorDrafts.bind(form, key, () => renderDetail(), !preview);
  mountWorldDetail(el("fpb-npc-detail"), {
    key,
    name: npc.name,
    location: campaign?.units.find(unit => unit.id === npc.villageId)?.name || t("소속 마을 없음"),
    badge: progression
      ? `${t(NPC_CLASSES[progression.classId])} · ${progression.classId === "none" ? `CR ${progression.commonerCr || "0"}` : `Lv.${progression.level} · ${validProgression ? tierText(progression.level, true) : t("입력값 확인 필요")}`}`
      : `CR ${stats.cr}`,
    sections: [
      {
        title: "인물 정보",
        fields: [
          ["이름", npc.name],
          ["역할", npc.role],
          ["지위", progression ? t(NPC_RANKS[progression.rank]) : ""],
          ["활동 범위", progression ? t(NPC_SCOPES[progression.scope]) : ""]
        ]
      },
      {
        title: "인물 기록",
        fields: [
          ["외형", npc.appearance],
          ["성격", npc.personality],
          ["목표", npc.goal],
          ["비밀", npc.secret],
          ["GM 메모", npc.notes]
        ]
      },
      {
        title: "규칙 안내",
        fields: [
          [
            "전투 프로필",
            t(
              epic
                ? "에픽 · 서사 레벨만 기록 · 21레벨 이상 간이 전투 수치 미제공"
                : "간이 수치 · 클래스 특성·주문·특기는 미포함 · 공식 CR 아님"
            )
          ]
        ]
      }
    ],
    portrait: npc.portrait,
    focus: () => focusUnit(npc.villageId),
    refresh: () => renderDetail()
  });
}

function collectNpcDraft(preview?: WorldNpc, values?: Record<string, string>): WorldNpc | undefined {
  const npc = preview || campaign?.npcs.find(item => item.id === selectedNpc);
  const form = el<HTMLFormElement>("fpb-npc-form");
  if (!npc || (!form && !values)) return;
  const data = values ? new Map(Object.entries(values)) : new FormData(form);
  const draft = { ...npc, templateId: String(data.get("templateId") ?? npc.templateId) as NpcTemplateId };
  if (npc.progression) {
    draft.progression = {
      ...npc.progression,
      level: Number(data.get("level") ?? npc.progression.level),
      classId: String(data.get("classId") ?? npc.progression.classId) as NpcClassId,
      rank: String(data.get("rank") ?? npc.progression.rank) as NpcRank,
      scope: String(data.get("scope") ?? npc.progression.scope) as NpcScope
    };
    if (draft.progression.classId === "none")
      draft.progression.commonerCr = String(data.get("commonerCr") || "0") as CommonerCr;
    else delete draft.progression.commonerCr;
  }
  for (const key of ["name", "role", "appearance", "personality", "goal", "secret", "notes"] as const)
    draft[key] = String(data.get(key) ?? npc[key]);
  return draft;
}

function focusUnit(id: string): void {
  const unit = campaign?.units.find(u => u.id === id);
  if (!unit) return;
  el<HTMLDialogElement>("fpb-world-dialog").close();
  el("fpb-map-view").click();
  zoomTo(unit.x, unit.y, unit.level === "village" ? 6 : 2, 600);
}

function regenerate(): void {
  if (!campaign || !confirm(t("선택 범위의 자동 생성 NPC를 다시 만들까요? 직접 수정한 NPC는 보존됩니다."))) return;
  const scope = selectedScope();
  const input = snapshot();
  const villages = input.villages.filter(v => !scope || belongsTo(`village:${v.id}`, scope, campaign!.units));
  const ids = new Set(villages.map(v => `village:${v.id}`));
  regenerateCampaignNpcs(campaign, input, ids);
  changed();
  renderNpcs();
}

async function exportNpcs(): Promise<void> {
  const world = campaign;
  if (!world) return;
  const filtered = filteredNpcs();
  const selected = world.npcs.filter(npc => npc.id === selectedNpc);
  const { openWorldDataExport } = await import("./world-data-export");
  if (campaign !== world) return;
  openWorldDataExport({
    kind: "npcs",
    world,
    all: world.npcs,
    filtered,
    selected,
    hasDrafts: EditorDrafts.snapshot().some(draft => draft.key.startsWith("npc:"))
  });
}

function restore(world?: CampaignWorld): void {
  headquartersPanel?.close(false);
  campaign = world ? structuredClone(world) : undefined;
  mapLevel = campaign?.mapLevel || "country";
  if (el("fpb-admin-level")) el<HTMLSelectElement>("fpb-admin-level").value = mapLevel;
  refresh();
  applyClassification();
  if (el<HTMLDialogElement>("fpb-world-dialog")?.open) renderFilters();
}

export const Campaign = {
  init,
  restore,
  rebalance: () => {
    refresh();
    if (!campaign) return;
    if (rebalanceCampaignNpcs(campaign, snapshot(), true)) changed();
    if (el<HTMLDialogElement>("fpb-world-dialog")?.open) renderNpcs();
  },
  openNpc: (id: string) => {
    open();
    el("fpb-tab-npcs")?.click();
    const npc = campaign?.npcs.find(n => n.id === id);
    if (!npc) return;
    for (const level of levels) el<HTMLSelectElement>(`fpb-filter-${level}`).value = "";
    el<HTMLInputElement>("fpb-npc-search").value = "";
    renderFilters();
    el<HTMLSelectElement>("fpb-filter-village").value = npc.villageId;
    selectedNpc = id;
    page = 0;
    renderNpcs();
    showWorldRecord(el("fpb-npc-detail"));
  },
  get: () => {
    refresh();
    return campaign;
  }
};
