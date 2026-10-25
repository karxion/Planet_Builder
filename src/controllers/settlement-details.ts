import { Campaign } from "@/controllers/campaign-world";
import type { Burg } from "@/generators/burgs-generator";
import { generateSettlementHistory, generateSettlementMap } from "@/generators/settlement-map";
import { npcLevelLabel } from "@/renderers/npc-level-label";
import { renderSettlementMap, settlementImagePrompt } from "@/renderers/settlement-map";
import { t } from "@/services/ui-language";
import type { SettlementMap, SettlementRecord } from "@/types/settlement-map";

const element = <K extends keyof HTMLElementTagNameMap>(tag: K, text = "") => {
  const node = document.createElement(tag);
  node.textContent = text;
  return node;
};
const changed = () => window.dispatchEvent(new Event("project:changed"));

export function settlementRecord(burg: Burg): SettlementRecord {
  const saved = burg.settlement;
  if (
    saved?.version === 1 &&
    typeof saved.seed === "string" &&
    saved.seed.length <= 160 &&
    typeof saved.history === "string" &&
    saved.history.length <= 4000
  )
    return saved;
  const mapSeed = `${String(seed)}:city:${burg.i}`;
  return {
    version: 1,
    seed: mapSeed,
    history: generateSettlementHistory(mapSeed, burg.name || "", Boolean(burg.capital), Boolean(burg.port))
  };
}

function facts(burg: Burg): string {
  const state = pack.states[burg.state || 0];
  const country = state?.fullName || state?.name || t("무소속");
  const province = pack.provinces[pack.cells.province[burg.cell]];
  return `${burg.name} · ${country}${burg.capital ? ` · ${t("수도")}` : ""}${province?.name ? ` · ${province.name}` : ""}${burg.port ? ` · ${t("항구")}` : ""}`;
}

export function mountSettlementDetails(burg: Burg): void {
  const old = document.getElementById("fpb-burg-details");
  const host = element("section");
  host.id = "fpb-burg-details";
  const heading = element("h3", t("도시 기록"));
  const summary = element("p", facts(burg));
  summary.dataset.i18nSkip = "";
  const history = element("details");
  history.append(element("summary", t("창작 연혁")), element("p", settlementRecord(burg).history));
  history.lastElementChild?.setAttribute("data-i18n-skip", "");
  host.append(heading, summary, history, element("h4", t("주요 NPC")));
  const world = Campaign.get();
  const npcs = (world?.npcs || [])
    .filter(n => n.villageId === `village:${burg.i}`)
    .sort(
      (a, b) =>
        (b.progression?.classId !== "none" ? b.progression?.level || 0 : 0) -
        (a.progression?.classId !== "none" ? a.progression?.level || 0 : 0)
    );
  const list = element("ul");
  for (const npc of npcs) {
    const row = element("li");
    const button = element("button", npc.name);
    button.type = "button";
    button.dataset.i18nSkip = "";
    button.onclick = () => Campaign.openNpc(npc.id);
    const role = element("span", `${npc.role} · ${npcLevelLabel(npc)}`);
    role.dataset.i18nSkip = "";
    row.append(button, role);
    list.append(row);
  }
  if (!npcs.length) list.append(element("li", t("소속 NPC 없음")));
  const tools = element("button", t("조감도·전투 지도"));
  tools.type = "button";
  tools.className = "icon-map";
  tools.onclick = () => openSettlementMap(burg);
  host.append(list, tools);
  if (old) old.replaceWith(host);
  else document.getElementById("burgPreviewSection")?.before(host);
}

function createMap(burg: Burg, mapSeed: string): SettlementMap {
  return generateSettlementMap({
    seed: mapSeed,
    name: burg.name || "",
    capital: Boolean(burg.capital),
    port: Boolean(burg.port),
    walls: Boolean(burg.walls),
    population: burg.population || 0,
    river: Boolean(pack.cells.r[burg.cell])
  });
}

function download(blob: Blob, name: string): void {
  const url = URL.createObjectURL(blob);
  const link = element("a");
  link.href = url;
  link.download = name;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 5000);
}

