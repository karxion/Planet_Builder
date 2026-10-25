// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { prepareNpcPortrait } from "@/services/npc-portrait-image";

const portrait = "data:image/jpeg;base64,/9j/2Q==";
describe("Portrait upload normalization", () => {
  let canvas: HTMLCanvasElement;
  let revoke: ReturnType<typeof vi.fn>;
  let draw: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    revoke = vi.fn();
    vi.stubGlobal("URL", { createObjectURL: vi.fn(() => "blob:input"), revokeObjectURL: revoke });
    vi.stubGlobal(
      "Image",
      class {
        naturalWidth = 2048;
        naturalHeight = 1024;
        onload?: () => void;
        set src(_value: string) {
          queueMicrotask(() => this.onload?.());
        }
      }
    );
    draw = vi.fn();
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(function (this: HTMLCanvasElement) {
      canvas = this;
      return { fillStyle: "", fillRect: vi.fn(), drawImage: draw } as unknown as CanvasRenderingContext2D;
    });
    vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue(portrait);
  });
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });
  it("resizes, re-encodes to JPEG and releases temporary URLs", async () => {
    expect(await prepareNpcPortrait(new File(["png"], "portrait.png", { type: "image/png" }))).toBe(portrait);
    expect([canvas.width, canvas.height]).toEqual([768, 384]);
    expect(draw).toHaveBeenCalled();
    expect(canvas.toDataURL).toHaveBeenCalledWith("image/jpeg", 0.82);
    expect(revoke).toHaveBeenCalledWith("blob:input");
  });
  it("rejects unsupported, empty and oversized inputs before decoding", async () => {
    for (const file of [
      new File(["svg"], "a.svg", { type: "image/svg+xml" }),
      new File([], "a.png", { type: "image/png" }),
      new File([new Uint8Array(10 * 1024 * 1024 + 1)], "a.jpg", { type: "image/jpeg" })
    ])
      await expect(prepareNpcPortrait(file)).rejects.toThrow();
    expect(URL.createObjectURL).not.toHaveBeenCalled();
  });
  it("releases the URL when decoding fails", async () => {
    vi.stubGlobal(
      "Image",
      class {
        onerror?: () => void;
        set src(_value: string) {
          queueMicrotask(() => this.onerror?.());
        }
      }
    );
    await expect(prepareNpcPortrait(new File(["broken"], "a.png", { type: "image/png" }))).rejects.toThrow(
      "이미지를 읽을 수 없습니다"
    );
    expect(revoke).toHaveBeenCalled();
  });
});
