// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { sanitizeImportedNotes, sanitizeNoteHtml } from "@/services/content-sanitizer";
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
  const tip = vi.fn();
  let pendingImport = "";
  Object.assign(window, { tinymce, sanitizeImportedNotes });
  const api = new Function(
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
    "uploadFile",
    `${code}\nreturn {open: editNotes, getNotes: () => notes};`
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
    tip,
    (_input: unknown, callback: (value: string) => void) => callback(pendingImport)
  );
  api.open("marker1");
  const upload = (value: string) => {
    pendingImport = value;
    document.getElementById("legendsToLoad")!.dispatchEvent(new Event("change"));
  };
  return { notes, activeEditor, callbacks, ...api, upload, tip };
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
  it.each(["not JSON", "{}", "null", "[]", '[{"id":"marker2","name":"missing legend"}]',
    '[{"id":"x","name":"one","legend":""},{"id":"x","name":"two","legend":""}]'])(
    "preserves all existing notes when importing invalid data: %s", value => {
      const fixture = editorFixture();
      fixture.upload(value);
      expect(fixture.getNotes()).toEqual(fixture.notes);
      expect(fixture.tip).toHaveBeenCalled();
    }
  );
  it("sanitizes a complete import before replacing notes and notifies autosave", () => {
    const fixture = editorFixture();
    const changed = vi.fn();
    window.addEventListener("project:changed", changed);
    fixture.upload(JSON.stringify([{ id: "marker2", name: "새 기록", legend: '<p onclick="bad()">본문</p><script>bad()</script>' }]));
    expect(fixture.getNotes()).toEqual([{ id: "marker2", name: "새 기록", legend: "<p>본문</p>" }]);
    expect(changed).toHaveBeenCalledOnce();
    window.removeEventListener("project:changed", changed);
  });
  it("notifies autosave for actual name and text edits but not unchanged blur", () => {
    const fixture = editorFixture();
    const changed = vi.fn();
    window.addEventListener("project:changed", changed);
    document.getElementById("notesLegend")!.dispatchEvent(new Event("blur"));
    expect(changed).not.toHaveBeenCalled();
    const name = document.getElementById("notesName") as HTMLInputElement;
    name.value = "내 메모";
    name.dispatchEvent(new Event("input"));
    fixture.activeEditor.setContent("새 내용");
    fixture.callbacks.get("Change")?.();
    expect(changed).toHaveBeenCalledTimes(2);
    window.removeEventListener("project:changed", changed);
  });
});
