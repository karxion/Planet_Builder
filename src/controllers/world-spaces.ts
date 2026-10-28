import { paintUnderground, siteInActiveLevel, undergroundLevel } from "@/data/underground";
import { seabedIndex } from "@/data/underwater";
import { drawWorldSpaces } from "@/renderers/world-spaces";
import { EditorDrafts } from "@/services/editor-drafts";
import { getUiLanguage } from "@/services/ui-language";
import { WorldSpaces } from "@/services/world-spaces/state";
import type { UndergroundCell } from "@/types/underground";
import { SITE_KINDS, SPACE_IDS, type SpaceSiteKind, TERRAIN_KINDS, type WorldSpace } from "@/types/world-spaces";
import { mountUndergroundTools } from "./underground-tools";
import { mountSeaDiplomacy, mountUnderwaterTools } from "./underwater-tools";

const text = (ko: string, en: string) => (getUiLanguage() === "ko" ? ko : en);
const esc = (value: string) =>
  value.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const key = (type: string, id: string) => `space-${type}:${id}`;
let panel: HTMLElement;
let selected = "";
let factionId = "";
let placement: SpaceSiteKind | "move" | "paint" | undefined;
let brush: { terrain: UndergroundCell; radius: number } = { terrain: 1, radius: 3 };
let tab = "sites";
let switchView: (space: WorldSpace) => Promise<void>;
let currentData = "";
let activeSpace: WorldSpace = "surface";
const spaceLabels = (): Record<WorldSpace, string> => ({
  surface: text("지상", "Surface"),
  underwater: text("수중", "Underwater"),
  underground: text("지저", "Underground")
});
const kinds = () => ({
  city: text("도시", "City"),
  territory: text("영지·세력권", "Territory"),
  terrain: text("지형 영역", "Terrain"),
  gateway: text("연결 지점", "Gateway")
});
const terrains = () => ({
  plain: text("평지", "Plain"),
  reef: text("산호초", "Reef"),
  trench: text("해구", "Trench"),
  cavern: text("공동", "Cavern"),
  lake: text("지하호수", "Lake"),
  rock: text("암반", "Rock")
});

export function refreshWorldSpaces(): void {
  if (!panel) return;
  const data = WorldSpaces.snapshot();
  if (activeSpace !== data.activeSpace) {
    activeSpace = data.activeSpace;
    placement = undefined;
    selected = "";
    if (activeSpace === "underground" && !data.underground) tab = "terrain";
    if (activeSpace === "underwater" && !data.underwater) {
      tab = "seabed";
      panel.hidden = false;
    }
  }
  for (const space of SPACE_IDS) {
    const button = document.getElementById(space === "surface" ? "fpb-map-view" : `fpb-space-${space}`);
    button?.classList.toggle("active", data.activeSpace === space);
    button?.setAttribute("aria-pressed", String(data.activeSpace === space));
  }
  if (data.activeSpace !== "surface") document.body.dataset.worldSpace = data.activeSpace;
  else delete document.body.dataset.worldSpace;
  const parent = document.querySelector<SVGGElement>("#map #viewbox");
  if (parent && typeof graphWidth !== "undefined")
    drawWorldSpaces({
      parent,
      data,
      width: graphWidth,
      height: graphHeight,
      selected,
      labels: spaceLabels(),
      landMask: Boolean(document.querySelector("#land"))
    });
}

function label(name: string, control: string): string {
  return `<label>${name}${control}</label>`;
}
function input(name: string, value: string | number, attrs = ""): string {
  return `<input name="${name}" value="${esc(String(value))}" ${attrs}>`;
}
function option(value: string, name: string, chosen: string): string {
  return `<option value="${esc(value)}" ${value === chosen ? "selected" : ""}>${esc(name)}</option>`;
}
function notify(): void {
  refreshWorldSpaces();
  currentData = JSON.stringify(WorldSpaces.snapshot());
}
function formValues(form: HTMLFormElement) {
  return new FormData(form);
}
function message(error: unknown): void {
  panel.querySelector<HTMLElement>("[data-space-status]")!.textContent =
    error instanceof Error ? error.message : String(error);
}
function run(action: () => void): void {
  try {
    action();
    notify();
    renderPanel();
  } catch (error) {
    message(error);
  }
}

