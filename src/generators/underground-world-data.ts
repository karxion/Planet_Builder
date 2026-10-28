import type { UndergroundMode } from "@/types/underground";
import type { WorldSpacesData } from "@/types/world-spaces";

export function prepareUndergroundWorld(existing: WorldSpacesData, mode: UndergroundMode) {
  const data = structuredClone(existing);
  data.sites = data.sites.filter(site => site.origin !== "underground" || site.edited);
  const ids = new Set(data.sites.map(site => site.id));
  data.links = data.links.filter(link => link.origin !== "underground" && ids.has(link.from) && ids.has(link.to));
  let generation = (existing.underground?.generation || 0) + 1;
  while ([...data.sites, ...data.links].some(s => s.id.startsWith(`ug:${generation}:`))) generation++;
  const names =
    mode === "hollow" ? ["내해 연맹", "균림 회합", "내부 고원 동맹"] : ["흑요석 연합", "균사 회합", "깊은 샘 동맹"];
  for (let i = 0; i < 3; i++)
    if (!data.factions.some(f => f.id === `ug-faction:${i}`))
      data.factions.push({
        id: `ug-faction:${i}`,
        name: names[i],
        color: ["#c494b9", "#88bc90", "#80aec9"][i],
        notes: mode === "hollow" ? "내부 대륙과 내해의 거주지를 잇는 창작 세력" : "지저 공동과 거주지를 잇는 창작 세력"
      });
  return { data, generation, prefix: `ug:${generation}:` };
}
