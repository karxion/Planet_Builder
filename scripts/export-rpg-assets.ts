import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { RPG_MAP_ASSETS } from "../src/data/rpg-map-assets.ts";

const output = resolve("public/assets/rpg-map");
const previews = resolve("docs/04-report/assets/rpg-map-assets");
await mkdir(output, { recursive: true });
await mkdir(previews, { recursive: true });
for (const asset of RPG_MAP_ASSETS) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${asset.viewBox}" width="128" height="128" role="img"><title>${asset.en}</title><desc>Fantasy Planet Builder map asset. AI-generated RPG token.</desc>${asset.body}</svg>`;
  await writeFile(resolve(output, `${asset.id}.svg`), svg);
}
const sections = [
  ["settlements", "도시와 마을 · SETTLEMENTS"],
  ["landmarks", "명소와 표식 · LANDMARKS"],
  ["resources", "자원 · RESOURCES"]
] as const;
let y = 88;
let content = `<text x="28" y="40" fill="#eee5ca" font-size="24" font-weight="bold">판타지 행성 빌더 · RPG MAP ASSETS</text><text x="28" y="65" fill="#aabaac" font-size="13">28 AI-generated location tokens + 16 AI-generated resource tokens</text>`;
for (const [category, title] of sections) {
  content += `<text x="28" y="${y + 20}" fill="#d5bb72" font-size="16">${title}</text>`;
  y += 36;
  const assets = RPG_MAP_ASSETS.filter(asset => asset.category === category);
  assets.forEach((asset, index) => {
    const x = 28 + (index % 10) * 108;
    const top = y + Math.floor(index / 10) * 114;
    content += `<g transform="translate(${x} ${top})"><rect width="98" height="104" rx="4" fill="#d5dece"/><svg x="15" y="6" width="68" height="70" viewBox="${asset.viewBox}">${asset.body}</svg><text x="49" y="94" text-anchor="middle" fill="#273d37" font-size="12">${asset.ko}</text></g>`;
  });
  y += Math.ceil(assets.length / 10) * 114 + 14;
}
await writeFile(resolve(previews, "contact-sheet.svg"), `<svg xmlns="http://www.w3.org/2000/svg" width="1128" height="${y + 10}" viewBox="0 0 1128 ${y + 10}" font-family="Arial, Malgun Gothic, sans-serif"><rect width="1128" height="${y + 10}" fill="#202722"/>${content}</svg>`);
console.log(`Exported ${RPG_MAP_ASSETS.length} self-contained generated map tokens to ${output}`);
