/** Run with Node 24+: node scripts/collect-seabed-sources.ts <new-output-directory> */
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { promisify } from "node:util";
const run = promisify(execFile);
const output = process.argv[2];
if (!output) throw new Error("Provide a new output directory");
const directory = resolve(output);
await mkdir(directory, { recursive: false });
const sources = [
  { id: "noaa-seamounts", url: "https://oceanexplorer.noaa.gov/facts/seamounts.html" },
  { id: "noaa-canyons", url: "https://oceanexplorer.noaa.gov/facts/submarine-canyons.html" },
  { id: "iho-standards", url: "https://iho.int/en/standards-and-specifications" },
  { id: "usgs-dynamic-earth", url: "https://pubs.usgs.gov/gip/dynamic/dynamic.html" },
  { id: "crossref-geomorphology", url: "https://api.crossref.org/works?query.title=Geomorphology%20of%20the%20oceans&rows=3" },
  { id: "crossref-canyons", url: "https://api.crossref.org/works?query.title=Global%20distribution%20of%20large%20submarine%20canyons&rows=3" }
];
const results = await Promise.all(sources.map(async source => {
  try {
    // curl preserves the environment's proxy and CA policy; no bypass or retries.
    const { stdout } = await run("curl", ["--fail", "--silent", "--show-error", "--location", "--max-time", "20", source.url], { encoding: "utf8", maxBuffer: 16 * 1024 * 1024 });
    await writeFile(resolve(directory, `${source.id}.txt`), stdout);
    let papers: unknown[] | undefined;
    if (source.id.startsWith("crossref")) {
      const json = JSON.parse(stdout);
      papers = json.message.items.map((item: { title?: string[]; DOI?: string; URL?: string; abstract?: string }) => ({ title: item.title?.[0], doi: item.DOI, url: item.URL, abstract: item.abstract }));
    }
    return { ...source, status: "retrieved", sha256: createHash("sha256").update(stdout).digest("hex"), bytes: Buffer.byteLength(stdout), papers };
  } catch (error) {
    const failure = error as { stderr?: string; message?: string };
    return { ...source, status: "unavailable", reason: failure.stderr?.trim() || failure.message || "Fetch failed" };
  }
}));
await writeFile(resolve(directory, "manifest.json"), JSON.stringify({ retrievedAt: new Date().toISOString(), results }, null, 2));
for (const result of results) process.stdout.write(`${result.id}: ${result.status}\n`);
if (results.some(result => result.status !== "retrieved")) process.exitCode = 1;
