import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import manifest from "./scene-image-manifest.json";

describe("generated scene module integrity", () => {
  it.each(Object.entries(manifest))("ships original RGBA PNG bytes and correct dimensions: %s", (id, meta) => {
    const bytes = readFileSync(new URL(`../../public/assets/scene-maps/${id}.png`, import.meta.url));
    expect(bytes.subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    expect(bytes.readUInt32BE(16)).toBe(meta.width);
    expect(bytes.readUInt32BE(20)).toBe(meta.height);
    expect(bytes[25]).toBe(6);
    expect(createHash("sha256").update(bytes).digest("hex")).toBe(meta.sha256);
  });
});
