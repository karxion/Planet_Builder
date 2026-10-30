import type { WorldSpacesData } from "@/types/world-spaces";

export const SPACE_LAYER_IDS = [
  "toggleBiomes",
  "toggleHeight",
  "toggleLakes",
  "toggleStates",
  "toggleProvinces",
  "toggleBorders",
  "toggleCells",
  "toggleGrid",
  "toggleRoutes",
  "toggleRelief",
  "toggleGoods",
  "toggleBurgIcons",
  "toggleMarkers",
  "toggleLabels"
] as const;
export type SpaceLayerId = (typeof SPACE_LAYER_IDS)[number];
export interface SpaceLayerPreferences {
  visible?: Partial<Record<SpaceLayerId, boolean>>;
  order?: SpaceLayerId[];
}
export const DEFAULT_SPACE_LAYERS: Record<SpaceLayerId, boolean> = {
  toggleBiomes: false,
  toggleHeight: false,
  toggleLakes: true,
  toggleStates: true,
  toggleProvinces: true,
  toggleBorders: true,
  toggleCells: false,
  toggleGrid: false,
  toggleRoutes: true,
  toggleRelief: true,
  toggleGoods: true,
  toggleBurgIcons: true,
  toggleMarkers: true,
  toggleLabels: true
};
export function spaceLayers(data: WorldSpacesData): Record<SpaceLayerId, boolean> {
  const legacy =
    data.activeSpace === "underwater" && data.underwater?.view === "terrain"
      ? { toggleStates: false, toggleBiomes: true, toggleHeight: true }
      : {};
  return {
    ...DEFAULT_SPACE_LAYERS,
    ...legacy,
    ...(data.activeSpace === "surface" ? {} : data.layers?.[data.activeSpace]?.visible)
  };
}
export function isSpaceLayers(value: unknown): boolean {
  const record = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
  if (!record(value)) return false;
  return Object.entries(value).every(([space, prefs]) => {
    if (!["underwater", "underground"].includes(space) || !record(prefs)) return false;
    if (Object.keys(prefs).some(key => !["visible", "order"].includes(key))) return false;
    if (
      prefs.visible !== undefined &&
      (!record(prefs.visible) ||
        !Object.entries(prefs.visible).every(
          ([id, on]) => SPACE_LAYER_IDS.includes(id as SpaceLayerId) && typeof on === "boolean"
        ))
    )
      return false;
    return (
      prefs.order === undefined ||
      (Array.isArray(prefs.order) &&
        prefs.order.every(id => SPACE_LAYER_IDS.includes(id as SpaceLayerId)) &&
        new Set(prefs.order).size === prefs.order.length)
    );
  });
}
