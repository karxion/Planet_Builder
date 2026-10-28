import Alea from "alea";
import { generatedTemplate as gf, generatedText as gt } from "@/utils/generation-text";
import { Delaunay } from "d3";
import type { SettlementMap, SettlementMapInput } from "@/types/settlement-map";

export function generateSettlementMap(input: SettlementMapInput): SettlementMap {
  const random = Alea(`${input.seed}:settlement-map-v1`);
  const points: [number, number][] = [];
  const large = input.capital || input.population > 5;
  const spacing = large ? 57 : 78;
  for (let y = 120; y < 700; y += spacing)
    for (let x = input.port ? 240 : 150; x < 1080; x += spacing) {
      const px = x + (random() - 0.5) * spacing * 0.5;
      const py = y + (random() - 0.5) * spacing * 0.5;
      if (((px - 620) / 470) ** 2 + ((py - 410) / 285) ** 2 < 1) points.push([px, py]);
    }
  const voronoi = Delaunay.from(points).voronoi([120, 90, 1100, 720]);
  const buildings: SettlementMap["buildings"] = [];
  for (const [id, center] of points.entries()) {
    if (Math.hypot(center[0] - 620, center[1] - 410) < 78) continue;
    if (Math.abs(center[0] - 620) < 45 || Math.abs(center[1] - 410) < 45) continue;
    if (input.river && Math.abs(center[0] - (830 + 35 * Math.sin(center[1] / 130))) < 40) continue;
    const cell = voronoi.cellPolygon(id);
    if (!cell) continue;
    const polygon = cell.slice(0, -1).map(([x, y]) => {
      const inset = Math.min(0.62, 32 / Math.hypot(x - center[0], y - center[1]));
      return [center[0] + (x - center[0]) * inset, center[1] + (y - center[1]) * inset] as [number, number];
    });
    const door: [number, number] = [(polygon[0][0] + polygon[1][0]) / 2, (polygon[0][1] + polygon[1][1]) / 2];
    buildings.push({
      id,
      center,
      polygon,
      door,
      kind:
        buildings.length === 0
          ? input.capital
            ? "keep"
            : "guild"
          : buildings.length === 1
            ? "inn"
            : buildings.length === 2
              ? "guild"
              : "house",
      color: ["#9e5147", "#b98255", "#526e7c", "#9c8062"][Math.floor(random() * 4)]
    });
  }
  const trees: SettlementMap["trees"] = [];
  for (let i = 0; i < 160; i++) {
    const x = random() * 1200,
      y = random() * 800;
    if ((x < 180 && input.port) || Math.hypot((x - 620) / 1.5, y - 410) < 320) continue;
    trees.push([x, y, 5 + random() * 8]);
  }
  return {
    version: 1,
    input: { ...input },
    width: 1200,
    height: 800,
    buildings,
    trees,
    district: { x: 470, y: 300, width: 320, height: 220 }
  };
}

export function generateSettlementHistory(seed: string, name: string, capital: boolean, port: boolean): string {
  const random = Alea(`${seed}:history-v1`);
  const age = 80 + Math.floor(random() * 520);
  const beginnings = port ? "나루와 교역항을 중심으로" : "오래된 길목의 정착지를 중심으로";
  const event = [
    "성벽을 보수하고 시장을 확장했다",
    "큰 화재 이후 중심 구역을 재건했다",
    "교역로가 열리면서 장인 길드가 성장했다",
    "국경 분쟁을 겪으며 방어 거점을 정비했다"
  ][Math.floor(random() * 4)];
  return gf(
    "{name}의 정착 역사는 약 {age}년 전으로 전해진다. {beginnings} 성장했으며, {development}최근에는 {event}.",
    "The settlement of {name} is said to date back about {age} years. It grew {beginnings}, and {development}Recently, it {event}.",
    {
      name,
      age,
      beginnings: gt(beginnings),
      development: gt(
        capital ? "수도로 자리 잡은 뒤 행정과 외교의 중심지가 되었다. " : "주변 영지의 교역과 생활을 이어 왔다. "
      ),
      event: gt(event)
    }
  );
}
