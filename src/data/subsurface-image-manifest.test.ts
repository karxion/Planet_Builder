import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import manifest from "./subsurface-image-manifest.json";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
describe("Dedicated subsurface PNG deliverables", () => {
  it("contains exactly the 24 first-priority designs", () => {
    expect(Object.keys(manifest).sort()).toEqual(
      "st01 st03 st06 sr01 sr02 sr03 ss01 ss05 ss06 ut01 ut02 ut05 ut09 ut10 ut11 ur01 ur04 ur06 us01 us05 us06 c01 c02 c04"
        .split(" ")
        .sort()
    );
  });
  it.each(Object.entries(manifest))("ships verified %s overview/battle PNGs with preserved masters", (id, asset) => {
    const bytes = readFileSync(resolve(root, "public/assets/subsurface", asset.file));
    const original = readFileSync(resolve(root, "assets/subsurface-originals", `${id}.png`));
    expect(bytes.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
    expect(bytes[25]).toBe(6); // RGBA, not an opaque placeholder.
    expect(createHash("sha256").update(bytes).digest("hex")).toBe(asset.sha256);
    expect(createHash("sha256").update(original).digest("hex")).toBe(asset.originalSha256);
    expect(bytes.readUInt32BE(16)).toBe(asset.width);
    expect(bytes.readUInt32BE(20)).toBe(asset.height);
    expect(original.readUInt32BE(16)).toBe(asset.originalWidth);
    expect(original.readUInt32BE(20)).toBe(asset.originalHeight);
    expect(Math.abs(asset.width - (asset.originalWidth * 2) / 3)).toBeLessThanOrEqual(1);
    expect(Math.abs(asset.height - (asset.originalHeight * 2) / 3)).toBeLessThanOrEqual(1);
    expect(asset.width / 2).toBeGreaterThan(250);
    expect(asset.height).toBeGreaterThan(250);
  });
});
