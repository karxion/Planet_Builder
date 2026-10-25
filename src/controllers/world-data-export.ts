import { buildWorldDataExport, exportCsv, exportFilename } from "@/services/io/world-data-export";
import { getUiLanguage, t } from "@/services/ui-language";
import type {
  DataExportOptions,
  DataExportScope,
  WorldDataExport,
  WorldDataExportSource
} from "@/types/world-data-export";

let dialog: HTMLDialogElement;
let source: WorldDataExportSource;
let preview: WorldDataExport | undefined;
let printing = false;
let printRevision = 0;
const get = <T extends HTMLElement = HTMLElement>(name: string) => dialog.querySelector<T>(`[data-export=${name}]`)!;
const element = <K extends keyof HTMLElementTagNameMap>(tag: K, text = "") => {
  const node = document.createElement(tag);
  node.textContent = text;
  return node;
};

function createDialog(): void {
  dialog = document.createElement("dialog");
  dialog.id = "fpb-data-export-dialog";
  dialog.setAttribute("aria-labelledby", "fpb-data-export-title");
  dialog.innerHTML = `<header><h2 id="fpb-data-export-title"></h2><button type="button" class="icon-cancel" data-export="close"></button></header>
    <section class="fpb-export-options"><label><span data-export-label="Export Range"></span><select data-export="scope"></select></label><label><span data-export-label="File Format"></span><select data-export="format"><option value="json">JSON</option><option value="csv">CSV</option></select></label>
    <label class="fpb-export-check"><input class="native" type="checkbox" data-export="private"><span data-export-label="Include Secrets and GM Notes"></span></label><label class="fpb-export-check"><input class="native" type="checkbox" checked data-export="images"><span data-export-label="Include Registered Images"></span></label></section>
    <p data-export="status" role="status"></p><p data-export="drafts" role="note"></p>
    <div class="fpb-export-actions"><button type="button" class="icon-download" data-export="download"></button><button type="button" class="icon-eye" data-export="preview-button"></button><button type="button" class="icon-print" data-export="print"></button></div>
    <section data-export="preview" aria-label="Print Preview" hidden></section>`;
  document.body.append(dialog);
  get("close").onclick = () => dialog.close();
  for (const name of ["scope", "format", "private", "images"]) get(name).addEventListener("change", update);
  get("download").onclick = download;
  get("preview-button").onclick = showPreview;
  get("print").onclick = () => void printData();
  window.addEventListener("ui:language-changed", () => {
    if (dialog.open) translate();
  });
  for (const event of ["map:generated", "map:loaded"]) window.addEventListener(event, () => dialog.close());
  window.addEventListener("afterprint", endPrint);
  dialog.addEventListener("close", endPrint);
}

function options(): DataExportOptions {
  return {
    language: getUiLanguage(),
    includePrivate: get<HTMLInputElement>("private").checked,
    includeImages: get<HTMLInputElement>("images").checked
  };
}
function currentScope(): DataExportScope {
  return get<HTMLSelectElement>("scope").value as DataExportScope;
}
function update(): void {
  endPrint();
  preview = undefined;
  get("preview").hidden = true;
  get("preview").replaceChildren();
  const count = source[currentScope()].length;
  get("status").textContent = t("{count} records ready", { count });
  get<HTMLButtonElement>("download").disabled = !count;
  get<HTMLButtonElement>("preview-button").disabled = !count;
  get<HTMLButtonElement>("print").disabled = !count;
}

function translate(): void {
  dialog.querySelector("h2")!.textContent = t(source.kind === "npcs" ? "NPC 데이터 출력" : "아이템 데이터 출력");
  for (const node of dialog.querySelectorAll<HTMLElement>("[data-export-label]"))
    node.textContent = t(node.dataset.exportLabel!);
  for (const [name, label] of [
    ["close", "닫기"],
    ["download", "다운로드"],
    ["preview-button", "인쇄 미리보기"],
    ["print", "인쇄 / PDF"]
  ]) {
    const button = get(name);
    button.title = t(label);
    button.setAttribute("aria-label", t(label));
    button.textContent = name === "close" ? "" : ` ${t(label)}`;
  }
  const scope = get<HTMLSelectElement>("scope");
  const selected = scope.value || "filtered";
  scope.replaceChildren(
    ...(
      [
        ["filtered", "검색 결과"],
        ["selected", "선택한 항목"],
        ["all", "전체 데이터"]
      ] as const
    ).map(([value, label]) => {
      const option = new Option(`${t(label)} (${source[value].length})`, value);
      option.disabled = !source[value].length;
      return option;
    })
  );
  scope.value = selected;
  get("drafts").hidden = !source.hasDrafts;
  get("drafts").textContent = t("Unapplied changes are excluded from output");
  get("preview").setAttribute("aria-label", t("인쇄 미리보기"));
  update();
}

export function openWorldDataExport(input: WorldDataExportSource): void {
  source = input;
  if (!dialog?.isConnected) createDialog();
  get<HTMLSelectElement>("scope").value = "filtered";
  get<HTMLInputElement>("private").checked = false;
  get<HTMLInputElement>("images").checked = true;
  get<HTMLSelectElement>("format").value = "json";
  translate();
  if (!dialog.open) dialog.showModal();
}

function download(): void {
  const format = get<HTMLSelectElement>("format").value as "json" | "csv";
  const settings = options();
  if (format === "csv") settings.includeImages = false;
  const data = buildWorldDataExport(source, currentScope(), settings);
  const content = format === "json" ? JSON.stringify(data.payload, null, 2) : exportCsv(data);
  const url = URL.createObjectURL(
    new Blob([content], { type: format === "json" ? "application/json;charset=utf-8" : "text/csv;charset=utf-8" })
  );
  const link = element("a");
  link.href = url;
  link.download = exportFilename(source.kind, currentScope(), format);
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 5000);
  get("status").textContent = t("Download requested for {count} records", { count: data.rows.length });
}

function showPreview(): void {
  preview = buildWorldDataExport(source, currentScope(), options());
  const container = get("preview");
  container.dataset.i18nSkip = "";
  container.replaceChildren(element("h2", preview.title));
  const fragment = document.createDocumentFragment();
  for (const card of preview.cards) {
    const article = element("article");
    article.className = "fpb-export-card";
    article.append(element("h3", card.name));
    if (card.image) {
      const image = element("img");
      image.src = card.image;
      image.alt = card.name;
      image.width = 160;
      image.height = 160;
      article.append(image);
    }
    const list = element("dl");
    for (const [label, value] of card.fields) if (value) list.append(element("dt", label), element("dd", value));
    article.append(list);
    fragment.append(article);
  }
  container.append(fragment, element("footer", preview.attribution));
  container.hidden = false;
}

function endPrint(): void {
  document.body.classList.remove("fpb-print-data");
  printing = false;
  printRevision++;
}

async function printData(): Promise<void> {
  if (printing) return;
  if (!preview) showPreview();
  printing = true;
  const revision = ++printRevision;
  const prepared = preview!;
  get("status").textContent = t("Preparing print");
  try {
    await Promise.all([...get("preview").querySelectorAll("img")].map(image => image.decode().catch(() => {})));
    if (!dialog.open || !printing || revision !== printRevision || preview !== prepared) return;
    document.body.classList.add("fpb-print-data");
    window.print();
    get("status").textContent = t("{count} records ready", { count: prepared.rows.length });
  } catch {
    get("status").textContent = t("Print could not be started");
  } finally {
    if (revision === printRevision) endPrint();
  }
}
