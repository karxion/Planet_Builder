# Resource Tokens

Sixteen resource-family tokens generated individually with the built-in OpenAI image-generation tool for Fantasy Planet Builder.

- Runtime files: 256 x 256 transparent WebP, 572,534 bytes in total.
- Source artwork: 1254 x 1254 transparent PNG in `docs/04-report/assets/resource-tokens/originals/`.
- Prompts and style-reference provenance: `docs/04-report/assets/resource-tokens/prompts.json`.
- No external game artwork or brand assets were used as reference. The generated timber token is the style reference for the other fifteen tokens.
- Runtime SVG symbols embed the WebP data, keeping local map files and exports independent of external image requests.
- Existing `rpg-*` resource IDs and standard goods-to-family mappings are retained.

Rebuild optimized files and the embedded TypeScript module with `scripts/build-resource-tokens.ts` using Sharp (`SHARP_MODULE` may point to the bundled development runtime). Rebuild standalone SVG wrappers with `scripts/export-rpg-assets.ts`.
