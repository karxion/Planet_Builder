export const MAX_IMPORT_BYTES = 128 * 1024 * 1024;

export class ImportSizeLimitError extends Error {
  constructor() {
    super("Map file size limit exceeded (128 MiB)");
    this.name = "ImportSizeLimitError";
  }
}

export async function readBoundedStream(
  stream: ReadableStream<Uint8Array>,
  consume: (chunk: Uint8Array) => void,
  limit = MAX_IMPORT_BYTES
): Promise<void> {
  const reader = stream.getReader();
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) throw new ImportSizeLimitError();
      consume(value);
    }
  } catch (error) {
    await reader.cancel().catch(() => {});
    throw error;
  } finally {
    reader.releaseLock();
  }
}

export async function readBoundedBytes(
  stream: ReadableStream<Uint8Array>,
  limit = MAX_IMPORT_BYTES
): Promise<Uint8Array<ArrayBuffer>> {
  const chunks: Uint8Array[] = [];
  let size = 0;
  await readBoundedStream(
    stream,
    chunk => {
      chunks.push(chunk);
      size += chunk.length;
    },
    limit
  );
  const result = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result;
}

export async function readBoundedResponse(response: Response, limit = MAX_IMPORT_BYTES): Promise<Blob> {
  if (Number(response.headers?.get("content-length")) > limit) throw new ImportSizeLimitError();
  if (response.body) {
    const bytes = await readBoundedBytes(response.body, limit);
    return new Blob([bytes], { type: response.headers.get("content-type") || "" });
  }
  const blob = await response.blob();
  if (blob.size > limit) throw new ImportSizeLimitError();
  return blob;
}
