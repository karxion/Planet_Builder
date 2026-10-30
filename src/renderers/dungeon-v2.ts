import { battleBox } from "@/data/battle-map";
import { DUNGEON_DEVICE_BY_ID } from "@/data/dungeon-devices";
import type { DungeonAssetId, DungeonFloor, DungeonV2 } from "@/types/dungeon-v2";
import { dungeonRoomCenter } from "@/utils/dungeon-grid";
import { dungeonAsset, dungeonAssetDefs } from "./dungeon-assets";
import { escapeAttribute as esc } from "./rpg-asset-renderer";

/** Build a public data object before rendering. No hidden names, devices, notes or destination refs in DOM/defs. */
export function publicDungeonV2(d: DungeonV2) {
  const floors = d.floors
    .filter(f => f.revealed)
    .map(f => {
      const rooms = f.rooms
        .filter(r => r.revealed)
        .map(r => ({ id: r.id, x: r.x, y: r.y, width: r.width, height: r.height }));
      const visibleRooms = new Set(rooms.map(r => r.id)),
        tiles = f.tiles.split("");
      for (const r of f.rooms.filter(r => !r.revealed))
        for (let y = r.y; y < r.y + r.height; y++)
          for (let x = r.x; x < r.x + r.width; x++) tiles[y * f.settings.width + x] = "1";
      return {
        id: f.id,
        name: f.name,
        elevationFt: f.elevationFt,
        width: f.settings.width,
        height: f.settings.height,
        cellFeet: f.cellFeet,
        tiles: tiles.join(""),
        rooms,
        endpoints: f.endpoints
          .filter(e => e.revealed && visibleRooms.has(e.roomId))
          .map(e => ({ id: e.id, roomId: e.roomId, x: e.x, y: e.y, width: e.width, height: e.height })),
        entities: f.entities
          .filter(e => e.revealed && visibleRooms.has(e.roomId))
          .map(e => ({
            id: e.id,
            roomId: e.roomId,
            x: e.x,
            y: e.y,
            width: e.width,
            height: e.height,
            assetId: e.assetId,
            rotation: e.rotation,
            blocksMovement: e.blocksMovement,
            blocksSight: e.blocksSight,
            movementCost: e.movementCost,
            open: e.device ? e.device.open || ["disabled", "destroyed"].includes(e.device.state) : e.opened,
            looted: e.looted,
            destroyed: e.device?.state === "destroyed",
            effects:
              e.device && ["triggered", "cooldown", "telegraphed"].includes(e.device.state) ? e.device.effectCells : []
          }))
      };
    });
  const endpoints = new Set(floors.flatMap(f => f.endpoints.map(e => `${f.id}/${e.id}`)));
  return {
    version: 1,
    kind: "dungeon-player" as const,
    name: d.name,
    floorOrder: d.floorOrder.filter(id => floors.some(f => f.id === id)),
    floors,
    connections: d.connections
      .filter(
        c =>
          c.revealed &&
          endpoints.has(`${c.from.floorId}/${c.from.endpointId}`) &&
          endpoints.has(`${c.to.floorId}/${c.to.endpointId}`)
      )
      .map(c => ({ id: c.id, from: c.from, to: c.to, kind: c.kind, bidirectional: c.bidirectional }))
  };
}
export function renderDungeonV2(
  d: DungeonV2,
  floorId: string,
  options: {
    gm: boolean;
    roomId?: string;
    tactical?: boolean;
    overview?: boolean;
    grid?: boolean;
    language?: "ko" | "en";
  }
): string {
  const unit = 24,
    publicData = publicDungeonV2(d),
    floor = d.floors.find(f => f.id === floorId);
  if (!floor || (!options.gm && !publicData.floors.some(f => f.id === floorId))) return "";
  const { width, height } = floor.settings,
    visible = publicData.floors.find(f => f.id === floorId);
  const rooms = options.gm ? floor.rooms : floor.rooms.filter(r => r.revealed);
  const entities = options.gm ? floor.entities : floor.entities.filter(e => visible!.entities.some(v => v.id === e.id));
  const tiles = options.gm ? floor.tiles : visible!.tiles;
  const focus = rooms.find(r => r.id === options.roomId) || rooms[0];
  if (!focus) return "";
  const center = dungeonRoomCenter(focus);
  const box = options.tactical
    ? battleBox(d.battleMap, { x: (center.x + 0.5) * unit, y: (center.y + 0.5) * unit }, unit)
    : { x: 0, y: 0, width: width * unit, height: height * unit };
  const pixelWidth = options.tactical ? d.battleMap.columns * d.battleMap.cellPixels : width * 64;
  const pixelHeight = options.tactical ? d.battleMap.rows * d.battleMap.cellPixels : height * 64;
  const floorAsset: DungeonAssetId = floor.settings.structure === "cavern" ? "D02" : "D01";
  const ids: DungeonAssetId[] = [floorAsset, ...entities.map(e => e.assetId)];
  const endpoints = options.gm
    ? floor.endpoints
    : floor.endpoints.filter(e => visible!.endpoints.some(v => v.id === e.id));
  ids.push(...endpoints.map((_, i) => (i ? ("D10" as const) : ("D09" as const))));
  let path = "",
    walls = "";
  const walk = (x: number, y: number) => x >= 0 && y >= 0 && x < width && y < height && tiles[y * width + x] === "0";
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++)
      if (walk(x, y)) {
        path += `M${x * unit},${y * unit}h${unit}v${unit}h-${unit}Z`;
        for (const [dx, dy, sx, sy, ex, ey] of [
          [-1, 0, 0, 0, 0, 1],
          [1, 0, 1, 0, 1, 1],
          [0, -1, 0, 0, 1, 0],
          [0, 1, 0, 1, 1, 1]
        ])
          if (!walk(x + dx, y + dy))
            walls += `M${(x + sx) * unit},${(y + sy) * unit}L${(x + ex) * unit},${(y + ey) * unit}`;
      }
  const image = (e: {
    assetId: DungeonAssetId;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
  }) => {
    const rotated = e.rotation === 90 || e.rotation === 270,
      w = (rotated ? e.height : e.width) * unit,
      h = (rotated ? e.width : e.height) * unit;
    const cx = (e.x + e.width / 2) * unit,
      cy = (e.y + e.height / 2) * unit;
    return dungeonAsset(e.assetId, cx - w / 2, cy - h / 2, w, h, e.rotation);
  };
  const shapes = entities
    .map(e => {
      const opened = e.device
        ? e.device.open || ["disabled", "destroyed"].includes(e.device.state)
        : e.opened || e.looted;
      const monster = e.feature?.kind === "monster";
      const detail = options.gm
        ? DUNGEON_DEVICE_BY_ID.get(e.device?.templateId || "lever")?.name[options.language || "ko"] || e.assetId
        : e.assetId;
      return `<g ${options.gm ? `data-dv2-entity="${esc(e.id)}" role="button" tabindex="0" aria-label="${esc(detail)}"` : ""} ${opened ? 'opacity="0.4"' : ""}>${options.gm ? `<rect data-entity-hit="" x="${e.x * unit}" y="${e.y * unit}" width="${e.width * unit}" height="${e.height * unit}" fill="transparent" pointer-events="all"/>` : ""}${monster ? `<circle cx="${(e.x + 0.5) * unit}" cy="${(e.y + 0.5) * unit}" r="9" fill="#a74141" stroke="#ecd7a2"/><text x="${(e.x + 0.5) * unit}" y="${(e.y + 0.5) * unit + 4}" text-anchor="middle" font-size="11" fill="white">${options.gm && e.feature?.kind === "monster" && e.feature.boss ? "♛" : "M"}</text>` : image(e)}${options.gm && e.device ? `<text x="${e.x * unit}" y="${e.y * unit + 9}" font-size="8" fill="#111" stroke="white" stroke-width="2" paint-order="stroke">${esc(e.device.state)}</text>` : ""}</g>`;
    })
    .join("");
  const effects = entities
    .filter(e => e.device && ["triggered", "cooldown", "telegraphed"].includes(e.device.state))
    .map(
      e =>
        `<path d="${e.device!.effectCells.map(p => `M${p.x * unit},${p.y * unit}h${unit}v${unit}h-${unit}Z`).join("")}" fill="${e.device!.templateId === "flood" ? "#3e9fc780" : "#d8943980"}" stroke="#f0d180" stroke-dasharray="${e.device!.state === "telegraphed" ? "4 4" : "none"}" pointer-events="none"/>`
    )
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" class="fpb-dungeon-map" width="${pixelWidth}" height="${pixelHeight}" viewBox="${box.x} ${box.y} ${box.width} ${box.height}" role="img" aria-label="${esc(floor.name)}">
    <defs>${dungeonAssetDefs(ids, options.overview ? "overview" : "battle")}<pattern id="dv2-floor" width="${unit}" height="${unit}" patternUnits="userSpaceOnUse">${dungeonAsset(floorAsset, 0, 0, unit, unit)}</pattern><pattern id="dv2-grid" width="${unit}" height="${unit}" patternUnits="userSpaceOnUse"><path d="M${unit},0H0V${unit}" fill="none" stroke="#82959d" stroke-opacity=".4"/></pattern></defs>
    <rect x="${box.x}" y="${box.y}" width="${box.width}" height="${box.height}" fill="#182125"/><path d="${path}" fill="url(#dv2-floor)"/><path d="${walls}" stroke="#737e86" stroke-width="5" fill="none"/>
    ${rooms.map((r, i) => `<rect data-dv2-room="${esc(r.id)}" role="button" tabindex="0" aria-label="${i + 1}" x="${r.x * unit + 2}" y="${r.y * unit + 2}" width="${r.width * unit - 4}" height="${r.height * unit - 4}" fill="${r.id === options.roomId ? "#4098b72b" : "transparent"}" stroke="${r.id === options.roomId ? "#82d8eb" : "none"}"/>`).join("")}
    ${effects}${endpoints.map((e, i) => `<g ${options.gm ? `data-dv2-endpoint="${esc(e.id)}" role="button" tabindex="0"` : ""}>${image({ assetId: i ? "D10" : "D09", x: e.x, y: e.y, width: e.width, height: e.height, rotation: 0 })}</g>`).join("")}${shapes}
    ${rooms.map((r, i) => `<text x="${r.x * unit + 4}" y="${r.y * unit + 14}" pointer-events="none" font-size="12" font-family="sans-serif" fill="white" stroke="#222" stroke-width="2" paint-order="stroke">${i + 1}${options.gm && r.secret ? " S" : ""}</text>`).join("")}
    ${options.grid ? `<rect x="${box.x}" y="${box.y}" width="${box.width}" height="${box.height}" fill="url(#dv2-grid)" pointer-events="none"/>` : ""}</svg>`;
}
export function renderDungeonSection(d: DungeonV2, gm: boolean): string {
  const visible = new Set(gm ? d.floorOrder : publicDungeonV2(d).floorOrder);
  const floors = d.floorOrder.filter(id => visible.has(id)).map(id => d.floors.find(f => f.id === id)!);
  if (!floors.length) return "";
  return `<div class="fpb-dv2-section" aria-label="층 연결 개략도">${floors.map(f => `<div><strong>${esc(f.name)}</strong> · ${f.elevationFt} ft</div>`).join("")}${d.connections
    .filter(
      c =>
        visible.has(c.from.floorId) &&
        visible.has(c.to.floorId) &&
        (gm || publicDungeonV2(d).connections.some(v => v.id === c.id))
    )
    .map(
      c =>
        `<p>${esc(floors.find(f => f.id === c.from.floorId)!.name)} ${c.bidirectional ? "↔" : "→"} ${esc(floors.find(f => f.id === c.to.floorId)!.name)} · ${esc(c.kind)}</p>`
    )
    .join("")}<small>개략 연결도 · 층간 거리는 고도 기준 / schematic, not to scale</small></div>`;
}
export const dungeonFloorById = (d: DungeonV2, id: string): DungeonFloor => d.floors.find(f => f.id === id)!;
