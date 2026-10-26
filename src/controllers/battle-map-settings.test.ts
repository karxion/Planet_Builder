// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { battlePreset } from "@/data/battle-map";
import { battleMapControls } from "./battle-map-settings";

const change = (host: HTMLElement, key: string, value: string, event = "input") => {
  const input = host.querySelector<HTMLInputElement>(`[data-battle-${key}]`)!;
  input.value = value;
  input.dispatchEvent(new Event(event, { bubbles: true }));
};
describe("battle map controls", () => {
  it("applies presets and preserves freely edited portrait dimensions", () => {
    const commit = vi.fn();
    const host = battleMapControls(battlePreset("small"), commit);
    document.body.replaceChildren(host);
    change(host, "preset", "large", "change");
    host.dispatchEvent(new Event("submit", { cancelable: true }));
    expect(commit).toHaveBeenLastCalledWith({ columns: 72, rows: 41, cellPixels: 64 });
    change(host, "ratio", "custom", "change");
    change(host, "columns", "36");
    change(host, "rows", "60");
    change(host, "pixels", "48");
    host.dispatchEvent(new Event("submit", { cancelable: true }));
    expect(commit).toHaveBeenLastCalledWith({ columns: 36, rows: 60, cellPixels: 48 });
  });
  it("does not silently shrink a large map or commit invalid pixel counts", () => {
    const commit = vi.fn();
    const host = battleMapControls(battlePreset("small"), commit);
    document.body.replaceChildren(host);
    change(host, "columns", "200");
    change(host, "pixels", "128");
    host.dispatchEvent(new Event("submit", { cancelable: true }));
    expect(commit).not.toHaveBeenCalled();
    expect(host.querySelector('[role="status"]')?.textContent).toContain("3000");
    change(host, "pixels", "16");
    host.dispatchEvent(new Event("submit", { cancelable: true }));
    expect(commit).toHaveBeenCalledWith({ columns: 200, rows: 113, cellPixels: 16 });
  });
});

it("shows capped PNG dimensions while retaining a previously saved high-resolution grid", () => {
  const settings = { columns: 128, rows: 64, cellPixels: 64 };
  const host = battleMapControls(settings, () => {});
  expect(host.querySelector("[data-battle-png-size]")?.textContent).toContain("3000 × 1500");
  expect(host.querySelector<HTMLInputElement>("[data-battle-columns]")!.value).toBe("128");
  expect(host.querySelector<HTMLInputElement>("[data-battle-pixels]")!.value).toBe("64");
});
