import { dungeonInSpace } from "@/data/dungeon-spaces";
import { isAdventureSite } from "@/data/adventure-sites";
import { populateAdventureMarkers } from "@/generators/adventure-site-markers";
import { EditorDrafts } from "@/services/editor-drafts";
import type { WorldSpacesData } from "@/types/world-spaces";

/** Prepare on copies, so a failed world generation cannot discard saved dungeon interiors or notes. */
export function prepareSpaceDungeons(data: WorldSpacesData): () => void {
  if (typeof pack === "undefined" || !pack.cells?.i || typeof notes === "undefined") return () => {};
  const draft = { ...pack, markers: [...pack.markers] },
    draftNotes = [...notes];
  const depths = data.activeSpace === "underground" ? data.underground!.levels.map(l => l.id) : [undefined];
  const drafts = EditorDrafts.snapshot();
  for (const levelId of depths) {
    const scope = structuredClone(data);
    if (scope.underground && levelId) scope.underground.activeLevel = levelId;
    const removed = new Set(
      draft.markers
        .filter(
          m =>
            dungeonInSpace(m, scope) &&
            isAdventureSite(m.adventure) &&
            !m.adventure.edited &&
            !m.lock &&
            !m.interior &&
            !drafts.some(d => d.key.startsWith(`dungeon:${m.i}:`))
        )
        .map(m => m.i)
    );
    draft.markers = draft.markers.filter(m => !removed.has(m.i));
    for (let i = draftNotes.length - 1; i >= 0; i--)
      if ([...removed].some(id => draftNotes[i].id === `marker${id}`)) draftNotes.splice(i, 1);
    populateAdventureMarkers(
      draft,
      draftNotes,
      String(seed),
      { width: graphWidth, height: graphHeight },
      undefined,
      scope.activeSpace === "underwater" ? scope.underwater!.generation : scope.underground!.generation,
      scope
    );
  }
  return () => {
    pack.markers = draft.markers;
    notes = draftNotes;
  };
}
