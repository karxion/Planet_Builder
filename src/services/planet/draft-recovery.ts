import { COMMONER_CR_PROFILES, NPC_CLASSES, NPC_RANKS, NPC_SCOPES } from "@/data/npc-progression";
import { NPC_STAT_BLOCKS } from "@/data/npc-stat-blocks";
import { ALIGNMENTS, DEITY_RANKS, ITEM_RARITIES } from "@/data/realm-heritage";
import { MAGIC_ITEM_CATEGORIES } from "@/data/magic-item-references";
import type { DraftRecovery, EditorDraftSnapshot, EditorDraftValues } from "@/types/editor-draft";
import type { PlanetProject } from "@/types/planet-project";

const MAX_DRAFTS = 256;
const MAX_BYTES = 4 * 1024 * 1024;
const npcFields = "name role templateId appearance personality goal secret notes classId level rank scope commonerCr";
const treasureFields = "name rarity symbolism rpEffect power history notes referenceEdition referenceId";
const religionFields = "name symbol alignment deityName deityRank doctrine headquartersId notes";
const itemFields = "name category rarity unique ownerKind ownerId ownerLabel reward appearance power history notes reference";
const settingsFields =
  "name radiusKm rotationHours axialTiltDeg heightmapPreset seaLevel equatorC northPoleC southPoleC precipitation seed";
const record = (value: unknown): value is Record<string, unknown> =>
  Boolean(value && typeof value === "object" && !Array.isArray(value));

function fields(value: unknown, names: string): value is EditorDraftValues {
  if (!record(value)) return false;
  const allowed = new Set(names.split(" "));
  return Object.entries(value).every(
    ([key, text]) => allowed.has(key) && typeof text === "string" && text.length <= 4000
  );
}

function validChoices(values: EditorDraftValues, key: string): boolean {
  const choices: Record<string, object> = {
    templateId: NPC_STAT_BLOCKS,
    classId: NPC_CLASSES,
    rank: NPC_RANKS,
    scope: NPC_SCOPES,
    commonerCr: COMMONER_CR_PROFILES,
    rarity: ITEM_RARITIES,
    alignment: ALIGNMENTS,
    deityRank: DEITY_RANKS,
    category: MAGIC_ITEM_CATEGORIES,
    unique: { true: true, false: true },
    ownerKind: { none: true, npc: true, unit: true, custom: true },
    referenceEdition: { mixed: true, 2014: true, 2024: true },
    heightmapPreset: { pangea: true, continents: true, archipelago: true, shattered: true }
  };
  if (!Object.hasOwn(values, "name") && !key.startsWith("history:")) return false;
  if (key.startsWith("npc:") && !Object.hasOwn(values, "templateId")) return false;
  if (key.startsWith("item:")) {
    if ("name category rarity unique ownerKind appearance power history notes reference reward".split(" ").some(name => !Object.hasOwn(values, name))) return false;
    if (["npc", "unit"].includes(values.ownerKind) && !Object.hasOwn(values, "ownerId")) return false;
    if (values.ownerKind === "custom" && !Object.hasOwn(values, "ownerLabel")) return false;
  }
  return Object.entries(values).every(([name, value]) => !choices[name] || Object.hasOwn(choices[name], value));
}

export function createDraftRecovery(
  entries: EditorDraftSnapshot[],
  owner: { id: string; projectId: string }
): { drafts: DraftRecovery; draftBytes: number } {
  if (entries.length > MAX_DRAFTS) throw new Error("Draft recovery size limit exceeded");
  const drafts: DraftRecovery = {
    schemaVersion: 1,
    projectId: owner.projectId,
    snapshotId: owner.id,
    entries: structuredClone(entries)
  };
  const draftBytes = JSON.stringify(drafts).length * 2;
  if (draftBytes > MAX_BYTES) throw new Error("Draft recovery size limit exceeded");
  return { drafts, draftBytes };
}

export function readDraftRecovery(
  value: unknown,
  owner: { id: string; projectId: string },
  project: PlanetProject
): { entries: EditorDraftSnapshot[]; rejected: boolean } {
  if (value === undefined) return { entries: [], rejected: false };
  if (
    !record(value) ||
    value.schemaVersion !== 1 ||
    typeof value.projectId !== "string" ||
    typeof value.snapshotId !== "string" ||
    value.projectId !== owner.projectId ||
    value.snapshotId !== owner.id ||
    !Array.isArray(value.entries) ||
    value.entries.length > MAX_DRAFTS
  )
    return { entries: [], rejected: true };
  try {
    if (JSON.stringify(value).length * 2 > MAX_BYTES) return { entries: [], rejected: true };
  } catch {
    return { entries: [], rejected: true };
  }
  const allowed = new Map<string, string>([["planet-settings", settingsFields]]);
  for (const npc of project.campaign?.npcs || []) allowed.set(`npc:${npc.id}`, npcFields);
  for (const item of project.campaign?.itemLibrary?.items || []) allowed.set(`item:${item.id}`, itemFields);
  for (const treasure of project.campaign?.heritage?.treasures || [])
    allowed.set(`heritage:${treasure.id}`, treasureFields);
  for (const religion of project.campaign?.heritage?.religions || [])
    allowed.set(`heritage:${religion.id}`, religionFields);
  for (const nation of project.campaign?.heritage?.nations || []) allowed.set(`history:${nation.stateId}`, "age");
  const entries: EditorDraftSnapshot[] = [];
  const seen = new Set<string>();
  let rejected = false;
  for (const entry of value.entries) {
    const names = record(entry) && typeof entry.key === "string" ? allowed.get(entry.key) : undefined;
    if (
      !record(entry) ||
      typeof entry.key !== "string" ||
      !names ||
      seen.has(entry.key) ||
      !fields(entry.baseline, names) ||
      !fields(entry.values, names) ||
      !validChoices(entry.baseline, entry.key) ||
      !validChoices(entry.values, entry.key)
    ) {
      rejected = true;
      continue;
    }
    seen.add(entry.key);
    entries.push({ key: entry.key, baseline: { ...entry.baseline }, values: { ...entry.values } });
  }
  return { entries, rejected };
}
