import createDOMPurify, { type Config, type WindowLike } from "dompurify";

const SVG_NS = "http://www.w3.org/2000/svg";
const SVG_POLICY: Config = {
  USE_PROFILES: { svg: true, svgFilters: true },
  // FMG uses local <use> references for terrain, markers and resource tokens.
  ADD_TAGS: ["use"],
  FORBID_TAGS: ["style", "a", "animate", "animateMotion", "animateTransform", "set"],
  RETURN_DOM_FRAGMENT: true
};
const NOTE_POLICY: Config = {
  USE_PROFILES: { html: true },
  FORBID_TAGS: ["style", "form", "input", "button", "textarea", "select", "option"],
  SANITIZE_NAMED_PROPS: true
};

export interface ImportedNote {
  id: string;
  name: string;
  legend: string;
}

export function createContentSanitizer(host: WindowLike) {
  const purifier = createDOMPurify(host);
  if (!purifier.isSupported) throw new Error("This browser cannot safely import map content");
  purifier.addHook("uponSanitizeAttribute", (node, attribute) => {
    if (node.namespaceURI !== SVG_NS || node.localName !== "use") return;
    if (["href", "xlink:href"].includes(attribute.attrName) && !/^#[^\s]+$/.test(attribute.attrValue)) {
      attribute.keepAttr = false;
    }
  });

  function sanitizeSvg(markup: string): SVGSVGElement {
    const fragment = purifier.sanitize(markup, { ...SVG_POLICY, RETURN_DOM_FRAGMENT: true });
    const root = fragment.firstElementChild;
    if (fragment.children.length !== 1 || root?.namespaceURI !== SVG_NS || root.localName !== "svg") {
      throw new Error("Invalid map SVG");
    }
    return root as SVGSVGElement;
  }

  function sanitizeMapSvg(markup: string): SVGSVGElement {
    const root = sanitizeSvg(markup);
    if (root.id !== "map") throw new Error("Invalid map SVG");
    return root;
  }

  function sanitizeSvgDefinitions(markup: string): DocumentFragment {
    const root = sanitizeSvg(`<svg xmlns="${SVG_NS}">${markup}</svg>`);
    const fragment = root.ownerDocument.createDocumentFragment();
    fragment.append(...root.childNodes);
    return fragment;
  }

  function sanitizeNoteHtml(markup: string): string {
    return purifier.sanitize(markup, NOTE_POLICY);
  }

  function sanitizeImportedNotes(value: unknown): ImportedNote[] {
    if (!Array.isArray(value)) throw new Error("Invalid map notes");
    const ids = new Set<string>();
    return value.map(note => {
      if (
        !note ||
        typeof note !== "object" ||
        typeof note.id !== "string" ||
        typeof note.name !== "string" ||
        typeof note.legend !== "string" ||
        !note.id.trim() || ids.has(note.id)
      ) {
        throw new Error("Invalid map notes");
      }
      ids.add(note.id);
      return { id: note.id, name: note.name, legend: sanitizeNoteHtml(note.legend) };
    });
  }

  return { sanitizeMapSvg, sanitizeSvgDefinitions, sanitizeNoteHtml, sanitizeImportedNotes };
}

let sanitizer: ReturnType<typeof createContentSanitizer> | undefined;
const getSanitizer = () => (sanitizer ??= createContentSanitizer(window));

export const sanitizeMapSvg = (markup: string) => getSanitizer().sanitizeMapSvg(markup);
export const sanitizeSvgDefinitions = (markup: string) => getSanitizer().sanitizeSvgDefinitions(markup);
export const sanitizeImportedNotes = (notes: unknown) => getSanitizer().sanitizeImportedNotes(notes);
export const sanitizeNoteHtml = (markup: string) => getSanitizer().sanitizeNoteHtml(markup);

declare global {
  interface Window {
    sanitizeNoteHtml: typeof sanitizeNoteHtml;
    sanitizeImportedNotes: typeof sanitizeImportedNotes;
  }
}
window.sanitizeNoteHtml = sanitizeNoteHtml;
window.sanitizeImportedNotes = sanitizeImportedNotes;
