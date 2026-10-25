import { isNpcPortrait } from "@/data/npc-portrait";
import { prepareNpcPortrait } from "@/services/npc-portrait-image";
import { t } from "@/services/ui-language";

interface ImageHandoffOptions {
  form: HTMLFormElement;
  image?: string;
  getPrompt: () => string;
  onChange: (portrait: string | undefined) => boolean;
  idPrefix: string;
  subject: string;
  deleteQuestion: string;
  actionsSelector?: string;
  headingSelector?: string;
}

export function mountImageHandoff({
  form,
  image: initialImage,
  getPrompt,
  onChange,
  idPrefix,
  subject,
  deleteQuestion,
  actionsSelector = ".fpb-npc-edit-actions",
  headingSelector = ".fpb-npc-heading"
}: ImageHandoffOptions): void {
  const actions = form.querySelector(actionsSelector);
  if (!actions) return;
  let portrait = initialImage;
  let request = 0;
  const button = (label: string, icon: string) => {
    const element = document.createElement("button");
    element.type = "button";
    element.className = icon;
    element.textContent = t(label);
    return element;
  };
  const preview = document.createElement("figure");
  preview.className = "fpb-npc-portrait";
  const image = document.createElement("img");
  image.alt = t(subject);
  image.decoding = "async";
  const remove = button("이미지 삭제", "icon-trash");
  preview.append(image, remove);
  form.querySelector(headingSelector)?.after(preview);
  const updatePreview = () => {
    preview.hidden = !isNpcPortrait(portrait);
    if (isNpcPortrait(portrait)) image.src = portrait;
    else image.removeAttribute("src");
  };
  updatePreview();

  const panel = document.createElement("section");
  panel.className = "fpb-npc-portrait-request";
  panel.id = `${idPrefix}-request`;
  panel.hidden = true;
  const notice = document.createElement("p");
  notice.textContent = t("수동 연결 · 요청문을 복사해 ChatGPT에서 생성한 뒤 이미지를 등록해주세요");
  const prompt = document.createElement("textarea");
  prompt.readOnly = true;
  prompt.rows = 8;
  prompt.setAttribute("aria-label", t("이미지 요청문"));
  const tools = document.createElement("div");
  tools.className = "fpb-npc-portrait-tools";
  const copy = button("요청문 복사", "icon-docs");
  const open = document.createElement("a");
  open.textContent = t("ChatGPT 열기");
  open.href = "https://chatgpt.com/";
  open.target = "_blank";
  open.rel = "noopener noreferrer";
  tools.append(copy, open);
  panel.append(notice, prompt, tools);
  const status = document.createElement("p");
  status.className = "fpb-npc-portrait-status";
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  form.insertBefore(panel, actions);
  form.insertBefore(status, actions);
  const generate = button("ChatGPT에서 생성", "icon-brush");
  generate.id = `${idPrefix}-generate`;
  generate.setAttribute("aria-expanded", "false");
  generate.setAttribute("aria-controls", panel.id);
  const upload = button("이미지 등록", "icon-upload");
  upload.id = `${idPrefix}-upload`;
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/png,image/jpeg,image/webp";
  input.hidden = true;
  input.className = "fpb-image-input";
  input.setAttribute("aria-label", t("이미지 등록"));
  actions.insertBefore(generate, actions.querySelector("a"));
  actions.insertBefore(upload, actions.querySelector("a"));
  form.append(input);
  generate.onclick = () => {
    panel.hidden = !panel.hidden;
    generate.setAttribute("aria-expanded", String(!panel.hidden));
    if (panel.hidden) return;
    prompt.value = getPrompt();
    prompt.focus();
    prompt.select();
  };
  copy.onclick = async () => {
    try {
      await navigator.clipboard.writeText(prompt.value);
      if (form.isConnected) status.textContent = t("복사됨");
    } catch {
      if (!form.isConnected) return;
      prompt.focus();
      prompt.select();
      status.textContent = t("복사하지 못했습니다. 선택된 요청문을 직접 복사해주세요");
    }
  };
  upload.onclick = () => input.click();
  input.onchange = async () => {
    const file = input.files?.[0];
    input.value = "";
    if (!file) return;
    const current = ++request;
    upload.disabled = true;
    status.textContent = t("이미지 처리 중");
    try {
      const result = await prepareNpcPortrait(file);
      if (current !== request || !form.isConnected || !onChange(result)) return;
      portrait = result;
      updatePreview();
      status.textContent = t("이미지 등록됨");
    } catch (error) {
      if (current === request && form.isConnected)
        status.textContent = t(error instanceof Error ? error.message : "이미지를 읽을 수 없습니다");
    } finally {
      if (current === request) upload.disabled = false;
    }
  };
  remove.onclick = () => {
    if (!confirm(t(deleteQuestion))) return;
    request++;
    upload.disabled = false;
    if (!onChange(undefined)) return;
    portrait = undefined;
    updatePreview();
    status.textContent = t("이미지 삭제됨");
  };
}
