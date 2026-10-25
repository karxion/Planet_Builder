import { Campaign } from "@/controllers/campaign-world";
import { removeDeorumFromNotes } from "@/services/external-character-policy";
import { selectLocalEncounterNpc } from "@/utils/localEncounter";

declare global {
  var openLocalEncounter: (markerId: number) => boolean;
}

let initialized = false;
export function initLocalEncounters(): void {
  if (initialized) return;
  initialized = true;
  window.openLocalEncounter = id => {
    const marker = pack.markers.find(m => m.i === id);
    if (marker?.type !== "encounters") return false;
    const world = Campaign.get();
    if (!world) return false;
    const npc = selectLocalEncounterNpc(marker, pack.cells.state[marker.cell], pack.burgs, world.npcs);
    if (!npc) return false;
    Campaign.openNpc(npc.id);
    return true;
  };
  const clean = () => {
    if (typeof notes !== "undefined" && Array.isArray(notes) && removeDeorumFromNotes(notes))
      window.dispatchEvent(new Event("project:changed"));
  };
  for (const event of ["map:loaded", "map:generated"]) window.addEventListener(event, clean);
  clean();
}
