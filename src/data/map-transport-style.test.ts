/// <reference types="node" />
import { readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { getMapTransportStyle } from "./map-transport-style";

const root = process.env.FPB_TRANSPORT_TEST_ROOT || resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const styles = resolve(root, "public/styles");

describe("bundled transport presets", () => {
  it.each(
    readdirSync(styles).filter(file => file.endsWith(".json"))
  )("keeps the water and road hierarchy in %s", file => {
    const preset = JSON.parse(readFileSync(resolve(styles, file), "utf8"));
    for (const [selector, attributes] of Object.entries(getMapTransportStyle(file.slice(0, -5)))) {
      expect(preset[selector]).toMatchObject(attributes);
    }
  });
});
