import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";

const libraries = resolve(process.cwd(), "public/libs");
const manifest = JSON.parse(readFileSync(resolve(libraries, "vendor-manifest.json"), "utf8")) as Record<
  string,
  { file: string; sha256: string }
>;
interface JQueryTest {
  (
    selector: string
  ): {
    dialog: (...args: unknown[]) => unknown;
    sortable: (...args: unknown[]) => unknown;
    slider: (...args: unknown[]) => unknown;
  };
  fn: { jquery: string };
  ui: { version: string };
  htmlPrefilter: (value: string) => string;
}

describe("Pinned legacy UI libraries", () => {
  it("checks vendor hashes and browser integrity attributes, excluding obsolete copies", () => {
    const html = readFileSync(resolve(process.cwd(), "src/index.html"), "utf8");
    const attributes = readFileSync(resolve(process.cwd(), ".gitattributes"), "utf8");
    for (const entry of Object.values(manifest)) {
      expect(attributes).toContain(`/public/libs/${entry.file} text eol=lf`);
      const data = readFileSync(resolve(libraries, entry.file));
      expect(createHash("sha256").update(data).digest("hex")).toBe(entry.sha256);
      expect(html).toContain(
        `src="libs/${entry.file}" integrity="sha256-${Buffer.from(entry.sha256, "hex").toString("base64")}"`
      );
    }
    expect(existsSync(resolve(libraries, "jquery-3.1.1.min.js"))).toBe(false);
    expect(existsSync(resolve(libraries, "jquery-ui.min.js"))).toBe(false);
  });
  it("retains legacy dialogs, sortable lists and sliders with patched jQuery behavior", () => {
    const page = new JSDOM(
      '<div id="dialog">기록</div><ul id="list"><li>one</li><li>two</li></ul><div id="slider"></div>',
      { runScripts: "outside-only" }
    );
    try {
      page.window.document.body.classList.add("fpb-ready");
      const style = page.window.document.createElement("style");
      style.textContent = readFileSync(resolve(process.cwd(), "public/planet-builder.css"), "utf8");
      page.window.document.head.append(style);
      for (const entry of Object.values(manifest))
        page.window.eval(readFileSync(resolve(libraries, entry.file), "utf8"));
      const $ = (page.window as unknown as { jQuery: JQueryTest }).jQuery;
      expect($.fn.jquery).toBe("3.7.1");
      expect($.ui.version).toBe("1.13.3");
      expect($.htmlPrefilter("<div/>")).toBe("<div/>");
      $("#dialog").dialog({ title: "마을 편집" });
      expect($("#dialog").dialog("isOpen")).toBe(true);
      const wrapper = page.window.document.getElementById("dialog")!.closest(".ui-dialog")!;
      expect(Number(page.window.getComputedStyle(wrapper).zIndex)).toBeGreaterThanOrEqual(1100);
      $("#dialog").dialog("close");
      expect($("#dialog").dialog("isOpen")).toBe(false);
      $("#list").sortable();
      expect($("#list").sortable("instance")).toBeTruthy();
      $("#slider").slider({ min: 0, max: 100, value: 20 });
      $("#slider").slider("value", 30);
      expect($("#slider").slider("value")).toBe(30);
    } finally {
      page.window.close();
    }
  });
});
