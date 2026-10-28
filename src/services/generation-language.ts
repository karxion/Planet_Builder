export type GenerationLanguage = "ko" | "en";
let language: GenerationLanguage = "ko";
try {
  if (typeof localStorage !== "undefined" && localStorage.getItem("fpb-ui-language") === "en") language = "en";
} catch {
  /* Korean is the default when preferences are unavailable. */
}

export const getGenerationLanguage = (): GenerationLanguage => language;
export function setGenerationLanguage(next: GenerationLanguage): void {
  language = next;
}
