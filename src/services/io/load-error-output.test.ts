// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { parseError } from "@/utils/commonUtils";

vi.mock("@/services", () => ({ Services: {} }));

describe("Safe map loading error output", () => {
  afterEach(() => vi.unstubAllGlobals());
  it.each([
    '\"><img src=x onerror="bad()">',
    "javascript:alert(1)",
    "data:text/html,<script>bad()</script>"
  ])("does not inject markup or active protocols from maplink: %s", async url => {
    const message = document.createElement("div");
    vi.stubGlobal("alertMessage", message);
    vi.stubGlobal("ERROR", false);
    vi.stubGlobal("$", () => ({ dialog: vi.fn() }));
    const { Load } = await import("./load");
    Load.showUploadErrorMessage("error", url);
    expect(message.querySelector("img,script,[onerror]")).toBeNull();
    const href = message.querySelector("a")!.getAttribute("href");
    expect(href === null || /^https?:/.test(href)).toBe(true);
  });
  it("keeps usable HTTPS links without treating URL quotes as attributes", async () => {
    const message = document.createElement("div");
    vi.stubGlobal("alertMessage", message);
    vi.stubGlobal("ERROR", false);
    vi.stubGlobal("$", () => ({ dialog: vi.fn() }));
    const { Load } = await import("./load");
    Load.showUploadErrorMessage("error", 'https://example.test/map?name=\"quoted\"');
    expect(message.querySelector("a")!.href).toContain("https://example.test/map");
    expect(message.querySelector("a")!.rel).toBe("noopener noreferrer");
  });
  it("escapes error messages before adding diagnostic HTML formatting", () => {
    const error = new Error('<img src=x onerror="bad()">');
    const container = document.createElement("div");
    container.innerHTML = parseError(error);
    expect(container.querySelector("img,[onerror]")).toBeNull();
    expect(container.textContent).toContain("<img");
  });
});
