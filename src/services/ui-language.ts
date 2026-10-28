import { UI_TRANSLATIONS } from "@/data/ui-translations";
import { setGenerationLanguage } from "./generation-language";
import { generatedText } from "@/utils/generation-text";
import { BUILD_INFO } from "./build-info";

export type UiLanguage = "ko" | "en";
const STORAGE_KEY = "fpb-ui-language";
const bySource = new Map<string, readonly [string, string]>();
const byLowercaseSource = new Map<string, readonly [string, string]>();
for (const pair of UI_TRANSLATIONS) {
  for (const source of pair) {
    if (!bySource.has(source)) bySource.set(source, pair);
    if (!byLowercaseSource.has(source.toLowerCase())) byLowercaseSource.set(source.toLowerCase(), pair);
  }
}
const lookup = (source: string) => bySource.get(source) || byLowercaseSource.get(source.toLowerCase());

let language: UiLanguage = "ko";
let observer: MutationObserver | undefined;
const originals = new WeakMap<Node, { source: string; rendered: string }>();
const attributes = new WeakMap<Element, Map<string, { source: string; rendered: string }>>();
const attributeNames = ["title", "aria-label", "placeholder", "data-tip", "label"];
const excluded =
  "svg, canvas, script, style, textarea, [contenteditable], [data-i18n-skip], [data-fpb-language], #fpb-filter-country, #fpb-filter-region, #fpb-filter-fief, #fpb-filter-village, #styleGroupSelect, #speakerVoice, #notesSelect, #notesBody, #notesHeader";

export function translateText(
  source: string,
  locale: UiLanguage,
  values: Record<string, string | number> = {}
): string {
  const normalized = source.trim().replace(/\s+/g, " ");
  const punctuation = normalized.match(/^(.*?)([:：])$/);
  const key = punctuation?.[1] || normalized;
  const pair = lookup(key);
  let result = pair ? pair[locale === "ko" ? 1 : 0] : source.trim();
  if (pair && punctuation) result += punctuation[2];

  if (!pair && locale === "ko") {
    const layerTip = normalized.match(
      /^(.+?): (click to toggle, drag to raise or lower the layer\. Ctrl \+ click to edit layer style)$/i
    );
    const openTip = normalized.match(/^Click to open (.+)$/);
    const editTip = normalized.match(/^(.+)\. (Click to (?:edit|view)(?: the (?:Route|Marker))?)$/);
    const populationTip = normalized.match(/^(.+) (capital|city|town|village)\. Population: (.+)\. Click to edit$/);
    const shortcutTip = normalized.match(/^(.+)\. Shortcut: (.+)$/);
    if (layerTip) result = `${translateText(layerTip[1], locale)}: ${translateText(layerTip[2], locale)}`;
    else if (openTip && lookup(openTip[1])) result = `${translateText(openTip[1], locale)} 열기`;
    else if (populationTip)
      result = `${populationTip[1]} · ${translateText(populationTip[2], locale)} · 인구: ${populationTip[3]}. 클릭하여 편집`;
    else if (editTip) result = `${editTip[1]}. ${translateText(editTip[2], locale)}`;
    else if (shortcutTip) result = `${translateText(shortcutTip[1], locale)}. 단축키: ${shortcutTip[2]}`;
  }
  result = result.replace(/\{(\w+)\}/g, (token, key: string) => String(values[key] ?? token));
  return source.replace(source.trim(), result);
}

export const t = (source: string, values?: Record<string, string | number>): string =>
  translateText(source, language, values);
export const getUiLanguage = (): UiLanguage => language;

declare global {
  interface Window {
    fpbTranslateUiText: typeof t;
    fpbGeneratedText: typeof generatedText;
  }
}
if (typeof window !== "undefined") {
  window.fpbTranslateUiText = t;
  window.fpbGeneratedText = generatedText;
}

function ignored(element: Element | null): boolean {
  return !element || Boolean(element.closest(excluded));
}

function translateNode(node: Node): void {
  if (node.nodeType === Node.TEXT_NODE) {
    if (ignored(node.parentElement) || !node.textContent?.trim()) return;
    const current = node.textContent;
    const old = originals.get(node);
    const source = old && current === old.rendered ? old.source : current;
    const rendered = t(source);
    const button = node.parentElement?.closest("button");
    const pair = lookup(source.trim());
    if (button?.textContent?.trim() === current.trim() && pair) button.dataset.fpbOriginalLabel = pair[0];
    originals.set(node, { source, rendered });
    if (rendered !== current) node.textContent = rendered;
    return;
  }
  if (!(node instanceof Element) || ignored(node)) return;
  // Options without explicit values otherwise change their machine value when their label changes.
  if (node instanceof HTMLOptionElement && !node.hasAttribute("value")) node.value = node.text;
  let tracked = attributes.get(node);
  if (!tracked) {
    tracked = new Map();
    attributes.set(node, tracked);
  }
  for (const name of attributeNames) {
    const current = node.getAttribute(name);
    if (!current) continue;
    const old = tracked.get(name);
    const source = old && current === old.rendered ? old.source : current;
    const rendered = t(source);
    tracked.set(name, { source, rendered });
    if (rendered !== current) node.setAttribute(name, rendered);
  }
  for (const child of node.childNodes) translateNode(child);
}

function observe(): void {
  observer?.observe(document.body, {
    childList: true,
    characterData: true,
    subtree: true,
    attributes: true,
    attributeFilter: attributeNames
  });
}

function translateUi(roots: Iterable<Node> = [document.body]): void {
  observer?.disconnect();
  for (const node of roots) translateNode(node);
  observe();
}

export function setUiLanguage(next: UiLanguage): void {
  if (next !== "ko" && next !== "en") return;
  language = next;
  setGenerationLanguage(next);
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* The preference still works when storage is unavailable. */
  }
  document.documentElement.lang = next;
  document.title = `${t("판타지 행성 빌더")} v${BUILD_INFO.version}`;
  document.querySelectorAll<HTMLSelectElement>("[data-fpb-language]").forEach(select => {
    select.value = next;
  });
  translateUi();
  window.dispatchEvent(new CustomEvent("ui:language-changed", { detail: next }));
}

export function initUiLanguage(): void {
  if (observer) return;
  // Legacy shortcut underlines split words into text nodes; flatten labels, never their controls.
  document.querySelectorAll<HTMLElement>("#mapLayers > li").forEach(item => {
    item.textContent = item.textContent!.replace(/\s+/g, " ").trim();
  });
  observer = new MutationObserver(records => {
    const roots = new Set<Node>();
    for (const record of records) {
      if (ignored(record.target instanceof Element ? record.target : record.target.parentElement)) continue;
      if (record.type === "childList")
        record.addedNodes.forEach(node => {
          roots.add(node);
        });
      else roots.add(record.target);
    }
    if (roots.size) translateUi(roots);
  });
  document.addEventListener("change", event => {
    const select = event.target as HTMLSelectElement;
    if (select.matches("[data-fpb-language]")) setUiLanguage(select.value as UiLanguage);
  });
  let saved: string | null = null;
  try {
    saved = localStorage.getItem(STORAGE_KEY);
  } catch {
    /* Korean is the default. */
  }
  setUiLanguage(saved === "en" ? "en" : "ko");
}
