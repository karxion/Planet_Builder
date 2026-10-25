// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { encodeCsvRows } from "@/services/io/csv";

const code = readFileSync(resolve(process.cwd(), "public/modules/ui/diplomacy-editor.js"), "utf8");
const payload = `\"'><img src=x onerror=alert(1)>`;
function fixture() {
  document.body.innerHTML = `<div id="diplomacyEditor"></div><div id="diplomacyBodySection"></div><div id="alertMessage"></div><div id="diplomacyMatrix"></div><div id="diplomacyMatrixBody"></div>
    ${["diplomacyEditorRefresh", "diplomacyEditStyle", "diplomacyRegenerate", "diplomacyReset", "diplomacyShowMatrix", "diplomacyHistory", "diplomacyExport"].map(id => `<button id="${id}"></button>`).join("")}`;
  const graph = {
    states: [
      { i: 0, diplomacy: [[payload]] },
      { i: 1, name: payload, fullName: payload, diplomacy: ["x", "x", "Neutral"] },
      { i: 2, name: "왕국", fullName: "은빛 왕국", diplomacy: ["x", "Neutral", "x"] }
    ]
  };
  const download = vi.fn();
  const chain = { style: vi.fn(() => chain), on: vi.fn(() => chain), selectAll: () => ({ each: vi.fn() }) };
  Object.assign(window, { encodeFpbCsvRows: encodeCsvRows });
  const environment = {
    window,
    document,
    Event: window.Event,
    customization: 0,
    pack: graph,
    tip: vi.fn(),
    closeDialogs: vi.fn(),
    layerIsOn: (id: string) => ["toggleStates", "toggleBorders"].includes(id),
    COArenderer: { trigger: vi.fn() },
    viewbox: chain,
    statesBody: chain,
    modules: {},
    fitContent: () => "fit-content",
    applySorting: vi.fn(),
    diplomacyHeader: {},
    $: () => ({ dialog: vi.fn() }),
    ensureEl: (id: string) => document.getElementById(id),
    diplomacyMatrix: document.getElementById("diplomacyMatrix"),
    alertMessage: document.getElementById("alertMessage"),
    getFileName: () => "relations",
    downloadFile: download,
    getAdjective: (value: string) => value
  };
  const open = new Function(...Object.keys(environment), `${code}\nreturn editDiplomacy;`)(
    ...Object.values(environment)
  );
  open();
  return { graph, open, download };
}

describe("Legacy diplomacy security boundaries", () => {
  beforeEach(() => document.body.replaceChildren());
  it("renders imported names as inert text in lists, relationship dialogs and the matrix", () => {
    fixture();
    const body = document.getElementById("diplomacyBodySection")!;
    expect(body.textContent).toContain(payload);
    expect(body.querySelector("img,[onerror]")).toBeNull();
    (body.querySelector(".changeRelations") as HTMLElement).click();
    const alert = document.getElementById("alertMessage")!;
    expect(alert.textContent).toContain(payload);
    expect(alert.querySelector("img,[onerror]")).toBeNull();
    document.getElementById("diplomacyShowMatrix")!.click();
    expect(document.getElementById("diplomacyMatrixBody")!.textContent).toContain(payload);
    expect(document.querySelector("img,[onerror],[onload]")).toBeNull();
  });
  it("does not interpret saved history as HTML and persists edits as text with change notification", () => {
    const { graph } = fixture();
    document.getElementById("diplomacyHistory")!.click();
    const history = document.querySelector<HTMLElement>('[contenteditable="true"]')!;
    expect(history.textContent).toBe(payload);
    expect(history.querySelector("img")).toBeNull();
    const changed = vi.fn();
    window.addEventListener("project:changed", changed);
    history.innerHTML = '<b>새 기록</b><img src=x onerror="bad()">';
    history.dispatchEvent(new Event("input", { bubbles: true }));
    expect(graph.states[0].diplomacy[0]).toEqual(["새 기록"]);
    expect(changed).toHaveBeenCalledOnce();
    window.removeEventListener("project:changed", changed);
  });
  it("handles unknown relationship values without crashing or creating markup", () => {
    const { graph, open } = fixture();
    graph.states[2].diplomacy[1] = payload;
    expect(open).not.toThrow();
    expect(document.getElementById("diplomacyBodySection")!.textContent).toContain("Unknown");
    document.getElementById("diplomacyShowMatrix")!.click();
    expect(document.querySelector("img,[onerror]")).toBeNull();
  });
  it("uses escaped formula-safe CSV for country names", () => {
    const { graph, download } = fixture();
    graph.states[1].name = '=HYPERLINK("https://example.test")';
    graph.states[2].name = '은빛,"왕국"';
    document.getElementById("diplomacyExport")!.click();
    const data = download.mock.calls[0][0];
    expect(data).toContain('"\'=HYPERLINK(""https://example.test"")"');
    expect(data).toContain('"은빛,""왕국"""');
    expect(data.startsWith("\uFEFF")).toBe(true);
  });
});
