import { BORDER_RELATIONS, borderRelation, relationAsset, vassalState } from "@/data/border-diplomacy";
import { renderBorderDiplomacy, scaleBorderTokens } from "@/renderers/border-diplomacy";
import { t } from "@/services/ui-language";
import type { BorderAnchor, BorderRelation } from "@/types/border-diplomacy";
import type { PackedGraph } from "@/types/PackedGraph";
import { setBorderRelation, sharedBorderAnchors } from "@/utils/borderDiplomacy";

let initialized = false;
let timer = 0;
let dialog: HTMLDialogElement | undefined;
let selected: BorderAnchor | undefined;
let selectedGraph: PackedGraph | undefined;
let geometryObserver: MutationObserver | undefined;
let zoomObserver: MutationObserver | undefined;
const node = <K extends keyof HTMLElementTagNameMap>(tag: K, text = "") => {
  const result = document.createElement(tag);
  result.textContent = text;
  return result;
};

function visible(): boolean {
  return document.getElementById("borders")?.dataset.relationsVisible !== "0";
}

function refresh(): void {
  if (typeof pack === "undefined" || !pack.vertices?.p?.length || !pack.states?.length) return;
  const parent = document.querySelector<SVGGElement>("#viewbox");
  if (!parent) return;
  let toggle = document.getElementById("toggleDiplomacy");
  if (!toggle && document.getElementById("toggleBorders")) {
    toggle = node("li");
    toggle.id = "toggleDiplomacy";
    toggle.setAttribute("role", "button");
    toggle.tabIndex = 0;
    toggle.onclick = () => {
      const border = document.getElementById("borders");
      if (!border) return;
      border.dataset.relationsVisible = visible() ? "0" : "1";
      refresh();
      window.dispatchEvent(new Event("project:changed"));
    };
    toggle.onkeydown = event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggle!.click();
      }
    };
    document.getElementById("toggleBorders")!.after(toggle);
  }
  if (toggle) {
    toggle.textContent = t("국가 관계");
    toggle.title = t("국경 관계 토큰 표시");
    toggle.classList.toggle("buttonoff", !visible());
    toggle.setAttribute("aria-pressed", String(visible()));
  }
  renderBorderDiplomacy(parent, sharedBorderAnchors(pack), pack.states, openBorderRelation);
  (parent.querySelector("#diplomacy") as SVGElement).style.display = visible() ? "" : "none";
  geometryObserver?.disconnect();
  geometryObserver = new MutationObserver(schedule);
  const borders = parent.querySelector("#stateBorders");
  if (borders)
    geometryObserver.observe(borders, { subtree: true, childList: true, attributes: true, attributeFilter: ["d"] });
  zoomObserver?.disconnect();
  zoomObserver = new MutationObserver(() => {
    if (!document.body.classList.contains("fpb-map-interacting")) scaleBorderTokens(parent);
  });
  zoomObserver.observe(parent, { attributes: true, attributeFilter: ["transform"] });
}

function schedule(): void {
  clearTimeout(timer);
  timer = window.setTimeout(refresh, 80);
}

function openBorderRelation(anchor: BorderAnchor): void {
  if (typeof pack === "undefined") return;
  const a = pack.states[anchor.a],
    b = pack.states[anchor.b];
  if (!a || !b || a.removed || b.removed) return;
  selected = anchor;
  selectedGraph = pack;
  if (!dialog?.isConnected) {
    dialog = node("dialog");
    dialog.id = "fpb-border-relations-dialog";
    dialog.dataset.i18nSkip = "";
    dialog.setAttribute("aria-labelledby", "fpb-border-relations-title");
    document.body.append(dialog);
  }
  const header = node("header");
  const title = node("h2", t("국가 간 관계"));
  title.id = "fpb-border-relations-title";
  const close = node("button");
  close.type = "button";
  close.className = "icon-cancel";
  close.title = t("닫기");
  close.setAttribute("aria-label", t("닫기"));
  close.onclick = () => dialog!.close();
  header.append(title, close);
  const names = node("p", `${a.fullName || a.name} ↔ ${b.fullName || b.name}`);
  names.className = "fpb-border-pair";
  const form = node("form");
  const fieldset = node("fieldset");
  fieldset.append(node("legend", t("외교 상태")));
  const grid = node("div");
  grid.className = "fpb-border-choices";
  for (const [kind, config] of Object.entries(BORDER_RELATIONS)) {
    const label = node("label");
    const input = node("input");
    input.type = "radio";
    input.name = "relation";
    input.value = kind;
    input.className = "native";
    input.checked = kind === borderRelation(a, b);
    const image = node("img");
    image.src = relationAsset(kind as BorderRelation);
    image.alt = "";
    image.width = 56;
    image.height = 56;
    label.append(input, image, node("span", t(config.label)));
    grid.append(label);
  }
  fieldset.append(grid);
  const direction = node("label", t("종속국"));
  direction.className = "fpb-border-dependent";
  const select = node("select");
  select.name = "dependent";
  select.append(new Option(a.fullName || a.name, String(a.i)), new Option(b.fullName || b.name, String(b.i)));
  select.value = String(vassalState(a, b) || a.i);
  direction.append(select);
  const update = () => {
    direction.hidden = new FormData(form).get("relation") !== "vassal";
  };
  form.onchange = update;
  const status = node("p");
  status.setAttribute("role", "status");
  const save = node("button", t("변경 저장"));
  save.type = "submit";
  save.className = "icon-floppy";
  form.append(fieldset, direction, status, save);
  dialog.replaceChildren(header, names, form);
  update();
  form.onsubmit = event => {
    event.preventDefault();
    if (pack !== selectedGraph || selected !== anchor) return;
    const data = new FormData(form);
    const kind = String(data.get("relation")) as BorderRelation;
    if (!setBorderRelation(pack.states, a.i, b.i, kind, Number(data.get("dependent")))) {
      status.textContent = t("종속 관계가 순환하지 않도록 종속국을 확인해주세요");
      return;
    }
    // State zero stores the legacy chronicle as arrays, despite its string[] type.
    const history = pack.states[0]?.diplomacy;
    if (Array.isArray(history))
      (history as unknown[]).push([
        t("외교 상태"),
        `${a.fullName || a.name} ↔ ${b.fullName || b.name}: ${t(BORDER_RELATIONS[kind].label)}`
      ]);
    refresh();
    window.dispatchEvent(new Event("project:changed"));
    dialog!.close();
  };
  if (!dialog.open) dialog.showModal();
}

export function initBorderDiplomacy(): void {
  if (initialized) return;
  initialized = true;
  for (const event of ["map:generated", "map:loaded"])
    window.addEventListener(event, () => {
      dialog?.close();
      schedule();
    });
  window.addEventListener("project:changed", schedule);
  window.addEventListener("diplomacy:changed", schedule);
  window.addEventListener("ui:language-changed", () => {
    refresh();
    if (dialog?.open && selected) openBorderRelation(selected);
  });
  window.addEventListener("resize", schedule);
  window.addEventListener("map:interaction-end", () => {
    const view = document.querySelector<SVGGElement>("#map #viewbox");
    if (view) scaleBorderTokens(view);
  });
  document.addEventListener("change", event => {
    if ((event.target as Element).closest?.("#statesEditor, #diplomacyEditor")) schedule();
  });
  refresh();
}
