// @vitest-environment jsdom
import type { WindowLike } from "dompurify";
import { beforeEach, describe, expect, it } from "vitest";
import mapTemplate from "../index.html?raw";
import { createContentSanitizer } from "./content-sanitizer";

const SVG_NS = "http://www.w3.org/2000/svg";
const XLINK_NS = "http://www.w3.org/1999/xlink";
const png = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB";
let sanitizer: ReturnType<typeof createContentSanitizer>;

beforeEach(() => {
  document.body.replaceChildren();
  sanitizer = createContentSanitizer(window);
});

describe("imported map SVG", () => {
  it("removes scripts, handlers, foreign HTML, animation and global styles", () => {
    const map = sanitizer.sanitizeMapSvg(`<svg id="map" onload="alert(1)">
      <script>alert(1)</script><style>body { display:none }</style>
      <foreignObject><img src="x" onerror="alert(1)"></foreignObject>
      <g id="viewbox" onclick="alert(1)"><path id="land" d="M0 0L10 10" fill="#abc"/>
      <animate attributeName="href" values="javascript:alert(1)"/><set attributeName="onload" to="alert(1)"/></g>
    </svg>`);
    document.body.prepend(map);
    expect(map.querySelector("script,style,foreignObject,foreignobject,img,animate,set")).toBeNull();
    expect(map.hasAttribute("onload")).toBe(false);
    expect(map.querySelector("#viewbox")?.hasAttribute("onclick")).toBe(false);
    expect(map.querySelector("#land")?.getAttribute("d")).toBe("M0 0L10 10");
  });

  it.each([
    "javascript:alert(1)",
    "https://example.test/icon.svg#x",
    "//example.test/x",
    "data:image/svg+xml,<svg/>"
  ])("does not permit a use element to load %s", href => {
    const map = sanitizer.sanitizeMapSvg(
      `<svg id="map" xmlns:xlink="${XLINK_NS}"><use href="${href}" xlink:href="${href}"/></svg>`
    );
    const use = map.querySelector("use");
    expect(use).not.toBeNull();
    expect(use?.hasAttribute("href")).toBe(false);
    expect(use?.hasAttributeNS(XLINK_NS, "href")).toBe(false);
  });

  it("preserves local references, labels, filters, raster tokens and inline map styles", () => {
    const map = sanitizer.sanitizeMapSvg(`<svg id="map" viewBox="0 0 960 480" xmlns:xlink="${XLINK_NS}">
      <defs id="deftemp"><symbol id="relief-mount-1"><path d="M0 0L5 5"/></symbol>
      <filter id="blur1"><feGaussianBlur stdDeviation="1"/></filter><path id="label-path" d="M0 0L10 0"/></defs>
      <g id="viewbox" style="display:block;opacity:0.8" data-custom="keep">
      <use href="#relief-mount-1" xlink:href="#relief-mount-1" width="12" height="12"/>
      <image id="resource-token" href="${png}" width="7" height="7"/>
      <text stroke="white" paint-order="stroke fill"><textPath href="#label-path">세레온 왕국</textPath></text>
      <g filter="url(#blur1)"/></g></svg>`);
    expect(map.namespaceURI).toBe(SVG_NS);
    expect(map.getAttribute("viewBox")).toBe("0 0 960 480");
    expect(map.querySelector("use")?.getAttribute("href")).toBe("#relief-mount-1");
    expect(map.querySelector("use")?.getAttributeNS(XLINK_NS, "href")).toBe("#relief-mount-1");
    expect(map.querySelector("image")?.getAttribute("href")).toBe(png);
    expect(map.querySelector("feGaussianBlur")).not.toBeNull();
    expect(map.querySelector("textPath")?.textContent).toBe("세레온 왕국");
    expect(map.querySelector("text")?.getAttribute("paint-order")).toBe("stroke fill");
    expect(map.querySelector("#viewbox")?.getAttribute("data-custom")).toBe("keep");
    expect(map.querySelector<SVGElement>("#viewbox")?.style.opacity).toBe("0.8");
  });

  it("retains the existing map template's layer and filter IDs", () => {
    const source = new DOMParser().parseFromString(mapTemplate, "text/html").querySelector("svg#map")!;
    const map = sanitizer.sanitizeMapSvg(source.outerHTML);
    const expectedIds = [...source.querySelectorAll("[id]")].map(node => node.id);
    const actualIds = new Set([...map.querySelectorAll("[id]")].map(node => node.id));
    expect(expectedIds.filter(id => !actualIds.has(id))).toEqual([]);
    expect(map.querySelectorAll("filter").length).toBe(source.querySelectorAll("filter").length);
  });

  it.each([
    "<div id=map>not SVG</div>",
    "<svg id=other></svg>",
    "<svg id=map></svg><svg></svg>"
  ])("rejects malformed or multiple map roots: %s", markup =>
    expect(() => sanitizer.sanitizeMapSvg(markup)).toThrow("Invalid map SVG"));
});

