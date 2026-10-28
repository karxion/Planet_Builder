import { GENERATED_TRANSLATIONS } from "@/data/generated-translations";
import { UI_TRANSLATIONS } from "@/data/ui-translations";
import { getGenerationLanguage, type GenerationLanguage } from "@/services/generation-language";

const translations = new Map<string, readonly [string, string]>();
for (const pair of GENERATED_TRANSLATIONS) {
  translations.set(pair[0], pair);
  if (!translations.has(pair[1])) translations.set(pair[1], pair);
}
for (const [en, ko] of UI_TRANSLATIONS) {
  if (!translations.has(en)) translations.set(en, [ko, en]);
  if (!translations.has(ko)) translations.set(ko, [ko, en]);
}

export function generatedText(source: string, language: GenerationLanguage = getGenerationLanguage()): string {
  const pair = translations.get(source);
  return pair ? pair[language === "ko" ? 0 : 1] : source;
}

export function generatedTemplate(
  ko: string,
  en: string,
  values: Record<string, string | number> = {},
  language: GenerationLanguage = getGenerationLanguage()
): string {
  return (language === "ko" ? ko : en).replace(/\{(\w+)\}/g, (token, key: string) =>
    values[key] === undefined ? token : String(values[key])
  );
}
