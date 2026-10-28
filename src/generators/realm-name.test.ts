import { describe, expect, it } from "vitest";
import { generateRealmName, isDefaultRealmName } from "./realm-name";

describe("Realm names", () => {
  it("uses reproducible Korean or English fantasy names without changing global randomness", () => {
    expect(generateRealmName("test", "ko")).toBe(generateRealmName("test", "ko"));
    const ko = generateRealmName("test", "ko"),
      en = generateRealmName("test", "en");
    expect(ko).toMatch(/^[가-힣]+$/);
    expect(en).toMatch(/^[A-Z][a-z]+$/);
    expect(new Set(Array.from({ length: 100 }, (_, i) => generateRealmName(String(i), "ko"))).size).toBeGreaterThan(85);
  });
  it("recognizes only the old blank and placeholder names", () => {
    expect(isDefaultRealmName("새로운 판타지 행성")).toBe(true);
    expect(isDefaultRealmName("New fantasy planet")).toBe(true);
    expect(isDefaultRealmName("  ")).toBe(true);
    expect(isDefaultRealmName("나의 렐름")).toBe(false);
  });
});
