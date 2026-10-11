export const MIN_SETTLEMENT_DISTANCE = 12;

export interface SettlementPosition {
  i: number;
  x: number;
  y: number;
  removed?: boolean;
}

interface SettlementDisplay extends SettlementPosition {
  name?: string;
  state?: number;
  cell?: number;
  capital?: number;
  population?: number;
}

export function settlementDisplayRepresentatives(settlements: readonly SettlementDisplay[]): Map<number, number> {
  const representatives = new Map<number, number>();
  const byName = new Map<string, SettlementDisplay[]>();
  const sorted = settlements
    .filter(burg => burg.i && !burg.removed && Number.isFinite(burg.x + burg.y))
    .sort(
      (a, b) =>
        Number(Boolean(b.capital)) - Number(Boolean(a.capital)) ||
        (b.population || 0) - (a.population || 0) ||
        a.i - b.i
    );
  for (const burg of sorted) {
    if (representatives.has(burg.i)) continue;
    const name = burg.name?.normalize("NFKC").replace(/\s+/g, "").toLowerCase() || "";
    const key = `${burg.state || 0}:${name}`;
    const candidates = byName.get(key) || [];
    const existing =
      name &&
      candidates.find(
        other =>
          (burg.cell !== undefined && burg.cell === other.cell) ||
          Math.hypot(burg.x - other.x, burg.y - other.y) < MIN_SETTLEMENT_DISTANCE * 2
      );
    representatives.set(burg.i, existing ? existing.i : burg.i);
    if (!existing) {
      candidates.push(burg);
      byName.set(key, candidates);
    }
  }
  return representatives;
}

export function isSettlementPositionOccupied(
  settlements: readonly SettlementPosition[],
  x: number,
  y: number,
  ignoredId?: number
): boolean {
  return settlements.some(
    burg =>
      burg.i && !burg.removed && burg.i !== ignoredId && Math.hypot(burg.x - x, burg.y - y) < MIN_SETTLEMENT_DISTANCE
  );
}

export function settlementTokenAppearance(
  population: number | undefined,
  capital: number | undefined,
  icon: string,
  baseSize: number,
  automatic = true
): { icon: string; size: number } {
  if (!automatic || !/^#rpg-(capital|city|town|village|hamlet)$/.test(icon)) return { icon, size: baseSize };
  const value = Number.isFinite(population) ? Math.max(0, population!) : 1;
  const tier = capital ? "capital" : value <= 0.1 ? "hamlet" : value <= 0.6 ? "village" : value <= 5 ? "town" : "city";
  const scale = Math.min(1.18, Math.max(0.85, 0.85 + Math.log1p(value) * 0.1));
  return { icon: `#rpg-${tier}`, size: Math.round(baseSize * scale * 100) / 100 };
}
