import { describe, expect, it, vi } from "vitest";
import { ImportSizeLimitError, readBoundedBytes, readBoundedResponse, readBoundedStream } from "./bounded-stream";

describe("Bounded import streams", () => {
  it("concatenates bytes once without changing multibyte content", async () => {
    const bytes = new TextEncoder().encode("한글 지도");
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        for (const byte of bytes) controller.enqueue(new Uint8Array([byte]));
        controller.close();
      }
    });
    expect(await readBoundedBytes(stream, bytes.length)).toEqual(bytes);
    expect(stream.locked).toBe(false);
  });
  it("bounds cumulative bytes, cancels immediately, and releases the reader", async () => {
    const cancel = vi.fn();
    const consume = vi.fn();
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new Uint8Array(3));
        controller.enqueue(new Uint8Array(3));
      },
      cancel
    });
    await expect(readBoundedStream(stream, consume, 5)).rejects.toBeInstanceOf(ImportSizeLimitError);
    expect(consume).toHaveBeenCalledOnce();
    expect(cancel).toHaveBeenCalledOnce();
    expect(stream.locked).toBe(false);
  });
  it("cancels and releases the reader if decoding fails", async () => {
    const cancel = vi.fn();
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new Uint8Array(1));
      },
      cancel
    });
    await expect(
      readBoundedStream(stream, () => {
        throw new Error("invalid UTF8");
      })
    ).rejects.toThrow("invalid UTF8");
    expect(cancel).toHaveBeenCalledOnce();
    expect(stream.locked).toBe(false);
  });
  it("rejects oversized headers before consuming the body", async () => {
    const response = new Response("data", { headers: { "content-length": "100" } });
    await expect(readBoundedResponse(response, 5)).rejects.toBeInstanceOf(ImportSizeLimitError);
    expect(response.bodyUsed).toBe(false);
  });
  it("does not trust missing or understated content-length", async () => {
    await expect(
      readBoundedResponse(new Response("longer than 5", { headers: { "content-length": "1" } }), 5)
    ).rejects.toBeInstanceOf(ImportSizeLimitError);
    const blob = await readBoundedResponse(new Response("지도", { headers: { "content-type": "application/test" } }));
    expect(await blob.text()).toBe("지도");
    expect(blob.type).toBe("application/test");
  });
});
