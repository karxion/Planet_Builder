import { t } from "@/services/ui-language";

export function initItemLibrary(): void {
  if (document.getElementById("fpb-items-button")) return;
  const button = document.createElement("button");
  button.id = "fpb-items-button";
  button.type = "button";
  button.title = t("매직 아이템");
  button.setAttribute("aria-label", t("매직 아이템"));
  button.setAttribute("aria-haspopup", "dialog");
  button.innerHTML = '<span class="icon-star" aria-hidden="true"></span><span data-item-label></span>';
  button.querySelector("[data-item-label]")!.textContent = t("아이템");
  document.getElementById("fpb-world-button")?.after(button);
  button.onclick = async () => {
    button.disabled = true;
    try {
      const { openItemLibrary } = await import("./world-items");
      openItemLibrary();
    } catch {
      alert(t("아이템 목록을 열지 못했습니다. 다시 시도해주세요"));
    } finally {
      button.disabled = false;
    }
  };
}
