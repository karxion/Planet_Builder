// @vitest-environment jsdom
import createDOMPurify from "dompurify";
import { describe, expect, it } from "vitest";

// Exercise the patched library modes without enabling them in the application's import policy.
describe("DOMPurify security patch regressions", () => {
  it.each([
    // biome-ignore lint/suspicious/noTemplateCurlyInString: The literal delimiters are the attack fixture.
    "${untrusted}",
    "{{untrusted}}",
    "<%untrusted%>"
  ])("scrubs split template delimiters inside an attached shadow root: %s", expression => {
    const host = document.createElement("article");
    const shadow = host.attachShadow({ mode: "open" });
    for (const character of expression) {
      shadow.append(document.createTextNode(character), document.createElement("object"));
    }

    createDOMPurify(window).sanitize(host, { IN_PLACE: true, SAFE_FOR_TEMPLATES: true });

    expect(shadow.querySelector("object")).toBeNull();
    expect(shadow.textContent).not.toContain(expression);
  });

  it.each(["parent", "sibling"] as const)("neutralizes handlers in a %s detached by a hook", mode => {
    const purifier = createDOMPurify(window);
    const root = document.createElement("section");
    root.innerHTML =
      '<figure><span data-trigger></span><img src="invalid-image" onerror="untrusted()"></figure><p>Keep</p>';
    const image = root.querySelector("img")!;
    purifier.addHook("uponSanitizeElement", node => {
      if (!(node instanceof Element) || !node.hasAttribute("data-trigger")) return;
      if (mode === "parent") node.parentElement!.remove();
      else node.nextElementSibling!.remove();
    });

    purifier.sanitize(root, { IN_PLACE: true });

    expect(root.contains(image)).toBe(false);
    expect(image.hasAttribute("onerror")).toBe(false);
    expect(root.querySelector("p")?.textContent).toBe("Keep");
  });

  it("strips SMIL href retargeting in the case-sensitive XHTML parser", () => {
    const clean = createDOMPurify(window).sanitize(
      '<svg xmlns="http://www.w3.org/2000/svg"><a id="destination"><animate attributeName="href" values="safe;javascript:untrusted()" dur="1s"/><text>Keep</text></a></svg>',
      {
        PARSER_MEDIA_TYPE: "application/xhtml+xml",
        ALLOWED_TAGS: ["svg", "a", "animate", "text"],
        ALLOWED_ATTR: ["id", "attributeName", "values", "dur"]
      }
    );
    const document = new DOMParser().parseFromString(clean, "application/xhtml+xml");

    expect(document.querySelector("parsererror")).toBeNull();
    expect(document.querySelector("animate")?.hasAttribute("attributeName")).toBe(false);
    expect(document.querySelector("text")?.textContent).toBe("Keep");
  });
});
