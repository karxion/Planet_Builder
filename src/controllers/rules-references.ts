import { type RulesReferenceEdition, type RulesReferenceKind, rulesReferenceLinks } from "@/data/rules-references";
import { t } from "@/services/ui-language";
import type { NpcClassId } from "@/types/campaign-world";

export function createRulesReferences(
  kind: RulesReferenceKind,
  initialEdition: RulesReferenceEdition,
  classId: NpcClassId = "none"
) {
  const element = document.createElement("details");
  element.className = "fpb-rules-references";
  const summary = document.createElement("summary");
  summary.textContent = t("외부 규칙 참고 · Wikidot");
  const label = document.createElement("label");
  label.textContent = t("외부 참고 판본");
  const select = document.createElement("select");
  for (const edition of ["2014", "2024"]) select.add(new Option(edition, edition));
  // Deliberately unnamed: browsing external rules must not change saved NPC/item mechanics.
  label.append(select);
  const links = document.createElement("nav");
  links.setAttribute("aria-label", t("외부 규칙 참고 · Wikidot"));
  const notice = document.createElement("small");
  notice.textContent = t("커뮤니티 자료 · UA·홈브루 포함 가능 · 자동 적용 안 됨");
  element.append(summary, label, links, notice);

  function setEdition(edition: RulesReferenceEdition): void {
    select.value = edition;
    links.replaceChildren();
    for (const reference of rulesReferenceLinks(kind, edition, classId)) {
      const anchor = document.createElement("a");
      anchor.textContent = t(reference.label);
      anchor.href = reference.url;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      anchor.dataset.reference = reference.id;
      links.append(anchor);
    }
  }
  select.addEventListener("change", () => {
    if (select.value === "2014" || select.value === "2024") setEdition(select.value);
  });
  setEdition(initialEdition);
  return { element, setEdition };
}
