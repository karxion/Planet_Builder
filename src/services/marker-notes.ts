import { readableInscription, translateMarkerName, translateMarkerText } from "@/data/marker-localization";
import { sanitizeNoteHtml } from "./content-sanitizer";
import { stripDeorumContent } from "./external-character-policy";
import { getUiLanguage, type UiLanguage } from "./ui-language";

interface MapNote {
  id: string;
  name: string;
  legend: string;
}

export function localizedMapNote(note: MapNote, language: UiLanguage = getUiLanguage()): MapNote {
  const isMarker = /^marker\d+$/.test(note.id);
  const legend = isMarker ? readableInscription(note.legend) : note.legend;
  const container = document.createElement("div");
  container.innerHTML = stripDeorumContent(sanitizeNoteHtml(legend));
  let generated = legend !== note.legend;
  if (isMarker) {
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    let node: Node | null;
    while ((node = walker.nextNode())) {
      const source = node.textContent || "";
      if (translateMarkerText(source, "ko") !== source || source.includes("이 지역에서 인물을 만났습니다."))
        generated = true;
      node.textContent = translateMarkerText(source, language);
    }
  }
  return {
    ...note,
    name: generated ? translateMarkerName(note.name, language) : note.name,
    legend: container.innerHTML
  };
}

export function renderMapNote(note: MapNote): void {
  const header = document.getElementById("notesHeader");
  const body = document.getElementById("notesBody");
  if (!header || !body) return;
  const localized = localizedMapNote(note);
  header.textContent = localized.name;
  body.innerHTML = localized.legend;
  body.dataset.noteId = note.id;
}

declare global {
  interface Window {
    localizedMapNote: typeof localizedMapNote;
    renderMapNote: typeof renderMapNote;
  }
}
window.localizedMapNote = localizedMapNote;
window.renderMapNote = renderMapNote;
window.addEventListener("ui:language-changed", () => {
  const id = document.getElementById("notesBody")?.dataset.noteId;
  if (!id || typeof notes === "undefined") return;
  const note = notes.find(note => note.id === id);
  if (note) renderMapNote(note);
});