export function renderSpacePanel(): void {
  if (panel) renderPanel();
}
function renderPanel(): void {
  if (!panel) return;
  panel.dataset.placing = String(Boolean(placement));
  const data = WorldSpaces.snapshot();
  const site = data.sites.find(s => s.id === selected && siteInActiveLevel(s, data));
  const faction = data.factions.find(f => f.id === factionId);
  panel.innerHTML = `<header><h3>${spaceLabels()[data.activeSpace]} · ${text("세계 공간", "World spaces")}</h3><button type="button" data-close aria-label="${text("닫기", "Close")}">×</button></header>
    <p>${data.activeSpace === "underground" ? text("지형 탭에서 동굴망을 생성하고 깊이 층을 전환합니다. 장소·세력·연결을 편집하거나 지형 붓으로 공동과 암반을 바꿀 수 있습니다.", "Generate cave networks and select depth layers in Terrain. Edit places, factions and connections, or paint caverns and rock.") : data.activeSpace === "underwater" ? text("해저·세력 탭에서 해저 지형과 수중 세력을 생성하고 지도 보기를 바꿉니다. 장소와 종족 구성·외교 관계는 자유롭게 편집합니다.", "Generate bathymetry and aquatic realms in Seabed / realms. Edit places, peoples and diplomacy.") : text("도시·세력·통로를 직접 배치하는 지도입니다. 옅은 육지는 지상 위치 참고용입니다. 지상 재생성 시 수동 기록은 유지됩니다.", "Manually place cities, territories and passages. Faint land indicates surface geography. Surface regeneration retains manual records.")}</p>
    <nav>${[
      ...(data.activeSpace === "underground" ? [["terrain", text("지형·층", "Terrain / depth")]] : []),
      ...(data.activeSpace === "underwater" ? [["seabed", text("해저·세력", "Seabed / realms")]] : []),
      ["sites", text("장소", "Places")],
      ["factions", text("세력", "Factions")],
      ["links", text("연결", "Connections")]
    ]
      .map(
        ([value, name]) => `<button type="button" data-tab="${value}" aria-pressed="${tab === value}">${name}</button>`
      )
      .join(
        ""
      )}</nav><p data-space-status role="status" aria-live="polite">${placement === "paint" ? text("지도에서 클릭할 때마다 지형을 칠합니다. Esc로 종료합니다.", "Click the map to paint terrain. Esc ends painting.") : placement ? text("지도에서 위치를 클릭하세요. Esc로 취소합니다.", "Click a map location. Esc cancels placement.") : ""}</p><div data-content></div>`;
  panel.querySelector<HTMLButtonElement>("[data-close]")!.onclick = () => {
    panel.hidden = true;
    placement = undefined;
  };
  panel.querySelectorAll<HTMLButtonElement>("[data-tab]").forEach(button => {
    button.onclick = () => {
      tab = button.dataset.tab!;
      placement = undefined;
      renderPanel();
    };
  });
  const content = panel.querySelector<HTMLElement>("[data-content]")!;
  if (tab === "seabed" && data.activeSpace === "underwater") {
    mountUnderwaterTools(content, {
      changed: () => {
        selected = "";
        placement = undefined;
        notify();
        renderPanel();
      },
      error: message,
      faction: id => {
        factionId = id;
        tab = "factions";
        renderPanel();
      }
    });
    return;
  }
  if (tab === "seabed") {
    tab = "sites";
    renderPanel();
    return;
  }
  if (tab === "terrain" && data.activeSpace === "underground") {
    mountUndergroundTools(content, {
      changed: () => {
        selected = "";
        placement = undefined;
        notify();
        renderPanel();
      },
      paint: (terrain, radius) => {
        brush = { terrain, radius };
        placement = "paint";
        renderPanel();
      },
      error: message
    });
    return;
  }
  if (tab === "terrain") {
    tab = "sites";
    renderPanel();
    return;
  }
  if (tab === "sites") {
    content.innerHTML = `<div class="fpb-space-add">${SITE_KINDS.map(kind => `<button type="button" data-place="${kind}">＋ ${kinds()[kind]}</button>`).join("")}</div><label>${text("장소 선택", "Select place")}<select data-sites><option value="">${text("장소를 선택하세요", "Select a place")}</option>${data.sites
      .filter(s => siteInActiveLevel(s, data))
      .map(s => option(s.id, `${kinds()[s.kind]} · ${s.name} (${s.depth} m)`, selected))
      .join("")}</select></label>
      ${
        site
          ? `<form data-site-form data-fpb-draft>${label(text("이름", "Name"), input("name", site.name, 'required maxlength="120"'))}
      <div class="fpb-space-columns">${label(text("깊이 (m)", "Depth (m)"), input("depth", site.depth, `type="number" min="0" max="100000" step="any" required ${site.space === "surface" ? "readonly" : ""}`))}${label(text("인구", "Population"), input("population", site.population, 'type="number" min="0" max="10000000000" required'))}</div>
      ${label(text("주요 주민", "Residents"), input("residents", site.residents, 'maxlength="500"'))}
      ${label(text("소속 세력", "Faction"), `<select name="factionId">${option("", text("없음", "None"), site.factionId || "")}${data.factions.map(f => option(f.id, f.name, site.factionId || "")).join("")}</select>`)}
      ${label(text("영역 크기 (지도 %)", "Area size (% of map)"), input("radius", Number((site.radius * 100).toFixed(2)), 'type="number" min="0.2" max="25" step="0.1" required'))}
      ${label(text("지형", "Terrain"), `<select name="terrain">${TERRAIN_KINDS.map(t => option(t, terrains()[t], site.terrain)).join("")}</select>`)}
      ${label(text("설명·GM 메모", "Description / GM notes"), `<textarea name="notes" maxlength="4000">${esc(site.notes)}</textarea>`)}
      <button type="submit">${text("변경 적용", "Apply changes")}</button><button type="button" data-move>${text("위치 옮기기", "Move")}</button><button type="button" data-delete>${text("장소 삭제", "Delete place")}</button></form>`
          : `<p>${text("배치 버튼을 누른 뒤 지도에서 위치를 선택하세요. 지상에도 동굴 입구·항구 등 연결 지점을 추가할 수 있습니다.", "Choose a placement tool, then click the map. Surface gateways can represent cave entrances or ports.")}</p>`
      }`;
    content.querySelectorAll<HTMLButtonElement>("[data-place]").forEach(button => {
      button.onclick = () => {
        placement = button.dataset.place as SpaceSiteKind;
        renderPanel();
      };
    });
    content.querySelector<HTMLSelectElement>("[data-sites]")!.onchange = event => {
      selected = (event.target as HTMLSelectElement).value;
      refreshWorldSpaces();
      renderPanel();
    };
    if (site) {
      const form = content.querySelector<HTMLFormElement>("form")!;
      EditorDrafts.bind(form, key("site", site.id), () => renderPanel());
      form.onsubmit = event => {
        event.preventDefault();
        run(() => {
          const values = formValues(form);
          WorldSpaces.update(d => {
            const item = d.sites.find(s => s.id === site.id)!;
            Object.assign(item, {
              name: String(values.get("name")).trim(),
              depth: Number(values.get("depth")),
              population: Number(values.get("population")),
              residents: String(values.get("residents")),
              radius: Number(values.get("radius")) / 100,
              terrain: String(values.get("terrain")),
              notes: String(values.get("notes"))
            });
            const faction = String(values.get("factionId"));
            if (item.origin) item.edited = true;
            if (item.space === "underground" && d.underground) d.underground.activeLevel = undergroundLevel(item.depth);
            if (faction) item.factionId = faction;
            else delete item.factionId;
          });
          EditorDrafts.clear(key("site", site.id));
        });
      };
      content.querySelector<HTMLButtonElement>("[data-move]")!.onclick = () => {
        placement = "move";
        renderPanel();
      };
      content.querySelector<HTMLButtonElement>("[data-delete]")!.onclick = () => {
        if (!confirm(text("이 장소와 연결된 통로를 삭제할까요?", "Delete this place and its connections?"))) return;
        run(() => {
          WorldSpaces.removeSite(site.id);
          EditorDrafts.clear(key("site", site.id));
          selected = "";
        });
      };
    }
  } else if (tab === "factions") {
    content.innerHTML = `<button type="button" data-add-faction>＋ ${text("새 세력", "New faction")}</button><select data-factions><option value="">${text("세력 선택", "Select faction")}</option>${data.factions.map(f => option(f.id, f.name, factionId)).join("")}</select>${faction ? `<form data-faction-form data-fpb-draft>${label(text("이름", "Name"), input("name", faction.name, 'required maxlength="120"'))}${label(text("색상", "Color"), input("color", faction.color, 'type="color"'))}${label(text("설명", "Description"), `<textarea name="notes" maxlength="4000">${esc(faction.notes)}</textarea>`)}<button type="submit">${text("변경 적용", "Apply changes")}</button><button type="button" data-delete-faction>${text("세력 삭제", "Delete faction")}</button></form>` : ""}`;
    content.querySelector<HTMLButtonElement>("[data-add-faction]")!.onclick = () =>
      run(() => {
        factionId = crypto.randomUUID();
        WorldSpaces.update(d => {
          d.factions.push({ id: factionId, name: text("새 세력", "New faction"), color: "#73bdcf", notes: "" });
        });
      });
    content.querySelector<HTMLSelectElement>("[data-factions]")!.onchange = event => {
      factionId = (event.target as HTMLSelectElement).value;
      renderPanel();
    };
    if (faction) {
      const form = content.querySelector<HTMLFormElement>("form")!;
      const people = document.createElement("label");
      people.textContent = text("주요 종족·주민", "Peoples / residents");
      const peopleInput = document.createElement("input");
      peopleInput.name = "people";
      peopleInput.maxLength = 500;
      peopleInput.value = faction.people || "";
      people.append(peopleInput);
      form.prepend(people);
      EditorDrafts.bind(form, key("faction", faction.id), () => renderPanel());
      form.onsubmit = event => {
        event.preventDefault();
        run(() => {
          const values = formValues(form);
          WorldSpaces.update(d => {
            Object.assign(d.factions.find(f => f.id === faction.id)!, {
              name: String(values.get("name")).trim(),
              people: String(values.get("people")),
              color: String(values.get("color")),
              notes: String(values.get("notes"))
            });
          });
          EditorDrafts.clear(key("faction", faction.id));
        });
      };
      content.querySelector<HTMLButtonElement>("[data-delete-faction]")!.onclick = () => {
        if (confirm(text("세력을 삭제할까요? 장소는 유지됩니다.", "Delete faction? Its places are retained.")))
          run(() => {
            WorldSpaces.removeFaction(faction.id);
            EditorDrafts.clear(key("faction", faction.id));
          });
      };
      if (data.activeSpace === "underwater")
        mountSeaDiplomacy(content, faction.id, () => {
          notify();
          renderPanel();
        });
    }
  } else {
    const siteOptions = data.sites
      .map(s => option(s.id, `${spaceLabels()[s.space]} · ${s.name} (${s.depth} m)`, ""))
      .join("");
    content.innerHTML = `<p>${text("같은 공간의 장소는 이동로로, 다른 공간의 장소는 전환 가능한 통로로 연결합니다.", "Connect places within a space as routes, or across spaces as passages.")}</p><form data-link-form>${label(text("연결 이름", "Connection name"), input("name", "", 'required maxlength="120"'))}${label(text("출발", "From"), `<select name="from" required><option value=""></option>${siteOptions}</select>`)}${label(text("도착", "To"), `<select name="to" required><option value=""></option>${siteOptions}</select>`)}<button type="submit">${text("연결 추가", "Add connection")}</button></form><ul>${data.links.map(l => `<li><span data-i18n-skip>${esc(l.name)}</span> <button type="button" data-travel="${esc(l.to)}">${text("도착지로 이동", "Go to destination")}</button><button type="button" data-remove-link="${esc(l.id)}">${text("삭제", "Delete")}</button></li>`).join("")}</ul>`;
    const linkForm = content.querySelector<HTMLFormElement>("form")!;
    EditorDrafts.bind(linkForm, "space-link:new", () => renderPanel());
    linkForm.onsubmit = event => {
      event.preventDefault();
      run(() => {
        const form = event.currentTarget as HTMLFormElement;
        const v = formValues(form);
        WorldSpaces.update(d => {
          d.links.push({
            id: crypto.randomUUID(),
            name: String(v.get("name")).trim(),
            from: String(v.get("from")),
            to: String(v.get("to"))
          });
        });
        EditorDrafts.clear("space-link:new");
      });
    };
    content.querySelectorAll<HTMLButtonElement>("[data-remove-link]").forEach(button => {
      button.onclick = () =>
        run(() =>
          WorldSpaces.update(d => {
            d.links = d.links.filter(l => l.id !== button.dataset.removeLink);
          })
        );
    });
    content.querySelectorAll<HTMLButtonElement>("[data-travel]").forEach(button => {
      button.onclick = () => void travel(button.dataset.travel!);
    });
  }
}

