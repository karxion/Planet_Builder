// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { prepareNpcPortrait } from "@/services/npc-portrait-image";
import type { WorldNpc } from "@/types/campaign-world";
import { mountNpcPortrait } from "@/controllers/npc-portrait";

vi.mock("@/services/npc-portrait-image", () => ({ prepareNpcPortrait: vi.fn() }));
const portrait = "data:image/jpeg;base64,/9j/2Q==";
const npc: WorldNpc = {
  id: "npc:1:0",
  villageId: "village:1",
  name: "기사",
  role: "기사",
  templateId: "noble",
  appearance: "외투",
  personality: "",
  goal: "",
  secret: "SECRET",
  notes: "PRIVATE",
  edited: false
};
const flush = () => new Promise(resolve => setTimeout(resolve, 0));
describe("NPC portrait editor", () => {
  let form: HTMLFormElement;
  let commit: ReturnType<typeof vi.fn<(portrait: string | undefined) => boolean>>;
  beforeEach(() => {
    vi.resetAllMocks();
    document.body.innerHTML =
      '<form><div class="fpb-npc-heading"></div><textarea name="notes">미적용 메모</textarea><div class="fpb-npc-edit-actions"><button type="submit">저장</button><a href="https://example.com">SRD</a></div></form>';
    form = document.querySelector("form")!;
    commit = vi.fn(() => true);
    mountNpcPortrait({ form, npc, getDraft: () => ({ ...npc, appearance: "수정된 외투" }), onChange: commit });
  });
  afterEach(() => vi.unstubAllGlobals());
  const choose = () => {
    const input = form.querySelector<HTMLInputElement>('[type="file"]')!;
    Object.defineProperty(input, "files", {
      value: [new File(["image"], "a.png", { type: "image/png" })],
      configurable: true
    });
    input.dispatchEvent(new Event("change", { bubbles: true }));
  };
  it("offers an explicit manual handoff using current unsaved appearance, not private notes", async () => {
    const clipboard = { writeText: vi.fn().mockResolvedValue(undefined) };
    vi.stubGlobal("navigator", { clipboard });
    form.querySelector<HTMLButtonElement>("#fpb-npc-portrait-generate")!.click();
    const prompt = form.querySelector<HTMLTextAreaElement>(".fpb-npc-portrait-request textarea")!;
    expect(prompt.value).toContain("수정된 외투");
    expect(prompt.value).not.toContain("PRIVATE");
    expect(prompt.value).not.toContain("SECRET");
    expect(form.querySelector<HTMLAnchorElement>(".fpb-npc-portrait-tools a")!.href).toBe("https://chatgpt.com/");
    form.querySelector<HTMLButtonElement>(".fpb-npc-portrait-tools button")!.click();
    await flush();
    expect(clipboard.writeText).toHaveBeenCalledWith(prompt.value);
    expect(commit).not.toHaveBeenCalled();
  });
  it("registers and removes images without submitting or losing text edits", async () => {
    vi.mocked(prepareNpcPortrait).mockResolvedValue(portrait);
    const submit = vi.fn();
    form.onsubmit = submit;
    choose();
    await flush();
    expect(commit).toHaveBeenCalledWith(portrait);
    expect(form.querySelector<HTMLImageElement>("figure img")!.src).toBe(portrait);
    expect(form.querySelector<HTMLTextAreaElement>('[name="notes"]')!.value).toBe("미적용 메모");
    expect(submit).not.toHaveBeenCalled();
    vi.stubGlobal("confirm", () => true);
    form.querySelector<HTMLButtonElement>("figure button")!.click();
    expect(commit).toHaveBeenLastCalledWith(undefined);
    expect(form.querySelector("figure")!.hidden).toBe(true);
  });
  it("does not attach a delayed upload to another NPC after selection changes", async () => {
    let resolve!: (value: string) => void;
    vi.mocked(prepareNpcPortrait).mockReturnValue(
      new Promise(done => {
        resolve = done;
      })
    );
    choose();
    form.remove();
    resolve(portrait);
    await flush();
    expect(commit).not.toHaveBeenCalled();
  });
  it("keeps the prompt selectable when clipboard permission is denied", async () => {
    vi.stubGlobal("navigator", { clipboard: { writeText: vi.fn().mockRejectedValue(new Error("denied")) } });
    form.querySelector<HTMLButtonElement>("#fpb-npc-portrait-generate")!.click();
    form.querySelector<HTMLButtonElement>(".fpb-npc-portrait-tools button")!.click();
    await flush();
    expect(form.querySelector('[role="status"]')!.textContent).toContain("직접 복사");
    expect(document.activeElement).toBe(form.querySelector(".fpb-npc-portrait-request textarea"));
  });
  it("keeps existing images when upload fails", async () => {
    vi.mocked(prepareNpcPortrait).mockRejectedValue(new Error("이미지를 읽을 수 없습니다"));
    choose();
    await flush();
    expect(commit).not.toHaveBeenCalled();
    expect(form.querySelector('[role="status"]')!.textContent).toContain("이미지를 읽을 수 없습니다");
    expect(form.querySelector<HTMLButtonElement>("#fpb-npc-portrait-upload")!.disabled).toBe(false);
  });
});
