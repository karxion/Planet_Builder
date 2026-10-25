declare global {
  interface Window {
    stripDeorumContent: (markup: string) => string;
  }
}

function isDeorumUrl(value: string): boolean {
  try {
    const host = new URL(value, "https://planet-builder.invalid/").hostname.toLowerCase();
    return host === "deorum.vercel.app" || host.endsWith(".deorum.vercel.app");
  } catch {
    return false;
  }
}

// This targeted integration filter is not a replacement for HTML sanitization.
export function stripDeorumContent(markup: string): string {
  if (typeof markup !== "string") return "";
  if (!/deorum/i.test(markup)) return markup;
  const template = document.createElement("template");
  template.innerHTML = markup;
  let changed = false;
  for (const node of template.content.querySelectorAll("[src], [href], [data], [poster], [action]")) {
    if (!["src", "href", "data", "poster", "action"].some(attr => isDeorumUrl(node.getAttribute(attr) || ""))) continue;
    if (node.localName === "a") node.replaceWith(...node.childNodes);
    else node.remove();
    changed = true;
  }
  return changed ? template.innerHTML : markup;
}

export function removeDeorumFromNotes(items: { legend: string }[]): boolean {
  let changed = false;
  for (const note of items) {
    if (!note || typeof note.legend !== "string") continue;
    const clean = stripDeorumContent(note.legend);
    if (clean === note.legend) continue;
    note.legend = clean;
    changed = true;
  }
  return changed;
}

window.stripDeorumContent = stripDeorumContent;