async function travel(id: string): Promise<void> {
  const site = WorldSpaces.snapshot().sites.find(s => s.id === id);
  if (!site) return;
  if (site.space === "underground" && WorldSpaces.snapshot().underground)
    WorldSpaces.update(d => {
      d.underground!.activeLevel = undergroundLevel(site.depth);
    });
  await switchView(site.space);
  selected = site.id;
  panel.hidden = false;
  tab = "sites";
  refreshWorldSpaces();
  renderPanel();
  zoomTo(site.x * graphWidth, site.y * graphHeight, Math.max(2, scale), 500);
}

export function initWorldSpaces(onSwitch: (space: WorldSpace) => Promise<void>): void {
  switchView = onSwitch;
  panel = document.createElement("aside");
  panel.id = "fpb-space-panel";
  panel.hidden = true;
  panel.dataset.i18nSkip = "";
  document.body.append(panel);
  const button = document.createElement("button");
  button.id = "fpb-space-tools";
  button.type = "button";
  button.dataset.i18nSkip = "";
  button.innerHTML = '<span class="icon-map-o" aria-hidden="true"></span><span data-space-tool-label></span>';
  button.querySelector("[data-space-tool-label]")!.textContent = text("공간 편집", "Edit spaces");
  button.title = text("공간 편집", "Edit spaces");
  document.getElementById("fpb-settings-button")?.before(button);
  button.onclick = () => {
    panel.hidden = !panel.hidden;
    renderPanel();
  };
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      placement = undefined;
      if (!panel.hidden) renderPanel();
    }
  });
  const redraw = () => {
    selected = "";
    placement = undefined;
    refreshWorldSpaces();
    if (!panel.hidden) renderPanel();
  };
  window.addEventListener("map:generated", redraw);
  window.addEventListener("map:loaded", redraw);
  window.addEventListener("world-spaces:restored", redraw);
  window.addEventListener("ui:language-changed", () => {
    button.innerHTML = '<span class="icon-map-o" aria-hidden="true"></span><span data-space-tool-label></span>';
    button.querySelector("[data-space-tool-label]")!.textContent = text("공간 편집", "Edit spaces");
    button.title = text("공간 편집", "Edit spaces");
    refreshWorldSpaces();
    if (!panel.hidden) renderPanel();
  });
  window.addEventListener("project:changed", () => {
    const data = JSON.stringify(WorldSpaces.snapshot());
    if (data !== currentData) {
      currentData = data;
      refreshWorldSpaces();
    }
  });
  const activate = (event: Event) => {
    const target = event.target as Element;
    if (event instanceof KeyboardEvent && !["Enter", " "].includes(event.key)) return;
    const portal = target.closest<SVGElement>("[data-space-travel]");
    const mark = target.closest<SVGElement>("[data-space-site]");
    if (!placement && (portal || mark)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (portal) void travel(portal.dataset.spaceTravel!);
      else {
        selected = mark!.dataset.spaceSite!;
        tab = "sites";
        panel.hidden = false;
        refreshWorldSpaces();
        renderPanel();
      }
      return;
    }
    if (!placement || !(event instanceof MouseEvent) || !target.closest("#map")) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const parent = document.querySelector<SVGGElement>("#viewbox")!;
    const svg = document.getElementById("map") as unknown as SVGSVGElement;
    const matrix = parent.getScreenCTM();
    if (!matrix) return;
    const p = svg.createSVGPoint();
    p.x = event.clientX;
    p.y = event.clientY;
    const local = p.matrixTransform(matrix.inverse());
    const x = local.x / graphWidth,
      y = local.y / graphHeight;
    if (x < 0 || x > 1 || y < 0 || y > 1) return;
    run(() => {
      if (placement === "paint") {
        WorldSpaces.update(d => {
          if (d.activeSpace !== "underground" || !d.underground)
            throw new Error(text("지저 지도를 먼저 생성하세요.", "Generate an underground map first."));
          paintUnderground(d.underground, x, y, brush.radius, brush.terrain);
        });
        return;
      }
      if (placement === "move")
        WorldSpaces.update(d => {
          const site = d.sites.find(s => s.id === selected);
          if (site) {
            if (site.space === "underwater" && d.underwater && !d.underwater.depths[seabedIndex(d.underwater, x, y)])
              throw new Error(text("수중 장소는 바다 위로 옮기세요.", "Move underwater places onto water."));
            site.x = x;
            site.y = y;
            if (site.origin) site.edited = true;
            for (const link of d.links) if (link.from === site.id || link.to === site.id) delete link.path;
          }
        });
      else selected = WorldSpaces.addSite(WorldSpaces.snapshot().activeSpace, placement!, x, y).id;
      placement = undefined;
    });
  };
  document.addEventListener("click", activate, true);
  document.addEventListener("keydown", activate, true);
  refreshWorldSpaces();
}
