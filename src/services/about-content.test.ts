// @vitest-environment jsdom
/// <reference types="node" />
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { beforeEach, describe, expect, it } from "vitest";
import { translateText } from "./ui-language";

const directory = dirname(fileURLToPath(import.meta.url));
const projectDirectory = process.env.FPB_ABOUT_TEST_ROOT || resolve(directory, "../..");
const html = readFileSync(resolve(projectDirectory, "src/index.html"), "utf8");
const css = readFileSync(resolve(projectDirectory, "public/about.css"), "utf8");
const legacyCss = readFileSync(resolve(projectDirectory, "public/planet-builder.css"), "utf8");
const about = new DOMParser().parseFromString(html, "text/html").getElementById("aboutContent")!;

function contrast(color: string, background: string): number {
  const luminance = (rgb: string) => {
    const values = rgb
      .match(/\d+/g)!
      .map(Number)
      .slice(0, 3)
      .map(value => {
        const s = value / 255;
        return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      });
    return 0.2126 * values[0] + 0.7152 * values[1] + 0.0722 * values[2];
  };
  const a = luminance(color);
  const b = luminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

describe("About content", () => {
  beforeEach(() => {
    document.head.replaceChildren();
    document.body.className = "fpb-ready";
    document.body.innerHTML = '<aside id="options"></aside>';
    document.getElementById("options")!.append(about.cloneNode(true));
    // Load legacy styles last to check the scoped rules still win.
    for (const source of [css, legacyCss]) {
      const style = document.createElement("style");
      style.textContent = source;
      document.head.append(style);
    }
  });

  it("distinguishes the original author from KURO's unofficial adaptation", () => {
    const root = document.getElementById("aboutContent")!;
    expect(root.textContent).toContain("Azgaar's Fantasy Map Generator");
    expect(root.textContent).toContain("Azgaar (Max Haniyeu)");
    expect(root.textContent).toContain("KURO");
    expect(root.textContent).toContain("비공식 파생 프로젝트");
    expect(root.querySelector('a[href="https://github.com/Azgaar/Fantasy-Map-Generator"]')).not.toBeNull();
  });

  it("offers free use and feedback without dropping license notices", () => {
    expect(about.textContent).toContain("자유롭게 이용");
    expect(about.textContent).toContain("상업적 활용");
    expect(about.textContent).toContain("라이선스 고지를 유지");
    expect(about.querySelector('a[href="legal/Azgaar-LICENSE.txt"]')).not.toBeNull();
    expect(about.querySelector('a[href="legal/srd.html"]')).not.toBeNull();
    expect(about.querySelector('a[href="mailto:karxion@gmail.com"]')!.textContent).toBe("karxion@gmail.com");
    expect(about.querySelector('a[href^="mailto:azgaar"]')).toBeNull();
  });

  it("retains the tour and removes unrelated promotional blocks and original-project share actions", () => {
    expect(about.querySelector("#startTourButton")!.getAttribute("onclick")).toBe("window.Services.UiTour.start()");
    expect(about.querySelector('.share-buttons, a[href*="patreon"], a[href*="u24.gov.ua"]')).toBeNull();
    for (const link of about.querySelectorAll('a[target="_blank"]')) {
      expect(link.getAttribute("rel")).toContain("noopener");
      expect(link.getAttribute("rel")).toContain("noreferrer");
    }
  });

  it("translates visible copy in both languages while preserving proper names and the email", () => {
    const walker = document.createTreeWalker(about, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const source = node.textContent!.trim();
      if (!source || node.parentElement!.closest("[data-i18n-skip]")) continue;
      const english = translateText(source, "en");
      expect(english, source).not.toBe(source);
      expect(translateText(english, "ko")).toBe(source);
    }
    expect(about.querySelectorAll("[data-i18n-skip]")).toHaveLength(4);
  });

  it("keeps body text and links readable against the dark panel despite legacy rules", () => {
    const root = document.getElementById("aboutContent")!;
    const background = getComputedStyle(root).backgroundColor;
    const paragraph = getComputedStyle(root.querySelector("p")!);
    const link = getComputedStyle(root.querySelector("a")!);
    expect(contrast(paragraph.color, background)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(link.color, background)).toBeGreaterThanOrEqual(4.5);
    expect(paragraph.textAlign).toBe("left");
    expect(link.textDecoration).toContain("underline");
    expect(getComputedStyle(root).overflowWrap).toBe("anywhere");
  });
});
