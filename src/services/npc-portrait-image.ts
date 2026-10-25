import { isNpcPortrait, MAX_PORTRAIT_FILE_BYTES, PORTRAIT_EDGE } from "@/data/npc-portrait";

export async function prepareNpcPortrait(file: File): Promise<string> {
  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type))
    throw new Error("PNG, JPG, WebP 이미지만 등록할 수 있습니다");
  if (!file.size || file.size > MAX_PORTRAIT_FILE_BYTES) throw new Error("이미지는 10 MiB 이하여야 합니다");
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    const loaded = new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("이미지를 읽을 수 없습니다"));
    });
    image.src = url;
    await loaded;
    if (!image.naturalWidth || !image.naturalHeight || image.naturalWidth * image.naturalHeight > 40000000)
      throw new Error("이미지 해상도가 너무 큽니다 (최대 40MP)");
    const scale = Math.min(1, PORTRAIT_EDGE / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("이미지를 변환할 수 없습니다");
    context.fillStyle = "#ece7df";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    // Re-encoding bounds size and strips input metadata and active content.
    const result = canvas.toDataURL("image/jpeg", 0.82);
    if (!isNpcPortrait(result)) throw new Error("변환된 이미지의 용량이 너무 큽니다");
    return result;
  } finally {
    URL.revokeObjectURL(url);
  }
}
