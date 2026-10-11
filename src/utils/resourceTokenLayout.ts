export const RESOURCE_TOKEN_SIZE = 7;
export const RESOURCE_SITE_SPACING = 21;

export function migrateResourceTokenLayout(size: string | undefined, version: string | undefined, spacing?: string) {
  const parsedSize = Number(size);
  if (version === "2") {
    return {
      size: parsedSize > 0 ? parsedSize : RESOURCE_TOKEN_SIZE,
      spacing: Number(spacing) > 0 ? Number(spacing) : RESOURCE_SITE_SPACING
    };
  }
  const isLegacyDefault = version !== "1" && (parsedSize === 6 || parsedSize === 9);
  const previousSize = parsedSize > 0 && !isLegacyDefault ? parsedSize : 14;
  return { size: previousSize / 2, spacing: previousSize * 1.5 };
}
