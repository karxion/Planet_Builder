import type { EditorDraftSnapshot, EditorDraftValues } from "@/types/editor-draft";
import { t } from "./ui-language";

type Values = EditorDraftValues;
interface Draft {
  baseline: Values;
  values: Values;
}

const controls = (form: HTMLFormElement) =>
  [...form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>("[name]")].filter(
    control => control.name && !control.disabled && !control.closest("[data-fpb-preference]")
  );
const read = (form: HTMLFormElement): Values =>
  Object.fromEntries(
    controls(form).map(control => [
      control.name,
      control instanceof HTMLInputElement && control.type === "checkbox" ? String(control.checked) : control.value
    ])
  );
const equal = (left: Values, right: Values) =>
  Object.keys(left).length === Object.keys(right).length && Object.keys(left).every(key => left[key] === right[key]);

/** Unapplied form values are deliberately separate from the serialized world. */
export class EditorDraftStore {
  private drafts = new Map<string, Draft>();
  private bindings = new WeakMap<HTMLFormElement, () => void>();
  revision = 0;
  constructor(private notify: () => void = () => {}) {}

  get count(): number {
    return this.drafts.size;
  }

  read(key: string): Values | undefined {
    const values = this.drafts.get(key)?.values;
    return values && { ...values };
  }

  snapshot(): EditorDraftSnapshot[] {
    return [...this.drafts].map(([key, draft]) => ({
      key,
      baseline: { ...draft.baseline },
      values: { ...draft.values }
    }));
  }

  restore(entries: EditorDraftSnapshot[]): void {
    this.drafts = new Map(
      entries.map(({ key, baseline, values }) => [key, { baseline: { ...baseline }, values: { ...values } }])
    );
    this.revision++;
    this.notify();
  }

  clear(key?: string): void {
    if (key ? this.drafts.has(key) : this.drafts.size) this.revision++;
    if (key) this.drafts.delete(key);
    else this.drafts.clear();
    this.notify();
  }

  bind(form: HTMLFormElement, key: string, onDiscard: () => void, restore = true): void {
    this.bindings.get(form)?.();
    form.dataset.fpbDraft = key;
    const previous = this.drafts.get(key);
    const baseline = previous?.baseline || read(form);
    if (previous && restore) {
      for (const control of controls(form)) {
        const value = previous.values[control.name];
        if (value === undefined) continue;
        if (control instanceof HTMLInputElement && control.type === "checkbox") control.checked = value === "true";
        else control.value = value;
      }
    }
    const notice = document.createElement("div");
    notice.className = "fpb-draft-notice";
    const label = document.createElement("span");
    label.textContent = t("적용 전 초안 · 프로젝트 파일에 미포함");
    const discard = document.createElement("button");
    discard.type = "button";
    discard.className = "icon-ccw";
    discard.title = t("초안 버리기");
    discard.setAttribute("aria-label", discard.title);
    discard.onclick = () => {
      this.clear(key);
      onDiscard();
    };
    notice.append(label, discard);
    form.append(notice);
    const capture = () => {
      const values = read(form);
      const previous = this.drafts.get(key)?.values;
      const dirty = !equal(baseline, values);
      if (dirty ? !previous || !equal(previous, values) : Boolean(previous)) this.revision++;
      if (!dirty) this.drafts.delete(key);
      else this.drafts.set(key, { baseline, values });
      notice.hidden = !this.drafts.has(key);
      this.notify();
    };
    const changed = () => {
      capture();
      // Reference selectors can update dependent fields or cancel their choice.
      queueMicrotask(() => {
        if (form.isConnected && this.bindings.get(form) === cleanup) capture();
      });
    };
    const cleanup = () => {
      form.removeEventListener("input", capture, true);
      form.removeEventListener("change", changed, true);
      notice.remove();
    };
    this.bindings.set(form, cleanup);
    form.addEventListener("input", capture, true);
    form.addEventListener("change", changed, true);
    capture();
  }
}

export const EditorDrafts = new EditorDraftStore(() => window.dispatchEvent(new Event("project:drafts-changed")));