describe("custom resource definitions", () => {
  it("preserves SVG namespace and raster icons without re-parsing HTML", () => {
    const fragment = sanitizer.sanitizeSvgDefinitions(
      `<g id="good-custom-1"><image href="${png}" onerror="alert(1)"/></g><script>alert(1)</script>`
    );
    const defs = document.createElementNS(SVG_NS, "defs");
    defs.append(fragment);
    expect(defs.querySelector("g")?.namespaceURI).toBe(SVG_NS);
    expect(defs.querySelector("image")?.getAttribute("href")).toBe(png);
    expect(defs.querySelector("image")?.hasAttribute("onerror")).toBe(false);
    expect(defs.querySelector("script")).toBeNull();
  });

  it("rejects attempts to break out of the definitions wrapper", () => {
    expect(() => sanitizer.sanitizeSvgDefinitions('</svg><svg id="injected"></svg>')).toThrow("Invalid map SVG");
  });
});

describe("map notes", () => {
  it("preserves basic rich text but removes active HTML, SVG and unsafe links", () => {
    const html =
      sanitizer.sanitizeNoteHtml(`<p><strong>길드</strong><em>설명</em><a href="https://example.test">자료</a>
      <a href="javascript:alert(1)">위험 링크</a><img src="${png}" onerror="alert(1)"></p>
      <svg onload="alert(1)"></svg><script>alert(1)</script><iframe srcdoc="bad"></iframe>
      <style>body{display:none}</style><form id="options"><input name="action"></form>`);
    const preview = document.createElement("div");
    preview.innerHTML = html;
    expect(preview.querySelector("strong")?.textContent).toBe("길드");
    expect(preview.querySelector("a")?.getAttribute("href")).toBe("https://example.test");
    expect(preview.querySelectorAll("a")[1].hasAttribute("href")).toBe(false);
    expect(preview.querySelector("img")?.hasAttribute("onerror")).toBe(false);
    expect(preview.querySelector("svg,script,iframe,style,form,input")).toBeNull();
  });

  it("cleans imported legends without mutating the supplied notes", () => {
    const input = [{ id: "burg1", name: "<b>세레온</b>", legend: '<b onclick="bad()">본문</b>' }];
    expect(sanitizer.sanitizeImportedNotes(input)).toEqual([
      { id: "burg1", name: "<b>세레온</b>", legend: "<b>본문</b>" }
    ]);
    expect(input[0].legend).toContain("onclick");
  });

  it.each([
    null,
    {},
    [null],
    [{ id: 1, name: "name", legend: "text" }],
    [{ id: "x", name: "name" }]
  ])("rejects malformed note data: %j", value =>
    expect(() => sanitizer.sanitizeImportedNotes(value)).toThrow("Invalid map notes"));

  it("isolates note IDs that could clobber application properties", () => {
    expect(sanitizer.sanitizeNoteHtml('<p id="fpb-shell">본문</p>')).toContain('id="user-content-fpb-shell"');
  });
});

it("fails closed when DOM sanitization is unavailable", () => {
  expect(() => createContentSanitizer({} as WindowLike)).toThrow("cannot safely import");
});
