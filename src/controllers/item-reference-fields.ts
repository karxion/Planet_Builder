import {
  MAGIC_ITEM_CATEGORIES,
  MAGIC_ITEM_REFERENCES,
  MAGIC_ITEM_SOURCES,
  optionKey,
  referenceSourceUrl
} from "@/data/magic-item-references";
import { eligibleItemReferences, referencePowerSummary } from "@/generators/magic-item-generator";
import { t } from "@/services/ui-language";
import type { ItemReferenceEdition } from "@/types/magic-item-reference";
import type { ItemRarity, RealmTreasure } from "@/types/realm-heritage";
import { createRulesReferences } from "./rules-references";

export function appendItemReferenceFields(
  form: HTMLFormElement,
  item: RealmTreasure,
  defaultEdition: ItemReferenceEdition
): void {
  const section = document.createElement("section");
  section.className = "fpb-item-reference";
  const title = document.createElement("h4");
  title.textContent = t("아이템 레퍼런스");
  section.append(title);
  const editionLabel = document.createElement("label");
  editionLabel.textContent = t("판본");
  const edition = document.createElement("select");
  edition.name = "referenceEdition";
  edition.add(new Option(t("2014 + 2024"), "mixed"));
  for (const value of ["2014", "2024"] as const)
    edition.add(new Option(`${value} · ${MAGIC_ITEM_REFERENCES.filter(item => item.edition === value).length}`, value));
  edition.value = item.design?.edition || defaultEdition;
  editionLabel.append(edition);
  section.append(editionLabel);
  const label = document.createElement("label");
  label.textContent = t("참고 원본");
  const select = document.createElement("select");
  select.name = "referenceId";
  label.append(select);
  section.append(label);
  const information = document.createElement("p");
  information.className = "fpb-npc-rule";
  section.append(information);
  const details = document.createElement("details");
  const summary = document.createElement("summary");
  summary.textContent = t("원본 규칙 (영문)");
  const rules = document.createElement("div");
  rules.lang = "en";
  rules.dataset.i18nSkip = "";
  rules.className = "fpb-item-reference-rules";
  details.append(summary, rules);
  section.append(details);
  const source = document.createElement("a");
  source.target = "_blank";
  source.rel = "noopener";
  section.append(source);
  const method = document.createElement("p");
  section.append(method);
  const external = createRulesReferences("item", item.design?.edition || (defaultEdition === "2014" ? "2014" : "2024"));
  section.append(external.element);
  let acceptedSelection = "";

  function updateInformation(updatePower = false) {
    const option = eligibleItemReferences(
      (form.elements.namedItem("rarity") as HTMLSelectElement).value as ItemRarity,
      edition.value as ItemReferenceEdition
    ).find(option => optionKey(option) === select.value);
    if (!option) {
      information.textContent = "";
      rules.replaceChildren();
      source.removeAttribute("href");
      source.textContent = "";
      method.textContent = "";
      return;
    }
    const reference = option.reference;
    external.setEdition(reference.edition);
    information.textContent = `${t(MAGIC_ITEM_CATEGORIES[reference.category])} · ${reference.attunement ? t("조율 필요") : t("조율 불필요")}${option.variant ? ` · ${option.variant}` : ""} · ${t("선택한 하위형의 효과만 적용")}`;
    rules.textContent = `${reference.metadata}\n\n${reference.rules}`;
    source.href = referenceSourceUrl(reference);
    source.textContent = `${MAGIC_ITEM_SOURCES[reference.edition].label} · p.${reference.page}`;
    if (updatePower) {
      const power = form.elements.namedItem("power") as HTMLTextAreaElement | null;
      if (power) power.value = referencePowerSummary(option);
    }
    const power = form.elements.namedItem("power") as HTMLTextAreaElement | null;
    method.textContent = t(
      power?.value.trim() === referencePowerSummary(option)
        ? "원본 효과 유지 · 외형·서사 창작"
        : "원본에서 영감 · GM이 수정한 효과"
    );
  }

  function populate(preserve: boolean) {
    const previous = preserve
      ? select.value
      : item.design
        ? `${item.design.referenceId}|${item.design.variant || ""}`
        : "";
    select.replaceChildren(new Option(t("레퍼런스 없이 유지"), ""));
    const rarity = (form.elements.namedItem("rarity") as HTMLSelectElement).value as ItemRarity;
    for (const option of eligibleItemReferences(rarity, edition.value as ItemReferenceEdition))
      select.add(
        new Option(
          `${option.reference.edition} · ${option.reference.name}${option.variant ? ` / ${option.variant}` : ""}`,
          optionKey(option)
        )
      );
    if ([...select.options].some(option => option.value === previous)) select.value = previous;
    acceptedSelection = select.value;
    updateInformation();
  }
  edition.onchange = () => {
    if (edition.value === "2014" || edition.value === "2024") external.setEdition(edition.value);
    populate(true);
  };
  select.onchange = () => {
    if (select.value && !confirm(t("참고 원본을 변경하고 효능 개요를 바꿀까요? 이름·상징성·메모는 유지됩니다."))) {
      select.value = acceptedSelection;
      updateInformation();
      return;
    }
    updateInformation(true);
    acceptedSelection = select.value;
  };
  form.querySelector('[name="power"]')?.addEventListener("input", () => updateInformation());
  form.querySelector('[name="rarity"]')!.addEventListener("change", () => populate(true));
  form.append(section);
  populate(false);
  if (!item.design) {
    const legacy = document.createElement("p");
    legacy.textContent = t("기존 창작품 · 원본을 선택하기 전까지 내용 유지");
    section.append(legacy);
  }
}
