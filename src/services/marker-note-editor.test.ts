// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { sanitizeNoteHtml } from "@/services/content-sanitizer";
import "@/services/marker-notes";
import { setUiLanguage } from "@/services/ui-language";

const code = readFileSync(resolve(process.cwd(), "public/modules/ui/notes-editor.js"), "utf8");

function editorFixture() {
  document.body.innerHTML = `<div id="notesHeader"></div><div id="notesBody"></div><div id="notesEditor"></div>
    <select id="notesSelect"></select><input id="notesName"><div id="notesLegend" contenteditable="true"></div>
    ${["notesPin", "notesFocus", "notesGenerateWithAi", "notesDownload", "notesUpload", "legendsToLoad", "notesRemove"].map(id => `<button id="${id}"></button>`).join("")}`;
  setUiLanguage("ko");
  const notes = [
    {
      id: "marker1",
      name: "은빛 Stele",
      legend: "An ancient stele.<p>The inscription has not yet been deciphered.</p>"
    }
  ];
  const callbacks = new Map<string, () => void>();
  let html = "";
  const activeEditor = {
    getContent: () => html,
    setContent: (value: string) => {
      html = value;
    }
  };
  const tinymce = {
    activeEditor,
    _setBaseUrl: vi.fn(),
    init: (settings: {
      setup: (editor: { on: (name: string, callback: () => void) => void; getContent: () => string }) => void;
    }) => {
      html = document.getElementById("notesLegend")!.innerHTML;
      settings.setup({
        on: (name, callback) => {
          callbacks.set(name, callback);
        },
        getContent: () => html
      });
      callbacks.get("init")?.();
    }
  };
  Object.assign(window, { tinymce });
  const open = new Function(
    "window",
    "document",
    "notes",
    "options",
    "modules",
    "ensureEl",
    "svgWidth",
    "svgHeight",
    "$",
    "tinymce",
    "sanitizeNoteHtml",
    "tip",
    `${code}\nreturn editNotes;`
  )(
    window,
    document,
    notes,
    {},
    {},
    (id: string) => document.getElementById(id),
    1280,
    720,
    () => ({ dialog: vi.fn() }),
    tinymce,
    sanitizeNoteHtml,
    vi.fn()
  );
  open("marker1");
  return { notes, activeEditor, callbacks };
}

describe("localized note editing", () => {
  it("shows Korean values without replacing the bilingual source on an unchanged blur", () => {
    const { notes } = editorFixture();
    expect((document.getElementById("notesName") as HTMLInputElement).value).toBe("은빛 비석");
    expect(document.getElementById("notesLegend")!.textContent).toContain("비문은 아직 해독되지 않았습니다");
    document.getElementById("notesLegend")!.dispatchEvent(new Event("blur"));
    expect(notes[0].name).toBe("은빛 Stele");
    expect(notes[0].legend).toContain("An ancient stele");
  });

  it("commits an actual edit as user content rather than restoring generated text", () => {
    const { notes, activeEditor, callbacks } = editorFixture();
    activeEditor.setContent("<p>사용자가 해독한 비문입니다.</p>");
    callbacks.get("Change")?.();
    expect(notes[0].legend).toBe("<p>사용자가 해독한 비문입니다.</p>");
    setUiLanguage("en");
    expect(notes[0].legend).toBe("<p>사용자가 해독한 비문입니다.</p>");
  });
});