export function openSettlementMap(burg: Burg): void {
  document.getElementById("fpb-city-map-dialog")?.remove();
  const record = settlementRecord(burg);
  let map = createMap(burg, record.seed);
  let battle = false;
  const dialog = element("dialog");
  dialog.id = "fpb-city-map-dialog";
  const header = element("header");
  const title = element("h2", burg.name);
  title.dataset.i18nSkip = "";
  const close = element("button");
  close.type = "button";
  close.className = "icon-cancel";
  close.title = close.ariaLabel = t("닫기");
  close.onclick = () => dialog.close();
  header.append(title, close);
  const toolbar = element("div");
  toolbar.className = "fpb-city-toolbar";
  const overview = element("button", t("조감도"));
  const tactical = element("button", t("전투 지도"));
  const district = element("select");
  district.ariaLabel = t("구역");
  for (const [value, label] of [
    ["market", "시장"],
    ["residential", "주거지"],
    ["gate", "성문"]
  ])
    district.add(new Option(t(label), value));
  const gridLabel = element("label", t("격자 · 1칸 5ft"));
  const grid = element("input");
  grid.type = "checkbox";
  grid.checked = true;
  gridLabel.prepend(grid);
  const seedLabel = element("label", t("시드"));
  const seedInput = element("input");
  seedInput.value = record.seed;
  seedInput.maxLength = 160;
  seedLabel.append(seedInput);
  const regenerate = element("button", t("생성"));
  regenerate.className = "icon-cw";
  const randomize = element("button");
  randomize.className = "icon-shuffle";
  randomize.title = randomize.ariaLabel = t("무작위 시드");
  randomize.onclick = () => {
    seedInput.value = crypto.randomUUID();
    regenerate.click();
  };
  const svgSave = element("button", "SVG");
  svgSave.className = "icon-download";
  const pngSave = element("button", "PNG");
  pngSave.className = "icon-download";
  const viewport = element("div");
  viewport.className = "fpb-city-viewport";
  const status = element("p");
  status.setAttribute("role", "status");
  const ai = element("details");
  ai.append(element("summary", t("AI 이미지 요청")));
  const prompt = element("textarea");
  prompt.readOnly = true;
  prompt.rows = 5;
  prompt.ariaLabel = t("이미지 요청문");
  const copy = element("button", t("요청문 복사"));
  copy.className = "icon-docs";
  copy.onclick = async () => {
    try {
      await navigator.clipboard.writeText(prompt.value);
      status.textContent = t("복사됨");
    } catch {
      prompt.focus();
      prompt.select();
      status.textContent = t("클립보드를 사용할 수 없습니다");
    }
  };
  const chat = element("a", t("ChatGPT 열기"));
  chat.href = "https://chatgpt.com/";
  chat.target = "_blank";
  chat.rel = "noopener noreferrer";
  ai.append(prompt, copy, chat);
  const draw = () => {
    viewport.innerHTML = renderSettlementMap(map, battle, grid.checked, district.value);
    overview.setAttribute("aria-pressed", String(!battle));
    tactical.setAttribute("aria-pressed", String(battle));
    district.disabled = grid.disabled = !battle;
    prompt.value = settlementImagePrompt(burg.name || "", pack.states[burg.state || 0]?.fullName || "", map);
    status.textContent = battle
      ? `${district.selectedOptions[0].text} · 32 × 22 · 5ft`
      : `${map.buildings.length} ${t("건물")} · ${burg.capital ? `1 ${t("성채")} · ` : ""}2 ${t("여관")} · 3 ${t("길드")}`;
  };
  overview.onclick = () => {
    battle = false;
    draw();
  };
  tactical.onclick = () => {
    battle = true;
    draw();
  };
  district.onchange = grid.onchange = draw;
  regenerate.onclick = () => {
    const value = seedInput.value.trim();
    if (!value) {
      seedInput.focus();
      return;
    }
    map = createMap(burg, value);
    burg.settlement = {
      version: 1,
      seed: value,
      history: generateSettlementHistory(value, burg.name || "", Boolean(burg.capital), Boolean(burg.port))
    };
    changed();
    mountSettlementDetails(burg);
    draw();
  };
  svgSave.onclick = () =>
    download(
      new Blob([viewport.innerHTML], { type: "image/svg+xml" }),
      `city-${burg.i}-${battle ? district.value : "overview"}.svg`
    );
  pngSave.onclick = () => {
    pngSave.disabled = true;
    const image = new Image();
    const url = URL.createObjectURL(new Blob([viewport.innerHTML], { type: "image/svg+xml" }));
    const done = () => {
      URL.revokeObjectURL(url);
      pngSave.disabled = false;
    };
    image.onerror = () => {
      done();
      status.textContent = t("이미지 내보내기 실패");
    };
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext("2d");
      if (!context) {
        done();
        return;
      }
      context.drawImage(image, 0, 0);
      canvas.toBlob(blob => {
        if (blob) download(blob, `city-${burg.i}.png`);
        else status.textContent = t("이미지 내보내기 실패");
        done();
      });
    };
    image.src = url;
  };
  toolbar.append(overview, tactical, district, gridLabel, seedLabel, randomize, regenerate, svgSave, pngSave);
  dialog.append(header, toolbar, viewport, status, ai);
  document.body.append(dialog);
  draw();
  dialog.showModal();
}

export function initSettlementTools(): void {
  const anchor = document.getElementById("fpb-npc-regenerate");
  if (!anchor || document.getElementById("fpb-npc-rebalance")) return;
  const button = element("button", t("티어 재분배"));
  button.id = "fpb-npc-rebalance";
  button.className = "icon-cw";
  button.onclick = () => {
    if (confirm(t("자동 생성 NPC의 레벨·직업을 재분배할까요? 이름·메모와 직접 수정한 인물은 유지됩니다.")))
      Campaign.rebalance();
  };
  anchor.after(button);
}
