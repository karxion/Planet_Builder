import { t } from "@/services/ui-language";
import type { CampaignWorld } from "@/types/campaign-world";

/** Read-only selection panel; editing continues in the existing religion editor. */
export function createHeadquartersDetails(world: () => CampaignWorld | undefined) {
  const panel = document.createElement("section");
  panel.id = "fpb-headquarters-panel";
  panel.hidden = true;
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "false");
  panel.setAttribute("aria-labelledby", "fpb-headquarters-title");
  let previousFocus: Element | null = null;
  const node = <K extends keyof HTMLElementTagNameMap>(tag: K, text: string) => {
    const element = document.createElement(tag);
    element.textContent = text;
    return element;
  };
  function close(restoreFocus = true) {
    const id = panel.dataset.location;
    panel.hidden = true;
    delete panel.dataset.location;
    const marker = [...document.querySelectorAll<SVGElement>("#fpb-headquarters [data-headquarters]")].find(
      element => element.dataset.headquarters === id
    );
    marker?.setAttribute("aria-pressed", "false");
    if (restoreFocus) {
      const target = previousFocus?.isConnected ? previousFocus : marker;
      if (target instanceof HTMLElement || target instanceof SVGElement) target.focus();
    }
    previousFocus = null;
  }
  function open(locationId: string) {
    const campaign = world();
    const home = campaign?.units.find(unit => unit.id === locationId);
    const religions = campaign?.heritage?.religions.filter(religion => religion.headquartersId === locationId);
    if (!campaign?.heritage?.showHeadquarters || !home || !religions?.length) return;
    previousFocus = document.activeElement;
    panel.replaceChildren();
    panel.dataset.location = locationId;
    const header = node("header", "");
    const title = node("h2", t("총본산"));
    title.id = "fpb-headquarters-title";
    const dismiss = node("button", "×");
    dismiss.type = "button";
    dismiss.setAttribute("aria-label", t("닫기"));
    dismiss.onclick = () => close();
    header.append(title, dismiss);
    const location = node("p", `${t(home.level === "village" ? "소재 도시" : "국가 중심")}: ${home.name}`);
    location.dataset.i18nSkip = "";
    const country = campaign.units.find(unit => unit.level === "country" && unit.stateId === home.stateId);
    const nation = node("p", `${t("국가")}: ${country?.name || t("소속 없음")}`);
    nation.dataset.i18nSkip = "";
    const list = node("ul", "");
    for (const religion of religions) {
      const item = node("li", "");
      const name = node("strong", religion.name);
      name.dataset.i18nSkip = "";
      const deity = node("span", religion.deityName);
      deity.dataset.i18nSkip = "";
      const edit = node("button", t("교단 상세"));
      edit.type = "button";
      edit.dataset.religion = religion.id;
      edit.setAttribute("aria-label", `${t("교단 상세")}: ${religion.name}`);
      edit.onclick = () => {
        close(false);
        window.dispatchEvent(new CustomEvent("realm:religion-selected", { detail: religion.id }));
      };
      item.append(name, deity, edit);
      list.append(item);
    }
    panel.append(header, location, nation, list);
    panel.hidden = false;
    dismiss.focus();
  }
  panel.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    event.preventDefault();
    event.stopPropagation();
    close();
  });
  document.body.append(panel);
  return { open, close };
}
