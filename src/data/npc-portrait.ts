export const MAX_NPC_PORTRAIT_LENGTH = 700000;
export const MAX_PORTRAIT_FILE_BYTES = 10 * 1024 * 1024;
export const PORTRAIT_EDGE = 768;

export function isNpcPortrait(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length <= MAX_NPC_PORTRAIT_LENGTH &&
    /^data:image\/jpeg;base64,\/9j\/[A-Za-z0-9+/]+={0,2}$/.test(value) &&
    (value.length - "data:image/jpeg;base64,".length) % 4 === 0
  );
}
