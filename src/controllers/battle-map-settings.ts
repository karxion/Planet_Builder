import { assertBattleMapSettings, battlePreset, battleRows, isBattleMapSettings } from "@/data/battle-map";
import { getUiLanguage } from "@/services/ui-language";
import type { BattleMapPreset, BattleMapRatio, BattleMapSettings } from "@/types/battle-map";

const text = (ko: string, en: string) => (getUiLanguage() === "ko" ? ko : en);

/** Only Apply commits values. Invalid drafts never replace a working map. */
export function battleMapControls(
  initial: BattleMapSettings,
  apply: (settings: BattleMapSettings) => void
): HTMLElement {
  const host = document.createElement("form");
  host.className = "fpb-battle-size";
  host.dataset.i18nSkip = "";
  host.innerHTML = `<label>${text("크기 프리셋", "Map preset")}<select data-battle-preset><option value="small">${text("소형 · 25칸", "Small · 25 columns")}</option><option value="medium">${text("중형 · 48칸", "Medium · 48 columns")}</option><option value="large">${text("대형 · 72칸", "Large · 72 columns")}</option><option value="custom">${text("수동", "Custom")}</option></select></label>
  <label>${text("비율", "Aspect ratio")}<select data-battle-ratio><option>16:9</option><option>4:3</option><option>1:1</option><option value="custom">${text("자유 비율", "Free ratio")}</option></select></label>
  <label>${text("가로 칸", "Columns")}<input data-battle-columns type="number" min="8" max="256" required></label><label>${text("세로 칸", "Rows")}<input data-battle-rows type="number" min="8" max="256" required></label>
  <label>${text("한 칸 해상도 (px)", "Pixels per square")}<input data-battle-pixels type="number" min="16" max="128" required></label><button type="submit">${text("크기 적용", "Apply size")}</button><p role="status" data-battle-size-status></p>`;
  const preset = host.querySelector<HTMLSelectElement>("[data-battle-preset]")!;
  const ratio = host.querySelector<HTMLSelectElement>("[data-battle-ratio]")!;
  const cols = host.querySelector<HTMLInputElement>("[data-battle-columns]")!;
  const rows = host.querySelector<HTMLInputElement>("[data-battle-rows]")!;
  const pixels = host.querySelector<HTMLInputElement>("[data-battle-pixels]")!;
  const status = host.querySelector<HTMLElement>("[data-battle-size-status]")!;
  cols.value = String(initial.columns);
  rows.value = String(initial.rows);
  pixels.value = String(initial.cellPixels);
  preset.value =
    (["small", "medium", "large"] as const).find(
      id => battlePreset(id).columns === initial.columns && battlePreset(id).rows === initial.rows
    ) || "custom";
  ratio.value = initial.rows === battleRows(initial.columns) ? "16:9" : "custom";
  function syncRows() {
    if (ratio.value !== "custom" && cols.validity.valid)
      rows.value = String(battleRows(Number(cols.value), ratio.value as Exclude<BattleMapRatio, "custom">));
  }
  preset.onchange = () => {
    if (preset.value !== "custom") {
      const v = battlePreset(preset.value as BattleMapPreset);
      cols.value = String(v.columns);
      ratio.value = "16:9";
      rows.value = String(v.rows);
    }
  };
  cols.oninput = () => {
    preset.value = "custom";
    syncRows();
  };
  rows.oninput = () => {
    preset.value = ratio.value = "custom";
  };
  ratio.onchange = () => {
    preset.value = "custom";
    syncRows();
  };
  host.onsubmit = event => {
    event.preventDefault();
    const next = { columns: Number(cols.value), rows: Number(rows.value), cellPixels: Number(pixels.value) };
    if (!isBattleMapSettings(next)) {
      status.textContent = text(
        "가로·세로 8~256칸, 한 칸 16~128px. 출력은 한 변 8192px·총 32Mpx 이하입니다. 큰 지도는 칸 해상도를 낮춰 주세요.",
        "Use 8–256 squares per axis and 16–128 pixels per square. Export limit: 8192px per axis, 32Mpx total. Reduce pixels per square for larger maps."
      );
      return;
    }
    assertBattleMapSettings(next);
    apply(next);
    status.textContent = text("크기를 적용했습니다.", "Map size applied.");
  };
  return host;
}
