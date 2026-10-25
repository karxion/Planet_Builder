// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EditorDraftStore } from "./editor-drafts";

describe("Editor drafts", () => {
  let store: EditorDraftStore;
  const createForm = () => {
    const form = document.createElement("form");
    form.innerHTML =
      '<input name="name" value="original"><input name="level" type="number" value="1"><textarea name="notes"></textarea>';
    document.body.append(form);
    return form;
  };
  const input = (form: HTMLFormElement, name: string, value: string) => {
    const field = form.elements.namedItem(name) as HTMLInputElement;
    field.value = value;
    field.dispatchEvent(new Event("input", { bubbles: true }));
  };
  beforeEach(() => {
    document.body.replaceChildren();
    store = new EditorDraftStore();
  });

  it("keeps unapplied values separate from committed data and restores them after replacement", () => {
    const committed = { name: "original" };
    const form = createForm();
    store.bind(form, "npc:1", () => {});
    input(form, "name", "draft");
    input(form, "notes", "private draft");
    expect(committed.name).toBe("original");
    form.remove();
    const replacement = createForm();
    store.bind(replacement, "npc:1", () => {});
    expect((replacement.elements.namedItem("name") as HTMLInputElement).value).toBe("draft");
    expect(store.read("npc:1")?.notes).toBe("private draft");
    expect(store.count).toBe(1);
  });

  it("tracks separate entities and clears dirty status after reverting all fields", () => {
    const first = createForm();
    const second = createForm();
    store.bind(first, "npc:1", () => {});
    store.bind(second, "npc:2", () => {});
    input(first, "name", "one");
    input(second, "name", "two");
    expect(store.count).toBe(2);
    input(first, "name", "original");
    expect(store.count).toBe(1);
    expect(store.read("npc:1")).toBeUndefined();
  });

  it("retains empty numeric inputs without treating them as a committed zero", () => {
    const form = createForm();
    store.bind(form, "npc:1", () => {});
    input(form, "level", "");
    form.remove();
    const replacement = createForm();
    store.bind(replacement, "npc:1", () => {});
    expect((replacement.elements.namedItem("level") as HTMLInputElement).value).toBe("");
    expect(store.count).toBe(1);
  });

  it("captures before a select handler replaces the form and preserves normalized preview fields", () => {
    const form = createForm();
    form.innerHTML += '<select name="classId"><option>fighter</option><option>none</option></select>';
    store.bind(form, "npc:1", () => {});
    const select = form.elements.namedItem("classId") as HTMLSelectElement;
    select.onchange = () => {
      expect(store.read("npc:1")?.classId).toBe("none");
      form.remove();
      const replacement = createForm();
      (replacement.elements.namedItem("level") as HTMLInputElement).value = "1";
      store.bind(replacement, "npc:1", () => {}, false);
    };
    select.value = "none";
    select.dispatchEvent(new Event("change"));
    expect(store.read("npc:1")?.level).toBe("1");
  });

  it("recaptures a canceled selection and programmatically changed dependent fields", async () => {
    const form = createForm();
    store.bind(form, "item:1", () => {});
    const name = form.elements.namedItem("name") as HTMLInputElement;
    name.onchange = () => {
      name.value = "original";
      (form.elements.namedItem("notes") as HTMLTextAreaElement).value = "dependent";
    };
    name.value = "canceled";
    name.dispatchEvent(new Event("change"));
    await Promise.resolve();
    expect(store.read("item:1")).toMatchObject({ name: "original", notes: "dependent" });
  });

  it("rebinds a reused settings form without duplicate listeners or stale baselines", async () => {
    const notify = vi.fn();
    store = new EditorDraftStore(notify);
    const form = createForm();
    store.bind(form, "settings", () => {});
    input(form, "name", "applied");
    store.clear("settings");
    store.bind(form, "settings", () => {});
    expect(store.count).toBe(0);
    expect(form.querySelectorAll(".fpb-draft-notice")).toHaveLength(1);
    notify.mockClear();
    input(form, "name", "new draft");
    expect(notify).toHaveBeenCalledTimes(1);
    input(form, "name", "applied");
    expect(store.count).toBe(0);
  });

  it("discards only the requested draft and returns defensive copies", () => {
    const form = createForm();
    const discarded = vi.fn();
    store.bind(form, "npc:1", discarded);
    input(form, "name", "draft");
    store.read("npc:1")!.name = "external mutation";
    expect(store.read("npc:1")!.name).toBe("draft");
    form.querySelector<HTMLButtonElement>(".fpb-draft-notice button")!.click();
    expect(store.count).toBe(0);
    expect(discarded).toHaveBeenCalledOnce();
  });

  it("restores a serialized draft into a fresh editor without committing it", () => {
    const form = createForm();
    store.bind(form, "npc:1", () => {});
    input(form, "notes", "unfinished story");
    input(form, "level", "");
    const saved = store.snapshot();
    form.remove();
    const nextSession = new EditorDraftStore();
    nextSession.restore(saved);
    saved[0].values.notes = "external change";
    const reopened = createForm();
    nextSession.bind(reopened, "npc:1", () => {});
    expect((reopened.elements.namedItem("notes") as HTMLTextAreaElement).value).toBe("unfinished story");
    expect((reopened.elements.namedItem("level") as HTMLInputElement).value).toBe("");
    expect(nextSession.count).toBe(1);
  });

  it("serializes explicit empty state after a draft is discarded", () => {
    const form = createForm();
    store.bind(form, "npc:1", () => {});
    input(form, "name", "pending");
    store.clear("npc:1");
    const nextSession = new EditorDraftStore();
    nextSession.restore(store.snapshot());
    expect(nextSession.count).toBe(0);
  });
});
